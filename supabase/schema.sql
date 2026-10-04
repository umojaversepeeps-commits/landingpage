-- Umojaverse content schema
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- It is idempotent and safe to re-run.

-- ---------------------------------------------------------------------------
-- Programs
-- ---------------------------------------------------------------------------
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'Campus tour',
  location text not null default '',
  period text not null default '',
  start_date date,
  end_date date,
  description text not null default '',
  overview text not null default '',
  body text not null default '',
  highlights text[] not null default '{}',
  cover_image_url text,
  video_url text,
  source text,
  source_label text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_image_url text,
  video_url text,
  author text not null default 'Umojaverse',
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: anyone may read published rows; writes use the service
-- role from server actions (which bypasses RLS).
-- ---------------------------------------------------------------------------
alter table public.programs enable row level security;
alter table public.posts enable row level security;

drop policy if exists "Public read published programs" on public.programs;
create policy "Public read published programs"
  on public.programs for select
  using (published = true);

drop policy if exists "Public read published posts" on public.posts;
create policy "Public read published posts"
  on public.posts for select
  using (published = true);

-- ---------------------------------------------------------------------------
-- Keep updated_at current
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists programs_set_updated_at on public.programs;
create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage bucket for cover images (public read, service-role writes)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- Seed the two programs that previously lived in src/lib/site.ts
-- ---------------------------------------------------------------------------
insert into public.programs
  (slug, title, category, location, period, start_date, end_date, description, overview, highlights, source, source_label, published)
values
  (
    'arbitrum-builders-initiative',
    'Arbitrum Builders Initiative',
    'Campus tour',
    'Kenya · Campus & online',
    '2024 program',
    '2024-06-01',
    '2024-12-31',
    'Practical blockchain workshops, campus ideathons, and a virtual hackerhouse. A shared starting point for developers turning curiosity into working ideas.',
    'The initiative connected students across five Kenyan universities through workshops and ideathons, followed by a virtual hackerhouse. Participants explored blockchain fundamentals and Arbitrum, developed ideas, and worked with mentors to take them further.',
    array[
      'Learn blockchain fundamentals through practical workshops.',
      'Find collaborators and develop an idea during campus ideathons.',
      'Continue building with technical guidance in a virtual hackerhouse.'
    ],
    'https://forum.arbitrum.foundation/t/final-report-arbitrum-builders-initiative-on-questbook/28070',
    'Read the program report',
    true
  ),
  (
    'kabarak-campus-workshop',
    'Umojaverse at Kabarak',
    'Campus tour',
    'Kabarak University · Kenya',
    '5 October 2024',
    '2024-10-05',
    '2024-10-05',
    'An introduction to blockchain and Arbitrum, followed by a collaborative ideathon where students explored problems and pitched possible solutions.',
    'The Kabarak campus visit brought students together for presentations, discussion, and an ideathon. Teams put their learning into practice by proposing blockchain solutions and sharing their ideas with the wider group.',
    array[
      'An accessible introduction to blockchain and Arbitrum.',
      'Team-based exploration of ideas and practical problems.',
      'A chance to present ideas and connect with other student builders.'
    ],
    'https://kabarak.ac.ke/sset-news/umojaverse-kabu-tour-engaging-students-in-blockchain-innovation',
    'Read Kabarak’s event recap',
    true
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Seed the welcome post that previously lived in src/lib/site.ts
-- ---------------------------------------------------------------------------
insert into public.posts
  (slug, title, excerpt, body, cover_image_url, author, tags, published, published_at)
values
  (
    'welcome-to-the-umojaverse-blog',
    'Welcome to the Umojaverse blog',
    'Notes from our workshops and campus tours, stories from the people building with us, and practical guides for African developers getting into Web3.',
    $post$This is where we share what we learn while building community across Africa.

Expect recaps from workshops and campus tours, profiles of builders, and practical walkthroughs you can follow at your own pace.

## What you can expect

- **Program updates** — what we ran, what worked, and what we learned.
- **Builder stories** — people turning curiosity into working products.
- **Practical guides** — step-by-step notes you can build on.

You can also embed video in any post by adding a YouTube or Vimeo link in the editor.$post$,
    '/images/community-builder-tables.webp',
    'Umojaverse',
    array['Community'],
    true,
    '2024-12-01T09:00:00.000Z'
  )
on conflict (slug) do nothing;
