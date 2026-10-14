# Penyusunan Model Simulasi *Spatial Spillover Effects* Sektor Pariwisata Menggunakan *Interregional Input-Output Network* dan *Geospatial Big Data*

**Studi Kasus Provinsi Bali Tahun 2025**

Repositori ini memuat seluruh kode, data, dan artefak skripsi: mulai dari pemutakhiran tabel Interregional Input–Output (IRIO), penyusunan guncangan dari data penginderaan jauh, simulasi rambatan dampak antarprovinsi, analisis spasial, sampai web story interaktif yang menyajikan hasilnya.

---

## Identitas

| | |
|---|---|
| **Penulis** | Atikah Nurfadia |
| **NIM** | 222212522 |
| **Program Studi** | D-IV Komputasi Statistik |
| **Perguruan Tinggi** | Politeknik Statistika STIS |
| **Dosen Pembimbing** | Dr. Eng. Arie Wahyu Wijayanto, S.S.T., M.T. |
| **Tahun Lulus** | 2026 |
| **Surel** | 222212522@stis.ac.id |

---

## Ringkasan penelitian

Penelitian ini mengukur ke mana dampak ekonomi mengalir ketika sektor pariwisata Bali mengalami guncangan, dengan pandemi COVID-19 tahun 2020 sebagai kasus empiris.

Besarnya guncangan tidak diasumsikan, melainkan disusun dari 85 indikator penginderaan jauh, data mobilitas, dan statistik resmi yang membandingkan periode Januari–Februari 2020 dengan April–Juli 2020. Guncangan itu kemudian dijalankan pada tabel IRIO 34 provinsi × 17 sektor, dan hasilnya ditumpangkan dengan analisis spasial berbasis konektivitas penerbangan.

### Temuan utama

| Besaran | Nilai |
|---|---|
| Guncangan permintaan akhir | Rp84,39 triliun |
| Penurunan output nasional | Rp142,65 triliun |
| *Multiplier* efektif | 1,6903 |
| Tertahan di Bali | Rp112,43 triliun (78,81%) |
| Merambat ke 33 provinsi lain | Rp30,22 triliun (21,19%) |
| Penurunan PDRB nasional | Rp81,10 triliun |
| Penerima *spillover* terbesar | Jawa Timur, Rp6,83 triliun |
| Intensitas dampak tertinggi | Sumatera Selatan, 0,278% dari output provinsinya |
| Moran's I global | 0,0178 (p = 0,119, tidak signifikan) |
| Klaster LISA *High-High* | Jawa Timur, Nusa Tenggara Barat, Nusa Tenggara Timur |
| Klaster LISA *Low-High* | DI Yogyakarta, Kepulauan Bangka Belitung |

Temuan pokoknya: pola rambatan tidak ditentukan oleh kedekatan geografis, melainkan oleh keterkaitan rantai produksi. Tujuh dari delapan pemasok input utama Bali juga merupakan penerima *spillover* terbesar.

---

## Struktur berkas

```
.
├── README.md                     berkas ini
│
├── artifact/                     web story interaktif (hasil akhir)
│   ├── index.html                seluruh halaman situs
│   ├── style.css                 seluruh tampilan
│   ├── foto.jpg
│   ├── data/
│   │   ├── data.js               dihasilkan kode 6
│   │   └── data_tambahan.js      disalin dari keluaran kode 2, 3, 4, 5
│   ├── js/                       12 berkas, satu per halaman
│   └── lib/                      Chart.js, Leaflet, dan huruf (luring)
│
├── pemodelan/                    kode, berurutan sesuai alur kerja
│   ├── 1_updating_tabel_irio.Rmd
│   ├── 2_pengambilan_data_rs.ipynb
│   ├── 3_konstruksi_shock_pariwisata.ipynb
│   ├── 4_simulasi_irio_shock_bali.ipynb
│   ├── 5_analisis_spasial_dan_overlay.ipynb
│   ├── 6_ekspor_data_dashboard.ipynb
│   └── 7_uji_sensitivitas_dan_forward_linkage.ipynb
│
├── dataset/
│   ├── README.md                 keterangan dan status keterbukaan tiap berkas
│   ├── input/                    masukan model
│   └── output/                   keluaran simulasi
│
└── docs/
    ├── PANDUAN-PENGGUNAAN.md     cara memakai web story
    ├── DOKUMENTASI-SISTEM.md     arsitektur, alur data, teknologi
    └── PANDUAN-PENGEMBANG.md     cara menyunting kode artefak
```

---

## Alur kerja

Nomor pada nama berkas menunjukkan urutan pengerjaan. Keluaran satu tahap menjadi masukan tahap berikutnya.

| Kode | Masukan | Keluaran |
|---|---|---|
| `1_updating_tabel_irio.Rmd` | `1_persiapan_data_irio.xlsx`, `2_data_updating_irio_2025.xlsx` | `3_data_irio_17_2025_ras.xlsx` |
| `2_pengambilan_data_rs.ipynb` | Citra satelit via Google Earth Engine | Statistik zonal per kabupaten/kota Bali |
| `3_konstruksi_shock_pariwisata.ipynb` | `4_ekstraksi_data_proksi.xlsx`, tabel IRIO | Vektor ΔFD, Rp84,39 T pada 10 sektor |
| `4_simulasi_irio_shock_bali.ipynb` | ΔFD, tabel IRIO | `A1`, `A3`, `B2`, `C2`, `C3` |
| `5_analisis_spasial_dan_overlay.ipynb` | `A1`, `C1`, `5_matriks_konektivitas.xlsx` | `F1_LISA_Klasifikasi.csv` |
| `6_ekspor_data_dashboard.ipynb` | `A1`, `A3`, `B2`, `F1`, GeoJSON | `artifact/data/data.js` |
| `7_uji_sensitivitas_dan_forward_linkage.ipynb` | Tabel IRIO, Tabel 15 naskah | Uji ketahanan hasil |

Kode 1 ditulis dalam R, sisanya Python. Kode 2 memerlukan akun Google Earth Engine yang sudah terdaftar.

Kode 7 disusun setelah sidang untuk menjawab pertanyaan penguji. Isinya menguji apakah hasil berubah bila indikator NDVI dan NO₂ diperlakukan berbeda, dan membandingkan dua definisi *forward linkage*. Kesimpulannya, besaran dampak bergerak dalam rentang −1,13% sampai +3,71%, sedangkan *multiplier* dan pangsa *spillover* praktis tidak berubah, sehingga kesimpulan penelitian tahan terhadap pilihan perlakuan tersebut.

---

## Cara menjalankan

### Membuka artefak

Unduh folder `artifact/`, lalu klik dua kali `index.html`. Tidak perlu server, tidak perlu pemasangan, dan tidak perlu koneksi internet — seluruh pustaka dan huruf disimpan di dalam folder `lib/`.

Panduan lengkap cara memakainya ada di `docs/PANDUAN-PENGGUNAAN.md`.

### Menjalankan ulang pemodelan

Notebook ditulis untuk Google Colab dengan Google Drive terpasang. Langkah-langkahnya:

1. Unggah isi `dataset/input/` ke Google Drive Anda.
2. Buka kode secara berurutan sesuai nomornya.
3. Pada sel pertama setiap notebook, sesuaikan variabel path agar mengarah ke folder Drive Anda.
4. Jalankan dari atas ke bawah.

Nama berkas yang dirujuk di dalam notebook berbeda dengan nama berkas di repositori ini, karena berkas di Drive memakai penamaan versi kerja. Pemetaannya dijelaskan pada `dataset/README.md`.

Pustaka Python yang dipakai: `numpy`, `pandas`, `geopandas`, `esda`, `libpysal`, `mapclassify`, `matplotlib`, `networkx`, `openpyxl`, `earthengine-api`.

---

## Teknologi

| Komponen | Perangkat |
|---|---|
| Pemodelan | Python (Google Colab), R (pemutakhiran RAS) |
| Ekstraksi citra | Google Earth Engine |
| Artefak | HTML, CSS, JavaScript murni tanpa *framework* |
| Grafik | Chart.js 4.4.1 (MIT License) |
| Peta | Leaflet 1.9.4 (BSD 2-Clause) |
| Huruf | Fraunces dan Plus Jakarta Sans (SIL Open Font License 1.1) |

---

## Sumber data

- Tabel Interregional Input–Output Indonesia 2016 (BPS), dimutakhirkan ke 2025 dengan metode RAS
- Landsat 8, MODIS MOD11A2, VIIRS VNP46A2 Black Marble, dan Sentinel-5P melalui Google Earth Engine
- Google Community Mobility Reports
- Statistik resmi transportasi udara, transportasi laut, dan akomodasi Provinsi Bali
- Konektivitas penerbangan antarprovinsi berupa waktu tempuh dan jumlah transit, diolah
- Batas wilayah: GeoJSON 34 provinsi dari repositori `ans-4175/peta-indonesia-geojson`

Status keterbukaan setiap berkas data dijelaskan pada `dataset/README.md`.

---

## Keterbatasan

Model bersifat statis. Harga, teknologi produksi, dan pola belanja antarwilayah dianggap tetap selama guncangan, dan lama waktu pemulihan tidak diperhitungkan. Angka yang dihasilkan merupakan perkiraan model, bukan pencatatan kejadian nyata.

---

## Lisensi dan penggunaan

Repositori ini disusun sebagai kelengkapan skripsi di Politeknik Statistika STIS. Penggunaan kode maupun data untuk keperluan di luar penelitian ini harap mencantumkan sumber.

Pustaka pihak ketiga pada `artifact/lib/` tunduk pada lisensinya masing-masing; salinan lisensi huruf disertakan di `artifact/lib/fonts/`.
