// Interaktivitas Sage Minimalist. Mengembalikan fungsi cleanup untuk useEffect.
export function initSageTemplate(D) {
  const openBtn = document.getElementById("open-invitation-btn");
  const cover = document.getElementById("sage-cover");
  const onOpen = () => cover && cover.classList.add("hide-cover");
  openBtn && openBtn.addEventListener("click", onOpen);

  const target = D.ts ? new Date(D.ts).getTime() : NaN;
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    if (isNaN(target)) return;
    const left = Math.max(0, target - Date.now());
    const d = document.getElementById("timer-days");
    const h = document.getElementById("timer-hours");
    if (d) d.textContent = pad(Math.floor(left / 864e5));
    if (h) h.textContent = pad(Math.floor((left % 864e5) / 36e5));
  };
  tick();
  const id = setInterval(tick, 1000);

  return () => {
    clearInterval(id);
    openBtn && openBtn.removeEventListener("click", onOpen);
  };
}
export default initSageTemplate;
