# Landing NalaroClass, 13 Oktober 2026

## Arah desain dan isi

Landing memperkenalkan satu alur kelas: materi, diskusi, tugas, presensi, kuis, dan evaluasi. Fotografi siswa serta guru menggantikan karakter manusia SVG lama. Logo produk tetap; warna hijau hutan, sage, ivory, dan terracotta mendukung foto editorial. Judul dan uraian menjelaskan manfaat praktis. Tidak ada angka pengguna, testimoni, pelanggan, klaim kenaikan hasil, atau janji layanan yang tidak terverifikasi.

Referensi yang dibaca untuk susunan narasi dan kejelasan label, bukan disalin:
- https://www.instructure.com/canvas — alur pendidik, pengalaman siswa, serta fitur dengan contoh penggunaan.
- https://www.thinkific.com/ — pengelompokan produk dan kebutuhan pengajar/pelajar.

Kemampuan produk ditelusuri melalui route dan kode NalaroClass. Semua nama, jumlah siswa, progres, rekap presensi, dan aktivitas pada preview adalah data ilustratif yang tidak meminta API produksi.

## Komponen

- `src/pages/Landing.jsx`: hero, navigasi responsif, manfaat guru, fitur, Assist, langkah mulai, FAQ, CTA, footer, reveal dan kontrol animasi.
- `src/components/landing/ProductPreview.jsx`: empat panel kelas yang dapat dipilih melalui klik atau keyboard.
- `src/components/landing/LandingQuiz.jsx`: dua contoh format soal, jawaban, umpan balik, dan reset.
- `src/components/landing/WorldShowcase.jsx`: sepuluh pilihan tema memakai SVG pemandangan baru. Tidak mengimpor karakter/engine kelas lama. Ilustrasi ini preview; runtime dunia di kelas tetap mandiri.
- `src/styles/landing-saas.css`: seluruh aturan visual berada dalam lingkup landing, termasuk reduced motion dan ukuran layar kecil.
- Metadata landing memakai judul produk yang konkret serta foto siswa untuk preview berbagi. Canonical mengikuti domain Pages yang sudah terkonfigurasi; alamat kustom tidak ditebak.

Hero memuat foto responsif berprioritas tinggi. Foto guru dimuat secara lazy. Animasi panel berhenti saat hero di luar viewport; kontrol jeda dan prefers-reduced-motion tersedia. Reveal memakai IntersectionObserver dan memiliki fallback tanpa observer.

## Aset fotografi

Dibuat melalui built-in imagegen. File asli diperiksa visual; turunan WebP hanya mengubah ukuran dan encoding untuk pengiriman browser.

| Aset | Ukuran file |
| --- | --- |
| `public/images/landing/students-1440.webp` | 77.9 KB |
| `public/images/landing/students-640.webp` | 26.2 KB |
| `public/images/landing/teacher-1000.webp` | 57.3 KB |
| `public/images/landing/teacher-640.webp` | 32.0 KB |

### Prompt siswa

Use case: photorealistic-natural. Asset: premium Indonesian education SaaS landing hero photograph. Two Indonesian high school students aged 17-18, boy and girl wearing neat white short sleeve school shirts, boy navy trousers girl navy skirt, cheerful natural editorial model expressions, seated close beside each other on a simple bench, one holding a modern unbranded silver laptop on lap and the other casually pointing at it, realistic hands and anatomy. Sophisticated commercial lifestyle photography, natural skin texture, soft daylight studio lighting. Medium full-body portrait composition from knees up, both entire heads and hands within frame with generous clear space at edges. Clean pale sage green studio backdrop and floor, subtle real shadows, restrained vibrant art direction. No graphic decorations, no text, no logos, no watermark, no cards, no interface, no graduation hats. Aspect ratio landscape 4:3.

### Prompt guru

Use case: photorealistic-natural. Asset: editorial model photography for professional Indonesian classroom SaaS landing. Indonesian female teacher about 30 years old wearing elegant cream hijab and tailored muted warm terracotta blouse with beige trousers, seated on a simple light wood chair, holding an unbranded slim tablet with one hand resting naturally at the edge, friendly confident warm smile toward camera, poised modern professional educator, no exaggerated gesture. Realistic facial texture, hands and anatomy. Clean warm ivory studio background, soft warm daylight from side with subtle shadows. Premium commercial editorial photography matching education campaign, medium portrait from mid thighs up, entire head and hands and tablet within frame with generous breathing space around silhouette. Portrait aspect ratio 4:5. No text, no logos, no watermark, no graphics, no UI, no graduation props.

## Batas pekerjaan

Perubahan pada presentasi publik. Tidak mengubah handler autentikasi, API, Worker, database, atau engine dunia kelas. CTA pembuatan kelas masuk melalui alur autentikasi yang tersedia. Pengujian login dengan fixture sintetis tidak membuktikan Firebase nyata atau perangkat fisik.
