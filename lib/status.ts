import type { ApplicationStatus, OrganizerDecision } from "@/lib/types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
  confirmed: "Confirmed",
};

export const PAGE_SIZE = 25;

export function canOrganizerDecide(
  current: ApplicationStatus,
  next: OrganizerDecision,
): boolean {
  if (current === "submitted") {
    return true;
  }
  return current === "waitlisted" && next !== "waitlisted";
}

export function canApplicantConfirm(status: ApplicationStatus): boolean {
  return status === "accepted";
}

export function isDecided(status: ApplicationStatus): boolean {
  return (
    status === "accepted" ||
    status === "rejected" ||
    status === "waitlisted" ||
    status === "confirmed"
  );
}
