# Lukis

Editor anotasi gambar yang jalan langsung di browser. Tempel screenshot dari clipboard, coret-coret atau tambahkan kotak/bulat/panah/teks di atasnya, lalu salin hasilnya ke clipboard atau unduh sebagai PNG/JPG.

## Kenapa Lukis

Aplikasi anotasi/screenshot-marking kebanyakan minta kamu bikin akun, login, atau install software desktop cuma buat ngasih tanda kotak merah di screenshot. Lukis tidak begitu:

- **Tanpa akun, tanpa login, tanpa babibu** — buka, langsung pakai. Tidak ada sign up, tidak ada "connect your account", tidak ada paywall.
- **Semua diproses di browser kamu sendiri** — gambar yang kamu tempel tidak pernah dikirim ke server mana pun. Tidak ada backend, tidak ada database, tidak ada yang menyimpan data kamu.
- **Alur kerja super singkat**: `Ctrl+V` → gambar → `Ctrl+C` atau Download. Selesai.
- **Ringan** — satu halaman statis, tidak perlu instalasi aplikasi apa pun selain browser.

## Fitur

- Tempel gambar dari clipboard (`Ctrl+V`), drag-and-drop, atau pilih berkas manual
- Tool gambar: pena bebas, kotak, elips, panah, garis, teks
- Pilih warna & tebal garis, isi transparan/solid untuk kotak & elips
- Seleksi, pindah, resize, dan rotate objek
- Undo/redo (`Ctrl+Z` / `Ctrl+Shift+Z`)
- Salin hasil akhir ke clipboard (`Ctrl+C`) atau unduh sebagai PNG (transparan) / JPG (latar putih)
- Shortcut keyboard untuk semua tool (`V` pilih, `P` pena, `R` kotak, `O` elips, `A` panah, `L` garis, `T` teks)

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di Chrome/Edge (Clipboard API butuh koneksi aman — `localhost` sudah dianggap aman).

## Build

```bash
npm run build
```

Hasil build ada di `dist/` — bisa di-host sebagai static site di mana saja (Netlify, Vercel, GitHub Pages, atau cuma dibuka dari file lokal).

## Stack

React + TypeScript + Vite, kanvas dengan [Konva](https://konvajs.org/) / `react-konva`, state dengan [Zustand](https://github.com/pmndrs/zustand), styling dengan Tailwind CSS v4.
