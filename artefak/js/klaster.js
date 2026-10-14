// =====================================================================
// klaster.js — bagian "Klaster spasial dan network overlay"
// Memakai buatPetaDasar dan pasangInteraksi dari peta.js.
// =====================================================================

function siapkanKlaster() {
  const st = DATA_TAMBAHAN.statistik;

  // ----- 1. Angka uji -----
  isiHTML('k-moran', fmt(st.moranI, 4) + '<span class="kecil">p = ' + fmt(st.moranP, 3) +
    ', tidak signifikan pada taraf 5%</span>');
  const signifikan = LUAR_BALI.filter(p => p.Kuadran_Final !== 'Not Significant');
  isiHTML('k-lisa', signifikan.length + ' dari ' + LUAR_BALI.length + ' provinsi' +
    '<span class="kecil">' + provinsiKuadran('HH').length + ' High-High dan ' + provinsiKuadran('LH').length + ' Low-High</span>');
  isiHTML('k-rho', 'ρ = ' + fmt(st.rhoStrukturalGeografis, 3) + '<span class="kecil">Spearman, p = ' +
    fmt(st.pStrukturalGeografis, 3) + '; kedua jaringan hanya sebagian tumpang tindih</span>');

  // ----- 2. Exposure struktural: tinggi bila koefisien L di atas atau sama dengan median -----
  const nilaiL = LUAR_BALI.map(p => p.Koef_Struktural_L).sort((a, b) => a - b);
  const tengah = Math.floor(nilaiL.length / 2);
  const medianL = nilaiL.length % 2 ? nilaiL[tengah] : (nilaiL[tengah - 1] + nilaiL[tengah]) / 2;
  function exposure(p) { return p.Koef_Struktural_L >= medianL ? 'Tinggi' : 'Rendah'; }

  // ----- 3. Warna kuadran -----
  const WARNA_KUADRAN = {
    'HH': WARNA.jambu,
    'LH': WARNA.laguna,
    'HL': WARNA.senja,
    'LL': WARNA.lagunaMuda,
    'Not Significant': WARNA.netral,
    'Sumber shock': WARNA.plum
  };
  let terpilih = null;

  function gaya(fitur) {
    const p = fitur.properties;
    const dipilih = p.Provinsi === terpilih;
    return {
      fillColor: WARNA_KUADRAN[p.Kuadran_Final],
      fillOpacity: 0.95,
      color: dipilih ? WARNA.plum : '#ffffff',
      weight: dipilih ? 3 : 0.8
    };
  }

  const peta = buatPetaDasar('kanvas-peta-lisa');
  const lapisan = L.geoJSON(DATA.geo, { style: gaya }).addTo(peta);
  pasangInteraksi(lapisan, pilihProvinsi);
  peta.fitBounds(lapisan.getBounds(), { padding: [8, 8] });

  // Legenda hanya berisi kuadran yang benar-benar muncul
  const ada = [...new Set(PROVINSI.map(p => p.Kuadran_Final))];
  let legenda = '';
  ['HH', 'LH', 'HL', 'LL', 'Not Significant', 'Sumber shock'].filter(k => ada.includes(k)).forEach(k => {
    legenda += '<span><i style="background:' + WARNA_KUADRAN[k] + '"></i>' + NAMA_KUADRAN[k] + '</span>';
  });
  legenda += '<span><i style="background:' + WARNA.jambu + '; height: 3px; border-radius: 2px"></i>Aliran spillover dari Bali</span>';
  isiHTML('legenda-lisa', legenda);

  // ----- 4. Jaringan spillover: busur dari Bali ke sepuluh penerima terbesar -----
  // Busur dibuat melengkung seperti rute penerbangan (kurva Bézier kuadratik).
  function titikBusur(asal, tujuan, jumlahTitik = 24) {
    const tengahLat = (asal[0] + tujuan[0]) / 2;
    const tengahLon = (asal[1] + tujuan[1]) / 2;
    const dLat = tujuan[0] - asal[0];
    const dLon = tujuan[1] - asal[1];
    const kendali = [tengahLat + dLon * 0.18, tengahLon - dLat * 0.18];   // digeser tegak lurus garis lurus
    const titik = [];
    for (let i = 0; i <= jumlahTitik; i++) {
      const t = i / jumlahTitik;
      const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      titik.push([a * asal[0] + b * kendali[0] + c * tujuan[0], a * asal[1] + b * kendali[1] + c * tujuan[1]]);
    }
    return titik;
  }

  const jaringan = L.layerGroup();
  const penerima = [...LUAR_BALI].sort((a, b) => a.Dx_triliun - b.Dx_triliun).slice(0, 10);
  const terbesar = Math.abs(penerima[0].Dx_triliun);
  const asal = [BALI.Lat, BALI.Lon];
  penerima.forEach(p => {
    const tebal = 1.5 + 6 * Math.abs(p.Dx_triliun) / terbesar;
    L.polyline(titikBusur(asal, [p.Lat, p.Lon]), { color: WARNA.jambu, weight: tebal, opacity: 0.8, interactive: true })
      .bindTooltip('Bali ke ' + p.Provinsi + ': ' + rupiahT(p.Dx_triliun), { sticky: true })
      .addTo(jaringan);
    L.circleMarker([p.Lat, p.Lon], { radius: 4, color: WARNA.jambu, weight: 2, fillColor: '#ffffff', fillOpacity: 1 })
      .addTo(jaringan);
  });
  jaringan.addTo(peta);

  segarkan('tampil-jaringan').addEventListener('change', e => {
    if (e.target.checked) jaringan.addTo(peta);
    else peta.removeLayer(jaringan);
  });

  // ----- 5. Panel rincian -----
  function pilihProvinsi(nama) {
    terpilih = nama;
    lapisan.setStyle(gaya);
    const p = PROVINSI.find(x => x.Provinsi === nama);
    if (nama === 'Bali') {
      isiHTML('detail-lisa', '<strong>Bali</strong> <span class="kecil">(asal shock)</span><br>' +
        'Bali tidak diikutkan dalam uji Moran\'s I dan LISA karena merupakan wilayah asal shock, ' +
        'sehingga pengujian dilakukan pada 33 provinsi lain.');
      return;
    }
    const arti = {
      'HH': 'Intensitas dampaknya tinggi dan dikelilingi provinsi berintensitas tinggi.',
      'LH': 'Intensitas dampaknya rendah, tetapi dikelilingi provinsi berintensitas tinggi.',
      'HL': 'Intensitas dampaknya tinggi, tetapi dikelilingi provinsi berintensitas rendah.',
      'LL': 'Intensitas dampaknya rendah dan dikelilingi provinsi berintensitas rendah.',
      'Not Significant': 'Tidak membentuk klaster yang signifikan pada taraf 5%.'
    };
    isiHTML('detail-lisa', '<strong>' + nama + '</strong> <span class="kecil">(' + NAMA_KUADRAN[p.Kuadran_Final] + ')</span><br>' +
      arti[p.Kuadran_Final] + '<br>' +
      'Local I ' + fmt(p.Local_I, 4) + ', p = ' + fmt(p.p_value, 3) + '. Intensitas ' + persen(p.Intensitas_pct, 3) + '.<br>' +
      'Koefisien struktural L ' + fmt(p.Koef_Struktural_L, 4) + ', exposure struktural ' + exposure(p).toLowerCase() + '.');
  }

  // ----- 6. Tabel silang exposure × kuadran -----
  const kolom = ['HH', 'LH', 'HL', 'LL', 'Not Significant'].filter(k => LUAR_BALI.some(p => p.Kuadran_Final === k));
  let html = '<thead><tr><th>Exposure struktural</th>' +
             kolom.map(k => '<th class="angka">' + NAMA_KUADRAN[k] + '</th>').join('') +
             '<th class="angka">Total</th></tr></thead><tbody>';
  ['Tinggi', 'Rendah'].forEach(ex => {
    const baris = LUAR_BALI.filter(p => exposure(p) === ex);
    html += '<tr><td>' + ex + '</td>' +
            kolom.map(k => '<td class="angka">' + baris.filter(p => p.Kuadran_Final === k).length + '</td>').join('') +
            '<td class="angka">' + baris.length + '</td></tr>';
  });
  html += '<tr><td><strong>Total</strong></td>' +
          kolom.map(k => '<td class="angka"><strong>' + LUAR_BALI.filter(p => p.Kuadran_Final === k).length + '</strong></td>').join('') +
          '<td class="angka"><strong>' + LUAR_BALI.length + '</strong></td></tr></tbody>';
  isiHTML('tabel-overlay', html);

  // ----- 7. Temuan: exposure tinggi tetapi tidak membentuk klaster -----
  const strukturalMurni = LUAR_BALI
    .filter(p => exposure(p) === 'Tinggi' && p.Kuadran_Final === 'Not Significant')
    .sort((a, b) => b.Koef_Struktural_L - a.Koef_Struktural_L);
  const jumlahTinggi = LUAR_BALI.filter(p => exposure(p) === 'Tinggi').length;
  isiTeks('k-temuan', strukturalMurni.length + ' dari ' + jumlahTinggi + ' provinsi dengan exposure struktural tinggi ' +
    'tidak membentuk klaster spasial, misalnya ' + gabungDaftar(strukturalMurni.slice(0, 3).map(p => p.Provinsi)) +
    '. Dampak ke provinsi-provinsi ini merambat melalui rantai produksi, bukan karena kedekatan geografis dengan Bali.');

  pilihProvinsi(provinsiKuadran('HH')[0]);
}
