import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-10 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
        Cal Hacks FA26 · Admissions
      </p>
      <h1 className="max-w-3xl font-display text-5xl leading-tight md:text-7xl">
        Two tracks. One weekend. Ship something loud.
      </h1>
      <p className="max-w-2xl text-lg text-paper/70">
        Apply as a hacker or a mentor. Organizers review, grade, and decide.
        You will see your decision, score, and note on the status page.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link className="btn-primary" href="/apply?track=hacker">
          Apply as hacker
        </Link>
        <Link className="btn-ghost" href="/apply?track=mentor">
          Apply as mentor
        </Link>
        <Link className="btn-ghost" href="/organizer">
          Organizer queue
        </Link>
      </div>
    </div>
  );
}
