"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field } from "@/components/Field";
import { emptyState } from "@/lib/actions/result";
import { signIn, signUp } from "@/lib/actions/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, emptyState);

  return (
    <form action={formAction} className="panel grid w-full max-w-md gap-4">
      <h1 className="font-display text-3xl">
        {mode === "login" ? "Log in" : "Create account"}
      </h1>
      {mode === "signup" ? (
        <Field name="full_name" label="Full name" required />
      ) : null}
      <Field name="email" label="Email" type="email" required />
      <Field name="password" label="Password" type="password" required />
      {state.needsConfirm ? (
        <p className="text-sm text-cyan">
          Check your email to confirm the account, then log in.
        </p>
      ) : null}
      {state.error ? (
        <p className="text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Working…" : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <p className="text-sm text-paper/60">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link className="text-gold hover:underline" href="/signup">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link className="text-gold hover:underline" href="/login">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
