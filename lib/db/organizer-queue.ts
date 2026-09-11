import { encodeCursor } from "@/lib/db/cursor";
import { PAGE_SIZE } from "@/lib/status";
import { createClient } from "@/lib/supabase/server";
import type {
  AccountType,
  ApplicationStatus,
  ApplicationSummary,
  QueueCursor,
} from "@/lib/types";

const SUMMARY_COLUMNS =
  "id, user_id, account_type, status, form_version, created_at, updated_at";

type ProfileEmbed = { email: string; full_name: string };

function asProfile(
  value: ProfileEmbed | ProfileEmbed[] | null,
): ProfileEmbed | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listOrganizerQueue(input: {
  status?: ApplicationStatus;
  accountType?: AccountType;
  cursor: QueueCursor | null;
}): Promise<{ rows: ApplicationSummary[]; nextCursor: string | null }> {
  const supabase = await createClient();
  let query = supabase
    .from("applications")
    .select(
      `${SUMMARY_COLUMNS}, profiles!applications_user_id_fkey ( email, full_name )`,
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (input.status) {
    query = query.eq("status", input.status);
  }
  if (input.accountType) {
    query = query.eq("account_type", input.accountType);
  }
  if (input.cursor) {
    const { created_at, id } = input.cursor;
    query = query.or(
      `created_at.lt.${created_at},and(created_at.eq.${created_at},id.lt.${id})`,
    );
  }

  const { data, error } = await query;
  if (error || !data) {
    return { rows: [], nextCursor: null };
  }

  const page = data.slice(0, PAGE_SIZE);
  const extra = data[PAGE_SIZE];
  const rows: ApplicationSummary[] = page.map((row) => {
    const profile = asProfile(row.profiles as ProfileEmbed | ProfileEmbed[] | null);
    return {
      id: String(row.id),
      user_id: String(row.user_id),
      account_type: row.account_type as ApplicationSummary["account_type"],
      status: row.status as ApplicationSummary["status"],
      form_version: String(row.form_version),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
      applicant_email: profile?.email ?? null,
      applicant_name: profile?.full_name ?? null,
    };
  });

  const last = extra ? page[page.length - 1] : null;
  return {
    rows,
    nextCursor: last
      ? encodeCursor({
          created_at: String(last.created_at),
          id: String(last.id),
        })
      : null,
  };
}
