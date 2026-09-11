import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getOptionalUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getOptionalUser();
  if (session) {
    redirect(session.profile.role === "organizer" ? "/organizer" : "/apply");
  }

  return (
    <div className="flex justify-center py-8">
      <AuthForm mode="login" />
    </div>
  );
}
