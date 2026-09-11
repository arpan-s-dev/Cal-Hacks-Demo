"use client";

import { useActionState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { emptyState } from "@/lib/actions/result";
import { confirmApplication } from "@/lib/actions/confirm-application";
import { canApplicantConfirm, isDecided } from "@/lib/status";
import type { Application, Review } from "@/lib/types";

export function DecisionCard({
  application,
  review,
}: {
  application: Application;
  review: Review | null;
}) {
  const [state, action, pending] = useActionState(confirmApplication, emptyState);

  return (
    <article className="panel grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl capitalize">
          {application.account_type} track
        </h2>
        <StatusBadge status={application.status} />
      </div>
      {!isDecided(application.status) ? (
        <p className="text-paper/70">
          Submitted. Organizers have not posted a decision yet.
        </p>
      ) : (
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-paper/50">Score</dt>
            <dd className="font-display text-3xl text-gold">
              {review ? `${review.score} / 5` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-paper/50">Organizer note</dt>
            <dd className="mt-1 whitespace-pre-wrap text-paper/90">
              {review?.notes ?? "No note attached."}
            </dd>
          </div>
        </dl>
      )}
      {canApplicantConfirm(application.status) ? (
        <form action={action} className="grid gap-3">
          <input type="hidden" name="application_id" value={application.id} />
          {state.error ? (
            <p className="text-sm text-red-300" role="alert">
              {state.error}
            </p>
          ) : null}
          <button className="btn-primary" type="submit" disabled={pending}>
            {pending ? "Confirming…" : "Confirm attendance"}
          </button>
        </form>
      ) : null}
    </article>
  );
}
