import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { PAGE_SIZE } from "@/lib/status";
import type { ApplicationSummary } from "@/lib/types";

type AppsTableProps = {
  rows: ApplicationSummary[];
  nextCursor: string | null;
  status: string;
  accountType: string;
};

export function AppsTable({
  rows,
  nextCursor,
  status,
  accountType,
}: AppsTableProps) {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (accountType) query.set("account_type", accountType);

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-panel font-mono text-xs uppercase tracking-wide text-paper/60">
          <tr>
            <th className="px-4 py-3">Applicant</th>
            <th className="px-4 py-3">Track</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3"> </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-paper/50" colSpan={5}>
                No applications in this queue.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="font-medium">{row.applicant_name || "—"}</div>
                  <div className="text-paper/50">{row.applicant_email}</div>
                </td>
                <td className="px-4 py-3 capitalize">{row.account_type}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-paper/60">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-gold hover:underline" href={`/organizer/${row.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {nextCursor ? (
        <div className="border-t border-line px-4 py-3 text-sm">
          <Link
            className="text-cyan hover:underline"
            href={`/organizer?${new URLSearchParams({
              ...Object.fromEntries(query),
              cursor: nextCursor,
            }).toString()}`}
          >
            Next {PAGE_SIZE}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
