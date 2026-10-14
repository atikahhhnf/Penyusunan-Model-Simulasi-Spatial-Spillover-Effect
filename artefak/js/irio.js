// =====================================================================
// irio.js — bagian "Simulasi IRIO Network"
// Satu grafik dengan tiga tampilan. Saat tombol diganti, grafik lama
// dihapus (destroy) lalu dibuat ulang dengan pengaturan tampilan baru.
// =====================================================================

function siapkanIRIO() {
  const WARNA_KOMPONEN = {
    'Efek langsung': WARNA.plum,
    'Efek tidak langsung intraregional': WARNA.mauve,
    'Efek umpan balik (feedback)': WARNA.mauveMuda,
    'Spillover interregional': WARNA.jambu
  };
  const PENJELASAN = {
    'Efek langsung': 'Penurunan output sektor pariwisata Bali yang terkena shock secara langsung.',
    'Efek tidak langsung intraregional': 'Sektor lain di Bali ikut turun karena memasok input ke sektor yang terkena shock.',
    'Efek umpan balik (feedback)': 'Dampak yang kembali ke Bali setelah berputar melalui provinsi lain. Nilainya sangat kecil.',
    'Spillover interregional': 'Dampak yang merambat ke 33 provinsi lain melalui hubungan antarwilayah.'
  };

  const komponen4 = DATA.dekomposisi.filter(b => b.Komponen !== 'Total dampak');
  const sektorBali = DATA_TAMBAHAN.sektorBali;                 // sudah terurut dari total terbesar
  const spillSektor = DATA.sektor;                             // tabel A3, sudah terurut

  let grafik = null;
  let tampilan = 'dekomposisi';

  // ----- Pengaturan tiap tampilan -----
  const TAMPILAN = {
    dekomposisi: {
      tinggi: 300,
      keterangan: () => {
        const bagian = komponen4.map(b => fmt(b.Multiplier_komponen, 4));
        return 'Multiplier ' + fmt(komponen('Total dampak').Multiplier_komponen, 4) +
               ' adalah jumlah kontribusi keempat komponen: ' + bagian.join(' + ') +
               '. Efek umpan balik hampir tidak terlihat karena nilainya hanya ' +
               rupiahT(komponen('Efek umpan balik (feedback)').Dampak_triliun, 2) + '.';
      },
      legenda: '',
      konfigurasi: () => ({
        type: 'bar',
        data: {
          labels: komponen4.map(b => bungkusLabel(b.Komponen)),
          datasets: [{
            data: komponen4.map(b => -b.Dampak_triliun),
            backgroundColor: komponen4.map(b => WARNA_KOMPONEN[b.Komponen]),
            borderRadius: 4, maxBarThickness: 44
          }]
        },
        options: opsiBatang('Penurunan output (Rp triliun)', c => rupiahT(c.parsed.x, c.parsed.x < 1 ? 4 : 2))
      }),
      detail: i => {
        const b = komponen4[i];
        return '<strong>' + b.Komponen + '</strong><br>' +
          'Penurunan output ' + rupiahT(b.Dampak_triliun, Math.abs(b.Dampak_triliun) < 1 ? 4 : 2) +
          ', atau ' + persen(b.Porsi_pct, b.Porsi_pct < 1 ? 3 : 2) + ' dari total dampak. ' +
          'Kontribusi terhadap multiplier: ' + fmt(b.Multiplier_komponen, 4) + '.<br>' + PENJELASAN[b.Komponen];
      }
    },

    'sektor-bali': {
      tinggi: 560,
      keterangan: () => {
        const tanpaShock = sektorBali.filter(s => s.langsung === 0);
        const jumlah = tanpaShock.reduce((j, s) => j + s.total, 0);
        return tanpaShock.length + ' sektor di Bali tidak menerima shock langsung, tetapi tetap turun ' +
               rupiahT(jumlah) + ' (' + persen(jumlah / BALI.Dx_triliun * 100, 1) +
               ' dampak Bali) karena memasok input ke sektor pariwisata.';
      },
      legenda:
        '<span><i style="background:' + WARNA.plum + '"></i>Efek langsung</span>' +
        '<span><i style="background:' + WARNA.mauve + '"></i>Efek tidak langsung</span>' +
        '<span><i style="background:' + WARNA.mauveMuda + '"></i>Efek umpan balik</span>',
      konfigurasi: () => ({
        type: 'bar',
        data: {
          labels: sektorBali.map(s => bungkusLabel(s.sektor)),
          datasets: [
            { label: 'Efek langsung', data: sektorBali.map(s => -s.langsung), backgroundColor: WARNA.plum },
            { label: 'Efek tidak langsung', data: sektorBali.map(s => -s.tidakLangsung), backgroundColor: WARNA.mauve },
            { label: 'Efek umpan balik', data: sektorBali.map(s => -s.umpanBalik), backgroundColor: WARNA.mauveMuda }
          ]
        },
        options: opsiBatang('Penurunan output di Bali (Rp triliun)',
          c => c.dataset.label + ': ' + rupiahT(c.parsed.x, c.parsed.x < 0.01 ? 5 : 4), true)
      }),
      detail: i => {
        const s = sektorBali[i];
        const catatan = s.langsung === 0
          ? 'Sektor ini tidak menerima shock langsung. Seluruh penurunannya berasal dari keterkaitan input–output.'
          : 'Sektor ini termasuk lingkup pariwisata dan menerima shock langsung.';
        return '<strong>' + s.sektor + '</strong> <span class="kecil">(' + s.kode + ')</span><br>' +
          'Total penurunan ' + rupiahT(s.total, 4) + ': langsung ' + rupiahT(s.langsung, 4) +
          ', tidak langsung ' + rupiahT(s.tidakLangsung, 4) + ', umpan balik ' + rupiahT(s.umpanBalik, 5) + '.<br>' + catatan;
      }
    },

    spillover: {
      tinggi: 560,
      keterangan: () => {
        const tiga = spillSektor.slice(0, 3);
        const porsiTiga = tiga.reduce((j, s) => j + s.Porsi_spillover_pct, 0);
        const akomodasi = spillSektor.find(s => s.Kode_S === 'S9');
        return 'Tiga sektor teratas (' + gabungDaftar(tiga.map(s => s.Sektor_singkat)) + ') menyumbang ' +
               persen(porsiTiga) + ' spillover. Sektor akomodasi dan makan minum, yang terkena shock langsung di Bali, ' +
               'hanya ' + persen(akomodasi.Porsi_spillover_pct) + ': dampak merambat lewat pemasok, bukan lewat sesama sektor wisata.';
      },
      legenda: '',
      konfigurasi: () => ({
        type: 'bar',
        data: {
          labels: spillSektor.map(s => bungkusLabel(s.Sektor_singkat)),
          datasets: [{
            data: spillSektor.map(s => -s.Spillover_triliun),
            backgroundColor: spillSektor.map((s, i) => (i < 3 ? WARNA.jambu : WARNA.skala[2])),
            borderRadius: 4, maxBarThickness: 24
          }]
        },
        options: opsiBatang('Penurunan output di luar Bali (Rp triliun)', c => rupiahT(c.parsed.x, 4))
      }),
      detail: i => {
        const s = spillSektor[i];
        return '<strong>' + s.Sektor_singkat + '</strong> <span class="kecil">(' + s.Kode_S + ', KBLI ' + s.KBLI + ')</span><br>' +
          'Penurunan output di 33 provinsi lain ' + rupiahT(s.Spillover_triliun, 4) + ', atau ' +
          persen(s.Porsi_spillover_pct) + ' dari total spillover.';
      }
    }
  };

  // Pengaturan yang sama untuk ketiga grafik batang mendatar
  function opsiBatang(judulSumbuX, labelTooltip, bertumpuk = false) {
    return {
      indexAxis: 'y',
      scales: {
        x: { stacked: bertumpuk, beginAtZero: true, title: { display: true, text: judulSumbuX } },
        y: { stacked: bertumpuk, ticks: { autoSkip: false, color: WARNA.plum }, grid: { display: false } }
      },
      plugins: { tooltip: { callbacks: { label: labelTooltip } } },
      onClick: (evt, elemen) => {
        if (elemen.length) isiHTML('detail-irio', TAMPILAN[tampilan].detail(elemen[0].index));
      }
    };
  }

  function gambar() {
    const t = TAMPILAN[tampilan];
    if (grafik) grafik.destroy();
    else Chart.getChart('grafik-irio')?.destroy();   // sisa dari penggambaran sebelumnya
    document.getElementById('kotak-irio').style.height = t.tinggi + 'px';
    grafik = new Chart(document.getElementById('grafik-irio'), t.konfigurasi());
    isiTeks('irio-keterangan', t.keterangan());
    isiHTML('legenda-irio', t.legenda);
    isiHTML('detail-irio', t.detail(0));
  }

  pasangPilihan('irio-pilihan', nilai => {
    tampilan = nilai;
    gambar();
  });

  gambar();
}
