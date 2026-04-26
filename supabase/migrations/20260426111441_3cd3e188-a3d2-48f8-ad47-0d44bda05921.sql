
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- credits
create table public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 10,
  updated_at timestamptz not null default now()
);
alter table public.user_credits enable row level security;
create policy "credits_select_own" on public.user_credits for select to authenticated using (auth.uid() = user_id);
create policy "credits_insert_own" on public.user_credits for insert to authenticated with check (auth.uid() = user_id);
create policy "credits_update_own" on public.user_credits for update to authenticated using (auth.uid() = user_id);

-- favorites
create table public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  image_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, image_id)
);
alter table public.user_favorites enable row level security;
create policy "fav_select_own" on public.user_favorites for select to authenticated using (auth.uid() = user_id);
create policy "fav_insert_own" on public.user_favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "fav_delete_own" on public.user_favorites for delete to authenticated using (auth.uid() = user_id);

-- generated images
create table public.user_generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text,
  url text not null,
  prompt text not null,
  mode text not null,
  subject text not null,
  outfit text not null,
  location text not null,
  mood text not null,
  created_at timestamptz not null default now()
);
alter table public.user_generated_images enable row level security;
create index on public.user_generated_images (user_id, created_at desc);
create policy "img_select_own" on public.user_generated_images for select to authenticated using (auth.uid() = user_id);
create policy "img_insert_own" on public.user_generated_images for insert to authenticated with check (auth.uid() = user_id);
create policy "img_delete_own" on public.user_generated_images for delete to authenticated using (auth.uid() = user_id);

-- auto-create profile + credits on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  insert into public.user_credits (user_id, credits) values (new.id, 10)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
