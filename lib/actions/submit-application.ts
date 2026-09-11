"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import {
  getApplicationForUserTrack,
  insertSubmittedApplication,
} from "@/lib/db/applications";
import { fail, firstZodError, type ActionState } from "@/lib/actions/result";
import { field, submitApplicationSchema } from "@/lib/validations/application";
import { HACKER_FORM_VERSION } from "@/lib/validations/hacker";
import { MENTOR_FORM_VERSION } from "@/lib/validations/mentor";
import type { AccountType } from "@/lib/types";

export async function submitApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId } = await requireUser();
  const accountType = field(formData, "account_type") as AccountType;

  const parsed = submitApplicationSchema.safeParse({
    account_type: accountType,
    form:
      accountType === "mentor"
        ? {
            full_name: field(formData, "full_name"),
            company: field(formData, "company"),
            title: field(formData, "title"),
            years_experience: field(formData, "years_experience"),
            expertise: field(formData, "expertise"),
            availability: field(formData, "availability"),
            why: field(formData, "why"),
            linkedin: field(formData, "linkedin"),
          }
        : {
            full_name: field(formData, "full_name"),
            school: field(formData, "school"),
            graduation_year: field(formData, "graduation_year"),
            github: field(formData, "github"),
            linkedin: field(formData, "linkedin"),
            track: field(formData, "track"),
            why: field(formData, "why"),
            shirt_size: field(formData, "shirt_size"),
          },
  });

  if (!parsed.success) {
    return fail(firstZodError(parsed.error));
  }

  const existing = await getApplicationForUserTrack(userId, parsed.data.account_type);
  if (existing) {
    return fail("You already submitted this track.");
  }

  const { error } = await insertSubmittedApplication({
    user_id: userId,
    account_type: parsed.data.account_type,
    form_data: parsed.data.form,
    form_version:
      parsed.data.account_type === "hacker"
        ? HACKER_FORM_VERSION
        : MENTOR_FORM_VERSION,
  });

  if (error) {
    return fail(error);
  }

  revalidatePath("/status");
  revalidatePath("/apply");
  redirect("/status");
}
