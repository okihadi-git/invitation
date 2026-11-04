import React, { useEffect } from 'react';
import { getTemplateMarkup } from './markup';
import { initSageTemplate } from './init';
import './style.css';

export default function SageMinimalist({ data }) {
  const markup = getTemplateMarkup(data);

  useEffect(() => {
    initSageTemplate();
  }, []);

  return (
    <div className="sage-template">
      {/* Cover / Hero Section */}
      <section id="sage-cover" className="sage-hero">
        <div className="sage-card">
          <p className="sage-subtitle">{markup.hero.subtitle}</p>
          <h1 className="sage-title">{markup.hero.title}</h1>
          <p className="sage-date">{markup.hero.date}</p>
          <button id="open-invitation-btn" className="sage-btn">Buka Undangan</button>
        </div>
      </section>

      {/* Couple Section */}
      <section className="sage-section sage-couple">
        <h2 className="sage-section-title">{markup.couple.title}</h2>
        <div className="sage-couple-grid">
          <div className="sage-person">
            <h3>{markup.couple.brideName}</h3>
            <p>{markup.couple.brideParents}</p>
          </div>
          <div className="sage-divider">&</div>
          <div className="sage-person">
            <h3>{markup.couple.groomName}</h3>
            <p>{markup.couple.groomParents}</p>
          </div>
        </div>
      </section>

      {/* Event Section */}
      <section className="sage-section sage-event">
        <h2 className="sage-section-title">{markup.event.title}</h2>
        <div className="sage-event-card">
          <h3>{markup.event.akadTitle}</h3>
          <p>{markup.event.date}</p>
          <p>{markup.event.address}</p>
          <div className="sage-timer">
            <div><span id="timer-days">00</span><p>Hari</p></div>
            <div><span id="timer-hours">00</span><p>Jam</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
