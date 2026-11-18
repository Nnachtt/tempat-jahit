# Website Profil Penjahit Delta Jeans (Custom & Vermak)

Website resmi dan interaktif untuk **Penjahit Delta Jeans (deltajeans custom dan vermak)** yang ditautkan langsung dengan Google Business Profile / Google Maps: [https://share.google/ai8maFnbqKDypuSw6](https://share.google/ai8maFnbqKDypuSw6).

---

## 👖 Fitur Utama Website

1. **Desain Denim Atelier Modern & Responsif**:
   - Palette warna Deep Indigo, Amber Gold Stitching, dan Leather Patch Badge.
   - 100% responsif untuk smartphone, tablet, maupun desktop.
2. **Kalkulator Estimasi Biaya Interaktif**:
   - Perhitungan harga real-time berdasarkan jenis pekerjaan (Potong Original, Chainstitch, Tapering, Darning/Tambal, Custom Raw Denim, dsb.) dan jumlah pakaian.
   - Opsi tambahan (Pengerjaan Express 1x24 jam, Hardware Kancing Brass, Custom Leather Patch).
   - Tombol **"Kirim Rincian ke WhatsApp"** yang otomatis mengonversi pilihan layanan menjadi template pesan chat WhatsApp siap kirim.
3. **Interactive Denim Studio (Customizer Visualizer)**:
   - Pelanggan dapat memilih tipe potongan (*Slim Fit*, *Slim Straight*, *Regular*, *Baggy*), jenis bahan denim (*Raw Indigo 15oz*, *Vintage Washed*, *Stealth Black*, *Japanese Selvedge Redline*), warna benang jahitan, serta hardware kancing dengan visualisasi skema celana langsung.
4. **Sebelum & Sesudah (Before/After Drag Slider)**:
   - Tuas geser interaktif untuk membandingkan kondisi celana jeans sobek / kedodoran sebelum dan sesudah direparasi di Delta Jeans.
5. **Panduan Pengukuran Mandiri & Kalkulator Ukuran**:
   - Panduan cara mengukur lingkar pinggang, panjang inseam, dan lingkar paha di rumah.
   - Kalkulator konversi ukuran (cm / inch) ke nomor size celana standar (Size 28 - 44).
   - Tombol satu-klik untuk menyalin data ukuran ke clipboard.
6. **Integrasi Google Maps & Pemesanan Online**:
   - Tautan langsung ke Google Maps listing target (`/g/11zxq82wxx`).
   - Formulir reservasi / konsultasi online.
   - Tombol mengambang (Floating Action Button) WhatsApp di pojok kanan bawah.
7. **FAQ & Bukti Ulasan Bintang 5**:
   - Accordion interaktif untuk pertanyaan umum seputar pengerjaan, ketebalan kain denim 16-21oz, pengiriman kurir/ekspedisi, dan garansi pas.

---

## 📁 Struktur File

```
deltajeans-website/
├── index.html        # Struktur HTML5 lengkap dengan Tailwind CSS & icon SVG
├── styles.css        # Efek jahitan (stitch border), texture denim, dan styling slider
├── script.js         # Logika kalkulator harga, visualizer denim, slider, & WhatsApp generator
└── README.md         # Petunjuk penggunaan & kustomisasi
```

---

## 🚀 Cara Membuka / Menjalankan Website

### Opsi 1: Buka Langsung di Browser
Anda dapat membuka file `index.html` langsung dengan klik dua kali (double click) atau klik kanan > **Open with** > **Google Chrome / Microsoft Edge / Firefox**. Tidak memerlukan instalasi server atau dependensi tambahan!

### Opsi 2: Menggunakan VS Code Live Server
1. Buka folder `deltajeans-website` di Visual Studio Code / Antigravity IDE.
2. Klik kanan file `index.html` lalu pilih **Open with Live Server**.

### Opsi 3: Deploy Gratis ke Internet
Website ini bersifat statis (HTML/CSS/JS) sehingga dapat langsung di-deploy secara instan dan gratis ke:
- **Netlify**: Cukup *drag and drop* folder `deltajeans-website` ke [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: Hubungkan repository GitHub atau jalankan `vercel` CLI.
- **GitHub Pages**: Unggah ke repository GitHub lalu aktifkan *GitHub Pages* di pengaturan repository.

---

## ⚙️ Cara Mengubah Data Kontak & WhatsApp

1. Buka file `script.js` dan ubah variabel nomor WhatsApp pada baris ke-17:
   ```javascript
   const DELTA_WA_NUMBER = "628xxxxxxxxxx"; // Ganti dengan nomor WhatsApp aktif toko Anda (gunakan format 62 tanpa + atau 0 di depan)
   ```
2. Buka `index.html` jika ingin memperbarui alamat fisik toko atau jam buka pada bagian `<section id="lokasi">`.
3. Harga layanan dapat disesuaikan pada objek `SERVICE_PRICES` di file `script.js`.
