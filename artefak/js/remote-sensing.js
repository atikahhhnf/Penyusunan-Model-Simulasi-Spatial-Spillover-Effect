// =====================================================================
// remote-sensing.js — bagian "Data remote sensing dan big data"
// =====================================================================

// Rumus perubahan δ, sama dengan Lampiran 7 (Konstruksi Shock), sel 5
function hitungDelta(proksi, baseline, shock) {
  const p = proksi.toLowerCase();
  if (p.includes('google') || p.includes('mobility')) return (shock - baseline) / 100;  // selisih poin persen
  if (baseline < -1e-9) return (shock - baseline) / Math.abs(baseline);                  // indeks bernilai negatif
  if (Math.abs(baseline) > 1e-10) return shock / baseline - 1;                            // indikator positif
  return 0;
}

function rumusDelta(proksi, baseline) {
  const p = proksi.toLowerCase();
  if (p.includes('google') || p.includes('mobility')) return 'δ = (shock − baseline) / 100';
  if (baseline < 0) return 'δ = (shock − baseline) / |baseline|';
  return 'δ = shock / baseline − 1';
}

function siapkanRemoteSensing() {
  const D = DATA_TAMBAHAN;
  isiTeks('rs-baseline', D.periode.baseline);
  isiTeks('rs-shock', D.periode.shock);

  // ----- 1. Tabel sensor -----
  let html = '<thead><tr><th>Sensor</th><th>Variabel</th><th>Resolusi</th><th>Komposit</th></tr></thead><tbody>';
  D.sensor.forEach(s => {
    html += '<tr><td>' + s.nama + '</td><td>' + s.variabel + '</td><td>' + s.resolusi +
            '</td><td>' + s.komposit + '</td></tr>';
  });
  isiHTML('tabel-sensor', html + '</tbody>');

  // ----- 2. Satu baris untuk setiap proksi yang berbeda -----
  // Proksi yang sama (misalnya NTL) dipakai oleh banyak kategori KBLI dengan nilai yang sama.
  const label = {};
  D.kategori.forEach(k => { label[k.kode] = k.label; });

  const unik = [];
  D.indikator.forEach(ind => {
    let u = unik.find(x => x.proksi === ind.proksi);
    if (!u) {
      const [singkat, nama, jenis, sumber, satuan] = D.proksi[ind.proksi];
      const mentah = hitungDelta(ind.proksi, ind.b, ind.s);
      const dibalik = ind.proksi.toLowerCase().includes('residential');   // arah Residential dibalik
      u = {
        proksi: ind.proksi, singkat, nama, jenis, sumber, satuan,
        b: ind.b, s: ind.s, mentah, dibalik,
        delta: dibalik ? -mentah : mentah,
        kbli: []
      };
      unik.push(u);
    }
    if (!u.kbli.includes(label[ind.kbli])) u.kbli.push(label[ind.kbli]);
  });
  unik.sort((a, b) => a.delta - b.delta);          // penurunan terbesar di atas

  const WARNA_JENIS = {
    'Remote sensing': WARNA.plum,
    'Mobilitas Google': WARNA.jambu,
    'Statistik resmi': WARNA.laguna
  };
  let tampil = unik;

  // ----- 3. Grafik batang mendatar -----
  Chart.getChart('grafik-rs')?.destroy();
  const grafik = new Chart(document.getElementById('grafik-rs'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderRadius: 4, maxBarThickness: 22 }] },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: { display: true, text: 'Perubahan dari periode awal (%)' },
          ticks: { callback: v => fmt(v, 0) + '%' },
          grid: { color: c => (c.tick.value === 0 ? WARNA.plum : WARNA.garis) }
        },
        y: { ticks: { autoSkip: false, color: WARNA.plum }, grid: { display: false } }
      },
      plugins: { tooltip: { callbacks: { label: c => fmt(c.parsed.x, 1) + '%' } } },
      onClick: (evt, elemen) => {
        if (elemen.length) tampilkanDetail(tampil[elemen[0].index]);
      }
    }
  });

  function perbarui() {
    // Tinggi grafik menyesuaikan jumlah batang
    const perBatang = window.innerWidth < 640 ? 34 : 26;
    document.getElementById('kotak-rs').style.height = (90 + tampil.length * perBatang) + 'px';
    grafik.data.labels = tampil.map(u => bungkusLabel(u.singkat));
    grafik.data.datasets[0].data = tampil.map(u => u.delta * 100);
    grafik.data.datasets[0].backgroundColor = tampil.map(u => (u.delta > 0 ? WARNA.mauveMuda : WARNA_JENIS[u.jenis]));
    grafik.update();
  }

  // ----- 4. Panel rincian -----
  function tampilkanDetail(u) {
    // Satuan ditulis setelah angka; tanda % menempel pada angka
    const tanpaSatuan = u.satuan === 'sesuai sumber' || u.satuan === 'indeks';
    const satuan = tanpaSatuan ? '' : (u.satuan.startsWith('%') ? '' : ' ') + u.satuan;
    let html = '<strong>' + u.nama + '</strong> <span class="kecil">(' + u.sumber + ')</span><br>' +
      D.periode.baseline + ': ' + fmtNilai(u.b) + satuan + '. ' +
      D.periode.shock + ': ' + fmtNilai(u.s) + satuan + '.<br>' +
      'Perubahan: <strong>' + (u.mentah > 0 ? '+' : '') + fmt(u.mentah * 100, 1) + '%</strong> dengan ' +
      rumusDelta(u.proksi, u.b) + '.<br>' +
      'Dipakai untuk kategori KBLI ' + gabungDaftar(u.kbli.map(k => '<span class="kode">' + k + '</span>')) + '.';
    if (u.dibalik) {
      html += '<br><span class="kecil">Arah indikator ini dibalik: makin lama orang di rumah, makin turun aktivitas di luar rumah.</span>';
    }
    if (u.delta > 0) {
      html += '<br><span class="kecil">Nilainya naik, sehingga tidak dihitung sebagai shock (dipotong menjadi nol).</span>';
    }
    isiHTML('detail-rs', html);
  }

  pasangPilihan('rs-pilihan', jenis => {
    tampil = jenis === 'semua' ? unik : unik.filter(u => u.jenis === jenis);
    perbarui();
    tampilkanDetail(tampil[0]);
  });

  perbarui();
  tampilkanDetail(unik[0]);
}
