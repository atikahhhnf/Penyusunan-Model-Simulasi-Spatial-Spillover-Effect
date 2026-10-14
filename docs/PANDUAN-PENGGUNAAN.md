# Panduan Penggunaan Web Story

**Ketika Bali Terhenti** — web story interaktif hasil skripsi mengenai dampak ekonomi guncangan sektor pariwisata Bali terhadap 34 provinsi di Indonesia.

Panduan ini ditujukan bagi pembaca yang ingin menjelajahi situsnya. Untuk penjelasan teknis kode dan cara menyuntingnya, lihat `PANDUAN-PENGEMBANG.md`.

---

## Membuka situs

Ada dua cara.

**Dari berkas.** Unduh folder `artifact/`, lalu klik dua kali `index.html`. Situs akan terbuka di peramban bawaan komputer Anda.

**Dari internet.** Buka tautan yang tercantum pada halaman repositori.

Situs ini tidak memerlukan pemasangan apa pun, tidak memerlukan server, dan tetap berfungsi penuh tanpa koneksi internet. Peramban yang disarankan adalah Chrome, Edge, atau Firefox versi terbaru. Tampilannya juga menyesuaikan diri di layar ponsel.

> **Catatan bila dibuka dari berkas:** folder `data/`, `js/`, dan `lib/` harus tetap berada di samping `index.html`. Bila salah satu dipindahkan, grafik dan peta tidak akan muncul.

---

## Mengenali tampilan

Situs terdiri atas dua bagian tetap dan satu bagian isi.

**Menu di sisi kiri** memuat seluruh halaman, dikelompokkan menjadi empat: *Mulai*, *Temuan*, *Jelajahi*, dan *Tentang*. Di bagian bawahnya ada identitas penulis beserta tombol untuk mengirim surel.

**Bilah atas** menampilkan nama halaman yang sedang dibuka dan tombol pergantian tampilan terang atau gelap.

**Bagian isi** menampilkan satu halaman penuh. Berpindah halaman tidak memuat ulang situs, sehingga perpindahannya seketika.

Di layar ponsel, menu sisi kiri tersembunyi dan dibuka lewat tombol **Menu** di kiri atas.

---

## Daftar halaman

| Halaman | Isi |
|---|---|
| **Beranda** | Temuan utama dan tiga angka kunci |
| **Ringkasan** | Persamaan *multiplier* dan enam fakta pokok |
| **Data satelit** | Sensor yang dipakai dan perubahan 25 proksi |
| **Konstruksi shock** | Cara citra satelit diubah menjadi angka rupiah |
| **Simulasi IRIO** | Hasil simulasi dalam tiga tampilan |
| **Peta dampak** | Sebaran dampak di 34 provinsi |
| **Klaster spasial** | Uji Moran's I, LISA, dan *network overlay* |
| **Rekomendasi** | Empat saran yang diturunkan dari hasil |
| **Simulator** | Mencoba skenario guncangan yang berbeda |
| **Tabel data** | Tiga tabel yang dapat diurutkan dan dicari |
| **Tanya jawab** | Pertanyaan yang sering muncul |
| **Tentang** | Identitas, sumber data, unduhan, keterbatasan |

---

## Berinteraksi dengan isinya

### Mengganti tampilan terang dan gelap

Klik tombol di kanan atas. Pilihan Anda diingat peramban, sehingga saat dibuka lagi tampilannya tetap sama. Pada kunjungan pertama, situs mengikuti pengaturan sistem komputer Anda.

### Membaca grafik

Seluruh grafik dapat diklik. Mengarahkan kursor ke sebuah batang menampilkan nilainya, dan mengkliknya memunculkan kotak rincian di bawah grafik.

Beberapa halaman punya tombol pilihan di atas grafiknya:

- **Data satelit** — menyaring indikator menurut jenisnya: penginderaan jauh, mobilitas Google, atau statistik resmi.
- **Simulasi IRIO** — berpindah antara dekomposisi dampak, dampak per sektor di Bali, dan *spillover* per sektor.

### Membaca peta

Peta ada di halaman **Peta dampak** dan **Klaster spasial**.

- Arahkan kursor ke sebuah provinsi untuk melihat namanya.
- Klik provinsi untuk menampilkan rinciannya di bawah peta.
- Gunakan tombol **+** dan **−** di pojok kiri atas untuk memperbesar dan memperkecil.
- Pada halaman Peta dampak, daftar sepuluh besar di sebelah kanan juga dapat diklik.
- Tombol **Besar dampak** dan **Intensitas** mengubah ukuran yang dipetakan. Keduanya menghasilkan urutan yang berbeda: Jawa Timur tertinggi menurut nilai rupiah, Sumatera Selatan tertinggi menurut intensitas.
- Pada halaman Klaster spasial, kotak centang **Tampilkan jaringan spillover** menyalakan atau mematikan garis aliran dampak dari Bali.

Peta sengaja tidak memakai peta jalan daring. Yang digambar hanya batas provinsi, supaya perhatian tertuju pada datanya dan situs tetap berfungsi tanpa internet.

> Di ponsel, peta tidak ikut bergeser saat Anda menggulir halaman. Gunakan tombol **+** dan **−** untuk mengatur tampilan peta.

### Memakai simulator

Halaman **Simulator** memungkinkan Anda mengubah besarnya guncangan dan melihat hasilnya dihitung ulang.

1. Geser penggaris, atau pilih salah satu tombol skenario siap pakai: Ringan, Sedang, Pandemi 2020, atau Berat.
2. Tiga angka di bawahnya langsung menyesuaikan: nilai produksi nasional yang hilang, bagian yang tertahan di Bali, dan bagian yang merambat ke provinsi lain.
3. Grafik menampilkan sepuluh provinsi penerima terbesar. Garis tipis pada setiap batang menandai posisi hasil skripsi, sehingga perbandingannya selalu terlihat.
4. Klik salah satu batang untuk melihat rincian provinsi tersebut.

Posisi awal penggaris adalah 35,05 persen, yaitu penurunan permintaan pariwisata Bali yang terjadi pada 2020 dan dipakai sebagai skenario dasar dalam skripsi.

**Hasilnya tepat, bukan perkiraan kasar.** Model Leontief bersifat linear, sehingga mengalikan seluruh guncangan dengan suatu faktor membuat seluruh hasil terkali faktor yang sama secara persis. Yang diasumsikan tetap adalah struktur perekonomian: harga, teknologi produksi, dan pola belanja antarwilayah. Karena itu skenario yang jauh dari 35 persen sebaiknya dibaca sebagai gambaran besaran, bukan ramalan.

### Memakai tabel data

Halaman **Tabel data** memuat tiga tabel yang dapat dipilih lewat tombol di atasnya:

- **Dampak per provinsi** — 34 baris
- **Indikator proksi** — 85 baris
- **Shock per sektor** — 10 baris

Klik judul kolom untuk mengurutkan, dan klik sekali lagi untuk membalik arahnya. Kolom pencarian menyaring baris sesuai kata yang diketik, misalnya `jawa` atau `pesawat`. Tabel yang lebar dapat digeser ke samping.

### Mengunduh data

Halaman **Tentang** menyediakan tautan unduhan untuk dua berkas data yang menjadi sumber seluruh angka di situs ini. Keduanya berupa teks biasa dan dapat dibuka dengan teks editor mana pun.

---

## Membaca angkanya dengan benar

Beberapa hal yang kerap disalahpahami:

**Rp142,65 triliun bukan kerugian Bali saja.** Itu kehilangan nilai produksi seluruh Indonesia. Bali menanggung Rp112,43 triliun, sisanya Rp30,22 triliun tersebar di 33 provinsi lain.

**Nilai produksi berbeda dengan PDRB.** Nilai produksi menghitung seluruh perputaran termasuk bahan baku, sehingga satu barang dapat terhitung beberapa kali di sepanjang rantainya. PDRB hanya menghitung nilai tambah di setiap tahap. Karena itu dampak terhadap PDRB lebih kecil, yaitu Rp81,10 triliun.

**Besar dampak berbeda dengan intensitas.** Besar dampak adalah penurunan dalam rupiah, sehingga provinsi berekonomi besar cenderung di atas. Intensitas membagi penurunan itu dengan ukuran ekonomi provinsinya sendiri.

**Angka ini hasil model, bukan pencatatan kejadian nyata.** Modelnya statis dan tidak memperhitungkan penyesuaian harga maupun lama waktu pemulihan.

---

## Bila ada yang tidak tampil

| Gejala | Kemungkinan penyebab |
|---|---|
| Grafik dan peta kosong, hanya teks yang muncul | Folder `data/`, `js/`, atau `lib/` terpisah dari `index.html` |
| Huruf terlihat berbeda dari semestinya | Folder `lib/fonts/` tidak ikut terunduh |
| Halaman tidak berganti saat menu diklik | JavaScript dimatikan di peramban |
| Pilihan tampilan terang atau gelap tidak diingat | Peramban dalam mode penyamaran, atau penyimpanan situs diblokir |

Bila situs dibuka dari berkas, pastikan seluruh isi folder `artifact/` ikut terunduh, bukan hanya `index.html`.

---

## Kontak

Pertanyaan mengenai isi penelitian maupun artefaknya dapat dikirim ke **222212522@stis.ac.id**, atau lewat tombol **Hubungi saya** pada menu di sisi kiri situs.
