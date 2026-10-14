// =====================================================================
// beranda.js — mengisi angka di halaman beranda
// Teks beranda ditulis langsung di index.html; berkas ini hanya
// mengisi angka supaya selalu sama dengan data.
// =====================================================================

function siapkanBeranda() {
  // Tiga angka besar pada pembuka
  isiTeks('h-total', rupiahT(komponen('Total dampak').Dampak_triliun));
  isiTeks('h-mult', fmt(komponen('Total dampak').Multiplier_komponen, 2) + '\u00D7');
  isiTeks('h-prov', LUAR_BALI.length);

  // Angka pada paragraf pengantar
  isiTeks('b-shock', rupiahT(komponen('Efek langsung').Dampak_triliun));
  isiTeks('b-total', rupiahT(komponen('Total dampak').Dampak_triliun));
  isiTeks('b-spill', rupiahT(komponen('Spillover interregional').Dampak_triliun));

  // Jumlah indikator per kategori KBLI: dihitung dari 85 baris indikator
  const indikator = DATA_TAMBAHAN.indikator;
  document.querySelectorAll('[data-jumlah-indikator]').forEach(el => {
    const kode = el.dataset.jumlahIndikator;                 // misalnya "G" atau "JK"
    el.textContent = indikator.filter(i => i.kbli === kode).length;
  });
  isiTeks('jumlah-indikator-total', indikator.length);
}
