---
name: frontend-design
description: "Membuat antarmuka HTML/CSS/JavaScript yang modern, konsisten, responsif, dan siap diintegrasikan ke project yang sudah ada."
---

# Frontend Design

## Tujuan
Buat antarmuka web yang rapi, modern, mudah digunakan, responsif, dan konsisten dengan desain project yang sedang dikerjakan.

## Alur kerja wajib
1. Periksa struktur folder, file layout, stylesheet, JavaScript, komponen, dan framework yang sudah digunakan sebelum membuat atau mengubah UI.
2. Ikuti design system yang sudah ada: warna, font, spacing, border radius, shadow, ukuran komponen, dan pola navigasi.
3. Gunakan komponen atau class yang sudah tersedia sebelum membuat komponen baru.
4. Buat perubahan sekecil mungkin dan jangan mengganti framework atau library tanpa diminta.
5. Pastikan tampilan bekerja pada desktop, tablet, dan ponsel.

## Prinsip desain
- Utamakan hierarki visual yang jelas, whitespace yang cukup, keterbacaan, dan konsistensi.
- Gunakan semantic HTML seperti `header`, `nav`, `main`, `section`, `form`, dan `footer` jika sesuai.
- Gunakan label yang jelas untuk setiap input; jangan mengandalkan placeholder sebagai label.
- Berikan state yang terlihat untuk hover, focus, active, disabled, loading, empty, success, dan error.
- Pastikan tombol memiliki teks/tujuan yang jelas dan ukuran target sentuh yang memadai.
- Gunakan kontras warna yang baik dan jangan menyampaikan status hanya dengan warna.
- Hindari layout berlebihan, gradient dekoratif, animasi yang tidak perlu, dan komponen yang terlalu padat.
- Jangan menambahkan teks dummy, angka palsu, atau data contoh ke halaman produksi.

## Responsive
- Hindari fixed width yang menyebabkan overflow.
- Gunakan Flexbox/Grid dan breakpoint yang mengikuti pola project.
- Tabel lebar harus memiliki strategi mobile yang jelas, misalnya horizontal scroll pada container tabel.
- Periksa modal, dropdown, form, navbar, dan sidebar pada viewport kecil.
- Jangan menyembunyikan informasi penting hanya untuk mengatasi overflow.

## Implementasi
- Pertahankan HTML, CSS, dan JavaScript terpisah sesuai struktur project.
- Hindari inline style/script kecuali project memang menggunakannya atau perubahan kecil membutuhkannya.
- Jangan menambahkan dependency baru jika CSS/komponen yang ada sudah cukup.
- Jangan mengubah ID, class, selector, atau atribut data yang dipakai JavaScript tanpa memeriksa semua pemakaiannya.
- Jangan menghapus fitur aksesibilitas atau atribut `aria-*` yang sudah ada.

## Sebelum selesai
- Jelaskan file yang diubah dan alasan perubahan.
- Sebutkan bagian yang perlu diuji manual.
- Jika tidak dapat menjalankan browser/test, nyatakan bahwa tampilan belum diverifikasi secara visual.
