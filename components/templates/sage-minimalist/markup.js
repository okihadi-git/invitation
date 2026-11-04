// Konten statis Sage Minimalist, disusun dari data undangan (format sama dengan Toile Biru).
export const getTemplateMarkup = (D) => ({
  hero: {
    subtitle: "THE WEDDING OF",
    title: `${D.a || "Mempelai"} & ${D.b || "Pasangan"}`,
    date: D.date || "",
  },
  couple: {
    title: "Mempelai",
    brideName: D.fa || D.a,
    brideParents: D.pa || "",
    groomName: D.fb || D.b,
    groomParents: D.pb || "",
  },
  events: (D.events || []).map((e) => ({ name: e.n, date: e.d, time: e.t, place: e.p })),
  addr: D.addr || "",
});
export default getTemplateMarkup;
