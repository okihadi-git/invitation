import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "undanganka.my.id";
const WA = process.env.NEXT_PUBLIC_ADMIN_WA || "";
const wa = `https://wa.me/${WA}?text=${encodeURIComponent("Halo, saya ingin memesan undangan digital.")}`;

const STEPS = [
  ["Pilih template", "Lihat contoh undangannya, lalu pilih yang paling cocok."],
  ["Isi data lewat dashboard", "Unggah foto, tulis nama, acara, dan rekening. Hasilnya langsung tampil."],
  ["Bagikan ke tamu", "Setiap tamu mendapat link dengan namanya di sampul undangan."],
];

export default function Home() {
  return (
    <>
      <header className="bar">
        <Link href="/" className="logo">undanganka</Link>
        <nav>
          <a href="#template">Template</a>
          <a href="#cara">Cara kerja</a>
          <Link href="/login" className="btn sm">Masuk</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <h1>Undangan pernikahan digital dengan alamat atas nama kalian.</h1>
            <p>
              Kirim satu link seperti <b>rani-bima.{ROOT}</b> ke tamu. Foto, acara, dan
              daftar tamu diatur sendiri dari dashboard, tanpa perlu paham desain.
            </p>
            <div className="cta">
              <a className="btn" href="/demo/toile-biru">Lihat contoh undangan</a>
              <a className="btn ghost" href={wa}>Pesan lewat WhatsApp</a>
            </div>
          </div>
          <div className="phone">
            <iframe src="/demo/toile-biru" title="Contoh undangan Toile Biru" loading="lazy" />
          </div>
        </section>

        <section id="template" className="block">
          <h2>Pilih template</h2>
          <p className="lead">Setiap template bisa dilihat langsung sebelum dipesan.</p>
          <div className="tpl-grid">
            {Object.entries(TEMPLATES).map(([id, t]) => (
              <a key={id} href={`/demo/${id}`} className="tpl">
                <div className="tpl-art"><img src={t.preview} alt="" /></div>
                <h3>{t.name}</h3>
                <p>{t.tag}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="cara" className="block">
          <h2>Cara kerja</h2>
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}><span>{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>
            ))}
          </ol>
          <div className="cta"><a className="btn" href={wa}>Mulai pesan undangan</a></div>
        </section>
      </main>

      <footer className="foot">© {new Date().getFullYear()} undanganka</footer>
    </>
  );
}
