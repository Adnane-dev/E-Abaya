-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (if not exists / drop-then-create).

create table if not exists shops (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text default '',
  logo_url text,
  is_approved boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric not null,
  image text not null,
  images text[] default '{}',
  category text not null,
  description text default '',
  sizes text[] default '{}',
  colors text[] default '{}',
  material text default '',
  brand text default '',
  in_stock boolean default true,
  is_new boolean default false,
  shop_id bigint references shops(id) on delete cascade,
  created_at timestamptz default now()
);

alter table products add column if not exists shop_id bigint references shops(id) on delete cascade;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Every new signup automatically gets a profile row (is_admin defaults
-- to false — nobody is admin until manually promoted, see bottom of
-- this file).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin check used by RLS policies below. Marked SECURITY DEFINER so it
-- runs with the function owner's privileges (bypassing RLS) instead of
-- the querying user's — calling it from a policy ON profiles avoids the
-- "infinite recursion detected in policy for relation profiles" error
-- you get if a policy on `profiles` runs a plain subquery on `profiles`.
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
  select exists (select 1 from public.profiles where id = user_id and is_admin = true);
$$ language sql security definer set search_path = public stable;

-- Prevents a vendor from self-approving their own shop by editing it —
-- silently reverts is_approved unless the actor is an admin.
create or replace function public.prevent_shop_self_approval()
returns trigger as $$
begin
  if (new.is_approved is distinct from old.is_approved) then
    if not public.is_admin(auth.uid()) then
      new.is_approved := old.is_approved;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists shops_prevent_self_approval on shops;
create trigger shops_prevent_self_approval
  before update on shops
  for each row execute function public.prevent_shop_self_approval();

alter table shops enable row level security;
alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;

-- Shops: publicly readable once approved; owner can always see/manage
-- their own (including while pending); admins can see/manage all.
drop policy if exists "Approved shops are publicly readable" on shops;
create policy "Approved shops are publicly readable" on shops
  for select using (is_approved = true);

drop policy if exists "Owners can view own shop" on shops;
create policy "Owners can view own shop" on shops
  for select using (auth.uid() = owner_id);

drop policy if exists "Users can create own shop" on shops;
create policy "Users can create own shop" on shops
  for insert with check (auth.uid() = owner_id);

drop policy if exists "Owners can update own shop" on shops;
create policy "Owners can update own shop" on shops
  for update using (auth.uid() = owner_id);

drop policy if exists "Admins can manage all shops" on shops;
create policy "Admins can manage all shops" on shops
  for all using (public.is_admin(auth.uid()));

-- Products: publicly visible if not tied to a vendor shop (admin's own
-- catalog), or if the vendor shop is approved.
drop policy if exists "Products are publicly readable" on products;
create policy "Products are publicly readable" on products
  for select using (
    shop_id is null
    or exists (select 1 from shops where shops.id = products.shop_id and shops.is_approved = true)
  );

-- Admins manage every product (own catalog + oversight of all vendors).
drop policy if exists "Admins can manage products" on products;
create policy "Admins can manage products" on products
  for all using (public.is_admin(auth.uid()));

-- Vendors manage only the products belonging to their own shop.
drop policy if exists "Vendors can manage own shop products" on products;
create policy "Vendors can manage own shop products" on products
  for all using (
    exists (select 1 from shops where shops.id = products.shop_id and shops.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from shops where shops.id = products.shop_id and shops.owner_id = auth.uid())
  );

-- Users can read and update only their own profile; admins can read all.
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles" on profiles
  for select using (public.is_admin(auth.uid()));
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Users can read and create only their own orders; admins can read all
-- and update status (fulfilling orders).
drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);
drop policy if exists "Admins can view all orders" on orders;
create policy "Admins can view all orders" on orders
  for select using (public.is_admin(auth.uid()));
drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders" on orders
  for update using (public.is_admin(auth.uid()));
drop policy if exists "Users can create own orders" on orders;
create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id);

-- Storage bucket for admin/vendor-uploaded product & shop photos
-- (replaces the unusable watermarked files in public/images — see
-- project memory "stock-images-warning"). Public read, admin/vendor write.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins and vendors can upload product images" on storage.objects;
create policy "Admins and vendors can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'product-images'
    and (
      public.is_admin(auth.uid())
      or exists (select 1 from shops where owner_id = auth.uid())
    )
  );

-- Explicit grants so the Data API works even with "Automatically expose
-- new tables" left OFF in the project settings (recommended default) —
-- RLS policies above still control which rows are actually visible.
grant select on products to anon, authenticated;
grant insert, update, delete on products to authenticated;
grant select, insert, update on profiles to authenticated;
grant select, insert, update on orders to authenticated;
grant select on shops to anon, authenticated;
grant insert, update on shops to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ⚠️ ONE-TIME MANUAL STEP: after you sign up your own account through
-- /auth/RegisterPage (or the Supabase dashboard), run this once, with
-- your own email, to become the site admin. Nobody has admin access
-- until this is run for at least one account:
--
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
