import Link from "next/link";
import { notFound } from "next/navigation";
import { GradePanel } from "@/components/GradePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { requireOrganizer } from "@/lib/auth/require-organizer";
import { getApplicationById } from "@/lib/db/applications";
import { getProfile } from "@/lib/db/profiles";
import { listReviewsForApplication } from "@/lib/db/reviews";
import { formEntries } from "@/lib/form-display";
import { canOrganizerDecide } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function OrganizerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOrganizer();
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) {
    notFound();
  }

  const [profile, reviews] = await Promise.all([
    getProfile(application.user_id),
    listReviewsForApplication(application.id),
  ]);
  const canGrade =
    canOrganizerDecide(application.status, "accepted") ||
    canOrganizerDecide(application.status, "rejected");

  return (
    <div className="grid gap-6">
      <Link className="text-sm text-cyan hover:underline" href="/organizer">
        ← Queue
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            {application.account_type} · {application.form_version}
          </p>
          <h1 className="font-display text-4xl">
            {profile?.full_name || "Applicant"}
          </h1>
          <p className="text-paper/60">{profile?.email}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>
      <section className="panel grid gap-3">
        <h2 className="font-display text-2xl">Form</h2>
        <dl className="grid gap-3">
          {formEntries(application.account_type, application.form_data).map(
            (entry) => (
              <div key={entry.label}>
                <dt className="text-xs uppercase tracking-wide text-paper/50">
                  {entry.label}
                </dt>
                <dd className="whitespace-pre-wrap">{entry.value}</dd>
              </div>
            ),
          )}
        </dl>
      </section>
      {reviews.length > 0 ? (
        <section className="panel grid gap-3">
          <h2 className="font-display text-2xl">Reviews</h2>
          {reviews.map((review) => (
            <article key={review.id} className="border-t border-line pt-3">
              <p className="font-display text-xl text-gold">{review.score} / 5</p>
              <p className="whitespace-pre-wrap text-sm">{review.notes}</p>
            </article>
          ))}
        </section>
      ) : null}
      {canGrade ? <GradePanel applicationId={application.id} /> : null}
    </div>
  );
}
