-- =========================================================================
-- WashSlot - PostgreSQL Database Schema for Supabase
-- Hyperlocal Vehicle Wash Booking Platform (Bengaluru)
-- Clean Production Schema: Zero Mock Users. Real Supabase Auth & Profiles.
-- =========================================================================

-- 1. PROFILES TABLE (Mapped to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique,
  phone text unique,
  role text default 'customer' check (role in ('customer', 'vendor', 'superadmin')),
  vendor_center_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_phone on public.profiles(phone);
create index if not exists idx_profiles_role on public.profiles(role);

-- 2. CENTERS TABLE (Washing Studios in Bengaluru Onboarded by Super Admin)
create table if not exists public.centers (
  id text primary key,
  name text not null,
  tagline text,
  locality text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  starting_price integer default 249,
  max_capacity_per_slot integer default 2,
  phone text default '+91 98450 12890',
  admin_contact_number text default '+91 98860 14280',
  vendor_pin text default '1234',
  status text default 'active' check (status in ('active', 'inactive')),
  rating numeric(2,1) default 4.8,
  reviews_count integer default 0,
  image text,
  cover_image text,
  timings text default '08:00 AM - 08:30 PM',
  categories jsonb default '["car", "bike", "foam"]'::jsonb,
  facilities jsonb default '["Water Recycling", "Waiting Lounge", "Free Wi-Fi", "UPI Accepted"]'::jsonb,
  services jsonb default '[]'::jsonb,
  time_slots jsonb default '[]'::jsonb,
  reviews jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_centers_locality on public.centers(locality);
create index if not exists idx_centers_status on public.centers(status);

-- 3. BOOKINGS TABLE (Customer Slot Reservations)
create table if not exists public.bookings (
  id text primary key,
  center_id text not null references public.centers(id) on delete cascade,
  center_name text,
  locality text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  vehicle_number text not null,
  vehicle_model text,
  vehicle_type text default 'Car',
  service_name text not null,
  price integer not null,
  booking_date text not null,
  slot_time text not null,
  otp text not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

create index if not exists idx_bookings_center on public.bookings(center_id);
create index if not exists idx_bookings_customer_phone on public.bookings(customer_phone);
create index if not exists idx_bookings_customer_email on public.bookings(customer_email);
create index if not exists idx_bookings_status on public.bookings(status);

-- 4. REVIEWS TABLE (Verified Customer Ratings)
create table if not exists public.reviews (
  id text primary key,
  center_id text not null references public.centers(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  vehicle_model text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_reviews_center on public.reviews(center_id);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.centers enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- Permissive RLS policies for client API access
create policy "Allow public read access to centers" on public.centers for select using (true);
create policy "Allow public insert/update to centers" on public.centers for all using (true);

create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow authenticated insert/update to profiles" on public.profiles for all using (true);

create policy "Allow public read access to bookings" on public.bookings for select using (true);
create policy "Allow public insert/update to bookings" on public.bookings for all using (true);

create policy "Allow public read access to reviews" on public.reviews for select using (true);
create policy "Allow public insert to reviews" on public.reviews for insert with check (true);

-- Trigger to automatically create a profile record when a user signs up with Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Customer'),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do update
  set
    name = coalesce(excluded.name, profiles.name),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
