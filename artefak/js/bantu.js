// =====================================================================
// bantu.js — fungsi dan pengaturan yang dipakai oleh semua bagian
// =====================================================================

// ===== 1. Format angka ala Indonesia =====
// fmt(84.39) -> "84,39"; fmt(1.69034, 4) -> "1,6903"
function fmt(angka, desimal = 2) {
  return Number(angka).toLocaleString('id-ID', {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal
  }).replace('-', '−');            // tanda minus yang benar secara tipografi
}

// Besaran penurunan dalam triliun rupiah, tanpa tanda minus: -84.39 -> "Rp84,39 T"
function rupiahT(triliun, desimal = 2) {
  return 'Rp' + fmt(Math.abs(triliun), desimal) + '\u00A0T';   // \u00A0 = spasi yang tidak boleh terputus
}

function persen(nilai, desimal = 2) {
  return fmt(nilai, desimal) + '%';
}

// Nilai asli indikator yang besarnya sangat beragam (0,00000794 sampai 1.866.829)
function fmtNilai(v) {
  const a = Math.abs(v);
  if (a >= 1000) return fmt(v, 0);
  if (a >= 1 || v === 0) return fmt(v, 2);
  return v.toLocaleString('id-ID', { maximumSignificantDigits: 4 }).replace('-', '−');
}

// ['A', 'B', 'C'] -> "A, B, dan C"
function gabungDaftar(daftar) {
  if (daftar.length <= 1) return daftar.join('');
  if (daftar.length === 2) return daftar[0] + ' dan ' + daftar[1];
  return daftar.slice(0, -1).join(', ') + ', dan ' + daftar[daftar.length - 1];
}

// Label grafik yang panjang dipecah menjadi beberapa baris di layar sempit.
// Chart.js menulis label berbentuk array sebagai beberapa baris.
function bungkusLabel(teks) {
  const maks = window.innerWidth < 640 ? 16 : 40;
  const baris = [];
  teks.split(' ').forEach(kata => {
    const terakhir = baris[baris.length - 1];
    if (terakhir && (terakhir + ' ' + kata).length <= maks) baris[baris.length - 1] = terakhir + ' ' + kata;
    else baris.push(kata);
  });
  return baris.length > 1 ? baris : teks;
}

// ===== 2. Warna dibaca dari style.css =====
// Nilainya dibaca ulang setiap tema berganti, lihat bacaUlangWarna().
function nilaiCSS(nama) {
  return getComputedStyle(document.documentElement).getPropertyValue('--' + nama).trim();
}

const WARNA = {};
function bacaUlangWarna() {
  Object.assign(WARNA, {
    plum: nilaiCSS('plum'),
    jambu: nilaiCSS('jambu'),
    senja: nilaiCSS('senja'),
    mauve: nilaiCSS('mauve'),
    mauveMuda: nilaiCSS('mauve-muda'),
    laguna: nilaiCSS('laguna'),
    lagunaMuda: nilaiCSS('laguna-muda'),
    kabut: nilaiCSS('kabut'),
    garis: nilaiCSS('garis'),
    netral: nilaiCSS('netral'),
    panel: nilaiCSS('panel'),
    skala: [1, 2, 3, 4, 5].map(i => nilaiCSS('skala-' + i))
  });
  if (window.Chart) {
    Chart.defaults.color = WARNA.kabut;
    Chart.defaults.borderColor = WARNA.garis;
    Chart.defaults.plugins.tooltip.backgroundColor = nilaiCSS('tooltip');
    Chart.defaults.plugins.tooltip.titleColor = nilaiCSS('tooltip-teks');
    Chart.defaults.plugins.tooltip.bodyColor = nilaiCSS('tooltip-teks');
  }
}
bacaUlangWarna();

// ===== 3. Pengaturan bawaan Chart.js untuk semua grafik =====
Chart.defaults.font.family = nilaiCSS('huruf-isi');
Chart.defaults.font.size = 13;
Chart.defaults.maintainAspectRatio = false;              // tinggi mengikuti kotak di CSS
Chart.defaults.plugins.legend.display = false;           // legenda dibuat sendiri di HTML
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.displayColors = false;
// Klik di mana pun pada baris batang dianggap memilih batang itu,
// sehingga batang yang sangat pendek tetap mudah diklik.
Chart.defaults.interaction.mode = 'index';
Chart.defaults.interaction.axis = 'y';
Chart.defaults.interaction.intersect = false;
bacaUlangWarna();                      // sekarang Chart sudah ada, pasang warnanya

// ===== 4. Data provinsi yang sering dipakai =====
const PROVINSI  = DATA.geo.features.map(f => f.properties)            // 34 provinsi,
                       .sort((a, b) => a.IDX - b.IDX);                    // urut kode BPS
const LUAR_BALI = PROVINSI.filter(p => p.Provinsi !== 'Bali');        // 33 provinsi
const BALI      = PROVINSI.find(p => p.Provinsi === 'Bali');

// Mengambil satu baris tabel dekomposisi (B2) berdasarkan namanya
function komponen(nama) {
  return DATA.dekomposisi.find(baris => baris.Komponen === nama);
}

const NAMA_KUADRAN = {
  'HH': 'High-High',
  'LH': 'Low-High',
  'HL': 'High-Low',
  'LL': 'Low-Low',
  'Not Significant': 'Tidak signifikan',
  'Sumber shock': 'Bali (asal shock)'
};

// ===== 5. Mengisi elemen HTML berdasarkan id =====
function isiTeks(id, teks) { document.getElementById(id).textContent = teks; }
function isiHTML(id, html) { document.getElementById(id).innerHTML = html; }

// Mengganti sebuah elemen dengan salinannya, sehingga pendengar peristiwa
// dari penggambaran sebelumnya ikut terbuang. Dipakai untuk elemen yang
// dipasangi pendengar setiap kali halaman dibangun ulang.
function segarkan(id) {
  const lama = document.getElementById(id);
  const baru = lama.cloneNode(true);
  lama.replaceWith(baru);
  return baru;
}

// ===== 6. Grup tombol pilihan: hanya satu tombol aktif pada satu waktu =====
// saatDipilih menerima nilai dari atribut data-nilai tombol yang diklik.
function pasangPilihan(idGrup, saatDipilih) {
  // Tombol diganti dengan salinannya supaya pendengar klik dari
  // penggambaran sebelumnya ikut terbuang dan tidak menumpuk.
  document.querySelectorAll('#' + idGrup + ' button').forEach(t => {
    t.replaceWith(t.cloneNode(true));
  });
  const semuaTombol = document.querySelectorAll('#' + idGrup + ' button');
  semuaTombol.forEach(tombol => {
    tombol.addEventListener('click', () => {
      semuaTombol.forEach(t => t.setAttribute('aria-pressed', t === tombol ? 'true' : 'false'));
      saatDipilih(tombol.dataset.nilai);
    });
  });
}

// ===== 7. Daftar peta Leaflet, dikunci berdasarkan id wadahnya =====
// Dipakai navigasi.js untuk menyegarkan ukuran peta, dan untuk membuang
// peta lama sebelum halaman yang sama digambar ulang.
const PETA_TERDAFTAR = {};
