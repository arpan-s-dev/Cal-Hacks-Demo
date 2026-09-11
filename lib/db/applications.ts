/**
 * INVARIANTS (enforced in SQL RLS + server actions — not here):
 * 1. UNIQUE (user_id, account_type) — one application per track.
 * 2. Applicant writes always use user_id from the auth session, never the client.
 * 3. Applicants may only set status to draft | submitted.
 * 4. Organizers set accepted | rejected | waitlisted from submitted (or waitlisted).
 * 5. confirmed is applicant-only from accepted (thin confirm).
 * 6. This module is queries only — no authz decisions.
 */
import { createClient } from "@/lib/supabase/server";
import type {
  AccountType,
  Application,
  ApplicationStatus,
} from "@/lib/types";

const DETAIL_COLUMNS =
  "id, user_id, account_type, status, form_version, created_at, updated_at, form_data";

type ApplicationRow = {
  id: string;
  user_id: string;
  account_type: string;
  status: string;
  form_data: unknown;
  form_version: string;
  created_at: string;
  updated_at: string;
};

function asFormData(value: unknown): Application["form_data"] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }
  const result: Application["form_data"] = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string" || typeof entry === "number") {
      result[key] = entry;
    }
  }
  return result;
}

function asApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    user_id: row.user_id,
    account_type: row.account_type as Application["account_type"],
    status: row.status as Application["status"],
    form_data: asFormData(row.form_data),
    form_version: row.form_version,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listApplicationsForUser(
  userId: string,
): Promise<Application[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(DETAIL_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }
  return data.map((row) => asApplication(row as ApplicationRow));
}

export async function getApplicationById(
  id: string,
): Promise<Application | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return asApplication(data as ApplicationRow);
}

export async function getApplicationForUserTrack(
  userId: string,
  accountType: AccountType,
): Promise<Application | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(DETAIL_COLUMNS)
    .eq("user_id", userId)
    .eq("account_type", accountType)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return asApplication(data as ApplicationRow);
}

export async function insertSubmittedApplication(row: {
  user_id: string;
  account_type: AccountType;
  form_data: Application["form_data"];
  form_version: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: row.user_id,
      account_type: row.account_type,
      status: "submitted",
      form_data: row.form_data,
      form_version: row.form_version,
    })
    .select("id")
    .single();

  return { id: data?.id ?? null, error: error?.message ?? null };
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  return { error: error?.message ?? null };
}
