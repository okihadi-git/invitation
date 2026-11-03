# undanganka

Platform undangan pernikahan digital: homepage, template undangan, dashboard klien
(foto + tamu + data), dan subdomain per klien (`rani-bima.undanganka.my.id`).

Stack: Next.js 14 (App Router) + Supabase (Postgres, Auth, Storage).

## 1. Supabase
1. Buat project di supabase.com.
2. SQL Editor → tempel isi `supabase/schema.sql` → Run (membuat tabel, aturan akses, dan bucket foto).
3. Authentication → Users → **Add user** untuk tiap klien (email + kata sandi, centang auto-confirm).
4. Hubungkan klien ke undangan (jalankan per klien di SQL Editor):

```sql
insert into invitations (owner_id, slug, template, data)
select id, 'rani-bima', 'toile-biru', '{"a":"Rani","b":"Bima"}'::jsonb
from auth.users where email = 'klien@email.com';
```
`slug` = subdomain klien (huruf kecil, angka, tanda minus). Sisanya diisi klien dari dashboard.

## 2. Jalankan lokal
```bash
cp .env.example .env.local   # isi URL & anon key dari Supabase > Project Settings > API
npm install
npm run dev
```
- Homepage: http://localhost:3000
- Contoh template: http://localhost:3000/demo/toile-biru
- Dashboard: http://localhost:3000/login
- Undangan klien: http://rani-bima.localhost:3000 (atau http://localhost:3000/s/rani-bima)
- Link untuk tamu: tambahkan `#Nama_Tamu`, mis. `…/#Budi_Santoso`

## 3. Deploy dan subdomain
1. Push ke GitHub, import ke Vercel, isi environment variables seperti `.env.example`
   (`NEXT_PUBLIC_ROOT_DOMAIN=undanganka.my.id`).
2. Vercel → Settings → Domains → tambahkan `undanganka.my.id` dan `*.undanganka.my.id`.
3. Wildcard di Vercel mengharuskan nameserver domain diarahkan ke Vercel
   (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`) di tempat Anda mendaftarkan domain .my.id.
   Setelah aktif, setiap `slug.undanganka.my.id` otomatis ditangani `middleware.js`.

## 4. Menambah template
1. Folder baru `components/templates/<id>/` (komponen menerima props `data` dan `api`, lihat `ToileBiru.js`).
2. Gambar di `public/templates/<id>/`.
3. Daftarkan di `lib/templates.js` dan `components/Invitation.js`.
4. Kolom `template` pada tabel `invitations` menentukan template yang dipakai tiap klien.

CSS tiap template bersifat global, jadi template dimuat dinamis satu per halaman.
