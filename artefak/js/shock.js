// =====================================================================
// shock.js — bagian "Dari indikator menjadi shock"
// =====================================================================

function siapkanShock() {
  const D = DATA_TAMBAHAN;
  const st = D.statistik;
  const sektor = [...D.shockSektor].sort((a, b) => b.shock - a.shock);   // shock terbesar di atas

  // ----- 1. Kalimat ringkasan -----
  const totalShock = sektor.reduce((jumlah, s) => jumlah + s.shock, 0);
  const turunBali = (1 - st.fdBaliSesudah / st.fdBaliAwal) * 100;
  isiHTML('shock-ringkas',
    'Permintaan akhir sepuluh sektor terkait pariwisata di Bali bernilai <strong>' + rupiahT(st.fdPariwisata) +
    '</strong>. Shock memangkasnya sebesar <strong>' + rupiahT(totalShock) + '</strong> (' +
    persen(totalShock / st.fdPariwisata * 100) + '). Akibatnya, permintaan akhir Bali secara keseluruhan turun dari ' +
    rupiahT(st.fdBaliAwal) + ' menjadi ' + rupiahT(st.fdBaliSesudah) + ', atau ' + persen(turunBali, 1) + '.');

  // ----- 2. Grafik: batang pucat = permintaan akhir awal, batang tua = shock -----
  Chart.getChart('grafik-shock')?.destroy();
  new Chart(document.getElementById('grafik-shock'), {
    type: 'bar',
    data: {
      labels: sektor.map(s => bungkusLabel(s.sektor)),
      datasets: [
        // order kecil = digambar paling depan
        { label: 'Shock', data: sektor.map(s => s.shock), backgroundColor: WARNA.jambu, borderRadius: 4, order: 1 },
        { label: 'Permintaan akhir awal', data: sektor.map(s => s.fdAwal), backgroundColor: WARNA.skala[1], borderRadius: 4, order: 2 }
      ]
    },
    options: {
      indexAxis: 'y',
      datasets: { bar: { grouped: false, maxBarThickness: 26 } },   // kedua batang ditumpuk di posisi yang sama
      scales: {
        x: { title: { display: true, text: 'Rp triliun' }, beginAtZero: true },
        y: { ticks: { color: WARNA.plum }, grid: { display: false } }
      },
      plugins: {
        tooltip: { callbacks: { label: c => c.dataset.label + ': ' + rupiahT(c.parsed.x) } }
      },
      onClick: (evt, elemen) => {
        if (elemen.length) tampilkanDetail(elemen[0].index);
      }
    }
  });

  // ----- 3. Panel rincian -----
  function tampilkanDetail(i) {
    const s = sektor[i];
    const kat = D.kategori.find(k => k.kode === s.kbli);
    const jumlahIndikator = D.indikator.filter(ind => ind.kbli === s.kbli).length;
    isiHTML('detail-shock',
      '<strong>' + s.sektor + '</strong> <span class="kecil">(' + s.kode + ', KBLI ' + kat.label + ')</span><br>' +
      'Permintaan akhir ' + rupiahT(s.fdAwal) + ' turun ' + rupiahT(s.shock) + ' menjadi ' + rupiahT(s.fdSesudah) + '.<br>' +
      'Proporsi shock ' + persen(s.persen) + ' berasal dari koefisien δ kategori ' + kat.label + ' sebesar ' +
      fmt(kat.delta, 4) + ', yang disusun dari ' + jumlahIndikator + ' indikator.');
  }

  tampilkanDetail(0);
}
