// =====================================================================
// simulator.js — bagian "Bagaimana kalau guncangannya berbeda?"
//
// Dasar perhitungannya: model Leontief bersifat linear.
//   Δx = L Δf
// Kalau seluruh Δf dikalikan k, maka seluruh Δx ikut terkali k. Jadi
// hasil pada skenario lain TIDAK diperkirakan, melainkan dihitung tepat
// dengan mengalikan hasil simulasi skripsi dengan k.
//
//   k = penurunan pilihan pengguna / penurunan pada skripsi (35,05%)
// =====================================================================

// Penurunan permintaan pariwisata Bali pada skripsi, dalam persen.
// Dihitung dari shock Rp84,39 T dibagi permintaan akhir pariwisata Rp240,77 T.
function persenDasar() {
  const shock = Math.abs(komponen('Efek langsung').Dampak_triliun);
  return shock / DATA_TAMBAHAN.statistik.fdPariwisata * 100;
}

function siapkanSimulator() {
  const dasar = persenDasar();
  const penggeser = segarkan('penggeser');
  const total0 = Math.abs(komponen('Total dampak').Dampak_triliun);
  const bali0 = Math.abs(BALI.Dx_triliun);
  const luar0 = Math.abs(komponen('Spillover interregional').Dampak_triliun);

  // Sepuluh provinsi penerima terbesar, dipakai sebagai isi grafik
  const sepuluh = [...LUAR_BALI].sort((a, b) => a.Dx_triliun - b.Dx_triliun).slice(0, 10);

  // Batas sumbu dipatok pada skenario terberat (70%). Tanpa ini sumbu ikut
  // menyesuaikan setiap kali penggeser digerakkan, sehingga panjang batang
  // terlihat sama saja dan perubahannya tidak terasa.
  const batasSumbu = Math.abs(sepuluh[0].Dx_triliun) * (Number(penggeser.max) / dasar);

  // Nilai awal penggeser disetel tepat pada skenario skripsi
  penggeser.value = dasar.toFixed(2);

  Chart.getChart('grafik-sim')?.destroy();
  const grafik = new Chart(document.getElementById('grafik-sim'), {
    type: 'bar',
    data: {
      labels: sepuluh.map(p => bungkusLabel(p.Provinsi)),
      datasets: [
        // Batang pucat sebagai pembanding: hasil pada skenario skripsi
        // Garis tipis penanda hasil skripsi, digambar di depan agar selalu terlihat
        { label: 'Pandemi 2020', data: sepuluh.map(p => Math.abs(p.Dx_triliun)),
          backgroundColor: 'transparent', borderColor: WARNA.plum,
          borderWidth: { left: 0, right: 2, top: 0, bottom: 0 }, order: 1 },
        { label: 'Skenario pilihan', data: [], backgroundColor: WARNA.jambu,
          borderRadius: 4, order: 2 }
      ]
    },
    options: {
      indexAxis: 'y',
      datasets: { bar: { grouped: false, maxBarThickness: 24 } },
      scales: {
        x: { beginAtZero: true, max: batasSumbu, title: { display: true, text: 'Penurunan output (Rp triliun)' } },
        y: { ticks: { color: WARNA.plum }, grid: { display: false } }
      },
      plugins: { tooltip: { callbacks: { label: c => c.dataset.label + ': ' + rupiahT(c.parsed.x, 3) } } },
      onClick: (evt, elemen) => {
        if (elemen.length) pilihProvinsi(elemen[0].index);
      }
    }
  });

  let terpilih = 0;

  function faktor() {
    return Number(penggeser.value) / dasar;
  }

  function pilihProvinsi(i) {
    terpilih = i;
    const p = sepuluh[i];
    const k = faktor();
    const sekarang = Math.abs(p.Dx_triliun) * k;
    const selisih = sekarang - Math.abs(p.Dx_triliun);
    let arah;
    if (Math.abs(selisih) < 0.0005) {
      arah = 'Sama dengan skenario pandemi 2020.';
    } else if (selisih > 0) {
      arah = 'Lebih besar ' + rupiahT(selisih, 3) + ' dibanding skenario pandemi 2020.';
    } else {
      arah = 'Lebih kecil ' + rupiahT(selisih, 3) + ' dibanding skenario pandemi 2020.';
    }
    isiHTML('detail-sim',
      '<strong>' + p.Provinsi + '</strong><br>' +
      'Penurunan output ' + rupiahT(sekarang, 3) + ', atau ' +
      persen(p.Intensitas_pct * k, 3) + ' dari output provinsinya.<br>' + arah);
  }

  function perbarui() {
    const nilai = Number(penggeser.value);
    const k = faktor();

    // Keterangan pada penggeser. Angka bulat ditulis tanpa desimal.
    let label = (nilai % 1 === 0 ? fmt(nilai, 0) : fmt(nilai, 2)) + '%';
    if (Math.abs(nilai - dasar) < 0.005) label += ' (pandemi 2020)';
    isiTeks('nilai-penggeser', label);

    // Tiga angka hasil
    isiHTML('sim-total', rupiahT(total0 * k) +
      '<span class="kecil">' + persen(total0 * k / 43112 * 100, 3) + ' dari output nasional</span>');
    isiHTML('sim-bali', rupiahT(bali0 * k) +
      '<span class="kecil">' + persen(BALI.Pct_nasional) + ' dari total dampak</span>');
    isiHTML('sim-luar', rupiahT(luar0 * k) +
      '<span class="kecil">' + persen(100 - BALI.Pct_nasional) + ' dari total dampak</span>');

    // Grafik
    grafik.data.datasets[1].data = sepuluh.map(p => Math.abs(p.Dx_triliun) * k);
    grafik.update();

    // Tombol skenario siap pakai ikut menyesuaikan
    document.querySelectorAll('#sim-cepat button').forEach(t => {
      t.setAttribute('aria-pressed', Math.abs(Number(t.dataset.nilai) - nilai) < 0.005 ? 'true' : 'false');
    });

    pilihProvinsi(terpilih);
  }

  penggeser.addEventListener('input', perbarui);
  pasangPilihan('sim-cepat', nilai => {
    penggeser.value = nilai;
    perbarui();
  });

  document.getElementById('kotak-sim').style.height = '420px';
  perbarui();
}
