-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (if not exists / drop-then-create).

create table if not exists shops (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text default '',
  logo_url text,
  id_document_url text,
  is_approved boolean not null default false,
  created_at timestamptz default now()
);

alter table shops add column if not exists id_document_url text;

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
alter table products add column if not exists discount_percent integer not null default 0;

-- Collections/categories are no longer a fixed list — admins and
-- vendors can add new ones from the product form. `products.category`
-- stores the category NAME directly (kept as plain text for backward
-- compatibility with existing rows); this table is the source of truth
-- for which collections exist and their public-facing slug.
create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

insert into categories (name, slug) values
  ('Hijab', 'hijab'),
  ('Jilbab/Abaya', 'abaya'),
  ('Robe', 'robe'),
  ('Foulard', 'foulard'),
  ('Abayas longues', 'abayas-longues'),
  ('Kaftans', 'kaftans'),
  ('Hijab de sport', 'hijab-sport'),
  ('Accessoires', 'accessoires')
on conflict (name) do nothing;

-- user_id references profiles (not auth.users directly) so PostgREST
-- can embed profiles(full_name) when fetching reviews.
create table if not exists reviews (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text default '',
  created_at timestamptz default now(),
  unique (product_id, user_id)
);

create table if not exists newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  is_admin boolean not null default false,
  is_courier boolean not null default false,
  courier_requested boolean not null default false,
  created_at timestamptz default now()
);

alter table profiles add column if not exists is_courier boolean not null default false;
alter table profiles add column if not exists courier_requested boolean not null default false;
alter table profiles add column if not exists avatar_url text;

-- Single-row table holding site-wide theme settings — admins pick an
-- accent color from a curated preset list in /admin/settings; the root
-- layout reads this at request time and overrides the --accent CSS
-- variable, so the whole site's accent color updates without a
-- redeploy. Public read (needed to render the theme for every
-- visitor), admin-only write.
create table if not exists site_settings (
  id int primary key default 1,
  accent_hsl text not null default '15 55% 40%',
  updated_at timestamptz default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending',
  customer_name text not null default '',
  customer_phone text not null default '',
  delivery_address text not null default '',
  payment_method text not null default 'cod',
  payment_reference text,
  created_at timestamptz default now()
);

alter table orders add column if not exists customer_name text not null default '';
alter table orders add column if not exists customer_phone text not null default '';
alter table orders add column if not exists delivery_address text not null default '';
alter table orders add column if not exists payment_method text not null default 'cod';
alter table orders add column if not exists payment_reference text;

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

-- Same pattern as is_admin(), for the delivery-courier role. Couriers
-- are promoted manually by an admin (see /admin/customers) — there is
-- no public self-signup for this role.
create or replace function public.is_courier(user_id uuid)
returns boolean as $$
  select exists (select 1 from public.profiles where id = user_id and is_courier = true);
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

-- Security fix: "Users can update own profile" only checks that the
-- row belongs to them — it does NOT restrict which columns they touch.
-- Without this trigger, any user could grant themselves admin/courier
-- rights via a plain profile update. Reverts those two columns to
-- their previous value unless the actor is already an admin.
create or replace function public.prevent_profile_self_escalation()
returns trigger as $$
begin
  if (new.is_admin is distinct from old.is_admin or new.is_courier is distinct from old.is_courier) then
    if not public.is_admin(auth.uid()) then
      new.is_admin := old.is_admin;
      new.is_courier := old.is_courier;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists profiles_prevent_self_escalation on profiles;
create trigger profiles_prevent_self_escalation
  before update on profiles
  for each row execute function public.prevent_profile_self_escalation();

alter table shops enable row level security;
alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table categories enable row level security;
alter table reviews enable row level security;
alter table newsletter_subscribers enable row level security;
alter table site_settings enable row level security;

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
drop policy if exists "Admins can update any profile" on profiles;
create policy "Admins can update any profile" on profiles
  for update using (public.is_admin(auth.uid()));

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

-- Couriers see orders that are ready for pickup or already in transit
-- (not old delivered/cancelled history), and can advance their status.
-- The admin-assigned is_courier flag is the only gate — see is_courier().
drop policy if exists "Couriers can view active orders" on orders;
create policy "Couriers can view active orders" on orders
  for select using (
    public.is_courier(auth.uid()) and status in ('confirmed', 'picked_up')
  );

drop policy if exists "Couriers can update order status" on orders;
create policy "Couriers can update order status" on orders
  for update using (public.is_courier(auth.uid()));

-- Vendors can see any order that contains at least one item from their
-- own shop (each cart item snapshot in `items` carries its shop_id) —
-- the vendor UI then filters `items` down to just their own products
-- before displaying, so they never see another seller's line items.
drop policy if exists "Vendors can view orders with their products" on orders;
create policy "Vendors can view orders with their products" on orders
  for select using (
    exists (
      select 1 from jsonb_array_elements(items) as item
      join shops on shops.id = (item->>'shop_id')::bigint
      where shops.owner_id = auth.uid()
    )
  );

-- Categories: publicly readable; admins and vendors (anyone owning a
-- shop) can add new collections beyond the seeded list.
drop policy if exists "Categories are publicly readable" on categories;
create policy "Categories are publicly readable" on categories
  for select using (true);

drop policy if exists "Admins and vendors can create categories" on categories;
create policy "Admins and vendors can create categories" on categories
  for insert with check (
    public.is_admin(auth.uid())
    or exists (select 1 from shops where owner_id = auth.uid())
  );

-- Reviews: publicly readable; a user manages only their own review
-- (one review per product per user, enforced by the unique constraint).
drop policy if exists "Reviews are publicly readable" on reviews;
create policy "Reviews are publicly readable" on reviews
  for select using (true);

drop policy if exists "Users can create own reviews" on reviews;
create policy "Users can create own reviews" on reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own reviews" on reviews;
create policy "Users can update own reviews" on reviews
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own reviews" on reviews;
create policy "Users can delete own reviews" on reviews
  for delete using (auth.uid() = user_id);

-- Newsletter: anyone (including anonymous visitors) can subscribe;
-- only admins can read the list of subscribers.
drop policy if exists "Anyone can subscribe to the newsletter" on newsletter_subscribers;
create policy "Anyone can subscribe to the newsletter" on newsletter_subscribers
  for insert with check (true);

drop policy if exists "Admins can view newsletter subscribers" on newsletter_subscribers;
create policy "Admins can view newsletter subscribers" on newsletter_subscribers
  for select using (public.is_admin(auth.uid()));

-- Site settings (theme accent color): readable by everyone (needed to
-- render the theme on every page), editable only by admins.
drop policy if exists "Site settings are publicly readable" on site_settings;
create policy "Site settings are publicly readable" on site_settings
  for select using (true);

drop policy if exists "Admins can update site settings" on site_settings;
create policy "Admins can update site settings" on site_settings
  for update using (public.is_admin(auth.uid()));

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

-- Private bucket for vendor identity-verification documents — NOT
-- public, unlike product-images. Files must be uploaded under a path
-- starting with the uploader's own user id (e.g. "<uid>/id-card.jpg")
-- so the policies below can scope access per-owner.
insert into storage.buckets (id, name, public)
values ('vendor-documents', 'vendor-documents', false)
on conflict (id) do nothing;

drop policy if exists "Vendors can upload own identity document" on storage.objects;
create policy "Vendors can upload own identity document" on storage.objects
  for insert with check (
    bucket_id = 'vendor-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners and admins can view identity documents" on storage.objects;
create policy "Owners and admins can view identity documents" on storage.objects
  for select using (
    bucket_id = 'vendor-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  );

-- Public bucket for user profile avatars — any authenticated user can
-- upload their own, under their own user-id folder.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatars are publicly readable" on storage.objects;
create policy "Avatars are publicly readable" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
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
grant select on categories to anon, authenticated;
grant insert on categories to authenticated;
grant select on reviews to anon, authenticated;
grant insert, update, delete on reviews to authenticated;
grant insert on newsletter_subscribers to anon, authenticated;
grant select on newsletter_subscribers to authenticated;
grant select on site_settings to anon, authenticated;
grant update on site_settings to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ⚠️ ONE-TIME MANUAL STEP: after you sign up your own account through
-- /auth/RegisterPage (or the Supabase dashboard), run this once, with
-- your own email, to become the site admin. Nobody has admin access
-- until this is run for at least one account:
--
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
