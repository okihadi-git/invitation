import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ffnumjhwbtjyghbqmipm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_pNiZ1Im_Vpslrv5rqrBifQ_FMRUMSPh";

// Satu client untuk server (baca undangan publik) dan browser (dashboard, ucapan).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKET = "invitation-photos";
export const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

// Alamat publik undangan. Lokal dipakai /s/<slug>, produksi <slug>.<domain>.
export const inviteUrl = (slug) =>
  ROOT === "localhost" ? `/s/${slug}` : `https://${slug}.${ROOT}`;
