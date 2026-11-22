# PRD — Aplikasi Portofolio Sales Toyota Agung Dumai

> Dokumen kebutuhan produk (Product Requirements Document)
> Versi: 1.0 — 16 November 2026
> Status: Aktif

---

## 1. Ringkasan

Aplikasi web **portofolio penjualan** untuk Sales Marketing dealer Toyota Agung Dumai. Menampilkan:

1. Info produk mobil Toyota (nama, harga, warna, fitur unggulan, spesifikasi, video)
2. Testimoni pembeli
3. Info penjualan / profil sales
4. Kalkulator perhitungan kredit

Target pengguna: calon pembeli mobil Toyota di wilayah Dumai dan sekitarnya, yang datang terutama dari **pencarian Google** dan **tautan WhatsApp** (dibagikan sales).

**Sales pemilik akun:** Rizki Ameriko Nasution
**WhatsApp/Telepon resmi:** +62 813-6562-6009 → format `wa.me`: `6281365626009`
**Alamat:** Jl. Kelakap 7 No.13, Ratu Sima, Kec. Dumai Selatan, Kota Dumai, Riau 28826

---

## 2. Batasan Teknis (Hard Constraints)

Aturan ini **wajib dipatuhi** oleh siapa pun (termasuk AI) yang mengembangkan aplikasi:

| # | Aturan |
|---|--------|
| C1 | **Website statis**. Tidak ada server backend, tidak ada database server, tidak ada framework/build step (React, Vue, npm, dsb.). |
| C2 | **Satu file halaman utama: `index.html`**. Seluruh HTML, konten, dan JavaScript berada di file ini. `index3.html` dan `index4.html` dianggap **arsip eksperimen** — jangan dijadikan basis, jangan dihapus tanpa konfirmasi pemilik. |
| C3 | **Seluruh CSS berada di `style.css`**. Dilarang menambah blok `<style>` besar di dalam HTML. |
| C4 | **Seluruh gambar berada di folder `images/`** dengan struktur sub-folder tetap (lihat §6). |
| C5 | **Data mobil berasal dari Google Apps Script** (JSONP) yang membaca Google Spreadsheet. API endpoint disimpan di variabel `API` di `index.html`. Dilarang hardcode data mobil ke dalam HTML/JS. |
| C6 | Bahasa konten: **Bahasa Indonesia**. |
| C7 | Tanpa dependensi eksternal selain: Google Fonts (Plus Jakarta Sans / Barlow Condensed), Google Maps embed, YouTube embed, dan Apps Script. |
| C8 | Harus berjalan dengan membuka `index.html` langsung dari file lokal atau hosting statis apa pun (GitHub Pages, Netlify, hosting pemilik). Deployment ditangani **pemilik** — pengembang tidak perlu mengurus deploy. |

---

## 3. Struktur Halaman (Single Page, Routing Hash)

`index.html` adalah satu halaman dengan beberapa "page" yang ditampilkan/disembunyikan via routing hash (`function route()`):

| Hash | Halaman | Isi |
|------|---------|-----|
| `#home` (default) | Beranda | Slider promo (5 slide), statistik, "Kenapa beli lewat saya", mobil terlaris, strip galeri, syarat pembelian, langkah pembelian, testimoni, FAQ, CTA WhatsApp |
| `#produk` | Katalog | Grid semua mobil dari data Sheets (kartu: foto, tag kategori, nama, harga mulai) |
| `#mobil/{i}` | Detail mobil | Foto per warna (switcher), video, pilihan tipe & harga, fitur unggulan, tabel spesifikasi, mobil terkait, tombol "Hitung cicilan" & "Tanya via WhatsApp" |
| `#cicilan` | Kalkulator kredit | Pilih mobil, kredit/tunai, harga, DP %, tenor 1–5 tahun, bunga flat % → rincian cicilan |
| `#kontak` | Kontak | Data kontak + Google Maps embed |
| `#galeri` | Galeri | Foto serah terima unit & momen konsumen |

Navigasi nav menandai item aktif; hash tak dikenal jatuh ke `#home`.

---

## 4. Sumber Data (Google Apps Script / Spreadsheet)

### 4.1 Mekanisme
- Data diambil via **JSONP**: `<script src="{API}?callback=onCarsLoaded">`.
- Endpoint dikonfigurasi di konstanta `API` pada `index.html`.
- Data terakhir disimpan di `localStorage` (`tad_cars_v1`, maks. 24 jam) agar kunjungan berikutnya tampil instan, lalu tetap di-refresh dari Apps Script di latar belakang.
- Gagal memuat → tampilkan pesan "Data mobil gagal dimuat" di grid produk; **tidak boleh** membiarkan halaman kosong tanpa pesan. Jika cache tersedia, data cache tetap dipakai.

### 4.2 Skema satu baris = satu mobil (kolom spreadsheet)

| Kolom | Tipe | Makna | Contoh |
|-------|------|-------|--------|
| `k` | string | Kode mobil → nama file gambar `images/mobil/{k}-{warna}.jpg` | `agya` |
| `n` | string | Nama model | `Agya` |
| `t` | string | Kategori/tag | `Hatchback` |
| `p` | angka (boleh teks) | Harga mulai (Rp) | `156500000` |
| `d` | string | Deskripsi singkat | |
| `f` | JSON array (string) | Fitur unggulan | `["Audio 7 inch","..."]` |
| `s` | JSON array 2-kolom (string) | Spesifikasi `[label, nilai]` | `[["Mesin","1.0L"],...]` |
| `ty` | JSON array 2-kolom (string) | Tipe & harga `[nama, harga]`; kosong → `[["Standar", p]]` | `[["1.0 G MT",156500000]]` |
| `cl` | JSON array 2-kolom (string), boleh kosong | Warna `[nama, hex]`; kosong → default: Putih `#f2f2f2`, Hitam `#1d1d1d`, Silver `#b5b8bc`, Merah `#c8102e` | `[["Maron","#6b2231"]]` |
| `v` | string | ID video YouTube (opsional) | `dQw4w9WgXcQ` |

Aturan normalisasi (`normalize()`): angka boleh dikirim sebagai teks; array boleh dikirim sebagai string JSON; semua wajib tahan terhadap nilai kosong.

### 4.3 Testimoni (sheet `testimoni`, opsional)

- Respons Apps Script idealnya berupa objek: `{ cars: [...], rv: [...] }` — `rv` berasal dari sheet `testimoni`.
- Sheet `testimoni` berisi 4 kolom: `no | nama | mobil | ulasan`. Apps Script mengirim per baris sebagai `[nama, mobil, ulasan, no]`.
- Foto konsumen = `images/konsumen/{no}.jpg` (dari kolom `no`, **bukan** urutan baris). Jika `no` kosong/tak valid → fallback nomor urut baris. Jika file foto tidak ada, placeholder SVG tampil — aman.
- Baris berupa objek `{nama, mobil, ulasan}` dari sumber lain juga diterima (tanpa `no`).
- **Fallback wajib**: jika respons tidak berisi `rv`, atau Sheets gagal dimuat, tampilkan array default `rv` di `index.html`. Strip testimoni tidak boleh kosong.
- Jika Apps Script masih mengembalikan array (format lama), hanya mobil yang terisi dan testimoni memakai default — tidak boleh error.

### 4.4 Kalkulator kredit (skema Priority / ADDM, bunga flat)

- **Pilihan mobil = tipe**: combobox berisi setiap tipe dari `ty` (nama model + nama tipe + harga), bukan per model; bisa **diketik untuk mencari** nama mobil/tipe (filter langsung, navigasi ↑/↓ + Enter, Esc menutup).
- Harga mobil terisi otomatis dari tipe terpilih, **tetap bisa diedit manual**.
- **Bunga flat tetap 7,5% per tahun** dan inputnya `readonly` (tidak bisa diubah host saat live maupun pengunjung web).
- DP diisi manual sebagai nominal Rupiah (pemisah ribuan otomatis); default 20% dari harga saat ganti tipe.
- Tidak ada pilihan tenor. Hasil langsung menampilkan angsuran untuk tenor **12, 24, 36, 48, 60 bulan**.
- **Skema Priority = ADDM (Angsuran Dibayar Di Muka)**: angsuran pertama dibayar bersama DP, sehingga `Total DP = DP + angsuran pertama`.

```
Pokok    = harga − DP            (DP dibatasi ≤ harga)
Bunga    = pokok × bunga_flat% × (tenor_bulan / 12)
Total    = pokok + bunga
Angsuran = Total / tenor_bulan   (per tenor 12/24/36/48/60)
Total DP = DP + Angsuran         (ADDM, per tenor)
```
Nilai estimasi cepat di kartu terlaris: `est(p) = p × 0.8 × (1 + 0.075×4) / 48` (DP 20%, 4 tahun, bunga 7,5%).
Teks disclaimer wajib ada: "Hasil berupa perkiraan… hubungi sales untuk penawaran resmi."

### 4.5 Mode Live OBS (`index.html?live=1`)

Khusus untuk live TikTok lewat OBS: tampilan dirancang pada **kanvas tetap 1080×1920 (vertikal)**, tanpa scroll.

- URL: `index.html?live=1` → `<html class="live">` ditambahkan oleh script kecil di `<head>`.
- Kanvas `#cicilan` fixed 1080×1920, di-scale otomatis (`transform: scale`) agar pas di browser source 1080×1920 maupun saat dipreview di layar lain.
- **Panel atas 1040px** (putih, garis bawah merah, judul "Toyota Dumai — Skema Priority") berisi:
  - form ringkas 3 baris: pencarian mobil, harga/DP/bunga, toggle Kredit/Tunai;
  - ringkasan 4 chip: harga, DP (+%), pokok, bunga flat;
  - **5 kartu tenor** (12/24/36/48/60) dengan angka angsuran besar + Total DP ADDM, layout 3+2;
  - footer 1 baris penjelasan ADDM + disclaimer singkat.
- **Area bawah ±880px transparan** — dipakai layar kamera OBS.
- Navbar, footer, halaman lain, tombol WA, dan disclaimer panjang disembunyikan.
- Harga & DP memakai pemisah ribuan; input tetap bisa diketik host saat live.
- Data tetap dari Apps Script; saat memuat/gagal muncul pesan singkat di panel.

Setup OBS: Browser Source `1080×1920` ke URL di atas, kamera sebagai source di area bawah, centang *Refresh browser when scene becomes active*.

---

## 5. Identitas & Kontak (Sumber Kebenaran Tunggal)

**Semua** nomor kontak di seluruh halaman HARUS memakai nilai di §1. Larangan:

- Nomor placeholder lama `6281234567890` / `0812-3456-7890` → **hapus/ganti semua** (ada di: tombol CTA WA, tabel kontak, footer, link WA di detail mobil & kalkulator).
- Nama "Lenny Widyawati" & nomor `087712347070` di meta description → ganti ke data §1.
- Nama "Andrew Jhonson" di kartu profil, kontak, footer → ganti ke **Rizki Ameriko Nasution**.

### 5.1 Daftar titik yang harus konsisten
1. `<meta name="description">` + OG + Twitter description
2. Kartu profil sales (foto `images/sales/fullbody.jpg`)
3. Semua link `https://wa.me/…?text=…` (teks pesan bebas, nomor tetap)
4. Tabel kontak `#kontak` (WA, telepon, email, alamat, jam layanan)
5. Footer
6. Halaman detail mobil — tombol "Tanya via WhatsApp" (dibangun dinamis di `upd()`)

---

## 6. Konvensi Gambar

Struktur folder **tetap** (jangan mengubah lokasi tanpa update PRD):

```
images/
├── icon150.png                 favicon / apple-touch-icon
├── flyer.jpg                   flyer daftar harga (halaman home)
├── sales/fullbody.jpg          foto profil sales
├── slider/1.jpg … 5.jpg        latar slider beranda (urutan = slide)
├── mobil/{k}-{warna}.jpg       foto mobil per warna (huruf kecil)
│     contoh: agya-putih.jpg, avanza-metalic.jpg
│     tambahan detail (opsional, dipakai index3 versi eksperimen):
│     {k}-{warna}-interior.jpg, {k}-{warna}-dashboard.jpg, dst.
├── galeri/1.jpg … N.jpg        galeri serah terima (lihat GALERI_COUNT di JS;
│                               caption opsional di array `caps` — foto tanpa caption tampil tanpa overlay)
└── konsumen/1.jpg … 5.jpg      foto testimoni (urutan = array `rv` di JS)
```

Aturan:
- Nama warna pada file = `cl[c][j][0].toLowerCase()` → nama warna di spreadsheet harus sinkron dengan nama file.
- Gambar yang gagal dimuat harus **dihapus otomatis** dari DOM (placeholder SVG ditampilkan), bukan menampilkan ikon rusak.
- Gambar dimuat `lazy` kecuali slider pertama.

---

## 7. Persyaratan Fungsional & Kriteria Terima

| # | Fitur | Kriteria terima |
|---|-------|-----------------|
| F1 | Katalog produk | Grid menampilkan semua baris Sheets; klik kartu → `#mobil/{i}`; index tak valid → kembali `#home` |
| F2 | Detail mobil | Bisa dibuka langsung via URL `#mobil/2` tanpa lewat katalog; pilih warna → foto+nama+background berubah; **tombol prev/next di atas foto utama berputar (loop) ke warna sebelum/berikutnya dan tetap sinkron dengan thumbnail**; mobil dengan 1 warna menyembunyikan tombol; pilih tipe → harga & teks WA berubah |
| F3 | Kalkulator | Combobox pencarian tipe mobil dari Sheets (model + tipe + harga; filter saat mengetik, ↑/↓ + Enter, Esc); kredit/tunai tetap ada (tunai menyembunyikan field kredit); harga auto-isi & editable; DP manual dengan pemisah ribuan; bunga flat tetap 7,5% (readonly); **tanpa pilihan tenor**; hasil menampilkan angsuran tenor 12/24/36/48/60 + Total DP ADDM (DP + angsuran pertama); perubahan input langsung menghitung; tombol WA membawa model/tipe, harga & DP |
| F4 | "Hitung cicilan" dari detail mobil | Mengisi dropdown + harga sesuai tipe terpilih, lalu langsung menampilkan hasil |
| F5 | Slider beranda | Auto 5 detik, klik dot memilih slide, timer reset saat manual |
| F6 | Testimoni & strip galeri | Auto-scroll berjalan, berhenti saat hover/touch, menghormati `prefers-reduced-motion` |
| F7 | Data gagal dimuat | Pesan error ramah + saran muat ulang; halaman lain tetap berfungsi |
| F8 | Kontak selalu benar | Semua titik di §5.1 memakai nomor/nama §1 — audit manual tiap perubahan |
| F9 | Tombol "ke atas" | Muncul setelah scroll 300px, smooth scroll |
| F10 | Testimoni & galeri | Testimoni (`rv`) dari sheet `testimoni` via Apps Script, dengan data default di `index.html` sebagai fallback (lihat §4.3); galeri statis di `index.html` — **urutan tampil: foto terbaru dulu (nomor terbesar → terkecil)**, tab Galeri memakai **paging windowed** (`GALERI_PER_PAGE`, default 12/halaman; pager menampilkan halaman pertama, terakhir, dan ±1 dari halaman aktif, sisanya dipotong `…`), strip beranda menampilkan `STRIP_COUNT` foto terbaru |
| F11 | Preview foto galeri (lightbox) | Klik foto galeri (tab galeri maupun strip beranda) → tampil besar di overlay gelap; navigasi prev/next (tombol, keyboard ←/→, swipe) **mengikuti urutan tampil yang sama**, tutup via ✕/Esc/klik latar; caption tampil jika ada; foto tidak terdistorsi (`object-fit: cover` di kartu, `contain` di lightbox) |
| F12 | Mode live OBS | `index.html?live=1` → kanvas vertikal 1080×1920 tanpa scroll: panel kalkulator di atas (form ringkas + ringkasan + 5 kartu tenor besar 3+2 + footer ADDM), area bawah transparan untuk kamera; halaman lain/navbar/footer/tombol WA disembunyikan; scaling otomatis mengikuti ukuran browser source (lihat §4.5) |

---

## 8. Persyaratan Non-Fungsional

1. **Responsif**: nyaman di layar ≤ 360px hingga desktop; grid `.two` & `.whyw` turun ke 1 kolom di ≤720/820px.
2. **Performa**: tanpa library JS; gambar lazy-load; ukuran halaman awal ringan (font + CSS saja).
3. **Aksesibilitas**: `aria-label` pada tombol ikon/dot/slider; fokus terlihat (`:focus-visible`); kontras teks di atas foto dijamin overlay gradasi `.slide.hi`.
4. **SEO**: satu halaman utama; meta description/OG/Twitter selalu memuat nama sales & nomor §1; canonical ke domain produksi.
5. **Tanpa error konsol** saat data Sheets gagal maupun berhasil.

---

## 9. Masalah Terbuka (Backlog Perbaikan)

| Prioritas | Masalah | Lokasi | Solusi | Status |
|-----------|---------|--------|--------|--------|
| 🔴 Tinggi | Nomor WA placeholder `6281234567890` dipakai di ±10 titik | `index.html` | Ganti semua ke `6281365626009` | ✅ Selesai (6 titik link WA, 16 Nov 2026) |
| 🔴 Tinggi | Nama & nomor sales lama (Lenny/Andrew) | meta description, kartu, kontak, footer | Ganti ke **Rizki Ameriko Nasution** / +62 813-6562-6009 | ✅ Selesai (nama ×3, nomor meta ×3, nomor kartu ×1) |
| 🟡 Sedang | Typo `salses.jpg` di meta OG image | `<head>` | Cek file sebenarnya di `images/`, perbaiki path | ✅ Typo diperbaiki → `sales.jpg`. ⚠️ **Perlu verifikasi pemilik**: pastikan file `images/sales.jpg` benar-benar ada di domain produksi; jika tidak, unggah foto tersebut |
| 🟡 Sedang | Canonical & OG url menunjuk `toyotaagungdumai.net/produk` + domain lama | `<head>` | Sinkronkan dengan domain deploy final (pemilik memutuskan saat deploy) | ⬜ Terbuka |
| 🟢 Rendah | Nama warna di spreadsheet ↔ file foto: sudah diverifikasi 17 Nov 2026 — 0 foto hilang, hanya 1 file tak terpakai (`raize-back.jpg`) | Sheets + `images/mobil/` | Biarkan atau pakai sebagai foto tambahan | ✅ Terverifikasi sinkron |
| 🟢 Rendah | CSS tak terpakai (`.modal`, `.mbox`, `.quote`) | `style.css` | Hapus bila tak dibutuhkan | ⬜ Terbuka |
| 🟢 Rendah | `index3.html` / `index4.html` eksperimen | root | Arsipkan ke folder `_arsip/` atau hapus setelah konfirmasi | ⬜ Terbuka |
| 🟢 Rendah | Fitur "tampilan detail per warna" (Eksterior/Interior/Dashboard) menarik dari index3 | `index3.html` | Pertimbangkan port ke `index.html` — butuh penambahan foto interior/dashboard per warna | ⬜ Terbuka |

---

## 10. Panduan Kerja untuk Pengembang (termasuk AI)

1. **Baca PRD ini dulu**, lalu `index.html` (basis aktif) dan `style.css`.
2. Jangan membuat file/fondasi baru kecuali diminta; modifikasi di `index.html` + `style.css` saja.
3. Pertahankan gaya kode yang ada: JS tanpa framework, fungsi kecil, nama variabel pendek (`c` = mobil, `cl` = warna, dsb.), string HTML dibangun dengan template sederhana.
4. Setiap kali mengubah konten kontak → jalankan audit F8 (cari regex `wa\.me|08[0-9\- ]+|Andrew|Lenny`).
5. Setiap perubahan skema Sheets harus dicatat di §4.2.
6. Uji minimal: buka `index.html` di browser — halaman terbuka, data termuat, navigasi hash bekerja, kalkulator menghitung, tidak ada error konsol.

---

## 11. Di Luar Lingkup (v1)

- Admin panel / CMS — data dikelola lewat Google Spreadsheet.
- Form lead online, backend, database.
- Multi-bahasa.
- Deployment & hosting (ditangani pemilik).
