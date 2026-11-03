// Data awal. DEMO dipakai di /demo/<template>; BLANK dipakai untuk undangan klien
// (tanpa data contoh, supaya rekening/alamat palsu tidak pernah tampil di undangan asli).
export const DEMO = {a:"Rani",b:"Bima",fa:"Rani Putri Hadi",fb:"Bima Wijaya",pa:"Putri dari Bpk. Hadi & Ibu Sari",pb:"Putra dari Bpk. Wijaya & Ibu Lestari",date:"Sabtu, 14 Maret 2027",ts:"2027-03-14T09:00:00+07:00",wa:"",
 ph:{hero:"",a:"",b:"",story:"",end:""},gal:[],story:[{t:"Pertemuan Pertama",d:"Ganti dengan cerita pertemuan kalian."},{t:"Menuju Serius",d:"Ganti dengan cerita perjalanan kalian."},{t:"Lamaran",d:"Ganti dengan cerita lamaran kalian."}],video:"",live:"",music:"",
 events:[{n:"Akad Nikah",d:"Sabtu, 14 Maret 2027",t:"08.00 – 10.00 WIB",p:"Kediaman Mempelai Wanita, Jl. Contoh No. 12, Yogyakarta",g:"20270314T010000Z/20270314T030000Z"},
         {n:"Resepsi",d:"Sabtu, 14 Maret 2027",t:"11.00 – 14.00 WIB",p:"Gedung Serbaguna Nusantara, Jl. Contoh No. 65, Yogyakarta",g:"20270314T040000Z/20270314T070000Z"},
         {n:"Tasyakuran",d:"Minggu, 15 Maret 2027",t:"18.00 – 20.00 WIB",p:"Kediaman Mempelai Pria, Jl. Contoh No. 45, Yogyakarta",g:"20270315T110000Z/20270315T130000Z"}],
 bank:[{b:"Bank Central Asia (BCA)",no:"1234567890",an:"Rani"},{b:"Bank Mandiri",no:"0987654321",an:"Bima"}],addr:"Jl. Contoh No. 12, Yogyakarta 55281"};

export const BLANK = {
  a: "Mempelai", b: "Pasangan", fa: "", fb: "", pa: "", pb: "",
  date: "", ts: "", wa: "", addr: "", video: "", live: "", music: "",
  ph: { hero: "", a: "", b: "", story: "", end: "" },
  gal: [], story: [], events: [], bank: [],
};

export function mergeData(d = {}) {
  return { ...BLANK, ...d, ph: { ...BLANK.ph, ...(d.ph || {}) }, gal: d.gal || [], story: d.story || [], events: d.events || [], bank: d.bank || [] };
}
