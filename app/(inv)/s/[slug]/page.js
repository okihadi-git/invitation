import { cache } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Invitation from "@/components/Invitation";

export const dynamic = "force-dynamic";

const getInvitation = cache(async (slug) => {
  const { data } = await supabase
    .from("invitations")
    .select("id,template,data")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }) {
  const inv = await getInvitation(params.slug);
  if (!inv) return { title: "Undangan tidak ditemukan" };
  const d = inv.data || {};
  const title = `Undangan Pernikahan ${d.a || ""} & ${d.b || ""}`;
  return {
    title,
    openGraph: { title, images: d.ph?.hero ? [d.ph.hero] : [] },
    robots: { index: false },
  };
}

export default async function Page({ params }) {
  const inv = await getInvitation(params.slug);
  if (!inv) notFound();
  return <Invitation template={inv.template} data={inv.data} invitationId={inv.id} />;
}
