// markup.js - Menyediakan struktur konten/section statis

export const getTemplateMarkup = (data) => {
  const { bride, groom, eventDate, location } = data || {};

  return {
    hero: {
      subtitle: "THE WEDDING OF",
      title: `${bride?.nickname || 'Mempelai'} & ${groom?.nickname || 'Mempelai'}`,
      date: eventDate || "Minggu, 12 Desember 2026",
    },
    couple: {
      title: "Mempelai",
      brideName: bride?.fullName || "Nama Mempelai Wanita",
      brideParents: `Putri dari Bpk. ${bride?.father || '-'} & Ibu ${bride?.mother || '-'}`,
      groomName: groom?.fullName || "Nama Mempelai Pria",
      groomParents: `Putra dari Bpk. ${groom?.father || '-'} & Ibu ${groom?.mother || '-'}`,
    },
    event: {
      title: "Waktu & Tempat",
      akadTitle: "Akad Nikah",
      date: eventDate || "12 Desember 2026",
      address: location?.address || "Lokasi Acara Belum Ditentukan",
      mapsUrl: location?.mapsUrl || "#",
    },
  };
};
