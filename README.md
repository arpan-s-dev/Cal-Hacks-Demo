# Cal Hacks FA26 Admissions Portal

Miniature applicant + organizer portal for the Cal Hacks FA26 Tech Team take-home. Two tracks (hacker / mentor), organizer grading, and a `/status` DecisionCard.

## 1. Setup

1. Create a [Supabase](https://supabase.com) project.
2. In **Authentication → Providers**, keep Email enabled. For a local demo, turn **off** “Confirm email” so signup creates a session immediately.
3. In the SQL editor, run `supabase/migrations/001_init.sql`.
4. Copy env vars:

   ```bash
   cp .env.example .env.local
   ```

   Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Project Settings → API**. Never commit real keys.

5. Seed one organizer (after that user has signed up through the app):

   ```sql
   update public.profiles
   set role = 'organizer'
   where email = 'you@example.com';
   ```

6. Install and run:

   ```bash
   npm install
   npm run dev
   ```

7. Deploy on Vercel: set the same two env vars. This app uses the Supabase JS client over HTTPS. If you later add a direct Postgres URL, use the **transaction pooler** (port 6543) on Vercel, not session mode.

## 2. Architecture

| Path | Rule |
| --- | --- |
| `app/` | UI only. Lists are Server Components. No write calls to Supabase. |
| `lib/actions/` | The only mutation boundary. Each file is one verb: authz → Zod → db. |
| `lib/db/` | Queries only. No auth decisions. Read `INVARIANTS` at the top of `applications.ts`. |
| `lib/validations/` | Zod schemas per track and for grading. |
| `lib/auth/` | `requireUser`, `requireOrganizer`. |
| `lib/supabase/` | `client.ts` (browser), `server.ts` (session cookies), `proxy.ts` (refresh). |
| `components/` | `AppForm`, `AppsTable`, `GradePanel`, `DecisionCard`. |

Status machine: `draft → submitted → accepted | rejected | waitlisted → confirmed`.

`user_id` and `role` are never taken from the client. Signup always creates `applicant`. Organizer is a SQL promotion.

## 3. Security checklist

- [x] RLS enabled on `profiles`, `applications`, `reviews` (never disabled).
- [x] Applicants can insert/update only their rows, and only `draft` / `submitted`.
- [x] Applicants cannot write `accepted` / `rejected` / `waitlisted`.
- [x] Confirm is a separate policy: `accepted → confirmed` on own row.
- [x] Organizers read all applications and insert reviews with `reviewer_id = auth.uid()`.
- [x] Applicants can read reviews for their own applications (DecisionCard).
- [x] Profile `role` cannot be changed from a logged-in client (trigger).
- [x] Server Actions re-check auth even though pages already gate the UI.
- [x] Zod validates every write. No `any`. Organizer list does not `select('*')`.

## 4. Scaling (day 1 vs day 2 at 10–50k apps)

**Day 1 (this repo):** one Next.js app, Supabase Auth + Postgres, keyset pagination on `(created_at desc, id desc)`, page size 25. The organizer list selects summary columns only.

**Day 2:**

- Keep keyset. Do not switch to large `OFFSET` pages.
- Add a covering index already present: `(status, created_at desc, id desc)`.
- Wrap `gradeApplication` (review insert + status update) in a single SQL RPC if you need a hard transaction.
- If you connect with a server Postgres client on Vercel, use the transaction pooler.
- Split hot reads (queue) from cold form JSON. `form_data` stays off the list query.
- Add rate limits on submit/grade. Email/notifications stay out of band.

If offset pagination is ever added, cap page size at 25 and treat keyset as the day-2 default.

## 5. Demo accounts / creating an organizer

There are no shared passwords in this repo.

1. Sign up at `/signup` as a normal applicant (hacker or mentor).
2. Sign up a second account for the organizer.
3. Run the SQL in Setup step 5 on the organizer email.
4. Log in as that user → `/organizer` is visible.
5. Submit a hacker or mentor form, open it in the queue, grade 1–5 + notes, set accepted / rejected / waitlisted.
6. Log back in as the applicant → `/status` shows the DecisionCard (decision, score, note). Accepted applicants can confirm.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
