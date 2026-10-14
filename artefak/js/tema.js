// =====================================================================
// tema.js — pergantian tampilan terang dan gelap
//
// Warna disimpan sebagai variabel CSS di style.css. Atribut data-tema
// pada elemen <html> menentukan kumpulan warna mana yang dipakai.
// Grafik membaca warna lewat bantu.js, jadi setelah tema berganti
// halaman yang sedang terbuka digambar ulang (lihat navigasi.js).
// =====================================================================

function temaSekarang() {
  return document.documentElement.dataset.tema === 'gelap' ? 'gelap' : 'terang';
}

function pasangTema(nama) {
  document.documentElement.dataset.tema = nama;
  const gelap = nama === 'gelap';

  const tombol = document.getElementById('tombol-tema');
  tombol.setAttribute('aria-pressed', gelap ? 'true' : 'false');
  tombol.setAttribute('aria-label', gelap ? 'Beralih ke tampilan terang' : 'Beralih ke tampilan gelap');
  isiTeks('label-tema', gelap ? 'Terang' : 'Gelap');

  try {
    localStorage.setItem('tema', nama);
  } catch (e) {
    // Beberapa browser melarang penyimpanan saat berkas dibuka langsung
    // dari komputer. Tidak masalah: tema tetap berganti, hanya tidak diingat.
  }
}

function siapkanTema(saatBerganti) {
  pasangTema(temaSekarang());
  document.getElementById('tombol-tema').addEventListener('click', () => {
    pasangTema(temaSekarang() === 'gelap' ? 'terang' : 'gelap');
    bacaUlangWarna();     // bantu.js: ambil nilai variabel CSS yang baru
    saatBerganti();       // navigasi.js: gambar ulang halaman yang terbuka
  });
}
