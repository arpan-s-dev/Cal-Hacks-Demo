import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

const PROFILE_COLUMNS = "id, email, full_name, role, created_at";

function asRole(value: string): Role {
  return value === "organizer" ? "organizer" : "applicant";
}

export async function getProfile(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: asRole(data.role),
    created_at: data.created_at,
  };
}
