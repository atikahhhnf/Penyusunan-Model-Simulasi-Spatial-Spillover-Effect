// =====================================================================
// peta.js — fungsi peta bersama dan bagian "Ke mana dampaknya merambat?"
// Fungsi di bagian 1 juga dipakai oleh klaster.js.
// =====================================================================

// ===== 1. Fungsi peta bersama =====

// Membuat peta Leaflet kosong di dalam elemen ber-id tertentu.
// scrollWheelZoom dimatikan supaya menggulir halaman tidak ikut memperbesar peta;
// perbesar peta dengan tombol + dan −.
function buatPetaDasar(idElemen) {
  // Kalau halaman digambar ulang (misalnya tema berganti), peta lama
  // harus dibuang dulu; Leaflet menolak memakai wadah yang sudah terpakai.
  if (PETA_TERDAFTAR[idElemen]) {
    PETA_TERDAFTAR[idElemen].remove();
    delete PETA_TERDAFTAR[idElemen];
  }
  const peta = L.map(idElemen, {
    zoomSnap: 0.25,
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile,     // di ponsel, geser satu jari tetap menggulir halaman
    attributionControl: false
  });
  PETA_TERDAFTAR[idElemen] = peta;
  return peta;
}

// Batas kelas berjarak logaritmik: setiap kelas bernilai kelipatan yang sama
// dari kelas sebelumnya. Cocok untuk nilai yang sangat timpang antarprovinsi.
function batasLogaritmik(daftarNilai, jumlahKelas) {
  const min = Math.min(...daftarNilai);
  const max = Math.max(...daftarNilai);
  return Array.from({ length: jumlahKelas + 1 }, (_, i) => min * Math.pow(max / min, i / jumlahKelas));
}

// Nomor kelas (0 sampai jumlah kelas − 1) untuk sebuah nilai
function nomorKelas(nilai, batas) {
  let kelas = 0;
  for (let i = 1; i < batas.length - 1; i++) {
    if (nilai >= batas[i]) kelas = i;
  }
  return kelas;
}

// Menambahkan tooltip nama, efek sorot, dan aksi klik ke setiap provinsi
function pasangInteraksi(lapisan, saatKlik) {
  lapisan.eachLayer(layer => {
    const p = layer.feature.properties;
    layer.bindTooltip(p.Provinsi, { sticky: true });
    layer.on({
      mouseover: e => { e.target.setStyle({ weight: 2.5, color: WARNA.plum }); e.target.bringToFront(); },
      mouseout: e => lapisan.resetStyle(e.target),
      click: () => saatKlik(p.Provinsi)
    });
  });
}

// ===== 2. Peta dampak per provinsi =====
function siapkanPetaDampak() {
  const UKURAN = {
    dampak: {
      judulLegenda: 'Penurunan output (Rp triliun)',
      judulPeringkat: 'Sepuluh penerima spillover terbesar',
      nilai: p => -p.Dx_triliun,
      teks: p => rupiahT(p.Dx_triliun, 3)
    },
    intensitas: {
      judulLegenda: 'Intensitas dampak (% dari output provinsi)',
      judulPeringkat: 'Sepuluh intensitas tertinggi',
      nilai: p => p.Intensitas_pct,
      teks: p => persen(p.Intensitas_pct, 3)
    }
  };

  let ukuran = 'dampak';
  let batas = [];
  let terpilih = null;

  // Bali dikeluarkan dari skala warna karena nilainya jauh di atas provinsi lain,
  // lalu diberi warna tersendiri sebagai asal shock.
  function hitungBatas() {
    batas = batasLogaritmik(LUAR_BALI.map(UKURAN[ukuran].nilai), WARNA.skala.length);
  }

  function gaya(fitur) {
    const p = fitur.properties;
    const isi = p.Provinsi === 'Bali' ? WARNA.plum : WARNA.skala[nomorKelas(UKURAN[ukuran].nilai(p), batas)];
    const dipilih = p.Provinsi === terpilih;
    return {
      fillColor: isi,
      fillOpacity: 0.95,
      color: dipilih ? WARNA.plum : '#ffffff',
      weight: dipilih ? 3 : 0.8
    };
  }

  hitungBatas();
  const peta = buatPetaDasar('kanvas-peta-dampak');
  const lapisan = L.geoJSON(DATA.geo, { style: gaya }).addTo(peta);
  pasangInteraksi(lapisan, pilihProvinsi);
  peta.fitBounds(lapisan.getBounds(), { padding: [8, 8] });

  // ----- Legenda: dibuat dari batas kelas yang sama dengan pewarnaan -----
  function buatLegenda() {
    const u = UKURAN[ukuran];
    const ringkas = v => fmt(v, v < 1 ? 3 : 2);
    let html = '<span class="judul-legenda">' + u.judulLegenda + '</span>';
    WARNA.skala.forEach((w, i) => {
      html += '<span><i style="background:' + w + '"></i>' + ringkas(batas[i]) + '–' + ringkas(batas[i + 1]) + '</span>';
    });
    html += '<span><i style="background:' + WARNA.plum + '"></i>Bali (asal shock)</span>';
    isiHTML('legenda-dampak', html);
  }

  // ----- Daftar peringkat sepuluh teratas -----
  function buatPeringkat() {
    const u = UKURAN[ukuran];
    const urut = [...LUAR_BALI].sort((a, b) => u.nilai(b) - u.nilai(a)).slice(0, 10);
    isiTeks('judul-peringkat', u.judulPeringkat);
    let html = '';
    urut.forEach((p, i) => {
      html += '<li><button type="button" data-provinsi="' + p.Provinsi + '" aria-pressed="' + (p.Provinsi === terpilih) + '">' +
              '<span class="no">' + (i + 1) + '</span><span>' + p.Provinsi + '</span>' +
              '<span class="nilai">' + u.teks(p) + '</span></button></li>';
    });
    isiHTML('daftar-peringkat', html);
    document.querySelectorAll('#daftar-peringkat button').forEach(tombol => {
      tombol.addEventListener('click', () => pilihProvinsi(tombol.dataset.provinsi));
    });
  }

  // ----- Memilih provinsi dari peta atau dari daftar -----
  function pilihProvinsi(nama) {
    terpilih = nama;
    lapisan.setStyle(gaya);
    document.querySelectorAll('#daftar-peringkat button').forEach(t => {
      t.setAttribute('aria-pressed', t.dataset.provinsi === nama ? 'true' : 'false');
    });

    const p = PROVINSI.find(x => x.Provinsi === nama);
    const bali = nama === 'Bali';
    let html = '<strong>' + nama + '</strong> <span class="kecil">(' +
               (bali ? 'asal shock, terdampak langsung' : 'penerima spillover') + ')</span><br>' +
               'Penurunan output ' + rupiahT(p.Dx_triliun, 3) + ', atau ' +
               persen(p.Pct_nasional, p.Pct_nasional < 1 ? 3 : 2) + ' dari dampak nasional.<br>' +
               'Intensitas ' + persen(p.Intensitas_pct, 3) + ' dari output provinsi sebesar ' + rupiahT(p.Output_triliun) +
               '. Penurunan PDRB ' + rupiahT(p.dPDRB_triliun, 3) + '.';
    if (!bali) {
      const urutDampak = [...LUAR_BALI].sort((a, b) => a.Dx_triliun - b.Dx_triliun);
      const urutIntensitas = [...LUAR_BALI].sort((a, b) => b.Intensitas_pct - a.Intensitas_pct);
      html += '<br><span class="kecil">Peringkat ' + (urutDampak.indexOf(p) + 1) + ' dari 33 menurut besar dampak dan ' +
              (urutIntensitas.indexOf(p) + 1) + ' dari 33 menurut intensitas.</span>';
    }
    isiHTML('detail-dampak', html);
  }

  pasangPilihan('peta-pilihan', nilai => {
    ukuran = nilai;
    hitungBatas();
    lapisan.setStyle(gaya);
    buatLegenda();
    buatPeringkat();
  });

  buatLegenda();
  buatPeringkat();
  pilihProvinsi([...LUAR_BALI].sort((a, b) => a.Dx_triliun - b.Dx_triliun)[0].Provinsi);
}
