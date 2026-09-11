"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, firstZodError, type ActionState } from "@/lib/actions/result";
import { createClient } from "@/lib/supabase/server";
import { field } from "@/lib/validations/application";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().trim().max(80).optional(),
});

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
  });
  if (!parsed.success) {
    return fail(firstZodError(parsed.error));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return fail(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/apply");
}

export async function signUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
    full_name: field(formData, "full_name"),
  });
  if (!parsed.success) {
    return fail(firstZodError(parsed.error));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.full_name ?? "" } },
  });
  if (error) {
    return fail(error.message);
  }
  if (!data.session) {
    return { ok: true, error: "", needsConfirm: true };
  }

  revalidatePath("/", "layout");
  redirect("/apply");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
