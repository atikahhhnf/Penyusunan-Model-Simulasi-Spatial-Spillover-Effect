// =====================================================================
// navigasi.js — berpindah halaman tanpa memuat ulang (dimuat paling akhir)
//
// Setiap bagian adalah satu halaman penuh, bukan satu bagian dari
// gulungan panjang. Alamat setelah tanda # menentukan halaman mana yang
// tampil, misalnya index.html#simulator. Tombol kembali pada browser
// tetap berfungsi karena alamatnya ikut berubah.
// =====================================================================

// slug: [judul pada bilah atas, fungsi yang membangun isinya]
const HALAMAN = {
  'beranda':   ['Beranda', siapkanBeranda],
  'ringkasan': ['Ringkasan', siapkanRingkasan],
  'satelit':   ['Data satelit', siapkanRemoteSensing],
  'shock':     ['Konstruksi shock', siapkanShock],
  'irio':      ['Simulasi IRIO', siapkanIRIO],
  'peta':      ['Peta dampak', siapkanPetaDampak],
  'klaster':   ['Klaster spasial', siapkanKlaster],
  'kebijakan': ['Rekomendasi', null],
  'simulator': ['Simulator', siapkanSimulator],
  'data':      ['Tabel data', siapkanTabel],
  'tanya':     ['Tanya jawab', null],
  'tentang':   ['Tentang', null]
};

const sudahDibangun = new Set();
let halamanAktif = 'beranda';

// Membangun isi satu halaman. Dipanggil sekali saat halaman pertama
// dibuka, dan sekali lagi setiap tema berganti supaya grafik dan peta
// ikut memakai warna yang baru.
function bangunHalaman(nama, paksa = false) {
  const bangun = HALAMAN[nama] && HALAMAN[nama][1];
  if (!bangun) return;
  if (sudahDibangun.has(nama) && !paksa) return;
  bangun();
  sudahDibangun.add(nama);
}

function jalankanRute() {
  const nama = location.hash.replace('#', '') || 'beranda';
  const tujuan = HALAMAN[nama] ? nama : 'beranda';
  halamanAktif = tujuan;

  // 1. Tampilkan satu halaman, sembunyikan sisanya
  Object.keys(HALAMAN).forEach(h => {
    document.getElementById('h-' + h).hidden = (h !== tujuan);
  });

  // 2. Tandai menu dan judul pada bilah atas
  document.querySelectorAll('.menu a').forEach(a => {
    const aktif = a.getAttribute('href') === '#' + tujuan;
    a.classList.toggle('aktif', aktif);
    if (aktif) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const judul = HALAMAN[tujuan][0];
  isiTeks('judul-bilah', tujuan === 'beranda' ? '' : judul);
  document.title = tujuan === 'beranda'
    ? 'Ketika Bali Terhenti'
    : judul + ' | Ketika Bali Terhenti';

  // 3. Bangun isinya, lalu segarkan ukuran peta
  bangunHalaman(tujuan);
  Object.values(PETA_TERDAFTAR).forEach(peta => peta.invalidateSize());

  // 4. Halaman baru selalu dimulai dari atas
  window.scrollTo(0, 0);
  tutupMenu();
}

// ----- Menu geser untuk layar kecil -----
const sisi = document.getElementById('sisi');
const tirai = document.getElementById('tirai');
const tombolMenu = document.getElementById('tombol-menu');

function bukaMenu() {
  sisi.classList.add('terbuka');
  tirai.hidden = false;
  tombolMenu.setAttribute('aria-expanded', 'true');
}
function tutupMenu() {
  sisi.classList.remove('terbuka');
  tirai.hidden = true;
  tombolMenu.setAttribute('aria-expanded', 'false');
}

tombolMenu.addEventListener('click', () => {
  if (sisi.classList.contains('terbuka')) tutupMenu();
  else bukaMenu();
});
tirai.addEventListener('click', tutupMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') tutupMenu();
});

// Mengklik tautan ke halaman yang sedang terbuka tidak mengubah alamat,
// jadi perpindahannya dijalankan sendiri.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    if (location.hash === a.getAttribute('href')) jalankanRute();
  });
});

// ----- Mulai -----
// Saat tema berganti: tandai semua halaman perlu digambar ulang, lalu
// gambar ulang yang sedang terbuka. Halaman lain menyusul saat dibuka,
// sehingga grafik dan petanya ikut memakai warna tema yang baru.
siapkanTema(() => {
  sudahDibangun.clear();
  bangunHalaman(halamanAktif, true);
});
window.addEventListener('hashchange', jalankanRute);
// Tunggu huruf selesai dimuat supaya grafik langsung memakai huruf yang benar
document.fonts.ready.then(jalankanRute);
