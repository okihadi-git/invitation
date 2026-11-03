-- Jalankan di Supabase: SQL Editor > New query > Run

create table invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique
    check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$')
    check (slug not in ('www','app','admin','api','dashboard','login','demo')),
  template text not null default 'toile-biru',
  published boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  phone text,
  created_at timestamptz not null default now()
);

create table wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table invitations enable row level security;
alter table guests enable row level security;
alter table wishes enable row level security;

-- invitations: publik boleh baca yang terbit; klien hanya boleh mengubah kolom "data"
create policy "baca undangan terbit" on invitations for select using (published);
create policy "pemilik baca" on invitations for select to authenticated using (owner_id = auth.uid());
create policy "pemilik ubah data" on invitations for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
revoke update on invitations from authenticated, anon;
grant update (data) on invitations to authenticated;

-- guests: hanya pemilik undangan
create policy "pemilik kelola tamu" on guests for all to authenticated
  using (exists (select 1 from invitations i where i.id = invitation_id and i.owner_id = auth.uid()))
  with check (exists (select 1 from invitations i where i.id = invitation_id and i.owner_id = auth.uid()));

-- wishes: siapa pun boleh baca & kirim ke undangan terbit; pemilik boleh hapus
create policy "baca ucapan" on wishes for select using (true);
create policy "kirim ucapan" on wishes for insert
  with check (exists (select 1 from invitations i where i.id = invitation_id and i.published));
create policy "pemilik hapus ucapan" on wishes for delete to authenticated
  using (exists (select 1 from invitations i where i.id = invitation_id and i.owner_id = auth.uid()));

-- Storage: bucket foto publik, hanya pemilik yang boleh upload ke folder undangannya
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invitation-photos', 'invitation-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "baca foto" on storage.objects for select using (bucket_id = 'invitation-photos');
create policy "upload foto pemilik" on storage.objects for insert to authenticated
  with check (bucket_id = 'invitation-photos' and exists (
    select 1 from invitations i where i.id::text = (storage.foldername(name))[1] and i.owner_id = auth.uid()));
create policy "hapus foto pemilik" on storage.objects for delete to authenticated
  using (bucket_id = 'invitation-photos' and exists (
    select 1 from invitations i where i.id::text = (storage.foldername(name))[1] and i.owner_id = auth.uid()));
