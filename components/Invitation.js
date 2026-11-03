"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { mergeData } from "@/lib/defaults";

// Dimuat dinamis supaya CSS tiap template hanya masuk ke halaman yang memakainya.
const VIEWS = {
  "toile-biru": dynamic(() => import("./templates/toile-biru/ToileBiru")),
};

export default function Invitation({ template, data, invitationId }) {
  const View = VIEWS[template] || VIEWS["toile-biru"];
  const d = useMemo(() => mergeData(data), [data]);

  // Ucapan & doa disimpan di Supabase. Tanpa invitationId (halaman demo) -> mode contoh.
  const api = useMemo(
    () =>
      invitationId
        ? {
            list: async () => {
              const { data: rows, error } = await supabase
                .from("wishes")
                .select("name,message,created_at")
                .eq("invitation_id", invitationId)
                .order("created_at", { ascending: false })
                .limit(100);
              if (error) throw error;
              return rows;
            },
            add: async (name, message) => {
              const { error } = await supabase
                .from("wishes")
                .insert({ invitation_id: invitationId, name, message });
              if (error) throw error;
            },
          }
        : null,
    [invitationId]
  );

  return <View data={d} api={api} />;
}
