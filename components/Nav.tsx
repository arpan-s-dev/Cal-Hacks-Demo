import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { getOptionalUser } from "@/lib/auth/require-user";

export async function Nav() {
  const session = await getOptionalUser();
  const isOrganizer = session?.profile.role === "organizer";

  return (
    <header className="border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-gold font-display text-sm text-gold">
            CH
          </span>
          <span className="font-display text-lg tracking-wide">
            FA26 Admissions
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link className="hover:text-gold" href="/apply">
            Apply
          </Link>
          <Link className="hover:text-gold" href="/status">
            Status
          </Link>
          {isOrganizer ? (
            <Link className="hover:text-gold" href="/organizer">
              Organizer
            </Link>
          ) : null}
          {session ? (
            <form action={signOut}>
              <button className="text-paper/60 hover:text-paper" type="submit">
                Sign out
              </button>
            </form>
          ) : (
            <Link className="text-gold hover:underline" href="/login">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
