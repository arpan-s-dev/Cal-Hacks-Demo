-- Cal Hacks FA26 admissions schema.
-- RLS stays enabled. Do not disable it for demos.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  role text not null default 'applicant' check (role in ('applicant', 'organizer')),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  account_type text not null check (account_type in ('hacker', 'mentor')),
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'accepted', 'rejected', 'waitlisted', 'confirmed')),
  form_data jsonb not null default '{}'::jsonb,
  form_version text not null default 'v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, account_type)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id),
  score integer not null check (score between 1 and 5),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index applications_user_id_idx on public.applications (user_id);
create index applications_status_idx on public.applications (status);
create index applications_account_type_idx on public.applications (account_type);
create index applications_queue_idx
  on public.applications (status, created_at desc, id desc);
create index reviews_application_id_idx on public.reviews (application_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- SECURITY DEFINER so RLS on profiles does not recurse.
create or replace function public.is_organizer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'organizer'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'applicant'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role is set by signup trigger (applicant) or SQL editor (organizer).
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'role cannot be changed from the client';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.reviews enable row level security;

create policy profiles_select on public.profiles
  for select
  using (id = auth.uid() or public.is_organizer());

create policy profiles_update_own on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy applications_select on public.applications
  for select
  using (user_id = auth.uid() or public.is_organizer());

create policy applications_insert_own on public.applications
  for insert
  with check (
    user_id = auth.uid()
    and status in ('draft', 'submitted')
  );

create policy applications_update_own on public.applications
  for update
  using (user_id = auth.uid() and status in ('draft', 'submitted'))
  with check (
    user_id = auth.uid()
    and status in ('draft', 'submitted')
  );

create policy applications_confirm_own on public.applications
  for update
  using (user_id = auth.uid() and status = 'accepted')
  with check (user_id = auth.uid() and status = 'confirmed');

create policy applications_update_organizer on public.applications
  for update
  using (public.is_organizer())
  with check (public.is_organizer());

create policy reviews_select on public.reviews
  for select
  using (
    public.is_organizer()
    or exists (
      select 1
      from public.applications a
      where a.id = reviews.application_id
        and a.user_id = auth.uid()
    )
  );

create policy reviews_insert_organizer on public.reviews
  for insert
  with check (public.is_organizer() and reviewer_id = auth.uid());

grant usage on schema public to authenticated, anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.applications to authenticated;
grant select, insert on public.reviews to authenticated;
grant execute on function public.is_organizer() to authenticated;
