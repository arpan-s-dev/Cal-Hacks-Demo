import { AppsTable } from "@/components/AppsTable";
import { requireOrganizer } from "@/lib/auth/require-organizer";
import { decodeCursor } from "@/lib/db/cursor";
import { listOrganizerQueue } from "@/lib/db/organizer-queue";
import { ACCOUNT_TYPES, STATUSES, type AccountType, type ApplicationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

function asStatus(value: string | undefined): ApplicationStatus | undefined {
  return STATUSES.find((status) => status === value);
}

function asAccountType(value: string | undefined): AccountType | undefined {
  return ACCOUNT_TYPES.find((type) => type === value);
}

export default async function OrganizerPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    account_type?: string;
    cursor?: string;
  }>;
}) {
  await requireOrganizer();
  const params = await searchParams;
  const status = asStatus(params.status) ?? "submitted";
  const accountType = asAccountType(params.account_type);
  const { rows, nextCursor } = await listOrganizerQueue({
    status,
    accountType,
    cursor: decodeCursor(params.cursor),
  });

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Organizer
        </p>
        <h1 className="font-display text-4xl">Admissions queue</h1>
      </div>
      <form className="flex flex-wrap gap-3" method="get">
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-md border border-line bg-ink px-3"
        >
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          name="account_type"
          defaultValue={accountType ?? ""}
          className="h-11 rounded-md border border-line bg-ink px-3"
        >
          <option value="">All tracks</option>
          {ACCOUNT_TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button className="btn-ghost" type="submit">
          Filter
        </button>
      </form>
      <AppsTable
        rows={rows}
        nextCursor={nextCursor}
        status={status}
        accountType={accountType ?? ""}
      />
    </div>
  );
}
