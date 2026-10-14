# Panduan web story "Ketika Bali Terhenti"

## Cara membuka

Klik dua kali `index.html`. Tidak perlu internet dan tidak perlu server, karena pustaka grafik, peta, dan huruf sudah tersimpan di folder `lib/`. Kalau mengedit di VS Code, simpan berkasnya lalu tekan F5 di browser.

Alamat setelah tanda `#` menentukan halaman yang tampil. `index.html#irio` langsung membuka halaman simulasi IRIO. Ini berguna saat presentasi: siapkan tab browser yang sudah terbuka di bagian yang ingin ditunjukkan.

## Isi folder

```
Web Story/
├── index.html              seluruh halaman (beranda dan dashboard)
├── style.css               seluruh tampilan
├── PANDUAN.md              berkas ini
├── data/
│   ├── data.js             dibuat notebook 04 dari CSV hasil simulasi
│   └── data_tambahan.js    disalin dari lampiran skripsi (5 sampai 9)
├── js/                     kode, satu berkas untuk satu halaman
└── lib/                    Chart.js, Leaflet, dan huruf (jangan diubah)
```

Berkas lama `app.js`, `peta.js`, dan `sektor.js` di folder utama sudah tidak dipakai. Seluruh kodenya ditulis ulang di folder `js/`.

## Susunan halaman

Situs ini terdiri atas dua belas halaman yang berdiri sendiri, bukan satu halaman panjang yang digulir. Hanya satu halaman tampil pada satu waktu, dan perpindahannya tidak memuat ulang berkas.

| Alamat | Isi |
| --- | --- |
| `#beranda` | Pembuka, pengantar, kategori KBLI, tiga pertanyaan penelitian |
| `#ringkasan` | Persamaan multiplier dan enam fakta kunci |
| `#satelit` | Tabel sensor dan grafik perubahan 25 proksi |
| `#shock` | Permintaan akhir dan shock per sektor |
| `#irio` | Tiga tampilan hasil simulasi |
| `#peta` | Peta dampak dan peringkat provinsi |
| `#klaster` | Peta LISA, jaringan spillover, tabel silang |
| `#kebijakan` | Empat rekomendasi |
| `#simulator` | Penggeser skenario |
| `#data` | Tiga tabel data |
| `#tanya` | Tanya jawab |
| `#tentang` | Identitas, sumber data, unduhan, keterbatasan |

## Tampilan terang dan gelap

Tombol di kanan atas mengganti tema. Pilihannya disimpan di browser, dan saat pertama kali dibuka situs mengikuti pengaturan sistem pengguna.

Seluruh warna ditulis dua kali di `style.css` bagian 2: satu untuk `:root` (terang) dan satu untuk `html[data-tema="gelap"]`. Grafik dan peta membaca warna dari sana lewat `js/bantu.js`, jadi ketika tema berganti, halaman yang sedang terbuka digambar ulang agar warnanya ikut menyesuaikan. Ilustrasi candi bentar sengaja memakai warna tetap, karena sifatnya gambar.

## Penjelasan setiap berkas

### index.html
Berisi dua halaman dalam satu berkas: `<div id="halaman-beranda">` dan `<div id="halaman-dashboard">`. Hanya satu yang tampil pada satu waktu; `js/navigasi.js` yang mengaturnya.

Beranda terdiri atas pembuka dengan ilustrasi candi bentar, pengantar, penjelasan sektor pariwisata dan kode KBLI, tiga langkah penelitian, dan ajakan ke dashboard. Seluruh teks beranda ditulis langsung di sini, jadi bisa Anda ubah tanpa menyentuh JavaScript.

Dashboard terdiri atas delapan `<section>`: ringkasan, data remote sensing, konstruksi shock, simulasi IRIO, peta dampak, klaster dan overlay, tabel data, dan kredit. Komentar di atas setiap section menyebut berkas JavaScript yang mengisinya. Elemen yang kosong di HTML (misalnya `<dd id="r-terbesar"></dd>`) diisi angka oleh JavaScript.

### style.css
Dibagi 13 bagian bernomor (daftarnya ada di baris paling atas). Bagian 2 adalah pusat warna. Grafik dan peta membaca warna dari sini, jadi cukup ubah satu kode warna dan seluruh halaman ikut berubah. Makna warnanya konsisten di semua grafik dan peta: plum untuk Bali, merah jambu untuk provinsi lain, biru laguna untuk laut dan kategori pembeda.

### js/bantu.js
Fungsi kecil yang dipakai semua bagian: `fmt` (angka format Indonesia), `rupiahT` (menulis "Rp84,39 T"), `persen`, `gabungDaftar` ("A, B, dan C"), pembacaan warna dari CSS, pengaturan bawaan Chart.js, dan `pasangPilihan` untuk grup tombol yang hanya boleh aktif satu.

### js/beranda.js
Mengisi angka di beranda: besar shock, total dampak, dan jumlah indikator per kategori KBLI. Jumlah indikator dihitung dari 85 baris indikator, bukan diketik manual.

### js/ringkasan.js
Mengisi persamaan shock × multiplier = total dampak, bilah porsi Bali dan luar Bali, serta enam fakta kunci. Semua angka dihitung dari `data.js`, misalnya penerima spillover terbesar dicari dengan mengurutkan provinsi.

### js/remote-sensing.js
`hitungDelta` adalah rumus δ yang sama persis dengan Lampiran 7 sel 5. Berkas ini menyusun tabel sensor, menggabungkan 85 indikator menjadi 25 proksi unik, menggambar grafik batang, dan menampilkan rincian saat batang diklik.

### js/shock.js
Grafik permintaan akhir awal (batang pucat) dengan shock di dalamnya (batang merah jambu), untuk sepuluh sektor. Rinciannya menghubungkan proporsi shock setiap sektor dengan koefisien δ kategori KBLI-nya.

### js/irio.js
Satu grafik dengan tiga tampilan: dekomposisi dampak, dampak per sektor di Bali, dan spillover per sektor di luar Bali. Setiap tampilan didefinisikan dalam objek `TAMPILAN`: tinggi grafik, kalimat keterangan, legenda, pengaturan grafik, dan isi rincian.

### js/peta.js
Bagian atas berisi fungsi peta bersama yang juga dipakai `klaster.js`. Bagian bawah membuat peta dampak: pewarnaan kelas logaritmik, legenda, daftar sepuluh besar yang bisa diklik, dan rincian provinsi.

### js/klaster.js
Angka uji (Moran's I, LISA, korelasi Spearman), peta kuadran LISA, jaringan spillover berupa busur dari Bali ke sepuluh penerima terbesar, tabel silang exposure struktural × kuadran, dan kalimat temuan. Exposure dihitung ulang di sini dengan aturan yang sama dengan notebook 9: tinggi bila koefisien L ≥ median 33 provinsi.

### js/tabel.js
Tiga tabel dalam satu elemen `<table>`. Setiap tabel didefinisikan oleh daftar kolom dan daftar baris. Pencarian menyaring kolom teks; klik judul kolom untuk mengurutkan dan klik lagi untuk membalik arah.

### js/simulator.js
Bagian "Bagaimana kalau guncangannya berbeda?". Model Leontief bersifat linear, artinya kalau seluruh guncangan dikalikan k, seluruh hasilnya ikut terkali k. Karena itu hasil pada skenario lain dihitung tepat, bukan diperkirakan, cukup dengan mengalikan hasil simulasi skripsi dengan k. Titik acuannya adalah penurunan 35,05 persen, yaitu Rp84,39 triliun dibagi permintaan akhir pariwisata Rp240,77 triliun.

### js/tema.js
Mengganti tampilan terang dan gelap, menyimpan pilihannya di browser, dan memberi tahu `navigasi.js` agar halaman digambar ulang.

### js/navigasi.js
Dimuat paling akhir. Membaca alamat setelah `#`, menampilkan satu halaman dan menyembunyikan sisanya, membangun isi halaman saat pertama kali dibuka, dan mengatur menu geser di layar kecil.

### data/data.js
Tetap dibuat oleh notebook `04_Ekspor_Data_Dashboard.ipynb`. Kalau hasil simulasi berubah, jalankan ulang notebook itu dan timpa berkas ini.

### data/data_tambahan.js
Berisi 85 indikator proksi, koefisien δ per kategori, shock per sektor, dampak per sektor di Bali, dan beberapa angka tunggal (PDRB, Moran's I, korelasi). Semuanya disalin dari lampiran skripsi, dan sumber setiap bagian tertulis di atasnya. Jangan mengubah angka di sini tanpa mengubah naskah.

## Perubahan setelah masukan penguji

Masukan penguji: artefak terasa seperti memindahkan isi skripsi ke web. Enam hal berikut diubah untuk menjawabnya.

1. **Judul bagian diganti menjadi temuan, bukan nama metode.** "Simulasi IRIO Network" menjadi "Yang paling terpukul justru bukan sektor pariwisata". Pembaca tahu isi bagian itu tanpa perlu paham istilahnya.
2. **Label "Tujuan 1, 2, 3" dihapus** dari menu samping, karena itu struktur bab skripsi, bukan cara pembaca mencari informasi. Menu sekarang dikelompokkan menjadi Cerita, Jelajahi, dan Tentang.
3. **Pembuka memimpin dengan temuan**, bukan dengan judul penelitian, dan menampilkan tiga angka kunci. Multiplier ditulis sebagai "1,69 kali lipat dari guncangan awalnya" agar bermakna bagi pembaca umum.
4. **Simulator ditambahkan**, sehingga pembaca bisa mencoba skenario sendiri. Artefak berubah dari laporan menjadi alat.
5. **Rekomendasi kebijakan ditambahkan**, menjawab pertanyaan "jadi apa?". Setiap butir diturunkan dari angka pada bagian sebelumnya.
6. **Tanya jawab, unduh data, dan identitas penulis ditambahkan**, supaya halaman ini bisa berdiri sendiri bagi pembaca yang belum membaca skripsinya.

## Pengembangan lanjutan yang mungkin

Simulator saat ini mengubah besarnya guncangan secara keseluruhan. Untuk memungkinkan pengguna mengatur guncangan per sektor, diperlukan sepuluh kolom matriks Leontief yang bersesuaian dengan sektor Bali yang terdampak, diagregasi ke tingkat provinsi. Ukurannya hanya 34 baris kali 10 kolom, jadi ringan untuk dimuat di browser. Di Colab, kolom itu dapat diekspor kira-kira seperti ini:

```python
kolom = [IDX_BALI * N_SEK + s for s in SEKTOR_TERDAMPAK]   # 10 sektor pariwisata
Lp = L[:, kolom].reshape(N_PROV, N_SEK, len(kolom)).sum(axis=1)   # 34 x 10
pd.DataFrame(Lp, index=PROV_NAMES, columns=KODE_S_TERDAMPAK).to_csv(
    CSV_OUT_DIR + 'C4_Kolom_Leontief_Sektor_Bali.csv', encoding='utf-8-sig')
```

Dengan berkas itu, hasil per provinsi untuk kombinasi guncangan apa pun dihitung sebagai perkalian matriks biasa, dan tetap tepat secara matematis.

## Yang biasa Anda ubah

**Kredit penulis dan alamat email.** Buka `index.html`, cari `ISI SENDIRI` (ada dua tempat: data penulis dan alamat email). Ganti teks di dalam `<span class="isian">...</span>`, lalu hapus pembungkus `<span class="isian">` supaya tampil sebagai teks biasa.

**Teks.** Semua kalimat beranda dan judul dashboard ada di `index.html`. Kalimat yang memuat angka (misalnya keterangan grafik IRIO) ada di berkas JavaScript bagiannya.

**Warna.** Ubah kode warna di bagian 2 `style.css`.

**Angka.** Jangan diketik manual. Angka di dashboard selalu dihitung dari `data.js` dan `data_tambahan.js`, sehingga tetap sama dengan naskah.

## Catatan data

1. Pada Lampiran 6, rata-rata lama menginap tercatat 2936 dan 2751. Kemungkinan besar maksudnya 2,936 dan 2,751 hari yang terbaca sebagai ribuan. Nilai δ tidak terpengaruh karena rumusnya rasio (−6,3%), tetapi sebaiknya dicek di naskah. Dashboard menampilkannya apa adanya tanpa satuan.
2. Nama proksi "HCHO ((formaldehyde)" di Lampiran 6 memuat salah ketik. Dashboard memakai nama rapi "Formaldehida troposfer", tetapi kunci datanya tetap teks asli supaya cocok dengan berkas sumber.
3. Nilai δ di tabel indikator adalah perubahan mentah, sebelum arah Residential dibalik dan sebelum nilai positif dipotong menjadi nol.

## Pertanyaan yang mungkin diajukan penguji

**Dari mana angka di dashboard berasal?**
Dari dua berkas data. `data.js` dibuat notebook 04 yang membaca CSV hasil simulasi (A1, A3, B2, F1). `data_tambahan.js` disalin dari keluaran notebook di lampiran. Tidak ada angka yang diketik ulang di HTML; semuanya dihitung JavaScript dari berkas data itu, dan pengecekan di browser menunjukkan hasilnya sama dengan naskah (Rp84,39 T, Rp142,65 T, 1,6903, 78,81%, 21,19%).

**Mengapa efek umpan balik hampir tidak terlihat di grafik dekomposisi?**
Nilainya hanya Rp0,02 T atau 0,016% dari total dampak. Umpan balik terjadi bila provinsi lain yang ikut turun lalu mengurangi pembelian input dari Bali. Pembelian itu kecil, sehingga dampak yang kembali ke Bali juga kecil: dampak yang sudah keluar dari Bali hampir tidak kembali.

**Apa beda besar dampak dan intensitas di peta?**
Besar dampak adalah penurunan output dalam rupiah, sehingga provinsi berekonomi besar seperti Jawa Timur cenderung di atas. Intensitas membagi penurunan itu dengan output provinsinya sendiri, sehingga Sumatera Selatan paling tinggi (0,278%) walaupun nominalnya peringkat ketiga.

**Mengapa warna peta memakai skala logaritmik dan Bali diwarnai terpisah?**
Dampak antarprovinsi berbeda beberapa orde besaran, sehingga skala linear membuat hampir semua provinsi berwarna sama. Bali dikeluarkan dari skala karena dampaknya (Rp112,43 T) jauh di atas provinsi lain, dan diberi warna sendiri sebagai asal shock.

**Mengapa Moran's I tidak signifikan tetapi ada klaster LISA?**
Moran's I global adalah rata-rata kontribusi semua provinsi, sehingga klaster kuat di satu wilayah bisa tertutup pola acak di wilayah lain (Anselin, 1995). LISA menguji setiap provinsi, dan lima provinsi signifikan: Jawa Timur, NTB, dan NTT (High-High), serta DI Yogyakarta dan Kep. Bangka Belitung (Low-High).

**Mengapa matriks bobot spasial memakai konektivitas penerbangan?**
Indonesia negara kepulauan, sehingga matriks ketetanggaan darat membuat banyak provinsi tidak punya tetangga. Wisatawan dan pelaku usaha juga bergerak lewat jaringan udara. Bobotnya w = 1 / (T^α × (1 + transit)^β) dengan α = β = 1.

**Apa yang dimaksud network overlay di dashboard?**
Dua lapisan pada peta yang sama: warna provinsi menunjukkan klaster spasial (LISA), sedangkan busur menunjukkan jaringan spillover dari simulasi IRIO. Tabel silang exposure × kuadran merangkum keduanya: 13 dari 17 provinsi berexposure tinggi tidak membentuk klaster, artinya dampaknya merambat lewat rantai produksi, bukan kedekatan geografis.

**Mengapa NDVI dan NO₂ naik tetapi tidak dihitung sebagai shock?**
Setelah arah semua indikator diseragamkan, nilai δ positif berarti tidak ada penurunan aktivitas, sehingga dipotong menjadi nol (clip) agar tidak mengurangi shock. Di grafik, batang keduanya diberi warna pucat.

**Mengapa arah mobilitas Residential dibalik?**
Kenaikan waktu di permukiman berarti orang lebih banyak di rumah, yang searah dengan turunnya aktivitas di luar rumah. Tanpa pembalikan, indikator ini justru akan mengurangi shock.

**Mengapa sektor akomodasi hanya menyumbang 1,93% spillover padahal terkena shock paling besar?**
Spillover mengalir lewat rantai pasok, bukan ke sektor yang sama di provinsi lain. Ketika sektor-sektor di Bali mengurangi pembelian input, yang ikut turun adalah sektor pemasoknya di provinsi lain, terutama industri pengolahan yang menanggung 48,83% spillover.

**Mengapa dibuat per halaman, bukan satu halaman panjang?**
Isinya terlalu banyak untuk satu gulungan: pembaca kehilangan arah dan sulit kembali ke bagian tertentu. Dengan satu halaman per topik, setiap bagian punya alamatnya sendiri yang bisa dibagikan dan dibuka langsung, misalnya `#simulator`. Perpindahannya tetap tanpa memuat ulang, jadi grafik yang sudah digambar tidak perlu dibangun dua kali.

**Apakah simulatornya hanya perkiraan?**
Bukan. Model Leontief linear, sehingga mengalikan seluruh guncangan dengan k membuat seluruh hasil terkali k secara tepat. Yang diasumsikan tetap adalah struktur perekonomian: harga, teknologi produksi, dan pola belanja antarwilayah. Asumsi itu sama dengan yang berlaku pada simulasi di naskah, jadi simulator tidak menambah asumsi baru. Yang perlu disampaikan adalah bahwa skenario yang sangat jauh dari 35 persen dibaca sebagai gambaran besaran, bukan ramalan.

**Dari mana angka pada rekomendasi kebijakan berasal?**
Seluruhnya dari hasil simulasi sendiri: porsi spillover 21,19 persen, kontribusi industri pengolahan 48,83 persen, intensitas Sumatera Selatan 0,278 persen, dan kehilangan Rp9,06 triliun pada tujuh sektor Bali yang tidak menerima guncangan langsung. Rekomendasinya bersifat teknis dan dibatasi oleh sifat statis model.

**Mengapa dashboard tetap berjalan tanpa internet?**
Chart.js, Leaflet, dan huruf disimpan di folder `lib/`, dan peta hanya menggambar batas provinsi dari GeoJSON tanpa ubin peta daring. Ini disengaja supaya tampilan saat sidang tidak bergantung pada koneksi.

## Lisensi pustaka dan huruf

Chart.js (MIT), Leaflet (BSD-2-Clause), Fraunces dan Plus Jakarta Sans (SIL Open Font License, salinan lisensinya ada di `lib/fonts/`). Plus Jakarta Sans dirancang untuk identitas kota Jakarta, sehingga cocok untuk penelitian tentang Indonesia.
