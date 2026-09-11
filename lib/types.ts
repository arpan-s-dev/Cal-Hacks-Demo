export const ROLES = ["applicant", "organizer"] as const;
export type Role = (typeof ROLES)[number];

export const ACCOUNT_TYPES = ["hacker", "mentor"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const STATUSES = [
  "draft",
  "submitted",
  "accepted",
  "rejected",
  "waitlisted",
  "confirmed",
] as const;
export type ApplicationStatus = (typeof STATUSES)[number];

export const ORGANIZER_DECISIONS = [
  "accepted",
  "rejected",
  "waitlisted",
] as const;
export type OrganizerDecision = (typeof ORGANIZER_DECISIONS)[number];

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  account_type: AccountType;
  status: ApplicationStatus;
  form_data: Record<string, string | number>;
  form_version: string;
  created_at: string;
  updated_at: string;
};

export type ApplicationSummary = {
  id: string;
  user_id: string;
  account_type: AccountType;
  status: ApplicationStatus;
  form_version: string;
  created_at: string;
  updated_at: string;
  applicant_email: string | null;
  applicant_name: string | null;
};

export type Review = {
  id: string;
  application_id: string;
  reviewer_id: string;
  score: number;
  notes: string;
  created_at: string;
};

export type QueueCursor = {
  created_at: string;
  id: string;
};
