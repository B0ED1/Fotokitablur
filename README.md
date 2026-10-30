# Photobooth

Cara pakai:
1. Buka folder ini, jalankan server lokal, contoh: `python -m http.server 8000`, lalu buka http://localhost:8000
   (kamera butuh `localhost` atau HTTPS; membuka file langsung via file:// bisa ditolak browser).
2. Izinkan akses kamera, pilih frame & filter, tekan "Mulai!".

Fitur: 2 layout (strip / grid 2x2), 5 filter, 6 frame, stiker, suara shutter, confetti.

Struktur:
- index.html        — kerangka halaman
- css/style.css     — tampilan (mendukung mode terang/gelap)
- js/config.js      — pengaturan: jumlah foto, hitung mundur, warna frame, filter, judul strip
- js/camera.js      — akses kamera & ambil foto
- js/composer.js    — menyusun photo strip & memuat foto upload
- js/app.js         — logika UI
