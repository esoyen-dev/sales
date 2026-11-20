---
name: web-design-guidelines
description: "Memeriksa kualitas HTML, aksesibilitas, UX, responsive layout, dan konsistensi tampilan sebelum perubahan dianggap selesai."
---

# Web Design Guidelines

## Pemeriksaan antarmuka
Saat membuat atau mereview halaman, periksa hal-hal berikut:

### Struktur dan aksesibilitas
- Gunakan elemen HTML semantik yang tepat.
- Pastikan setiap input memiliki label yang terhubung melalui `for` dan `id`.
- Tombol harus menggunakan `<button>` dan navigasi menggunakan `<a>` dengan tujuan yang benar.
- Pastikan kontrol dapat digunakan dengan keyboard dan memiliki focus state yang terlihat.
- Gunakan `alt` yang bermakna untuk gambar informatif; gunakan `alt=""` untuk gambar dekoratif.
- Gunakan heading secara berurutan dan jangan memilih heading hanya karena ukuran tampilannya.
- Tambahkan `aria-label` atau atribut ARIA hanya ketika elemen native belum cukup menjelaskan fungsi.

### Form
- Tampilkan pesan validasi dekat dengan field terkait.
- Pertahankan nilai input ketika validasi gagal.
- Bedakan status required, disabled, readonly, loading, dan invalid.
- Berikan konfirmasi untuk tindakan destruktif.
- Jangan mengandalkan alert browser jika project sudah memiliki sistem notifikasi.

### Responsive dan layout
- Periksa viewport kecil dan besar.
- Hindari horizontal overflow pada body.
- Pastikan modal tidak keluar dari layar dan kontennya dapat di-scroll.
- Pastikan dropdown, Select2, datepicker, tooltip, dan popover tidak terpotong container.
- Jangan mengubah ukuran font atau menyembunyikan kolom secara acak hanya agar tampilan muat.

### Performa
- Hindari event listener ganda dan pemanggilan AJAX berulang.
- Hindari selector DOM yang terlalu luas jika selector spesifik tersedia.
- Gunakan ukuran gambar yang sesuai dan lazy loading untuk gambar non-kritis.
- Jangan menambahkan library besar untuk kebutuhan sederhana.

### Review sebelum mengubah
- Identifikasi penyebab masalah, jangan hanya menutupi gejalanya.
- Periksa CSS/JS global yang mungkin memengaruhi halaman lain.
- Periksa apakah komponen digunakan di halaman lain sebelum mengubah aturan global.
- Utamakan perbaikan lokal dengan risiko regresi paling kecil.

## Format laporan review
Berikan:
1. Temuan yang benar-benar terlihat dari kode.
2. Dampak terhadap pengguna.
3. Perubahan minimal yang disarankan.
4. Risiko kompatibilitas dan pengujian yang diperlukan.

Jangan mengklaim halaman sudah lolos audit visual atau accessibility jika belum diuji.
