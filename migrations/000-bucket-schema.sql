-- ─────────────────────────────────────────────
-- BUCKET APP — Full Supabase Schema
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- USERS
-- Extends Supabase's built-in auth.users table
-- ─────────────────────────────────────────────
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  name          text not null,
  handle        text unique not null,
  avatar_color  int default 0,
  created_at    timestamptz default now()
);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, handle)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'handle', 'user-' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─────────────────────────────────────────────
-- BUCKETS
-- Each bucket is a shared list
-- ─────────────────────────────────────────────
create table public.buckets (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  emoji       text default '🪣',
  created_by  uuid references public.profiles(id) on delete set null,
  invite_code text unique default substr(md5(random()::text), 1, 8),
  created_at  timestamptz default now()
);

-- Who belongs to which bucket
create table public.bucket_members (
  id          uuid default uuid_generate_v4() primary key,
  bucket_id   uuid references public.buckets(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  status      text default 'active' check (status in ('active', 'pending', 'declined')),
  joined_at   timestamptz default now(),
  unique(bucket_id, user_id)
);


-- ─────────────────────────────────────────────
-- CATEGORIES
-- Default + custom categories per bucket
-- ─────────────────────────────────────────────
create table public.categories (
  id          uuid default uuid_generate_v4() primary key,
  bucket_id   uuid references public.buckets(id) on delete cascade,
  key         text not null,
  label       text not null,
  accent      text not null default '#BA7517',
  bg          text not null default '#FAEEDA',
  dark        text not null default '#633806',
  icon        text,
  is_default  boolean default false,
  created_at  timestamptz default now(),
  unique(bucket_id, key)
);

-- Insert default categories for a new bucket automatically
create or replace function public.create_default_categories()
returns trigger as $$
begin
  insert into public.categories (bucket_id, key, label, accent, bg, dark, icon, is_default) values
    (new.id, 'travel',    'Travel',    '#BA7517', '#FAEEDA', '#633806', 'plane',            true),
    (new.id, 'food',      'Food',      '#993C1D', '#FAECE7', '#4A1B0C', 'tools-kitchen-2',  true),
    (new.id, 'adventure', 'Adventure', '#534AB7', '#EEEDFE', '#26215C', 'bolt',             true),
    (new.id, 'wellness',  'Wellness',  '#0F6E56', '#E1F5EE', '#04342C', 'leaf',             true);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_bucket_created
  after insert on public.buckets
  for each row execute function public.create_default_categories();


-- ─────────────────────────────────────────────
-- ITEMS
-- The actual bucket list entries
-- ─────────────────────────────────────────────
create table public.items (
  id            uuid default uuid_generate_v4() primary key,
  bucket_id     uuid references public.buckets(id) on delete cascade not null,
  title         text not null,
  category_key  text not null default 'adventure',
  emoji         text default '⭐',
  done          boolean default false,
  done_at       timestamptz,
  done_by       uuid references public.profiles(id) on delete set null,
  hearts        int default 0,
  memory_note   text,
  location      text,
  sort_order    int default 0,
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz default now()
);

-- Who is tagged on each item
create table public.item_tags (
  id        uuid default uuid_generate_v4() primary key,
  item_id   uuid references public.items(id) on delete cascade not null,
  user_id   uuid references public.profiles(id) on delete cascade not null,
  unique(item_id, user_id)
);

-- Hearts (one per user per item)
create table public.item_hearts (
  id        uuid default uuid_generate_v4() primary key,
  item_id   uuid references public.items(id) on delete cascade not null,
  user_id   uuid references public.profiles(id) on delete cascade not null,
  unique(item_id, user_id)
);

-- Memory photos
create table public.item_photos (
  id          uuid default uuid_generate_v4() primary key,
  item_id     uuid references public.items(id) on delete cascade not null,
  storage_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now()
);


-- ─────────────────────────────────────────────
-- COMMENTS
-- Threaded comments on items
-- ─────────────────────────────────────────────
create table public.comments (
  id          uuid default uuid_generate_v4() primary key,
  item_id     uuid references public.items(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  text        text not null,
  created_at  timestamptz default now()
);


-- ─────────────────────────────────────────────
-- ACTIVITY FEED
-- Log of everything that happens in a bucket
-- ─────────────────────────────────────────────
create table public.activity (
  id          uuid default uuid_generate_v4() primary key,
  bucket_id   uuid references public.buckets(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete set null,
  action      text not null check (action in (
                'added', 'done', 'commented', 'hearted',
                'joined', 'invited', 'photo_added'
              )),
  item_id     uuid references public.items(id) on delete set null,
  item_title  text,
  emoji       text,
  created_at  timestamptz default now()
);

-- Auto-log activity when an item is marked done
create or replace function public.log_item_done()
returns trigger as $$
begin
  if new.done = true and old.done = false then
    insert into public.activity (bucket_id, user_id, action, item_id, item_title, emoji)
    values (new.bucket_id, new.done_by, 'done', new.id, new.title, new.emoji);
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_item_done
  after update on public.items
  for each row execute function public.log_item_done();

-- Auto-log activity when a comment is posted
create or replace function public.log_comment()
returns trigger as $$
declare
  v_item public.items%rowtype;
begin
  select * into v_item from public.items where id = new.item_id;
  insert into public.activity (bucket_id, user_id, action, item_id, item_title, emoji)
  values (v_item.bucket_id, new.user_id, 'commented', new.item_id, v_item.title, '💬');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.log_comment();


-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Users can only see data from buckets they belong to
-- ─────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.buckets        enable row level security;
alter table public.bucket_members enable row level security;
alter table public.categories     enable row level security;
alter table public.items          enable row level security;
alter table public.item_tags      enable row level security;
alter table public.item_hearts    enable row level security;
alter table public.item_photos    enable row level security;
alter table public.comments       enable row level security;
alter table public.activity       enable row level security;

-- Helper: is the current user a member of a bucket?
create or replace function public.is_bucket_member(bucket_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.bucket_members
    where bucket_members.bucket_id = $1
    and bucket_members.user_id = auth.uid()
    and bucket_members.status = 'active'
  );
$$ language sql security definer;

-- Profiles: anyone can read, only you can update yours
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Buckets: only members can see their buckets
create policy "Members can view their buckets"
  on public.buckets for select using (public.is_bucket_member(id));
create policy "Authenticated users can create buckets"
  on public.buckets for insert with check (auth.role() = 'authenticated');
create policy "Bucket creator can update"
  on public.buckets for update using (created_by = auth.uid());

-- Bucket members
create policy "Members can view bucket membership"
  on public.bucket_members for select using (public.is_bucket_member(bucket_id));
create policy "Members can be inserted by authenticated users"
  on public.bucket_members for insert with check (auth.role() = 'authenticated');
create policy "Members can update own membership"
  on public.bucket_members for update using (user_id = auth.uid());

-- Categories
create policy "Members can view categories"
  on public.categories for select using (public.is_bucket_member(bucket_id));
create policy "Members can insert categories"
  on public.categories for insert with check (public.is_bucket_member(bucket_id));
create policy "Members can update categories"
  on public.categories for update using (public.is_bucket_member(bucket_id));
create policy "Members can delete custom categories"
  on public.categories for delete using (public.is_bucket_member(bucket_id) and is_default = false);

-- Items
create policy "Members can view items"
  on public.items for select using (public.is_bucket_member(bucket_id));
create policy "Members can insert items"
  on public.items for insert with check (public.is_bucket_member(bucket_id));
create policy "Members can update items"
  on public.items for update using (public.is_bucket_member(bucket_id));
create policy "Members can delete items"
  on public.items for delete using (public.is_bucket_member(bucket_id));

-- Item tags, hearts, photos
create policy "Members can view item tags"
  on public.item_tags for select using (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Members can manage item tags"
  on public.item_tags for all using (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Members can view hearts"
  on public.item_hearts for select using (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Members can manage hearts"
  on public.item_hearts for all using (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Members can view photos"
  on public.item_photos for select using (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Members can add photos"
  on public.item_photos for insert with check (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );

-- Comments
create policy "Members can view comments"
  on public.comments for select using (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Members can post comments"
  on public.comments for insert with check (
    exists (select 1 from public.items where items.id = item_id and public.is_bucket_member(items.bucket_id))
  );
create policy "Users can delete own comments"
  on public.comments for delete using (user_id = auth.uid());

-- Activity
create policy "Members can view activity"
  on public.activity for select using (public.is_bucket_member(bucket_id));
create policy "Members can log activity"
  on public.activity for insert with check (public.is_bucket_member(bucket_id));


-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- For memory photos
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('photos', 'photos', false);

create policy "Members can upload photos"
  on storage.objects for insert with check (
    bucket_id = 'photos' and auth.role() = 'authenticated'
  );
create policy "Members can view photos"
  on storage.objects for select using (
    bucket_id = 'photos' and auth.role() = 'authenticated'
  );


-- ─────────────────────────────────────────────
-- REALTIME
-- Enable real-time on tables that need live sync
-- ─────────────────────────────────────────────
alter publication supabase_realtime add table public.items;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.activity;
alter publication supabase_realtime add table public.item_hearts;
alter publication supabase_realtime add table public.item_tags;
