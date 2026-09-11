import Link from "next/link";
import { DecisionCard } from "@/components/DecisionCard";
import { requireUser } from "@/lib/auth/require-user";
import { listApplicationsForUser } from "@/lib/db/applications";
import { getLatestReview } from "@/lib/db/reviews";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const { userId } = await requireUser();
  const applications = await listApplicationsForUser(userId);

  const cards = await Promise.all(
    applications.map(async (application) => ({
      application,
      review: await getLatestReview(application.id),
    })),
  );

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Your decision
        </p>
        <h1 className="font-display text-4xl">Application status</h1>
      </div>
      {cards.length === 0 ? (
        <div className="panel grid gap-4">
          <p>No applications yet.</p>
          <Link className="btn-primary w-fit" href="/apply">
            Apply now
          </Link>
        </div>
      ) : (
        cards.map(({ application, review }) => (
          <DecisionCard
            key={application.id}
            application={application}
            review={review}
          />
        ))
      )}
    </div>
  );
}
