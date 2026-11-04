"use client";
import { useEffect, useState } from "react";
import { getTemplateMarkup } from "./markup";
import { initSageTemplate } from "./init";
import "./style.css";

export default function SageMinimalist({ data }) {
  const m = getTemplateMarkup(data);
  const [guest, setGuest] = useState("");

  useEffect(() => {
    try {
      setGuest(decodeURIComponent(location.hash.slice(1)).replace(/_/g, " "));
    } catch {}
    return initSageTemplate(data);
  }, [data]);

  return (
    <div className="sage-template">
      <section id="sage-cover" className="sage-hero">
        <div className="sage-card">
          <p className="sage-subtitle">{m.hero.subtitle}</p>
          <h1 className="sage-title">{m.hero.title}</h1>
          <p className="sage-date">{m.hero.date}</p>
          {guest && <p className="sage-date">Kepada: <b>{guest}</b></p>}
          <button id="open-invitation-btn" className="sage-btn">Buka Undangan</button>
        </div>
      </section>

      <section className="sage-section sage-couple">
        <h2 className="sage-section-title">{m.couple.title}</h2>
        <div className="sage-couple-grid">
          <div className="sage-person">
            <h3>{m.couple.brideName}</h3>
            <p>{m.couple.brideParents}</p>
          </div>
          <div className="sage-divider">&amp;</div>
          <div className="sage-person">
            <h3>{m.couple.groomName}</h3>
            <p>{m.couple.groomParents}</p>
          </div>
        </div>
      </section>

      <section className="sage-section sage-event">
        <h2 className="sage-section-title">Waktu &amp; Tempat</h2>
        {m.events.map((e) => (
          <div key={e.name} className="sage-event-card" style={{ marginBottom: "1rem" }}>
            <h3>{e.name}</h3>
            <p>{e.date}</p>
            <p>{e.time}</p>
            <p>{e.place}</p>
          </div>
        ))}
        <div className="sage-timer">
          <div><span id="timer-days">00</span><p>Hari</p></div>
          <div><span id="timer-hours">00</span><p>Jam</p></div>
        </div>
      </section>
    </div>
  );
}
