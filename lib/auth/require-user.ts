import { redirect } from "next/navigation";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export type Session = {
  userId: string;
  profile: Profile;
};

export async function getOptionalUser(): Promise<Session | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const profile = await getProfile(user.id);
    if (!profile) {
      return null;
    }

    return { userId: user.id, profile };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<Session> {
  const session = await getOptionalUser();
  if (!session) {
    redirect("/login");
  }
  return session;
}
