import { redirect } from "next/navigation";
import { requireUser, type Session } from "@/lib/auth/require-user";

export async function requireOrganizer(): Promise<Session> {
  const session = await requireUser();
  if (session.profile.role !== "organizer") {
    redirect("/");
  }
  return session;
}
