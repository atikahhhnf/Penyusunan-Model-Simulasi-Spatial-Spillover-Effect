# Dokumentasi Sistem

Dokumen ini menjelaskan bagaimana artefak web story dibangun: arsitekturnya, alur datanya, mekanisme di dalamnya, dan alasan di balik keputusan teknis yang diambil.

Dokumen lain yang melengkapi:

| Berkas | Untuk siapa | Isi |
|---|---|---|
| `README.md` | penilai dan pembaca umum | Identitas, ringkasan penelitian, struktur repositori |
| `PANDUAN-PENGGUNAAN.md` | pembaca web story | Cara membuka dan menjelajahi situs |
| `PANDUAN-PENGEMBANG.md` | yang akan menyunting kode | Penjelasan tiap berkas dan bagian yang biasa diubah |
| **`DOKUMENTASI-SISTEM.md`** | penilai teknis | Arsitektur dan mekanisme sistem |

---

## 1. Gambaran arsitektur

Artefak ini adalah **situs statis**. Tidak ada server aplikasi, tidak ada basis data, dan tidak ada proses *build*. Berkas sumber yang ditulis adalah berkas yang dijalankan peramban.

```
┌─────────────────────────────────────────────────┐
│  Peramban (Chrome, Edge, Firefox)               │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  index.html    struktur 12 halaman        │  │
│  │  style.css     tampilan, 14 bagian        │  │
│  └───────────────────────────────────────────┘  │
│                      ▲                          │
│  ┌───────────────────┴───────────────────────┐  │
│  │  js/   12 modul                           │  │
│  │  bantu · tema · navigasi · 9 modul isi    │  │
│  └───────────────────────────────────────────┘  │
│                      ▲                          │
│  ┌───────────────────┴───────────────────────┐  │
│  │  data/   data.js · data_tambahan.js       │  │
│  └───────────────────────────────────────────┘  │
│                      ▲                          │
│  ┌───────────────────┴───────────────────────┐  │
│  │  lib/   Chart.js · Leaflet · huruf        │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

Seluruh lapisan berada di dalam satu folder. Tidak ada permintaan jaringan keluar sama sekali ketika situs dijalankan, sehingga artefak tetap berfungsi penuh tanpa koneksi internet.

### Ukuran sistem

| Komponen | Jumlah |
|---|---|
| Halaman | 12 |
| Modul JavaScript | 12 berkas |
| Baris kode sendiri | sekitar 2.900, di luar pustaka dan data |
| Pustaka pihak ketiga | 2 (Chart.js, Leaflet) |
| Berkas data | 2 |

---

## 2. Alur data

Rantai dari citra satelit sampai angka yang tampil di layar:

```
Citra satelit (Google Earth Engine)
    │  kode 2: statistik zonal per kabupaten/kota
    ▼
85 indikator proksi
    │  kode 3: normalisasi min–maks, agregasi per KBLI
    ▼
Koefisien δ untuk 9 kategori KBLI
    │  kode 3: δᵢ × permintaan akhir sektor
    ▼
Guncangan Rp84,39 T pada 10 sektor Bali
    │  kode 4: Δx = (I − A)⁻¹ Δf
    ▼
Berkas CSV hasil simulasi (A1, A3, B2, C2, C3)
    │  kode 5: Moran's I, LISA, network overlay
    ▼
F1_LISA_Klasifikasi.csv
    │  kode 6: gabung dengan GeoJSON, tulis sebagai JavaScript
    ▼
data/data.js
    │  dibaca modul di folder js/
    ▼
Angka, grafik, dan peta di layar
```

**Tidak ada satu pun angka yang diketik langsung ke dalam halaman.** Setiap nilai ditarik dari berkas data melalui JavaScript. Konsekuensinya, memperbarui hasil simulasi cukup dilakukan dengan mengganti `data.js`, dan seluruh situs ikut berubah tanpa menyentuh HTML.

### Format berkas data

**`data.js`** dihasilkan kode 6, berukuran sekitar 489 KB:

```javascript
const DATA = {
  geo:         { /* GeoJSON 34 provinsi, properti tiap provinsi sudah
                    digabung: Dx_triliun, Intensitas_pct, Kuadran_Final,
                    Koef_Struktural_L, Lat, Lon, dan lainnya */ },
  dekomposisi: [ /* 5 baris: 4 komponen + total */ ],
  sektor:      [ /* 17 sektor, spillover di luar Bali */ ]
};
```

**`data_tambahan.js`** disusun dari keluaran kode 2 sampai 5, berukuran sekitar 23 KB:

```javascript
const DATA_TAMBAHAN = {
  periode:     { baseline, shock },
  sensor:      [ /* 4 sensor beserta koleksi, resolusi, metode komposit */ ],
  proksi:      { /* 25 proksi unik: label, jenis, sumber, satuan */ },
  indikator:   [ /* 85 baris: kbli, subsektor, proksi, nilai b dan s */ ],
  kategori:    [ /* 9 kategori KBLI beserta δ */ ],
  shockSektor: [ /* 10 sektor terdampak */ ],
  sektorBali:  [ /* 17 sektor, dekomposisi per komponen */ ],
  statistik:   { /* PDRB, Moran's I, korelasi Spearman */ }
};
```

Sumber setiap bagian dicantumkan sebagai komentar di dalam berkasnya.

---

## 3. Struktur modul

Modul dimuat berurutan di akhir `index.html`. Urutannya mengikat karena modul yang belakangan bergantung pada yang terdahulu.

| Urutan | Berkas | Tanggung jawab |
|---|---|---|
| 1 | `lib/chart.umd.min.js` | Pustaka grafik |
| 2 | `lib/leaflet.js` | Pustaka peta |
| 3 | `data/data.js` | Data hasil simulasi |
| 4 | `data/data_tambahan.js` | Data indikator dan statistik |
| 5 | `js/bantu.js` | Fungsi bersama, dipakai seluruh modul |
| 6–14 | `js/beranda.js` … `js/simulator.js` | Satu modul untuk satu halaman |
| 15 | `js/tema.js` | Pergantian tampilan terang dan gelap |
| 16 | `js/navigasi.js` | Perutean halaman; dimuat paling akhir |

### Isi `js/bantu.js`

Modul ini tidak menggambar apa pun. Isinya enam kelompok fungsi yang dipakai bersama:

1. **Format angka** — `fmt`, `rupiahT`, `persen`, `fmtNilai`, `gabungDaftar`. Seluruh angka ditulis dengan konvensi Indonesia: koma sebagai pemisah desimal, titik sebagai pemisah ribuan, dan tanda minus tipografis.
2. **Pembacaan warna** — `nilaiCSS`, `bacaUlangWarna`. Dijelaskan pada bagian 4.3.
3. **Pengaturan bawaan Chart.js** — huruf, warna, perilaku tooltip.
4. **Data provinsi siap pakai** — `PROVINSI` (34, urut kode BPS), `LUAR_BALI` (33), `BALI`, dan `komponen()` untuk membaca baris dekomposisi.
5. **Pengisi elemen** — `isiTeks`, `isiHTML`, `pasangPilihan`, `segarkan`.
6. **Daftar peta aktif** — `PETA_TERDAFTAR`.

---

## 4. Mekanisme inti

### 4.1 Perutean halaman

Alamat setelah tanda `#` menentukan halaman yang tampil, misalnya `index.html#simulator`.

Seluruh dua belas halaman ada di dalam `index.html` sejak awal, tetapi sebelas di antaranya diberi atribut `hidden`. Fungsi `jalankanRute()` pada `navigasi.js` membaca alamat, menampilkan satu halaman, dan menyembunyikan sisanya.

Pendekatan ini dipilih karena tiga hal:

- Perpindahan halaman terasa seketika, sebab tidak ada permintaan berkas baru.
- Grafik yang sudah digambar tidak perlu dibangun ulang saat halaman dikunjungi kembali.
- Tombol kembali pada peramban tetap berfungsi, karena alamatnya memang berubah.

Setiap halaman punya alamatnya sendiri yang dapat dibagikan dan dibuka langsung.

### 4.2 Pembangunan isi yang ditunda

Isi halaman tidak dibangun saat situs dimuat, melainkan saat halaman itu pertama kali dibuka:

```javascript
const HALAMAN = {
  'beranda':   ['Beranda', siapkanBeranda],
  'ringkasan': ['Ringkasan', siapkanRingkasan],
  'satelit':   ['Data satelit', siapkanRemoteSensing],
  // dan seterusnya
};

function bangunHalaman(nama, paksa = false) {
  const bangun = HALAMAN[nama] && HALAMAN[nama][1];
  if (!bangun) return;
  if (sudahDibangun.has(nama) && !paksa) return;
  bangun();
  sudahDibangun.add(nama);
}
```

Alasannya bukan sekadar kecepatan. Chart.js dan Leaflet mengukur dimensi wadahnya saat dibuat, dan elemen yang masih `hidden` berdimensi nol. Grafik yang dibangun dalam keadaan tersembunyi akan tergambar dengan ukuran salah.

Halaman `kebijakan`, `tanya`, dan `tentang` berisi teks saja, sehingga tidak punya fungsi pembangun.

### 4.3 Tampilan terang dan gelap

Seluruh warna didefinisikan dua kali pada `style.css` bagian 2:

```css
:root                     { --jambu: #B8336A; --plum: #4A2338; /* … */ }
html[data-tema="gelap"]   { --jambu: #F08BAE; --plum: #F7E9EE; /* … */ }
```

Atribut `data-tema` pada elemen `<html>` menentukan kumpulan mana yang berlaku. Untuk CSS, pergantiannya seketika.

Masalahnya, grafik Chart.js digambar ke dalam kanvas dengan nilai warna yang sudah disalin saat pembuatan, sehingga tidak ikut berubah. Penyelesaiannya tiga langkah:

1. `bacaUlangWarna()` membaca ulang seluruh variabel CSS ke dalam objek `WARNA`.
2. `sudahDibangun.clear()` menandai seluruh halaman perlu dibangun ulang.
3. Halaman yang sedang terbuka digambar ulang seketika; halaman lain menyusul saat dibuka.

Pilihan tema disimpan di `localStorage`. Pada kunjungan pertama, situs mengikuti pengaturan sistem lewat `prefers-color-scheme`. Pemasangan temanya dilakukan oleh skrip kecil di dalam `<head>`, sebelum halaman digambar, supaya tidak ada kedipan putih sesaat saat membuka situs dalam mode gelap.

Satu pengecualian: ilustrasi candi bentar memakai warna tetap, bukan variabel tema, karena sifatnya gambar dan harus tetap terbaca di kedua latar.

### 4.4 Daur hidup grafik dan peta

Karena halaman dapat dibangun lebih dari sekali, objek lama harus dibuang sebelum yang baru dibuat. Tanpa ini, Chart.js menggambar dua grafik bertumpuk pada satu kanvas, dan Leaflet menolak wadah yang sudah terpakai dengan galat *Map container is already initialized*.

**Grafik:**

```javascript
Chart.getChart('grafik-rs')?.destroy();
const grafik = new Chart(document.getElementById('grafik-rs'), { /* … */ });
```

**Peta:** didaftarkan pada objek `PETA_TERDAFTAR` dengan id wadahnya sebagai kunci.

```javascript
if (PETA_TERDAFTAR[idElemen]) {
  PETA_TERDAFTAR[idElemen].remove();
  delete PETA_TERDAFTAR[idElemen];
}
const peta = L.map(idElemen, { /* … */ });
PETA_TERDAFTAR[idElemen] = peta;
```

Setiap kali rute dijalankan, `invalidateSize()` dipanggil pada seluruh peta terdaftar agar ukurannya menyesuaikan wadah yang baru terlihat.

### 4.5 Pendengar peristiwa yang tidak menumpuk

Masalah yang sama berlaku untuk pendengar klik. Memasang pendengar pada elemen yang sama berkali-kali membuat satu klik memicu banyak reaksi.

Penyelesaiannya mengganti elemen dengan salinannya, yang otomatis membuang seluruh pendengar lama:

```javascript
function segarkan(id) {
  const lama = document.getElementById(id);
  const baru = lama.cloneNode(true);
  lama.replaceWith(baru);
  return baru;
}
```

Fungsi `pasangPilihan()` melakukan hal serupa untuk grup tombol.

### 4.6 Simulator

Simulator memanfaatkan sifat linear model Leontief. Karena

$$\Delta x = L \, \Delta f$$

maka mengalikan seluruh vektor guncangan dengan faktor *k* membuat seluruh hasil terkali *k* yang sama:

$$L \, (k \, \Delta f) = k \, (L \, \Delta f) = k \, \Delta x$$

Artinya hasil pada skenario lain **dihitung tepat, bukan diperkirakan**, cukup dengan mengalikan hasil simulasi skripsi dengan

$$k = \frac{\text{penurunan pilihan pengguna}}{35{,}05\%}$$

Angka 35,05% adalah penurunan permintaan pariwisata Bali pada skenario dasar, yaitu Rp84,39 triliun dibagi permintaan akhir pariwisata Rp240,77 triliun.

Pendekatan ini tidak menambah asumsi baru di luar yang sudah berlaku pada simulasi di naskah. Yang tetap diasumsikan adalah struktur perekonomian: harga, teknologi produksi, dan pola belanja antarwilayah. Karena itu skenario yang jauh dari 35% dibaca sebagai gambaran besaran, bukan ramalan.

Sumbu grafik dipatok pada skenario terberat agar perubahan panjang batang benar-benar terlihat. Tanpa pematokan, sumbu ikut menyesuaikan setiap kali penggaris digerakkan, sehingga batangnya tampak sama saja.

### 4.7 Pewarnaan peta

Dampak antarprovinsi berbeda beberapa orde besaran, dari Rp0,02 triliun sampai Rp6,83 triliun. Dengan skala linear, hampir seluruh provinsi akan berwarna sama.

Karena itu kelas warna disusun logaritmik: setiap kelas bernilai kelipatan tetap dari kelas sebelumnya.

```javascript
function batasLogaritmik(daftarNilai, jumlahKelas) {
  const min = Math.min(...daftarNilai);
  const max = Math.max(...daftarNilai);
  return Array.from({ length: jumlahKelas + 1 },
    (_, i) => min * Math.pow(max / min, i / jumlahKelas));
}
```

Bali dikeluarkan dari perhitungan skala dan diberi warna tersendiri, karena dampaknya sebesar Rp112,43 triliun jauh di atas provinsi lain dan akan membuat 33 provinsi sisanya tidak terbedakan.

---

## 5. Keputusan teknis

| Keputusan | Alasan |
|---|---|
| Tanpa *framework* (React, Vue) | Isi situs statis dan halamannya sedikit. *Framework* menambah ukuran dan proses *build* tanpa manfaat berarti, sedangkan tanpa *framework* berkas sumber bisa langsung dibuka peramban. |
| Satu `index.html` untuk 12 halaman | Perpindahan tanpa muat ulang, grafik tidak digambar dua kali, tombol kembali tetap berfungsi. |
| Pustaka disimpan lokal, bukan CDN | Situs tetap tampil utuh tanpa koneksi. Penting agar tampilan saat sidang tidak bergantung pada jaringan ruangan. |
| Peta tanpa ubin peta daring | Mendukung penggunaan luring, dan tampilannya lebih bersih karena fokus pada data, bukan pada jalan dan kota. |
| Angka dihitung dari data | Menjamin konsistensi dengan naskah. Memperbarui hasil cukup mengganti satu berkas data. |
| Warna dipusatkan di CSS | Grafik dan peta membaca warna dari sana, sehingga satu perubahan berlaku ke seluruh situs dan tema gelap dapat ditambahkan tanpa menyentuh JavaScript. |
| Skala peta logaritmik | Lihat bagian 4.7. |
| Pembangunan isi ditunda | Lihat bagian 4.2. |

---

## 6. Pengujian

Pengujian dilakukan dengan menjalankan situs pada peramban Chromium secara otomatis. Yang diperiksa:

| Aspek | Cakupan |
|---|---|
| Galat konsol | Seluruh 12 halaman, pada kedua tema, dua putaran penuh |
| Ukuran layar | 1366 px mewakili laptop, 390 px mewakili ponsel |
| Luapan mendatar | Lebar dokumen dibandingkan lebar layar pada tiap halaman |
| Interaksi | Tombol pilihan, klik grafik, klik peta, daftar peringkat, kotak centang, penggaris simulator, pengurutan dan pencarian tabel |
| Ketahanan | Pergantian tema berulang, diikuti interaksi pada halaman yang sudah dibangun ulang |
| Kecocokan angka | Dibandingkan dengan naskah |

Angka yang diverifikasi: guncangan Rp84,39 T, dampak Rp142,65 T, *multiplier* 1,6903, porsi Bali 78,81%, porsi *spillover* 21,19%, penerima terbesar Jawa Timur, intensitas tertinggi Sumatera Selatan, daftar klaster HH dan LH, serta tabel silang *overlay* 3/1/13 dan 0/1/15.

Linearitas simulator diuji dengan membandingkan posisi 35% dan 70%: hasilnya tepat dua kali lipat, sesuai yang diharapkan dari model linear.

---

## 7. Kebutuhan dan keterbatasan sistem

### Kebutuhan

Peramban modern yang mendukung CSS custom properties, `IntersectionObserver`, dan `localStorage`: Chrome, Edge, Firefox, atau Safari versi mutakhir. Tidak ada kebutuhan lain — tanpa pemasangan, tanpa server, tanpa koneksi.

### Keterbatasan teknis

- **Tanpa pengujian otomatis yang tersimpan.** Pengujian dijalankan selama pengembangan, tetapi tidak disertakan sebagai berkas uji yang dapat dijalankan ulang.
- **`localStorage` dapat diblokir.** Pada mode penyamaran atau bila penyimpanan situs dimatikan, pilihan tema tidak diingat. Situs tetap berfungsi; hanya pilihannya kembali ke bawaan.
- **Dibuka dari berkas.** Bila `index.html` dibuka langsung tanpa server, beberapa peramban membatasi akses berkas lokal tertentu. Pada susunan ini tidak menjadi masalah karena seluruh data dimuat sebagai `<script>`, bukan lewat `fetch`.
- **Hanya bahasa Indonesia.** Teks tertanam di dalam HTML dan JavaScript, bukan di berkas terjemahan terpisah.

### Keterbatasan model

Model bersifat statis. Harga, teknologi produksi, dan pola belanja antarwilayah dianggap tetap selama guncangan, dan lama waktu pemulihan tidak diperhitungkan. Angka yang ditampilkan merupakan perkiraan model, bukan pencatatan kejadian nyata.

Uji ketahanan pada kode 7 menunjukkan bahwa besaran dampak bergerak dalam rentang −1,13% sampai +3,71% tergantung perlakuan terhadap indikator NDVI dan NO₂, sedangkan *multiplier* dan pangsa *spillover* praktis tidak berubah.

---

## 8. Catatan pengembangan

Artefak disusun bertahap: mula-mula kerangka sederhana sambil mempelajari dasar HTML, CSS, dan JavaScript, lalu ditulis ulang agar strukturnya konsisten, dan terakhir dirombak menjadi susunan dua belas halaman setelah menerima masukan penguji.

Dalam proses ini digunakan bantuan AI (Claude) untuk penulisan dan penataan kode. Penentuan isi, pemilihan data, keputusan rancangan, serta verifikasi kebenaran angka dilakukan sendiri oleh penulis.
