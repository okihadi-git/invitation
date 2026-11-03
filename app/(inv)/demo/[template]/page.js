import { notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import { DEMO } from "@/lib/defaults";
import Invitation from "@/components/Invitation";

export function generateMetadata({ params }) {
  return { title: `Contoh undangan – ${TEMPLATES[params.template]?.name || ""}` };
}

export default function Demo({ params }) {
  if (!TEMPLATES[params.template]) notFound();
  return <Invitation template={params.template} data={DEMO} />;
}
