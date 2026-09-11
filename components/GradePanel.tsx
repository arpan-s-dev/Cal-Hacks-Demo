"use client";

import { useActionState } from "react";
import { Field, SelectField, TextArea } from "@/components/Field";
import { emptyState } from "@/lib/actions/result";
import { gradeApplication } from "@/lib/actions/grade-application";

export function GradePanel({ applicationId }: { applicationId: string }) {
  const [state, action, pending] = useActionState(gradeApplication, emptyState);

  return (
    <form action={action} className="panel grid gap-4">
      <h2 className="font-display text-2xl">Grade</h2>
      <p className="text-sm text-paper/60">
        Inserts a review and updates status in the same action.
      </p>
      <input type="hidden" name="application_id" value={applicationId} />
      <Field
        name="score"
        label="Score (1–5)"
        type="number"
        required
        min={1}
        max={5}
      />
      <SelectField
        name="status"
        label="Decision"
        required
        options={[
          { value: "accepted", label: "Accepted" },
          { value: "waitlisted", label: "Waitlisted" },
          { value: "rejected", label: "Rejected" },
        ]}
      />
      <TextArea name="notes" label="Organizer notes (visible to applicant)" required />
      {state.error ? (
        <p className="text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save grade"}
      </button>
    </form>
  );
}
