import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types";

const REVIEW_COLUMNS =
  "id, application_id, reviewer_id, score, notes, created_at";

function asReview(row: {
  id: string;
  application_id: string;
  reviewer_id: string;
  score: number;
  notes: string;
  created_at: string;
}): Review {
  return {
    id: row.id,
    application_id: row.application_id,
    reviewer_id: row.reviewer_id,
    score: row.score,
    notes: row.notes,
    created_at: row.created_at,
  };
}

export async function listReviewsForApplication(
  applicationId: string,
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }
  return data.map(asReview);
}

export async function getLatestReview(
  applicationId: string,
): Promise<Review | null> {
  const reviews = await listReviewsForApplication(applicationId);
  return reviews[0] ?? null;
}

export async function insertReview(row: {
  application_id: string;
  reviewer_id: string;
  score: number;
  notes: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    application_id: row.application_id,
    reviewer_id: row.reviewer_id,
    score: row.score,
    notes: row.notes,
  });
  return { error: error?.message ?? null };
}
