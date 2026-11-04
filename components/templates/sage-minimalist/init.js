// init.js - Menangani interaktivitas template di sisi client

export function initSageTemplate() {
  if (typeof window === 'undefined') return;

  // 1. Buka Undangan & Unlock Scroll
  const openBtn = document.getElementById('open-invitation-btn');
  const coverSection = document.getElementById('sage-cover');
  
  if (openBtn && coverSection) {
    openBtn.addEventListener('click', () => {
      coverSection.classList.add('hide-cover');
      document.body.style.overflow = 'auto';
      
      const audio = document.getElementById('bg-music');
      if (audio) audio.play();
    });
  }

  // 2. Countdown Timer
  const countDate = new Date('Dec 12, 2026 09:00:00').getTime();
  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');

    if (daysEl) daysEl.innerText = days < 10 ? `0${days}` : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
  }, 1000);
}
