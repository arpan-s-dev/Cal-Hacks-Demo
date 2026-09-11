"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { fail, type ActionState } from "@/lib/actions/result";
import {
  getApplicationById,
  updateApplicationStatus,
} from "@/lib/db/applications";
import { canApplicantConfirm } from "@/lib/status";
import { field } from "@/lib/validations/application";

export async function confirmApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId } = await requireUser();
  const id = field(formData, "application_id");
  const application = await getApplicationById(id);

  if (!application || application.user_id !== userId) {
    return fail("Application not found.");
  }
  if (!canApplicantConfirm(application.status)) {
    return fail("Only accepted applicants can confirm.");
  }

  const { error } = await updateApplicationStatus(id, "confirmed");
  if (error) {
    return fail(error);
  }

  revalidatePath("/status");
  redirect("/status");
}
