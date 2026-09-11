import { STATUS_LABELS } from "@/lib/status";
import type { ApplicationStatus } from "@/lib/types";

const TONE: Record<ApplicationStatus, string> = {
  draft: "border-line text-paper/70",
  submitted: "border-cyan/50 text-cyan",
  accepted: "border-gold text-gold",
  rejected: "border-red-400/60 text-red-300",
  waitlisted: "border-amber-300/70 text-amber-200",
  confirmed: "border-gold bg-gold/10 text-gold",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide ${TONE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
