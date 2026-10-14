// =====================================================================
// DATA TAMBAHAN untuk halaman Dashboard
// Berbeda dengan data.js (dibuat notebook 04), isi berkas ini disalin
// dari lampiran skripsi. Sumber tiap bagian ditulis di atasnya.
// Jangan mengubah angka di sini tanpa mengubah naskah skripsi.
// =====================================================================
const DATA_TAMBAHAN = {
  // Periode komposit (Lampiran 5, sel 1)
  periode: { baseline: 'Januari–Februari 2020', shock: 'April–Juli 2020' },

  // Sensor yang diekstraksi di Google Earth Engine (Lampiran 5, sel 4)
  sensor: [
    { nama: 'Landsat 8 Surface Reflectance', koleksi: 'LANDSAT/LC08/C02/T1_L2', variabel: 'NDVI, NDWI, NDBI, BUI', resolusi: '30 m', komposit: 'median' },
    { nama: 'MODIS MOD11A2', koleksi: 'MODIS/061/MOD11A2', variabel: 'LST siang', resolusi: '1 km', komposit: 'median' },
    { nama: 'VIIRS VNP46A2 Black Marble', koleksi: 'NASA/VIIRS/002/VNP46A2', variabel: 'NTL', resolusi: '500 m', komposit: 'median' },
    { nama: 'Sentinel-5P OFFL', koleksi: 'COPERNICUS/S5P/OFFL/L3_*', variabel: 'NO₂, CO, HCHO, aerosol index', resolusi: '3,5–7 km', komposit: 'mean' }
  ],

  // Keterangan tiap proksi. Kunci = teks proksi persis seperti di Lampiran 6.
  // Isi: [label singkat, nama lengkap, jenis data, sumber, satuan]
  proksi: {
    "Night Time Light (NTL)": ["NTL", "Night-time light", "Remote sensing", "VIIRS VNP46A2 Black Marble", "nW/cm²/sr"],
    "Land Surface Temperature (LST)": ["LST", "Suhu permukaan darat (siang)", "Remote sensing", "MODIS MOD11A2", "°C"],
    "Normalized Difference Built-up Index (NDBI)": ["NDBI", "Indeks lahan terbangun (NDBI)", "Remote sensing", "Landsat 8", "indeks"],
    "Built-Up Index (BUI)": ["BUI", "Built-up index (BUI)", "Remote sensing", "Landsat 8", "indeks"],
    "Normalized Difference Vegetation Index (NDVI)": ["NDVI", "Indeks vegetasi (NDVI)", "Remote sensing", "Landsat 8", "indeks"],
    "Normalized Difference Water Index (NDWI)": ["NDWI", "Indeks air (NDWI)", "Remote sensing", "Landsat 8", "indeks"],
    "Nitrogen Dioksida (NO₂)": ["NO₂", "Nitrogen dioksida troposfer", "Remote sensing", "Sentinel-5P OFFL", "mol/m²"],
    "Karbon Monoksida (CO)": ["CO", "Karbon monoksida", "Remote sensing", "Sentinel-5P OFFL", "mol/m²"],
    "Aerosol Index (AER_AI)": ["Aerosol", "Absorbing aerosol index", "Remote sensing", "Sentinel-5P OFFL", "indeks"],
    "HCHO ((formaldehyde)": ["HCHO", "Formaldehida troposfer", "Remote sensing", "Sentinel-5P OFFL", "mol/m²"],
    "Google Community Mobility Report (Retail & Recreation)": ["Ritel & rekreasi", "Mobilitas ke ritel dan rekreasi", "Mobilitas Google", "Google Community Mobility Reports", "% dari baseline Google"],
    "Google Community Mobility Report (Transit Stations)": ["Stasiun transit", "Mobilitas ke stasiun transit", "Mobilitas Google", "Google Community Mobility Reports", "% dari baseline Google"],
    "Google Community Mobility Report (Workplaces)": ["Tempat kerja", "Mobilitas ke tempat kerja", "Mobilitas Google", "Google Community Mobility Reports", "% dari baseline Google"],
    "Google Community Mobility Report (Residential)": ["Permukiman", "Waktu di permukiman", "Mobilitas Google", "Google Community Mobility Reports", "% dari baseline Google"],
    "Google Community Mobility Report (Grocery & Pharmacy)": ["Toko pangan & apotek", "Mobilitas ke toko pangan dan apotek", "Mobilitas Google", "Google Community Mobility Reports", "% dari baseline Google"],
    "Google Community Mobility : Parks": ["Taman", "Mobilitas ke taman", "Mobilitas Google", "Google Community Mobility Reports", "% dari baseline Google"],
    "Jumlah Penumpang Kapal Pelayaran Dalam Negeri dan Internasional Berangkat dari Pelabuhan di Provinsi Bali": ["Penumpang kapal berangkat", "Penumpang kapal berangkat dari pelabuhan di Bali", "Statistik resmi", "Statistik resmi transportasi laut", "orang"],
    "Jumlah Penumpang Kapal Pelayaran Dalam Negeri dan Internasional Menuju Pelabuhan di Provinsi Bali": ["Penumpang kapal datang", "Penumpang kapal menuju pelabuhan di Bali", "Statistik resmi", "Statistik resmi transportasi laut", "orang"],
    "Jumlah Kapal Dalam Negeri dan Internasional Menuju ke Pelabuhan Bali": ["Kunjungan kapal", "Kapal menuju pelabuhan di Bali", "Statistik resmi", "Statistik resmi transportasi laut", "unit"],
    "Jumlah Penumpang Pesawat Dalam Negeri dan Internasional Menuju Bandara Bali": ["Penumpang pesawat datang", "Penumpang pesawat menuju bandara Bali", "Statistik resmi", "Statistik resmi transportasi udara", "orang"],
    "Jumlah Penumpang Pesawat Dalam Negeri dan Internasional dari Bandara Bali": ["Penumpang pesawat berangkat", "Penumpang pesawat dari bandara Bali", "Statistik resmi", "Statistik resmi transportasi udara", "orang"],
    "Jumlah Penerbangan Dalam Negeri dan Internasional Menuju Bandara Bali": ["Penerbangan datang", "Penerbangan menuju bandara Bali", "Statistik resmi", "Statistik resmi transportasi udara", "penerbangan"],
    "Jumlah Penerbangan Dalam Negeri dan Internasional dari Bandara Bali": ["Penerbangan berangkat", "Penerbangan dari bandara Bali", "Statistik resmi", "Statistik resmi transportasi udara", "penerbangan"],
    "Tingkat Penghunian Kamar (TPK) Hotel Bintang": ["TPK hotel bintang", "Tingkat penghunian kamar hotel bintang", "Statistik resmi", "Statistik resmi akomodasi", "%"],
    "Rata-Rata Lama Menginap Menginap Tamu Domestik dan Asing pada Hotel Bintang": ["Lama menginap", "Rata-rata lama menginap tamu hotel bintang", "Statistik resmi", "Statistik resmi akomodasi", "sesuai sumber"]
  },

  // 85 indikator per kategori KBLI (Lampiran 6: Ekstraksi Data Proksi.xlsx)
  // b = nilai baseline (Jan–Feb 2020), s = nilai shock (Apr–Jul 2020)
  indikator: [
    { kbli: "G", sub: "Perdagangan Mobil, Sepeda Motor dan Reparasinya; Perdagangan Besar dan Eceran, Bukan Mobil dan Sepeda Motor", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "G", sub: "Perdagangan Mobil, Sepeda Motor dan Reparasinya; Perdagangan Besar dan Eceran, Bukan Mobil dan Sepeda Motor", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "G", sub: "Perdagangan Mobil, Sepeda Motor dan Reparasinya; Perdagangan Besar dan Eceran, Bukan Mobil dan Sepeda Motor", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "G", sub: "Perdagangan Mobil, Sepeda Motor dan Reparasinya; Perdagangan Besar dan Eceran, Bukan Mobil dan Sepeda Motor", proksi: "Built-Up Index (BUI)", b: -1.03344154, s: -1.07741588 },
    { kbli: "G", sub: "Perdagangan Mobil, Sepeda Motor dan Reparasinya; Perdagangan Besar dan Eceran, Bukan Mobil dan Sepeda Motor", proksi: "Normalized Difference Vegetation Index (NDVI)", b: 0.7138457, s: 0.73823455 },
    { kbli: "G", sub: "Perdagangan Mobil, Sepeda Motor dan Reparasinya; Perdagangan Besar dan Eceran, Bukan Mobil dan Sepeda Motor", proksi: "Google Community Mobility Report (Retail & Recreation)", b: -3.67, s: -41.94 },
    { kbli: "H", sub: "Angkutan Rel", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "H", sub: "Angkutan Rel", proksi: "Nitrogen Dioksida (NO₂)", b: 7.94e-06, s: 8.2e-06 },
    { kbli: "H", sub: "Angkutan Rel", proksi: "Google Community Mobility Report (Transit Stations)", b: -7.13, s: -74.1 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Nitrogen Dioksida (NO₂)", b: 7.94e-06, s: 8.2e-06 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Karbon Monoksida (CO)", b: 0.02692558, s: 0.02554611 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Aerosol Index (AER_AI)", b: -1.29458492, s: -1.43651571 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Google Community Mobility Report (Transit Stations)", b: -7.13, s: -74.1 },
    { kbli: "H", sub: "Angkutan Darat", proksi: "Google Community Mobility Report (Workplaces)", b: -17.4, s: -38.03 },
    { kbli: "H", sub: "Angkutan Laut; Angkutan Sungai Danau dan Penyeberangan", proksi: "Jumlah Penumpang Kapal Pelayaran Dalam Negeri dan Internasional Berangkat dari Pelabuhan di Provinsi Bali", b: 434226.0, s: 76848.0 },
    { kbli: "H", sub: "Angkutan Laut; Angkutan Sungai Danau dan Penyeberangan", proksi: "Jumlah Penumpang Kapal Pelayaran Dalam Negeri dan Internasional Menuju Pelabuhan di Provinsi Bali", b: 353504.0, s: 50586.0 },
    { kbli: "H", sub: "Angkutan Laut; Angkutan Sungai Danau dan Penyeberangan", proksi: "Jumlah Kapal Dalam Negeri dan Internasional Menuju ke Pelabuhan Bali", b: 15105.0, s: 3162.0 },
    { kbli: "H", sub: "Angkutan Laut; Angkutan Sungai Danau dan Penyeberangan", proksi: "Nitrogen Dioksida (NO₂)", b: 7.94e-06, s: 8.2e-06 },
    { kbli: "H", sub: "Angkutan Laut; Angkutan Sungai Danau dan Penyeberangan", proksi: "Karbon Monoksida (CO)", b: 0.02692558, s: 0.02554611 },
    { kbli: "H", sub: "Angkutan Laut; Angkutan Sungai Danau dan Penyeberangan", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Jumlah Penumpang Pesawat Dalam Negeri dan Internasional Menuju Bandara Bali", b: 1719918.0, s: 83655.0 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Jumlah Penumpang Pesawat Dalam Negeri dan Internasional dari Bandara Bali", b: 1866829.0, s: 110952.0 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Jumlah Penerbangan Dalam Negeri dan Internasional Menuju Bandara Bali", b: 12679.0, s: 2064.0 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Jumlah Penerbangan Dalam Negeri dan Internasional dari Bandara Bali", b: 12687.0, s: 2077.0 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Nitrogen Dioksida (NO₂)", b: 7.94e-06, s: 8.2e-06 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Karbon Monoksida (CO)", b: 0.02692558, s: 0.02554611 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "HCHO ((formaldehyde)", b: 0.00012906, s: 9.357e-05 },
    { kbli: "H", sub: "Angkutan Udara", proksi: "Google Community Mobility Report (Transit Stations)", b: -7.13, s: -74.1 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Nitrogen Dioksida (NO₂)", b: 7.94e-06, s: 8.2e-06 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Karbon Monoksida (CO)", b: 0.02692558, s: 0.02554611 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Aerosol Index (AER_AI)", b: -1.29458492, s: -1.43651571 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Google Community Mobility Report (Workplaces)", b: -17.4, s: -38.03 },
    { kbli: "H", sub: "Pergudangan dan Jasa Penunjang Angkutan, Pos dan Kurir", proksi: "Google Community Mobility Report (Transit Stations)", b: -7.13, s: -74.1 },
    { kbli: "I", sub: "Penyediaan Makan Minum", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "I", sub: "Penyediaan Makan Minum", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "I", sub: "Penyediaan Makan Minum", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "I", sub: "Penyediaan Makan Minum", proksi: "Karbon Monoksida (CO)", b: 0.02692558, s: 0.02554611 },
    { kbli: "I", sub: "Penyediaan Makan Minum", proksi: "Google Community Mobility Report (Retail & Recreation)", b: -3.67, s: -41.94 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Built-Up Index (BUI)", b: -1.03344154, s: -1.07741588 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Normalized Difference Water Index (NDWI)", b: -0.66035412, s: -0.68415713 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Tingkat Penghunian Kamar (TPK) Hotel Bintang", b: 51.12, s: 3.46 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Rata-Rata Lama Menginap Menginap Tamu Domestik dan Asing pada Hotel Bintang", b: 2936.0, s: 2751.0 },
    { kbli: "I", sub: "Penyediaan Akomodasi", proksi: "Google Community Mobility Report (Retail & Recreation)", b: -3.67, s: -41.94 },
    { kbli: "JK", sub: "Informasi & Komunikasi; Jasa Keuangan & Asuransi", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "JK", sub: "Informasi & Komunikasi; Jasa Keuangan & Asuransi", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "JK", sub: "Informasi & Komunikasi; Jasa Keuangan & Asuransi", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "JK", sub: "Informasi & Komunikasi; Jasa Keuangan & Asuransi", proksi: "Built-Up Index (BUI)", b: -1.03344154, s: -1.07741588 },
    { kbli: "JK", sub: "Informasi & Komunikasi; Jasa Keuangan & Asuransi", proksi: "Google Community Mobility Report (Workplaces)", b: -17.4, s: -38.03 },
    { kbli: "L", sub: "Real Estat", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "L", sub: "Real Estat", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "L", sub: "Real Estat", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "L", sub: "Real Estat", proksi: "Built-Up Index (BUI)", b: -1.03344154, s: -1.07741588 },
    { kbli: "L", sub: "Real Estat", proksi: "Normalized Difference Water Index (NDWI)", b: -0.66035412, s: -0.68415713 },
    { kbli: "MN", sub: "Jasa Perusahaan (agen perjalanan, event organizer, konsultansi)", proksi: "Google Community Mobility Report (Workplaces)", b: -17.4, s: -38.03 },
    { kbli: "MN", sub: "Jasa Perusahaan (agen perjalanan, event organizer, konsultansi)", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "MN", sub: "Jasa Perusahaan (agen perjalanan, event organizer, konsultansi)", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "MN", sub: "Jasa Perusahaan (agen perjalanan, event organizer, konsultansi)", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "MN", sub: "Jasa Perusahaan (agen perjalanan, event organizer, konsultansi)", proksi: "Built-Up Index (BUI)", b: -1.03344154, s: -1.07741588 },
    { kbli: "P", sub: "Jasa Pendidikan", proksi: "Google Community Mobility Report (Residential)", b: 3.07, s: 17.55 },
    { kbli: "P", sub: "Jasa Pendidikan", proksi: "Google Community Mobility Report (Workplaces)", b: -17.4, s: -38.03 },
    { kbli: "P", sub: "Jasa Pendidikan", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "P", sub: "Jasa Pendidikan", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "P", sub: "Jasa Pendidikan", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "P", sub: "Jasa Pendidikan", proksi: "Normalized Difference Vegetation Index (NDVI)", b: 0.7138457, s: 0.73823455 },
    { kbli: "Q", sub: "Jasa Kesehatan & Sosial", proksi: "Google Community Mobility Report (Grocery & Pharmacy)", b: -1.33, s: -32.39 },
    { kbli: "Q", sub: "Jasa Kesehatan & Sosial", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "Q", sub: "Jasa Kesehatan & Sosial", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "Q", sub: "Jasa Kesehatan & Sosial", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Night Time Light (NTL)", b: 0.18813736, s: 0.14086656 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Land Surface Temperature (LST)", b: 28.90410363, s: 26.8484165 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Normalized Difference Built-up Index (NDBI)", b: -0.31980155, s: -0.33915503 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Built-Up Index (BUI)", b: -1.03344154, s: -1.07741588 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Normalized Difference Vegetation Index (NDVI)", b: 0.7138457, s: 0.73823455 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Google Community Mobility Report (Retail & Recreation)", b: -3.67, s: -41.94 },
    { kbli: "RSTU", sub: "Jasa Lainnya (seni, hiburan, rekreasi, jasa perorangan)", proksi: "Google Community Mobility : Parks", b: 0.0, s: -55.93 }
  ],

  // Koefisien perubahan per kategori KBLI (Lampiran 7, sel 9)
  kategori: [
    { kode: 'G',    label: 'G',          sektor: ['S7'],         delta: -0.351949 },
    { kode: 'H',    label: 'H',          sektor: ['S8'],         delta: -0.413209 },
    { kode: 'I',    label: 'I',          sektor: ['S9'],         delta: -0.277313 },
    { kode: 'JK',   label: 'J, K',       sektor: ['S10', 'S11'], delta: -0.401513 },
    { kode: 'L',    label: 'L',          sektor: ['S12'],        delta: -0.261383 },
    { kode: 'MN',   label: 'M, N',       sektor: ['S13'],        delta: -0.401513 },
    { kode: 'P',    label: 'P',          sektor: ['S15'],        delta: -0.486882 },
    { kode: 'Q',    label: 'Q',          sektor: ['S16'],        delta: -0.451277 },
    { kode: 'RSTU', label: 'R, S, T, U', sektor: ['S17'],        delta: -0.349275 }
  ],

  // Shock permintaan akhir Bali per sektor, triliun Rp (Lampiran 8, sel 20 / berkas D1)
  shockSektor: [
    { kode: 'S7',  kbli: 'G',   sektor: 'Perdagangan',            fdAwal: 21.0336, shock: 7.4028,  fdSesudah: 13.6308, persen: 35.19 },
    { kode: 'S8',  kbli: 'H',   sektor: 'Transportasi',           fdAwal: 49.0841, shock: 20.2820, fdSesudah: 28.8021, persen: 41.32 },
    { kode: 'S9',  kbli: 'I',   sektor: 'Akomodasi & Mamin',      fdAwal: 99.4366, shock: 27.5751, fdSesudah: 71.8615, persen: 27.73 },
    { kode: 'S10', kbli: 'JK',  sektor: 'Informasi & Komunikasi', fdAwal: 12.3279, shock: 4.9498,  fdSesudah: 7.3781,  persen: 40.15 },
    { kode: 'S11', kbli: 'JK',  sektor: 'Keuangan & Asuransi',    fdAwal: 7.9660,  shock: 3.1984,  fdSesudah: 4.7675,  persen: 40.15 },
    { kode: 'S12', kbli: 'L',   sektor: 'Real Estate',            fdAwal: 9.8465,  shock: 2.5737,  fdSesudah: 7.2728,  persen: 26.14 },
    { kode: 'S13', kbli: 'MN',  sektor: 'Jasa Perusahaan',        fdAwal: 1.3538,  shock: 0.5436,  fdSesudah: 0.8102,  persen: 40.15 },
    { kode: 'S15', kbli: 'P',   sektor: 'Pendidikan',             fdAwal: 19.5725, shock: 9.5295,  fdSesudah: 10.0430, persen: 48.69 },
    { kode: 'S16', kbli: 'Q',   sektor: 'Kesehatan',              fdAwal: 12.7529, shock: 5.7551,  fdSesudah: 6.9978,  persen: 45.13 },
    { kode: 'S17', kbli: 'RSTU', sektor: 'Jasa Lainnya',          fdAwal: 7.3923,  shock: 2.5819,  fdSesudah: 4.8103,  persen: 34.93 }
  ],

  // Dampak per sektor di Bali menurut komponen, triliun Rp (Lampiran 8, sel 38 / berkas B2b)
  sektorBali: [
    { kode: 'S9',  sektor: 'Akomodasi & Mamin',      langsung: -27.5751, tidakLangsung: -3.0041, umpanBalik: -0.00348, total: -30.5827 },
    { kode: 'S8',  sektor: 'Transportasi',           langsung: -20.2820, tidakLangsung: -3.1425, umpanBalik: -0.00538, total: -23.4298 },
    { kode: 'S15', sektor: 'Pendidikan',             langsung: -9.5295,  tidakLangsung: -0.3037, umpanBalik: -0.00003, total: -9.8332 },
    { kode: 'S7',  sektor: 'Perdagangan',            langsung: -7.4028,  tidakLangsung: -2.3930, umpanBalik: -0.00325, total: -9.7990 },
    { kode: 'S10', sektor: 'Informasi & Komunikasi', langsung: -4.9498,  tidakLangsung: -4.0174, umpanBalik: -0.00076, total: -8.9680 },
    { kode: 'S11', sektor: 'Keuangan & Asuransi',    langsung: -3.1984,  tidakLangsung: -3.2275, umpanBalik: -0.00164, total: -6.4276 },
    { kode: 'S16', sektor: 'Kesehatan',              langsung: -5.7551,  tidakLangsung: -0.1171, umpanBalik: -0.00032, total: -5.8725 },
    { kode: 'S1',  sektor: 'Pertanian',              langsung: 0,        tidakLangsung: -3.7649, umpanBalik: -0.00471, total: -3.7696 },
    { kode: 'S12', sektor: 'Real Estate',            langsung: -2.5737,  tidakLangsung: -1.1922, umpanBalik: -0.00045, total: -3.7664 },
    { kode: 'S17', sektor: 'Jasa Lainnya',           langsung: -2.5819,  tidakLangsung: -0.4426, umpanBalik: -0.00023, total: -3.0248 },
    { kode: 'S4',  sektor: 'Listrik & Gas',          langsung: 0,        tidakLangsung: -2.3496, umpanBalik: -0.00042, total: -2.3500 },
    { kode: 'S3',  sektor: 'Industri Pengolahan',    langsung: 0,        tidakLangsung: -1.9636, umpanBalik: -0.00226, total: -1.9659 },
    { kode: 'S13', sektor: 'Jasa Perusahaan',        langsung: -0.5436,  tidakLangsung: -1.1157, umpanBalik: -0.00029, total: -1.6596 },
    { kode: 'S6',  sektor: 'Konstruksi',             langsung: 0,        tidakLangsung: -0.6495, umpanBalik: -0.00010, total: -0.6495 },
    { kode: 'S14', sektor: 'Adm. Pemerintahan',      langsung: 0,        tidakLangsung: -0.2294, umpanBalik: -0.00003, total: -0.2294 },
    { kode: 'S2',  sektor: 'Pertambangan',           langsung: 0,        tidakLangsung: -0.0501, umpanBalik: -0.00005, total: -0.0501 },
    { kode: 'S5',  sektor: 'Air & Limbah',           langsung: 0,        tidakLangsung: -0.0474, umpanBalik: -0.00002, total: -0.0474 }
  ],

  // Angka tunggal dari keluaran notebook
  statistik: {
    fdBaliAwal: 395.65, fdBaliSesudah: 311.26,      // Lampiran 8, sel 20 (triliun Rp)
    fdPariwisata: 240.77,                           // Lampiran 7, sel 10 (triliun Rp)
    pdrbNasional: -81.10, pdrbBali: -65.27, pdrbLuar: -15.83,   // Lampiran 8, sel 30 (triliun Rp)
    pdrbPersenBali: 20.54,                          // % dari PDRB Bali
    moranI: 0.0178, moranEI: -0.0312, moranP: 0.119, moranZ: 1.1431,   // Lampiran 9, sel 11
    rhoStrukturalGeografis: 0.4111, pStrukturalGeografis: 0.0175       // Lampiran 9, sel 19
  }
};
