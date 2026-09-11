import Link from "next/link";
import { AppForm } from "@/components/AppForm";
import { requireUser } from "@/lib/auth/require-user";
import { getApplicationForUserTrack } from "@/lib/db/applications";
import { ACCOUNT_TYPES, type AccountType } from "@/lib/types";

export const dynamic = "force-dynamic";

function asTrack(value: string | undefined): AccountType | null {
  return value === "hacker" || value === "mentor" ? value : null;
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { userId } = await requireUser();
  const params = await searchParams;
  const track = asTrack(params.track);

  if (!track) {
    return (
      <div className="grid gap-8">
        <h1 className="font-display text-4xl">Choose a track</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {ACCOUNT_TYPES.map((option) => (
            <Link
              key={option}
              href={`/apply?track=${option}`}
              className="panel block hover:border-gold"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-gold">
                Track
              </p>
              <h2 className="mt-2 font-display text-3xl capitalize">{option}</h2>
              <p className="mt-2 text-sm text-paper/60">
                {option === "hacker"
                  ? "Build all weekend. One application."
                  : "Coach teams on the floor. One application."}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const existing = await getApplicationForUserTrack(userId, track);
  if (existing) {
    return (
      <div className="panel grid max-w-xl gap-4">
        <h1 className="font-display text-3xl capitalize">{track} application</h1>
        <p className="text-paper/70">
          You already submitted this track. Decisions land on the status page.
        </p>
        <Link className="btn-primary w-fit" href="/status">
          View status
        </Link>
      </div>
    );
  }

  return (
    <div className="grid max-w-xl gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Application
        </p>
        <h1 className="font-display text-4xl capitalize">{track} form</h1>
      </div>
      <AppForm track={track} />
    </div>
  );
}
