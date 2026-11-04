// Logika interaktif template Sage Minimalist (sama dengan Toile Biru, hanya path aset yang beda).
// D = data undangan, api = {list, add} untuk ucapan (null = mode demo).
export default function init(D, api){
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=u=>/^https?:\/\//i.test(u||"")?u:"#";
const wnum=String(D.wa||"").replace(/\D/g,"");
document.body.classList.add("lock");
const BASE="/templates/sage-minimalist",EXT="svg"; // ganti EXT ke "webp" kalau aset aslinya .webp
const $=id=>document.getElementById(id),$$=s=>[...document.querySelectorAll(s)];
const gst=(()=>{try{return decodeURIComponent(location.hash.slice(1)).replace(/_/g," ")}catch{return ""}})()||"Tamu Undangan";
$$("img[data-i]").forEach(i=>i.src=`${BASE}/${i.dataset.i}.${EXT}`);

// --- isi konten ---
const nm=`${esc(D.a)}<i>&amp;</i>${esc(D.b)}`;$("cn").innerHTML=nm;$("hn").innerHTML=nm;$("gn").textContent=gst;$("rn").value=gst;
$("dt0").textContent=D.date;$("n1").textContent=D.fa||D.a;$("p1").textContent=D.pa;$("n2").textContent=D.fb||D.b;$("p2").textContent=D.pb;
$("fm").textContent=`Keluarga ${D.a} & ${D.b}`;$("ad").textContent=D.addr;$("rc").textContent=D.fa||D.a;$("vn").textContent=`${D.a} & ${D.b}`;
$$(".pho[data-k]").forEach(e=>{const u=D.ph[e.dataset.k];if(u)e.style.backgroundImage=`url("${safe(u)}")`;else e.textContent=e.dataset.k=="b"?D.b[0]:D.a[0]});
$("gl").innerHTML=(D.gal.length?D.gal:(api?[]:[0,0,0])).map(u=>u?`<img class="ph" src="${esc(safe(u))}" alt="">`:`<div class="pho">Ganti dengan foto prewedding</div>`).join("");
$("vl").href=safe(D.video);$("lv").href=safe(D.live);$("wa").href=`https://wa.me/${wnum}`;
const mapU=p=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p);
$("ev").innerHTML=D.events.map(e=>`<div class="card"><h3>${esc(e.n)}</h3><p class="m sm" style="margin:0">${esc(e.d)} · ${esc(e.t)}</p><p style="margin:10px 0 0">${esc(e.p)}</p>
 <div class="row"><a class="btn" target="_blank" rel="noopener" href="${mapU(e.p)}">Buka Peta</a><a class="btn o" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.n+" "+D.a+" & "+D.b)}&dates=${esc(e.g)}&location=${encodeURIComponent(e.p)}">+ Kalender</a></div></div>`).join("");
$("bk").innerHTML=D.bank.map(k=>`<div style="margin:22px 0"><p class="ey" style="margin:0;letter-spacing:.1em">${esc(k.b)}</p><p class="n">${esc(k.no)}</p><p class="sm" style="margin:0 0 10px">${esc(k.an)}</p><button class="btn o" data-cp="${esc(k.no)}">Salin</button></div>`).join("");
const onCp=async e=>{const b=e.target.closest("[data-cp]");if(!b)return;try{await navigator.clipboard.writeText(b.dataset.cp);b.textContent="Tersalin"}catch{b.textContent="Salin manual"}setTimeout(()=>b.textContent="Salin",1500)};document.addEventListener("click",onCp);

$("tl").innerHTML=(D.story||[]).filter(s=>s.t).map(s=>`<div><h3>${esc(s.t)}</h3><p class="m">${esc(s.d)}</p></div>`).join("");
// --- hitung mundur ---
const tgt=new Date(D.ts).getTime()||Date.now();
function cd(){let s=Math.max(0,Math.floor((tgt-Date.now())/1e3));$("cd").innerHTML=[["hari",86400],["jam",3600],["menit",60],["detik",1]].map(([l,m])=>{const n=Math.floor(s/m);s-=n*m;return`<div><b>${n}</b><span>${l}</span></div>`}).join("")}
cd();const tm=setInterval(cd,1000);

// --- RSVP (dikirim lewat WhatsApp) ---
const rs=D.events.map(()=>({s:"Hadir",d:2,k:0}));
const stp=(i,c,l)=>`<div class="st">${l}<span><button data-i="${i}" data-c="${c}" data-v="-1" aria-label="Kurangi ${l}">−</button>${rs[i][c]}<button data-i="${i}" data-c="${c}" data-v="1" aria-label="Tambah ${l}">+</button></span></div>`;
function drawRs(){$("rs").innerHTML=D.events.map((e,i)=>`<div class="card"><h3>${esc(e.n)}</h3><p class="sm" style="margin:0">${esc(e.p)}</p><div class="tg"><button data-i="${i}" data-s="Hadir" aria-pressed="${rs[i].s=="Hadir"}">Ya, Akan Hadir</button><button data-i="${i}" data-s="Tidak hadir" aria-pressed="${rs[i].s!="Hadir"}">Tidak Hadir</button></div>
 <div class="sts">${stp(i,"d","Dewasa")}${stp(i,"k","Anak")}</div></div>`).join("")}
drawRs();
$("rs").onclick=e=>{const b=e.target.closest("button");if(!b)return;const r=rs[b.dataset.i];if(b.dataset.s)r.s=b.dataset.s;else r[b.dataset.c]=Math.max(0,Math.min(9,r[b.dataset.c]+ +b.dataset.v));drawRs()};
$("rk").onclick=()=>{const n=$("rn").value.trim()||gst;
 const m=`Konfirmasi kehadiran pernikahan ${D.a} & ${D.b}\nNama: ${n}\n`+D.events.map((e,i)=>`${esc(e.n)}: ${rs[i].s}${rs[i].s=="Hadir"?` (dewasa ${rs[i].d}, anak ${rs[i].k})`:""}`).join("\n");
 window.open(`https://wa.me/${wnum}?text=${encodeURIComponent(m)}`,"_blank","noopener")};

// --- ucapan & doa ---
const seed=[["Dian Permatasari","Selamat menempuh hidup baru! Semoga sakinah, mawaddah, warahmah.","2 hari lalu"],["Rizky Ananda","Bahagia selalu, semoga langgeng sampai kakek nenek.","3 hari lalu"],["Putri Wulandari","Barakallahu laka, semoga menjadi pasangan yang saling melengkapi.","5 hari lalu"],["Fajar Nugroho","Selamat menempuh hidup baru! Semoga selalu rukun dan bahagia.","5 hari lalu"],["Sari Kusuma","Semoga menjadi keluarga yang penuh berkah dan selalu diberi kemudahan.","1 minggu lalu"],["Andika Pratama","Selamat berdua, bahagia terus sampai tua nanti.","1 minggu lalu"],["Melati Anjani","Barakallahu fii kum, semoga sakinah mawaddah warahmah selalu menyertai.","2 minggu lalu"],["Reza Firmansyah","Happy wedding! Semoga langgeng dan cepat dikasih momongan.","2 minggu lalu"]];
let W=[],pg=0;
const ago=t=>{const s=(Date.now()-new Date(t))/1e3;return s<3600?"baru saja":s<86400?Math.floor(s/3600)+" jam lalu":Math.floor(s/86400)+" hari lalu"};
function drawW(){const a=api?W:[...W,...seed],n=Math.max(1,Math.ceil(a.length/4));pg=Math.min(pg,n-1);
 $("wl").innerHTML=a.length?a.slice(pg*4,pg*4+4).map(w=>`<div class="card wish"><small>${w[2]||"baru saja"}</small><b>${esc(w[0])}</b><p>${esc(w[1])}</p></div>`).join(""):`<p class="m sm" style="text-align:center">Belum ada ucapan. Jadilah yang pertama.</p>`;
 $("pn").textContent=`Halaman ${pg+1} dari ${n}`;$("pv").disabled=!pg;$("nx").disabled=pg>=n-1}
drawW();$("pv").onclick=()=>{pg--;drawW()};$("nx").onclick=()=>{pg++;drawW()};
if(api)api.list().then(r=>{W=r.map(w=>[w.name,w.message,ago(w.created_at)]);drawW()}).catch(()=>{});
$("wb").onclick=async()=>{const n=$("wn").value.trim(),t=$("wt").value.trim();if(!n||!t)return;
 if(api){try{await api.add(n,t)}catch{return}}
 W.unshift([n,t]);$("wt").value="";pg=0;drawW()};

// --- musik ---
const au=$("au"),mu=$("mu");let on=false;
const setM=p=>{on=p;mu.classList.toggle("p",!p)};
mu.onclick=()=>{if(!D.music)return;if(on){au.pause();setM(false)}else au.play().then(()=>setM(true)).catch(()=>{})};

// --- buka undangan ---
$("op").onclick=()=>{$("cv").classList.add("open");document.body.classList.remove("lock");scrollTo(0,0);mu.classList.add("on");
 if(D.music){au.src=D.music;au.play().then(()=>setM(true)).catch(()=>setM(false))}};
$("cv").ontransitionend=()=>{if($("cv").classList.contains("open"))$("cv").style.display="none"};

// --- video YouTube: klik untuk memutar di tempat (bukan YouTube = buka tab baru) ---
const ytId=(u=>{try{const x=new URL(u),h=x.hostname.replace(/^www\./,"");if(h==="youtu.be")return x.pathname.slice(1);
 if(/^(m\.)?youtube(-nocookie)?\.com$/.test(h)){if(x.pathname==="/watch")return x.searchParams.get("v");const m=x.pathname.match(/^\/(embed|shorts|live)\/([\w-]{11})/);if(m)return m[2]}}catch{}return null})(D.video);
const vl=$("vl");
const onVl=e=>{if(!/^[\w-]{11}$/.test(ytId||""))return;e.preventDefault();if(on){au.pause();setM(false)}
 const f=document.createElement("iframe");f.src=`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`;
 f.title="Video undangan";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.referrerPolicy="strict-origin-when-cross-origin";
 f.style.cssText="position:absolute;left:8%;right:8%;top:50%;transform:translateY(-50%);width:84%;aspect-ratio:16/9;border:0;border-radius:8px;background:#000";vl.replaceWith(f)};
vl.addEventListener("click",onVl);

// --- muncul perlahan saat di-scroll ---
let io=null;
if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver"in window){
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.08});
 $$(".wrap section>*,.tl>div").forEach(e=>{e.classList.add("rv");io.observe(e)})}

return ()=>{vl.removeEventListener("click",onVl);clearInterval(tm);document.removeEventListener("click",onCp);io&&io.disconnect();document.body.classList.remove("lock");au.pause()}
}
