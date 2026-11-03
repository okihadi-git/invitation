"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, BUCKET, ROOT, inviteUrl } from "@/lib/supabase";
import { mergeData } from "@/lib/defaults";

const SLOTS = [
  ["hero", "Foto utama (halaman depan)"],
  ["a", "Mempelai wanita"],
  ["b", "Mempelai pria"],
  ["story", "Foto kisah kasih"],
  ["end", "Foto penutup"],
];
const MAX_GAL = 12;

// Perkecil foto dari HP (3–8 MB) menjadi ±300 KB sebelum diunggah.
async function resize(file, max = 1600) {
  const bmp = await createImageBitmap(file);
  const r = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * r);
  c.height = Math.round(bmp.height * r);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob(res, "image/jpeg", 0.85));
}
const pathOf = (url) => (url || "").split(`/${BUCKET}/`)[1];
const waNumber = (p) => {
  let d = (p || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  return d;
};

// Hitung teks tanggal, jam, dan tautan kalender dari isian acara (waktu WIB).
function computeEvent(ev) {
  const s = new Date(`${ev.date}T${ev.from}:00+07:00`);
  const e = new Date(`${ev.date}T${ev.to}:00+07:00`);
  const f = (x) => x.toISOString().replace(/[-:]|\.\d{3}/g, "");
  return {
    ...ev,
    d: s.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }),
    t: `${ev.from.replace(":", ".")} – ${ev.to.replace(":", ".")} WIB`,
    g: `${f(s)}/${f(e)}`,
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [inv, setInv] = useState(null);
  const [data, setData] = useState(null); // data tersimpan
  const [form, setForm] = useState(null); // isian tab Data
  const [guests, setGuests] = useState([]);
  const [bulk, setBulk] = useState("");
  const [tab, setTab] = useState("foto");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { router.replace("/login"); return; }
      const { data: rows } = await supabase
        .from("invitations").select("*")
        .eq("owner_id", s.session.user.id).order("created_at").limit(1);
      const row = rows?.[0] || null;
      setInv(row);
      if (row) {
        const d = mergeData(row.data);
        setData(d); setForm(d);
        loadGuests(row.id);
      }
      setReady(true);
    })();
  }, [router]);

  async function loadGuests(id) {
    const { data: g } = await supabase.from("guests").select("*").eq("invitation_id", id).order("created_at");
    setGuests(g || []);
  }

  // Jalankan aksi dengan status sibuk + pesan hasil.
  async function run(fn, okText) {
    setBusy(true); setMsg({ type: "", text: "" });
    try { await fn(); if (okText) setMsg({ type: "ok", text: okText }); }
    catch (e) { setMsg({ type: "err", text: e.message || "Terjadi kesalahan." }); }
    setBusy(false);
  }

  async function save(next) {
    const { error } = await supabase.from("invitations").update({ data: next }).eq("id", inv.id);
    if (error) throw error;
    setData(next); setForm(next);
  }

  async function putPhoto(file, key) {
    const blob = await resize(file);
    const path = `${inv.id}/${key}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
    if (error) throw error;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  const dropFile = (url) => pathOf(url) && supabase.storage.from(BUCKET).remove([pathOf(url)]);

  const setSlot = (key, file) => file && run(async () => {
    const url = await putPhoto(file, key);
    const old = data.ph[key];
    await save({ ...data, ph: { ...data.ph, [key]: url } });
    dropFile(old);
  }, "Foto tersimpan.");

  const addGallery = (files) => run(async () => {
    const list = [...files].slice(0, MAX_GAL - data.gal.length);
    const urls = [];
    for (const f of list) urls.push(await putPhoto(f, "gal"));
    await save({ ...data, gal: [...data.gal, ...urls] });
  }, "Foto galeri tersimpan.");

  const removeGallery = (url) => run(async () => {
    await save({ ...data, gal: data.gal.filter((u) => u !== url) });
    dropFile(url);
  });

  const saveForm = () => run(async () => {
    const events = (form.events || [])
      .filter((x) => x.n && x.date && x.from && x.to)
      .map(computeEvent);
    const first = events[0];
    await save({
      ...form,
      events,
      date: first ? first.d : "",
      ts: first ? new Date(`${first.date}T${first.from}:00+07:00`).toISOString() : "",
    });
  }, "Data tersimpan.");

  // ---- tamu
  const addGuests = () => run(async () => {
    const rows = bulk.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const [name, phone] = l.split(/[,;\t]/).map((s) => s.trim());
      return { invitation_id: inv.id, name, phone: phone || null };
    });
    if (!rows.length) return;
    const { error } = await supabase.from("guests").insert(rows);
    if (error) throw error;
    setBulk(""); await loadGuests(inv.id);
  }, "Tamu ditambahkan.");

  const delGuest = (id) => run(async () => {
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) throw error;
    setGuests((g) => g.filter((x) => x.id !== id));
  });

  const base = () => (inviteUrl(inv.slug).startsWith("/") ? location.origin + inviteUrl(inv.slug) : inviteUrl(inv.slug));
  const guestLink = (g) => `${base()}/#${encodeURIComponent(g.name.trim().replace(/\s+/g, "_"))}`;
  const copyLink = async (g) => {
    try { await navigator.clipboard.writeText(guestLink(g)); setMsg({ type: "ok", text: `Link untuk ${g.name} disalin.` }); }
    catch { setMsg({ type: "err", text: "Gagal menyalin. Salin manual dari tombol WhatsApp." }); }
  };
  const waLink = (g) => {
    const text = `Kepada Yth. ${g.name}, kami mengundang Anda ke pernikahan ${data.a} & ${data.b}. Detail undangan: ${guestLink(g)}`;
    return `https://wa.me/${waNumber(g.phone)}?text=${encodeURIComponent(text)}`;
  };

  // ---- editor daftar (acara, rekening, kisah)
  const setItem = (key, i, f, v) =>
    setForm((p) => ({ ...p, [key]: p[key].map((it, j) => (j === i ? { ...it, [f]: v } : it)) }));
  const addItem = (key, blank) => setForm((p) => ({ ...p, [key]: [...(p[key] || []), blank] }));
  const delItem = (key, i) => setForm((p) => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }));

  // Dipanggil sebagai fungsi biasa (bukan komponen) supaya input tidak kehilangan fokus.
  const field = (k, label, type = "text") => (
    <label className="fld" key={k}><span>{label}</span>
      <input type={type} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>
  );
  const list = (key, title, fields, blank) => (
    <div className="card">
      <h3>{title}</h3>
      {(form[key] || []).map((it, i) => (
        <div className="row" key={i}>
          {fields.map(([f, label, type]) => (
            <label className="fld" key={f}><span>{label}</span>
              <input type={type || "text"} value={it[f] || ""} onChange={(e) => setItem(key, i, f, e.target.value)} /></label>
          ))}
          <button type="button" className="btn ghost sm" onClick={() => delItem(key, i)}>Hapus</button>
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={() => addItem(key, blank)}>Tambah</button>
    </div>
  );

  if (!ready) return <main className="dash"><p>Memuat…</p></main>;
  if (!inv) return (
    <main className="dash">
      <h1>Undangan belum tersedia</h1>
      <p>Akun ini belum dihubungkan ke undangan. Hubungi admin untuk membuatkannya.</p>
      <button className="btn ghost" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>Keluar</button>
    </main>
  );

  const full = inviteUrl(inv.slug);

  return (
    <main className="dash">
      <div className="dtop">
        <div>
          <h1>{data.a} &amp; {data.b}</h1>
          <a className="url" href={full} target="_blank" rel="noopener">{inv.slug}.{ROOT} ↗</a>
        </div>
        <button className="btn ghost sm" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>Keluar</button>
      </div>

      <div className="tabs" role="tablist">
        {[["foto", "Foto"], ["tamu", `Tamu (${guests.length})`], ["data", "Data undangan"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {msg.text && <p className={msg.type === "err" ? "err" : "ok"} role="status">{msg.text}</p>}

      {tab === "foto" && (
        <>
          <div className="card">
            <h3>Foto undangan</h3>
            <div className="slots">
              {SLOTS.map(([k, label]) => (
                <div className="slot" key={k}>
                  <div className="thumb" style={data.ph[k] ? { backgroundImage: `url("${data.ph[k]}")` } : undefined}>{!data.ph[k] && "Belum ada foto"}</div>
                  <b>{label}</b>
                  <input type="file" accept="image/*" disabled={busy} onChange={(e) => { setSlot(k, e.target.files[0]); e.target.value = ""; }} />
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>Galeri ({data.gal.length}/{MAX_GAL})</h3>
            <input type="file" accept="image/*" multiple disabled={busy || data.gal.length >= MAX_GAL}
              onChange={(e) => { addGallery(e.target.files); e.target.value = ""; }} />
            <div className="gal">
              {data.gal.map((u) => (
                <div className="thumb" key={u} style={{ backgroundImage: `url("${u}")` }}>
                  <button className="btn sm" disabled={busy} onClick={() => removeGallery(u)}>Hapus</button>
                </div>
              ))}
            </div>
          </div>
          {busy && <p>Mengunggah…</p>}
        </>
      )}

      {tab === "tamu" && (
        <>
          <div className="card">
            <h3>Tambah tamu</h3>
            <label className="fld"><span>Satu tamu per baris. Nomor WhatsApp opsional, pisahkan dengan koma.</span>
              <textarea rows={5} value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"Budi Santoso, 08123456789\nKeluarga Pak Hadi"} /></label>
            <p><button className="btn" disabled={busy || !bulk.trim()} onClick={addGuests}>Simpan tamu</button></p>
          </div>
          <div className="card">
            {guests.length === 0 ? <p>Belum ada tamu. Tambahkan lewat kotak di atas.</p> : (
              <table>
                <thead><tr><th>Nama</th><th className="hide-sm">WhatsApp</th><th></th></tr></thead>
                <tbody>
                  {guests.map((g) => (
                    <tr key={g.id}>
                      <td>{g.name}</td><td className="hide-sm">{g.phone || "–"}</td>
                      <td className="act">
                        <button className="btn ghost sm" onClick={() => copyLink(g)}>Salin link</button>
                        {g.phone && <a className="btn sm" href={waLink(g)} target="_blank" rel="noopener">Kirim WhatsApp</a>}
                        <button className="btn ghost sm" disabled={busy} onClick={() => delGuest(g.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {tab === "data" && (
        <>
          <div className="card">
            <h3>Mempelai</h3>
            <div className="formgrid">
              {field("a", "Nama panggilan wanita")}{field("fa", "Nama lengkap wanita")}{field("pa", "Orang tua wanita (mis. Putri dari Bpk. … & Ibu …)")}
              {field("b", "Nama panggilan pria")}{field("fb", "Nama lengkap pria")}{field("pb", "Orang tua pria (mis. Putra dari Bpk. … & Ibu …)")}
            </div>
          </div>
          {list("events", "Acara", [["n", "Nama acara"], ["date", "Tanggal", "date"], ["from", "Mulai (WIB)", "time"], ["to", "Selesai (WIB)", "time"], ["p", "Tempat & alamat"]], { n: "", date: "", from: "", to: "", p: "" })}
          {list("story", "Kisah kasih", [["t", "Judul"], ["d", "Cerita"]], { t: "", d: "" })}
          {list("bank", "Rekening hadiah", [["b", "Bank"], ["no", "Nomor rekening"], ["an", "Atas nama"]], { b: "", no: "", an: "" })}
          <div className="card">
            <h3>Lainnya</h3>
            <div className="formgrid">
              {field("wa", "WhatsApp untuk konfirmasi (628…)")}{field("addr", "Alamat kirim hadiah")}
              {field("video", "Link video (YouTube)")}{field("live", "Link siaran langsung")}{field("music", "Link musik (.mp3)")}
            </div>
          </div>
          <button className="btn" disabled={busy} onClick={saveForm}>{busy ? "Menyimpan…" : "Simpan data"}</button>
        </>
      )}
    </main>
  );
}
