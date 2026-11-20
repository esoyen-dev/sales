---
name: php-development
description: "Menulis, memperbaiki, dan mereview PHP dengan fokus pada keamanan, kompatibilitas, keterbacaan, dan perubahan minimal."
---

# PHP Development

## Prinsip utama
- Periksa versi PHP dan pola coding project sebelum memakai sintaks atau fitur baru.
- Ikuti struktur dan konvensi project; jangan melakukan refactor besar tanpa permintaan.
- Pertahankan nama method, parameter, return type, route, session key, dan kontrak API yang sudah digunakan.
- Hindari mengubah perilaku bisnis yang sudah berjalan tanpa persetujuan.
- Jangan mengarang nama tabel, kolom, konfigurasi, atau helper. Cari definisinya di project.

## Keamanan
- Validasi seluruh input dari request, termasuk query string, POST, JSON, dan file upload.
- Escape output sesuai konteks HTML; jangan mencetak input pengguna secara mentah.
- Gunakan query parameter/binding untuk input SQL. Jika project menggunakan query SQL manual, pertahankan gaya tersebut tetapi tetap gunakan binding untuk nilai dinamis.
- Jangan menyimpan password dalam plaintext; gunakan password hashing bawaan PHP/framework.
- Lindungi operasi perubahan data dengan CSRF dan otorisasi yang sesuai.
- Jangan membocorkan stack trace, kredensial, token, atau detail database ke pengguna.
- Validasi upload berdasarkan ukuran, MIME/content, ekstensi yang diizinkan, dan nama file yang dibuat server.
- Jangan mempercayai nama file atau MIME dari browser.

## Kualitas kode
- Gunakan nama variabel dan method yang jelas.
- Pisahkan validasi, proses bisnis, akses data, dan presentasi sesuai pola project.
- Tangani error secara eksplisit; jangan menelan exception tanpa alasan.
- Hindari query di dalam loop jika dapat digabungkan dengan aman.
- Hindari duplikasi logika yang menimbulkan perilaku berbeda.
- Gunakan strict comparison bila sesuai dan tangani nilai `null`, string kosong, `0`, dan `false` secara berbeda.

## Debugging
1. Minta atau periksa pesan error lengkap dan baris yang terkait.
2. Telusuri sumber nilai dan alur eksekusi sebelum mengubah kode.
3. Buat hipotesis penyebab berdasarkan bukti.
4. Terapkan perubahan terkecil yang memperbaiki penyebab.
5. Jelaskan cara menguji ulang dan kemungkinan efek samping.

## Output saat memberi solusi
- Tampilkan kode lengkap untuk bagian yang perlu diganti, bukan potongan yang kehilangan konteks penting.
- Sebutkan lokasi file dan posisi perubahan.
- Jangan menyatakan kode sudah diuji jika belum dijalankan.
