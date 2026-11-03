"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr("Email atau kata sandi salah."); setBusy(false); return; }
    router.push("/dashboard");
  }

  return (
    <main className="auth">
      <Link href="/" className="logo">undanganka</Link>
      <form onSubmit={submit} className="panel">
        <h1>Masuk ke dashboard</h1>
        <label className="fld"><span>Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="fld"><span>Kata sandi</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? "Memeriksa…" : "Masuk"}</button>
      </form>
    </main>
  );
}
