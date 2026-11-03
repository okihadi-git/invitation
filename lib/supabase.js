import { createClient } from "@supabase/supabase-js";

// Satu client untuk server (baca undangan publik) dan browser (dashboard, ucapan).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const BUCKET = "invitation-photos";
export const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

// Alamat publik undangan. Lokal dipakai /s/<slug>, produksi <slug>.<domain>.
export const inviteUrl = (slug) =>
  ROOT === "localhost" ? `/s/${slug}` : `https://${slug}.${ROOT}`;
