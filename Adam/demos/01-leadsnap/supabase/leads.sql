-- LeadSnap demo: creates public.leads with RLS OFF and fake sales leads.
-- Run this again any time to reset.

drop table if exists public.leads cascade;

create table public.leads (
  id bigint generated always as identity primary key,
  company text not null,
  industry text not null,
  contact text not null,
  title text not null,
  email text not null,
  phone text not null,
  deal_value int not null,
  created_at timestamptz not null default now()
);

alter table public.leads disable row level security;
grant select on public.leads to anon, authenticated;

insert into public.leads (company, industry, contact, title, email, phone, deal_value) values
  ('Kopi Kaki Sdn Bhd', 'F&B chain', 'Farid Hassan', 'Head of Operations', 'farid@kopikaki.example', '012-411 2093', 48000),
  ('Pantai Logistics', 'Logistics', 'Michelle Tan', 'VP Sales', 'michelle@pantailogistics.example', '016-382 7741', 120000),
  ('Batik Lane', 'E-commerce', 'Siti Nurhaliza Omar', 'Founder', 'siti@batiklane.example', '013-990 1185', 18000),
  ('NusaCloud Systems', 'SaaS', 'Rajesh Kumar', 'CTO', 'rajesh@nusacloud.example', '017-205 6638', 95000),
  ('Gemilang Properties', 'Real estate', 'Daniel Ong', 'Marketing Director', 'daniel@gemilangprop.example', '012-776 3420', 210000),
  ('Teh Tarik Labs', 'Media agency', 'Aisyah Rahim', 'Managing Partner', 'aisyah@tehtariklabs.example', '019-338 5072', 36000),
  ('Selat Fintech', 'Fintech', 'Wong Kar Hoe', 'Head of Growth', 'karhoe@selatfintech.example', '011-2093 4471', 150000),
  ('Hijau Agro', 'Agriculture', 'Muthu Selvam', 'General Manager', 'muthu@hijauagro.example', '014-662 0189', 64000),
  ('Bayu Clinics', 'Healthcare', 'Dr. Nadia Yusof', 'COO', 'nadia@bayuclinics.example', '012-850 9314', 88000),
  ('Rimba Outdoor Co.', 'Retail', 'Jason Lee', 'Owner', 'jason@rimbaoutdoor.example', '016-147 2268', 22000),
  ('Cendana EdTech', 'Education', 'Priya Nair', 'Head of Partnerships', 'priya@cendana.example', '017-593 8806', 72000),
  ('Puncak Builders', 'Construction', 'Hafiz Rosli', 'Procurement Lead', 'hafiz@puncakbuilders.example', '013-271 4459', 175000),
  ('Seri Wellness', 'Fitness', 'Grace Lim', 'Founder', 'grace@seriwellness.example', '018-904 3317', 15000),
  ('Langkawi Stays', 'Hospitality', 'Amir Zulkifli', 'Revenue Manager', 'amir@langkawistays.example', '019-468 1150', 54000),
  ('Orkid Insurance', 'Insurance', 'Chong Mei Yee', 'Distribution Head', 'meiyee@orkidins.example', '012-337 6092', 132000),
  ('Dapur Digital', 'Cloud kitchen', 'Kevin Raj', 'Co-founder', 'kevin@dapurdigital.example', '011-1820 7743', 27000);

select count(*) as leads from public.leads;
