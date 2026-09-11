"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOrganizer } from "@/lib/auth/require-organizer";
import { fail, firstZodError, type ActionState } from "@/lib/actions/result";
import { getApplicationById, updateApplicationStatus } from "@/lib/db/applications";
import { insertReview } from "@/lib/db/reviews";
import { canOrganizerDecide } from "@/lib/status";
import { gradeSchema } from "@/lib/validations/grade";
import { field } from "@/lib/validations/application";

export async function gradeApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId } = await requireOrganizer();

  const parsed = gradeSchema.safeParse({
    application_id: field(formData, "application_id"),
    score: field(formData, "score"),
    notes: field(formData, "notes"),
    status: field(formData, "status"),
  });

  if (!parsed.success) {
    return fail(firstZodError(parsed.error));
  }

  const application = await getApplicationById(parsed.data.application_id);
  if (!application) {
    return fail("Application not found.");
  }
  if (!canOrganizerDecide(application.status, parsed.data.status)) {
    return fail(`Cannot set ${parsed.data.status} from ${application.status}.`);
  }

  const review = await insertReview({
    application_id: parsed.data.application_id,
    reviewer_id: userId,
    score: parsed.data.score,
    notes: parsed.data.notes,
  });
  if (review.error) {
    return fail(review.error);
  }

  const status = await updateApplicationStatus(
    parsed.data.application_id,
    parsed.data.status,
  );
  if (status.error) {
    return fail(status.error);
  }

  revalidatePath("/organizer");
  revalidatePath(`/organizer/${parsed.data.application_id}`);
  revalidatePath("/status");
  redirect(`/organizer/${parsed.data.application_id}`);
}
