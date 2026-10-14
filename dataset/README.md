# Dataset

Folder ini memuat data masukan dan keluaran model.

- **`input/`** berisi data yang berasal dari luar, ditambah tabel IRIO hasil pemutakhiran. Nomornya mengikuti urutan pemakaian pada `pemodelan/`.
- **`output/`** berisi berkas yang dihasilkan kode. **Namanya jangan diubah**, karena notebook menulis dan membaca berkas ini berdasarkan nama persisnya.

---

## Status keterbukaan data

> **PERLU DIISI.** Periksa status setiap berkas bersama dosen pembimbing sebelum diunggah. Untuk data yang tidak terbuka untuk umum, ganti berkas aslinya dengan contoh minimal lima baris dan samarkan bagian yang sensitif, lalu tandai pada kolom Status.

| Berkas | Sumber | Status |
|---|---|---|
| `input/1_persiapan_data_irio.xlsx` | BPS | *isi* |
| `input/2_data_updating_irio_2025.xlsx` | BPS | *isi* |
| `input/3_data_irio_17_2025_ras.xlsx` | olahan dari BPS | *isi* |
| `input/4_ekstraksi_data_proksi.xlsx` | olahan sendiri | terbuka |
| `input/5_matriks_konektivitas.xlsx` | olahan sendiri | terbuka |
| `output/*.csv` | olahan sendiri | terbuka |

---

## Pemetaan nama berkas

Notebook merujuk berkas dengan nama versi kerja di Google Drive, yang berbeda dengan nama di repositori ini. Gunakan tabel berikut saat menjalankan ulang kode.

| Nama di repositori | Nama yang dirujuk notebook | Variabel |
|---|---|---|
| `input/3_data_irio_17_2025_ras.xlsx` | `01. Data_IRIO_17_Siap.xlsx` | `F_IRIO`, `PATH_IRIO` |
| `input/4_ekstraksi_data_proksi.xlsx` | `02. Ekstraksi_Data.xlsx` | `F_GEO` |
| `input/5_matriks_konektivitas.xlsx` | `matriks_konektivitas_spasial_transit.xlsx` | `F_W` |

Sesuaikan salah satunya: ubah nama berkas agar sama dengan yang dirujuk notebook, atau ubah variabel path di dalam notebook agar menunjuk nama di repositori ini.

---

## Masukan

### `input/1_persiapan_data_irio.xlsx`
Tabel Interregional Input–Output Indonesia 2016 terbitan BPS, disusun ulang ke bentuk 34 provinsi × 17 lapangan usaha. Menjadi dasar pemutakhiran pada kode 1.

### `input/2_data_updating_irio_2025.xlsx`
Data sasaran pemutakhiran ke tahun 2025, berisi total baris dan kolom yang harus dipenuhi prosedur RAS.

### `input/3_data_irio_17_2025_ras.xlsx`
Tabel IRIO 2025 hasil pemutakhiran, yaitu keluaran kode 1. Inilah tabel yang dipakai kode 3, 4, dan 7. Lembarnya:

| Lembar | Isi |
|---|---|
| `A` | Matriks koefisien teknis, 578 × 578 |
| `Z` | Matriks transaksi antara |
| `FD25` | Permintaan akhir 2025 |
| `Total Output` | Output bruto per sektor-wilayah |

Sistemnya berukuran 34 provinsi × 17 sektor = 578 unit sektor-wilayah. Bali adalah provinsi ke-17, sehingga menempati indeks 272 sampai 288 dalam penomoran berbasis nol.

### `input/4_ekstraksi_data_proksi.xlsx`
85 indikator proksi untuk 9 kategori KBLI pariwisata, masing-masing dengan nilai pada periode dasar (Januari–Februari 2020) dan periode guncangan (April–Juli 2020). Disusun dari keluaran kode 2 ditambah statistik resmi.

Terdiri atas 25 proksi unik dari tiga jenis sumber:

- **Penginderaan jauh** — NTL, LST, NDVI, NDWI, NDBI, BUI, NO₂, CO, HCHO, aerosol index
- **Mobilitas** — enam kategori Google Community Mobility Reports
- **Statistik resmi** — penumpang dan penerbangan udara, penumpang dan kunjungan kapal, tingkat penghunian kamar, rata-rata lama menginap

### `input/5_matriks_konektivitas.xlsx`
Waktu tempuh dan jumlah transit penerbangan antarprovinsi, dipakai kode 5 untuk menyusun matriks bobot spasial. Bobot mentahnya dirumuskan sebagai w = 1 / (T^α × (1+transit)^β) dengan α = β = 1, lalu dibakukan baris.

Konektivitas penerbangan dipilih menggantikan ketetanggaan darat karena Indonesia negara kepulauan, dan karena wisatawan bergerak lewat jaringan udara.

---

## Keluaran

| Berkas | Dihasilkan | Isi | Dipakai |
|---|---|---|---|
| `A1_Dampak_per_Provinsi.csv` | kode 4 | Δx, intensitas, koefisien struktural per provinsi | kode 5, 6 |
| `A3_Spillover_per_Sektor.csv` | kode 4 | *Spillover* per sektor di luar Bali | kode 6 |
| `B2_Dekomposisi_Dampak.csv` | kode 4 | Dekomposisi dampak menjadi empat komponen | kode 6 |
| `C2_network_nodes.csv` | kode 4 | Simpul jaringan: provinsi, koordinat, ukuran | analisis jaringan |
| `C3_network_edges.csv` | kode 4 | Sisi jaringan: aliran *spillover* dari Bali | analisis jaringan |
| `F1_LISA_Klasifikasi.csv` | kode 5 | Kuadran LISA dan *exposure* struktural | kode 6 |

### Keterangan kolom penting

| Kolom | Arti |
|---|---|
| `Dx_triliun` | Perubahan output dalam triliun rupiah, bertanda negatif |
| `Pct_nasional` | Porsi terhadap dampak nasional |
| `Intensitas_pct` | Dampak dibagi output provinsi itu sendiri |
| `Koef_Struktural_L` | Keterkaitan struktural provinsi dengan Bali melalui invers Leontief |
| `dPDRB_triliun` | Perubahan nilai tambah bruto |
| `Kuadran_Final` | Kuadran LISA: `HH`, `LH`, `HL`, `LL`, atau `Not Significant` |
| `Local_I` | Nilai Local Moran's I |
| `p_value` | Nilai-p dari 999 permutasi |

### Angka kunci untuk pemeriksaan

Bila kode dijalankan ulang, angka berikut harus muncul kembali:

| Besaran | Nilai |
|---|---|
| Total guncangan | −Rp84,39 triliun |
| Dampak output nasional | −Rp142,65 triliun |
| *Multiplier* efektif | 1,6903 |
| Porsi Bali | 78,81% |
| Porsi *spillover* | 21,19% |
| Moran's I | 0,0178 |

---

## Berkas yang tidak disertakan

- **`indonesia_prov.geojson`** — batas 34 provinsi, diunduh otomatis oleh kode 5 dan 6 dari repositori publik `ans-4175/peta-indonesia-geojson`. Salinannya sudah tertanam di dalam `artifact/data/data.js`.
- **Keluaran antara penginderaan jauh** — berkas `rs_bali_summary_*.csv` hasil kode 2. Ringkasannya sudah termuat dalam `input/4_ekstraksi_data_proksi.xlsx`.
