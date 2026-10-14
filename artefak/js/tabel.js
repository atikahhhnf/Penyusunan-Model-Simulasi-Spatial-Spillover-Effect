// =====================================================================
// tabel.js — bagian "Tabel data"
// Tiga tabel memakai satu elemen <table>. Setiap tabel didefinisikan
// oleh daftar kolom dan daftar baris; fungsi gambar() menyusun HTML-nya.
// =====================================================================

function siapkanTabel() {
  const D = DATA_TAMBAHAN;
  const labelKBLI = {};
  D.kategori.forEach(k => { labelKBLI[k.kode] = k.label; });

  // Setiap kolom: kunci (nama properti baris), judul, angka (rata kanan?),
  // panjang (teks boleh dilipat?), tampil (cara menulis nilai)
  const TABEL = {
    provinsi: {
      kolom: [
        { kunci: 'Provinsi', judul: 'Provinsi' },
        { kunci: 'dampak', judul: 'Penurunan output (Rp T)', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'Pct_nasional', judul: '% dampak nasional', angka: true, tampil: v => fmt(v, 3) },
        { kunci: 'Intensitas_pct', judul: 'Intensitas (%)', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'Koef_Struktural_L', judul: 'Koef. struktural L', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'pdrb', judul: 'Penurunan PDRB (Rp T)', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'kuadran', judul: 'Kuadran LISA' }
      ],
      baris: PROVINSI.map(p => ({
        ...p,
        dampak: -p.Dx_triliun,
        pdrb: -p.dPDRB_triliun,
        kuadran: NAMA_KUADRAN[p.Kuadran_Final]
      })),
      sumber: 'Sumber: A1_Dampak_per_Provinsi dan F1_LISA_Klasifikasi.'
    },

    indikator: {
      kolom: [
        { kunci: 'kbli', judul: 'KBLI' },
        { kunci: 'sub', judul: 'Kelompok aktivitas', panjang: true },
        { kunci: 'proksi', judul: 'Proksi', panjang: true },
        { kunci: 'b', judul: 'Jan–Feb 2020', angka: true, tampil: fmtNilai },
        { kunci: 's', judul: 'Apr–Jul 2020', angka: true, tampil: fmtNilai },
        { kunci: 'delta', judul: 'Perubahan δ (%)', angka: true, tampil: v => fmt(v, 2) }
      ],
      baris: D.indikator.map(i => ({
        ...i,
        kbli: labelKBLI[i.kbli],
        delta: hitungDelta(i.proksi, i.b, i.s) * 100
      })),
      sumber: 'Sumber: Lampiran 6, Ekstraksi Data Proksi. Perubahan δ memakai rumus yang sama dengan Lampiran 7, sebelum arah dan pemotongan disesuaikan.'
    },

    shock: {
      kolom: [
        { kunci: 'kode', judul: 'Kode' },
        { kunci: 'kbliLabel', judul: 'KBLI' },
        { kunci: 'sektor', judul: 'Sektor' },
        { kunci: 'fdAwal', judul: 'FD awal (Rp T)', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'shock', judul: 'Shock (Rp T)', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'fdSesudah', judul: 'FD sesudah (Rp T)', angka: true, tampil: v => fmt(v, 4) },
        { kunci: 'persen', judul: 'Proporsi shock (%)', angka: true, tampil: v => fmt(v, 2) }
      ],
      baris: D.shockSektor.map(s => ({ ...s, kbliLabel: labelKBLI[s.kbli] })),
      sumber: 'Sumber: Lampiran 8, uji kelayakan shock (D1). FD = permintaan akhir Bali 2025.'
    }
  };

  let aktif = 'provinsi';
  let urutKunci = null;      // kolom yang sedang dipakai untuk mengurutkan
  let urutNaik = true;
  let kataCari = '';
  const kotakCari = segarkan('tabel-cari');

  function gambar() {
    const t = TABEL[aktif];

    // 1. Saring baris yang mengandung kata yang dicari (di kolom teks mana pun)
    let baris = t.baris.filter(b =>
      t.kolom.some(k => !k.angka && String(b[k.kunci]).toLowerCase().includes(kataCari)));

    // 2. Urutkan bila salah satu judul kolom sudah diklik
    if (urutKunci) {
      baris = [...baris].sort((a, b) => {
        const x = a[urutKunci], y = b[urutKunci];
        const hasil = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'id');
        return urutNaik ? hasil : -hasil;
      });
    }

    // 3. Susun HTML
    let html = '<thead><tr>';
    t.kolom.forEach(k => {
      const arah = k.kunci === urutKunci ? (urutNaik ? 'ascending' : 'descending') : 'none';
      html += '<th class="' + (k.angka ? 'angka' : '') + '" aria-sort="' + arah + '">' +
              '<button type="button" data-kunci="' + k.kunci + '">' + k.judul + '</button></th>';
    });
    html += '</tr></thead><tbody>';
    baris.forEach(b => {
      html += '<tr>';
      t.kolom.forEach(k => {
        const nilai = b[k.kunci];
        const kelas = k.angka ? 'angka' : (k.panjang ? 'panjang' : '');
        html += '<td class="' + kelas + '">' + (k.tampil ? k.tampil(nilai) : nilai) + '</td>';
      });
      html += '</tr>';
    });
    isiHTML('tabel-data', html + '</tbody>');
    isiTeks('tabel-info', 'Menampilkan ' + baris.length + ' dari ' + t.baris.length + ' baris. ' + t.sumber);

    // 4. Klik judul kolom: urutkan; klik lagi: balik arah
    document.querySelectorAll('#tabel-data th button').forEach(tombol => {
      tombol.addEventListener('click', () => {
        const kunci = tombol.dataset.kunci;
        if (urutKunci === kunci) urutNaik = !urutNaik;
        else { urutKunci = kunci; urutNaik = true; }
        gambar();
        // kembalikan fokus ke judul kolom yang sama (penting untuk pengguna papan ketik)
        document.querySelector('#tabel-data th button[data-kunci="' + kunci + '"]').focus();
      });
    });
  }

  pasangPilihan('tabel-pilihan', nilai => {
    aktif = nilai;
    urutKunci = null;
    kataCari = '';
    kotakCari.value = '';
    gambar();
  });

  kotakCari.addEventListener('input', () => {
    kataCari = kotakCari.value.trim().toLowerCase();
    gambar();
  });

  gambar();
}
