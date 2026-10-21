-- CampusConnect demo: creates public.students with RLS OFF and 40 fake students.
-- Run this again any time to reset the demo (it also removes any policies).

drop table if exists public.students cascade;

create table public.students (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  matric_no text not null unique,
  email text not null,
  phone text not null,
  course text not null,
  year int not null,
  hostel text not null,
  created_at timestamptz not null default now()
);

-- The demo needs the lock OFF. Some projects switch RLS on for new tables automatically.
alter table public.students disable row level security;
grant select on public.students to anon, authenticated;

insert into public.students (full_name, matric_no, email, phone, course, year, hostel)
select
  name,
  'A' || (2200000 + i * 137),
  lower(split_part(name, ' ', 1)) || '@campus.example',
  '012-' || lpad((i * 7919 % 1000)::text, 3, '0') || ' ' || lpad((i * 104729 % 10000)::text, 4, '0'),
  (array['Computer Science', 'Software Engineering', 'Data Science', 'Information Systems', 'Cybersecurity'])[i % 5 + 1],
  i % 4 + 1,
  'Kolej ' || (array['Tun Fatimah', 'Za''aba', 'Kinabalu', 'Aminuddin Baki'])[i % 4 + 1]
    || ', Blok ' || chr(65 + i % 6) || '-' || (100 + i * 3)
from (
  select name, ord::int as i
  from unnest(array[
    'Aina Sofea binti Rahman', 'Daniel Lim Wei Jie', 'Priya a/p Subramaniam', 'Haziq bin Kamarul',
    'Chloe Tan Hui Min', 'Arjun a/l Ramasamy', 'Nurul Izzati binti Hassan', 'Marcus Wong Jun Hao',
    'Kavitha a/p Muniandy', 'Irfan bin Zulkifli', 'Jasmine Ong Xin Yi', 'Siti Aisyah binti Omar',
    'Ravi a/l Krishnan', 'Amirul bin Azman', 'Rachel Chong Li Ying', 'Farah binti Iskandar',
    'Vikram a/l Selvam', 'Hafiz bin Rosli', 'Michelle Lee Pei Shan', 'Divya a/p Ganesan',
    'Syafiq bin Ismail', 'Ashley Goh Mei Ling', 'Nadia binti Yusof', 'Kumar a/l Perumal',
    'Zarif bin Hamdan', 'Vanessa Teoh Jia Hui', 'Aisyah binti Mansor', 'Ganesh a/l Rajan',
    'Iman binti Shahrul', 'Brandon Yap Zhi Hao', 'Lavanya a/p Arumugam', 'Danish bin Faizal',
    'Natalie Khoo Wen Qi', 'Hannah binti Azlan', 'Suresh a/l Nair', 'Luqman bin Hakim',
    'Grace Lau Yee Ting', 'Thivya a/p Balan', 'Aqil bin Roslan', 'Emily Chan Kai Xin'
  ]) with ordinality as t (name, ord)
) n;

-- Link rows to the demo login accounts (aina@ and daniel@campus.example) by email.
update public.students s
set user_id = u.id
from auth.users u
where u.email = s.email;

select count(*) as students, count(user_id) as linked_to_a_login from public.students;
