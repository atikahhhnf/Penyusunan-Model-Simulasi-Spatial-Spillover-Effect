// =====================================================================
// ringkasan.js — bagian "Ringkasan hasil"
// Semua angka dihitung dari DATA (data.js) dan DATA_TAMBAHAN.
// =====================================================================

function siapkanRingkasan() {
  const langsung = komponen('Efek langsung');
  const total    = komponen('Total dampak');
  const spill    = komponen('Spillover interregional');

  // ----- 1. Persamaan: shock × multiplier = total -----
  isiTeks('r-shock', rupiahT(langsung.Dampak_triliun));
  isiTeks('r-mult', fmt(total.Multiplier_komponen, 4));
  isiTeks('r-total', rupiahT(total.Dampak_triliun));

  // ----- 2. Bilah porsi Bali dan luar Bali -----
  const porsiBali = BALI.Pct_nasional;      // 78,813
  const porsiLuar = spill.Porsi_pct;        // 21,187
  document.getElementById('r-porsi-bali').style.width = porsiBali + '%';
  document.getElementById('r-porsi-luar').style.width = porsiLuar + '%';

  const teksBali = 'Bali ' + persen(porsiBali) + ', ' + rupiahT(BALI.Dx_triliun);
  const teksLuar = '33 provinsi lain ' + persen(porsiLuar) + ', ' + rupiahT(spill.Dampak_triliun);
  isiTeks('r-teks-bali', teksBali);
  isiTeks('r-teks-luar', teksLuar);
  document.getElementById('r-bilah').setAttribute('aria-label', teksBali + '; ' + teksLuar);

  // ----- 3. Fakta kunci -----
  // Urutkan dari penurunan terbesar (Dx paling negatif) ke terkecil
  const menurutDampak = [...LUAR_BALI].sort((a, b) => a.Dx_triliun - b.Dx_triliun);
  const menurutIntensitas = [...LUAR_BALI].sort((a, b) => b.Intensitas_pct - a.Intensitas_pct);

  const terbesar = menurutDampak[0];
  const terintens = menurutIntensitas[0];
  isiHTML('r-terbesar', terbesar.Provinsi +
    '<span class="kecil">' + rupiahT(terbesar.Dx_triliun) + ' penurunan output</span>');
  isiHTML('r-intensitas', terintens.Provinsi +
    '<span class="kecil">' + persen(terintens.Intensitas_pct, 3) + ' dari output provinsinya</span>');

  isiTeks('r-hh', gabungDaftar(provinsiKuadran('HH')));
  isiTeks('r-lh', gabungDaftar(provinsiKuadran('LH')));

  const st = DATA_TAMBAHAN.statistik;
  isiHTML('r-pdrb', rupiahT(st.pdrbNasional) +
    '<span class="kecil">' + rupiahT(st.pdrbBali) + ' di Bali, ' + rupiahT(st.pdrbLuar) + ' di provinsi lain</span>');

  const limaTeratas = menurutDampak.slice(0, 5);
  const jumlahLima = limaTeratas.reduce((jumlah, p) => jumlah + p.Dx_triliun, 0);
  isiHTML('r-lima', persen(jumlahLima / spill.Dampak_triliun * 100, 1) + ' dari seluruh spillover' +
    '<span class="kecil">' + gabungDaftar(limaTeratas.map(p => p.Provinsi)) + '</span>');
}

// Nama provinsi dalam satu kuadran LISA, misalnya 'HH'
function provinsiKuadran(kode) {
  return LUAR_BALI.filter(p => p.Kuadran_Final === kode).map(p => p.Provinsi);
}
