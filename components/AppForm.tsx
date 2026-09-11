"use client";

import { useActionState } from "react";
import { HackerFields } from "@/components/HackerFields";
import { MentorFields } from "@/components/MentorFields";
import { emptyState } from "@/lib/actions/result";
import { submitApplication } from "@/lib/actions/submit-application";
import type { AccountType } from "@/lib/types";

export function AppForm({ track }: { track: AccountType }) {
  const [state, action, pending] = useActionState(submitApplication, emptyState);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="account_type" value={track} />
      {track === "hacker" ? <HackerFields /> : <MentorFields />}
      {state.error ? (
        <p className="text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Submitting…" : `Submit ${track} application`}
      </button>
    </form>
  );
}
