# Audit Nalaro Class - 3 Oktober 2026

Status: **belum semua fitur tuntas**. Audit ini memeriksa source frontend, kontrak route Worker, regresi lokal, dan bundle publik. Pengguna mengonfirmasi backend sudah bermigrasi penuh ke Cloudflare; Pages akun lama dan akun baru masih berdampingan. Pengujian yang dilaporkan pengguna terjadi pada Pages lama. Pengerjaan ini berfokus pada Cloudflare dan tidak mengubah backend AWS.

## Lingkungan yang diperiksa

| Bukti HTTP/bundle publik | Hasil aktual |
| --- | --- |
| `https://nalaro.web.id` | HTTP 200; entry `index-Bq4tkA-f.js`; modul konfigurasi `firebase-CBBlQq5b.js` masih menunjuk API Lambda AWS dan gateway AI lama. Cocok dengan nama asset pada log pengguna. |
| `https://nalaroclass.pages.dev` | HTTP 200; entry `index-CEmCnQrr.js`; modul konfigurasi `firebase-DRWI5TxO.js` menunjuk Worker `nalaro-api.uniquefactuhl.workers.dev`. |
| Worker `/health` | HTTP 200, `status: ok`. |
| Worker `/classes/audit-check/analytics/me` tanpa login | HTTP 401, route terdaftar dan dilindungi auth. Ini tidak membuktikan hasil analitik akun nyata. |
| Endpoint analytics pada Lambda lama tanpa login | HTTP 404, `Endpoint tidak ditemukan`. Router legacy di source juga tidak mendaftarkan Learning Insights. Ini menjelaskan 404 pada bundle lama, bukan indikasi route Insights hilang dari Worker. |
| Bundle build lokal setelah patch | Host API/AI yang ditemukan hanya `nalaro-api.uniquefactuhl.workers.dev`; tidak ada host AWS. |

Tidak ada perubahan DNS, custom domain, konfigurasi dashboard Pages, resource, data, atau deployment dalam tugas ini. Kepemilikan akun Cloudflare tidak diperiksa melalui API dashboard. Angka/version deployment 2 Oktober pada dokumen release adalah bukti historis, bukan pemeriksaan ulang semua konfigurasi saat ini.

## Empat masalah yang dilaporkan

### 1. Agenda

Sebelumnya widget hanya kalender dan teks `Agenda belum tersedia`, tanpa pengambilan jadwal. Patch menghubungkan dashboard guru/siswa ke `GET /learning/agenda?from=YYYY-MM-DD&to=YYYY-MM-DD` pada Worker.

- Sumber agenda: pertemuan `learning_sessions.meeting_date` dan tenggat `tasks.due_at`, dari kelas aktif yang dimiliki guru atau diikuti siswa.
- Siswa hanya melihat konten terbit. Guru juga melihat draf miliknya dengan label Draf. Konten arsip dan kelas lain tidak ditampilkan.
- Kalender, hari, batas tenggat dan jam ditampilkan dalam WIB; navigasi minggu meminta data baru.
- Tautan pertemuan membuka daftar pertemuan kelas; tautan tugas membuka detail tugas. Ada keadaan loading, kosong, gagal, dan retry.
- Rentang maksimal 31 hari. Respons maksimal 100 agenda dan memberi indikator bila terpotong.

**Batas fitur:** ini agenda pertemuan dan tenggat tugas, bukan kalender pribadi, penjadwalan jam pertemuan, pengulangan jadwal, reminder, atau notifikasi. Kuis/presensi tidak diberi tanggal rekaan. Patch perlu deployment Worker dan Pages; push frontend saja belum mengaktifkan endpoint agenda baru.

### 2. Progres dan estimasi materi

Reader sebelumnya hanya menulis 1% saat materi dibuka dan 100% lewat tombol selesai. Tidak ada hitungan waktu, kata, atau pemantauan pembacaan.

Patch menghitung kata pada paragraf, judul, kutipan, daftar dan label. Estimasi teks memakai asumsi produk 200 kata/menit dengan minimum 3 detik per blok non-divider. Gambar mendapat alokasi 15 detik; tautan 15 detik; file 2 menit; video 3 menit. Menit dibulatkan ke atas. File/tautan/video diberi keterangan bahwa ini alokasi, karena isi lampiran dan durasi playback sebenarnya tidak terbaca oleh reader. PDF di iframe dan dokumen Office belum dianalisis untuk jumlah kata/halaman.

Progres bertambah dari waktu aktif pada blok yang terlihat, dibagi antarblok yang terlihat, dan dibatasi bagian blok yang sudah masuk viewport. Tab tersembunyi, jendela tidak fokus, dan kondisi tanpa interaksi lebih dari 90 detik tidak menambah progres. Timer yang tertunda tidak mengkreditkan seluruh waktu tidur. Progres otomatis maksimal 99%; pengguna menegaskan penyelesaian lewat tombol. Progres ini adalah estimasi keterlibatan, bukan bukti penguasaan materi.

Autosave setiap 5 detik, ketika tab disembunyikan, dan saat meninggalkan reader. Penulisan kecil memakai keepalive, antrean serial, retry, dan pesan error yang terlihat. Penutupan paksa/offline tetap dapat kehilangan waktu yang belum tersimpan; UI tidak mengaku telah menyimpan ketika API gagal. Baseline berasal dari D1 saat materi dibuka kembali. Distribusi waktu per blok direkonstruksi dari persentase tersimpan, bukan histori detail halaman atau setiap blok.

### 3. Tandai selesai

Worker/D1 sudah memiliki route progres. Tidak ada bukti bahwa HTTP 500 Lambda pada log pengguna juga terjadi pada Worker. Backend legacy memakai `percent` tanpa alias pada ekspresi DynamoDB; ini kata cadangan menurut [dokumentasi DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html), sehingga source lama memiliki cacat yang konsisten dengan kegagalan penulisan. CloudWatch tidak dibaca; penyebab invocation produksi lama tidak dikonfirmasi. Backend legacy tidak diperbaiki karena pengguna telah menegaskan migrasi Cloudflare penuh.

Patch aktif menambahkan antrean autosave/selesai di frontend serta upsert monotonik pada D1. Respons atau penulisan 5% yang terlambat tidak dapat menimpa 100%, status selesai, atau tanggal selesai pertama. Tombol memiliki indikator menyimpan, mencegah klik berulang, dan hanya menunjukkan selesai setelah API berhasil. Reload mengambil nilai yang sudah disimpan. Bookmark tetap tersedia.

Audit juga memperbaiki pengambilan daftar materi siswa: dua query tambahan per materi diganti JOIN dalam satu query daftar. Pengujian 100 materi menghasilkan maksimal tiga query termasuk pemeriksaan kelas/anggota. Library progres/bookmark kini menyaring keanggotaan yang masih berlaku.

### 4. Learning Insights siswa

Service frontend dan route Worker `/classes/:classId/analytics/me` cocok. Source dan regresi lokal memverifikasi penggunaan evidence kuis, tugas bernilai, Live terautentikasi, pemisahan engagement/mastery, privasi siswa, serta snapshot Live yang sudah lengkap. Progres materi tetap hanya memengaruhi engagement.

404 pada log berasal dari API AWS bundle Pages lama. Tidak ada fallback lintas backend atau penggabungan data AWS/D1. Langkah penerapan adalah memakai build/variabel API Cloudflare pada Pages yang dipilih dan memindahkan domain ke proyek itu. Build kini menolak endpoint API AWS/HTTP lewat pemeriksaan `VITE_API_URL`. Pemeriksaan ini tidak dapat mengganti bundle lama yang sudah live.

## Inventaris dan pekerjaan yang belum clear

| Area | Kesimpulan audit source/tes lokal | Yang masih diperlukan |
| --- | --- | --- |
| Auth, profil, role | Firebase Auth/Firestore dan anchor role Worker/D1 ada; tes role/cache/race lulus | Uji login terautentikasi pada Pages akun baru setelah penerapan. Tidak membuat akun/uji produksi pada tugas ini. |
| Kelas, anggota | Create/join/list/detail dan daftar anggota ada | Mengeluarkan anggota/mengubah akses belum ada. Daftar anggota dibatasi 100; pagination belum tersedia. |
| Materi, progres, bookmark | Patch di atas lulus regresi D1 dan browser lokal sintetis | Terapkan Worker/Pages; uji siswa nyata, pindah materi, reload/offline. Analisis isi PDF/Office/video sebenarnya belum ada. |
| Diskusi, balasan, jawaban terpilih | Service/route/repository dan validasi ada | Alur browser produksi terbaru tidak diulang dalam audit ini. |
| Pertemuan dan agenda | Pertemuan CRUD/lifecycle/reorder ada; agenda terhubung lokal | Kalender pribadi, jam pertemuan, reminder dan agenda kuis/presensi belum ada. |
| Presensi standar/lokasi/wajah | Kontrak tiga mode/metode dan rekap D1 lulus; patch UX ada pada commit lokal `bbe0c95` | Kamera/model/GPS nyata, deny/retry, cahaya redup, Android/iOS belum terverifikasi ulang. MVP wajah tetap matching browser dan metode face dipercaya dari client; bukan verifikasi biometrik server. |
| Kuis mandiri | Submit/review/hasil/snapshot nama/import/export D1 lulus | Urutan soal acak belum dipersist pada draft; reload mengacak ulang. Jawaban awal Arrange sudah dihitung terjawab meski belum disentuh. Dua gap ini belum diubah pada tugas materi/agenda. |
| Kuis umum dan Bank Kuis | Route/service, publish/copy/unpublish dan D1 lulus | Moderasi, rating, pencarian lanjut/analytics katalog belum ada. |
| Tugas, lampiran, nilai, revisi | Regresi D1 submit/upload scoping/nilai/revisi lulus | UI grading masih memakai satu `busy` untuk semua siswa; indikator menyimpan muncul di seluruh tombol. Rubrik dan feedback AI sebagai alur UI belum ada. |
| Nalaro Live | Tes state, answer lock/privacy, reconnect identity, alarm dan persistence/retry lulus | Uji fisik 1 host + 3-5 pemain/jaringan nyata dan kapasitas di atas bukti historis 4 pemain. |
| AI Assist | Gateway, validasi, rate-limit fallback dan draft guru ada | Uji provider produksi pada akun baru belum dilakukan; feedback AI penilaian belum terhubung UI tugas. |
| Learning Insights | Method/evidence/fairness/privacy teruji regresi lokal | Benchmark belum ada. `loadDataset` membaca 14 kelompok data satu kelas termasuk histori, juga untuk detail satu siswa; risiko biaya/latensi saat kelas tumbuh belum diukur. |
| Domain dan metadata | Pages lama/Worker berbeda terkonfirmasi; build baru memakai Worker | Domain tujuan, repo/branch Pages, variabel API/AI/Firebase dan custom domain harus selaras. Canonical/OG/sitemap masih `nalaroclass.pages.dev`; sesuaikan saat domain produksi final dipilih. |

Temuan prioritas:

1. **Sebelum cutover:** terapkan backend/Pages yang sama dan arahkan domain ke Pages yang memakai Worker. Pastikan migrasi remote sampai `0014` untuk patch sebelumnya. Agenda tidak menambah migrasi. Status migrasi remote terbaru tidak dibaca pada tugas ini.
2. **Perilaku kuis:** `src/pages/QuizAttempt.jsx` mengacak soal di `useMemo([quiz])`, sementara draft hanya menyimpan `answers`, `activeQuestionId`, `savedAt`. `src/features/quiz/runtime.js` mengisi jawaban awal Arrange; fungsi `answered()` menghitung array nonkosong sebagai terjawab. Perlu persist questionOrder dan state touched/konfirmasi.
3. **UX nilai:** `src/pages/TaskDetail.jsx` memakai satu `busy` pada semua tombol siswa. Perlu status penyimpanan per siswa tanpa mengubah kontrak grading.
4. **Gate release:** perangkat Live, kamera/GPS nyata, dan pengukuran kapasitas/Insights masih terbuka. Keberhasilan tes lokal tidak menggantikan gate ini.

## Validasi yang dijalankan

- `node --test src/features/materials/reading-progress.test.js workers/test/material-progress-d1.test.js workers/test/agenda-d1.test.js`: **14/14**.
- `npm.cmd run validate`: lint tanpa warning; build berhasil dengan warning ukuran chunk besar; **26/26 frontend**, **126/126 backend legacy compatibility**, **66/66 Worker**; syntax checks backend dan Worker berhasil. Tes legacy dijalankan karena merupakan bagian script validate, bukan bukti runtime AWS atau rekomendasi memakai AWS kembali.
- `node workers/scripts/smoke-learning-local.mjs`: browser Chrome headless lokal dengan API/data sintetis. Membuktikan progres otomatis di atas 5%, estimasi, pause tab tersembunyi, selesai/reload, gagal selesai/retry, link guru/siswa, navigasi minggu, kosong/gagal/retry agenda. Tidak ada error runtime; tidak ada horizontal overflow pada 320/1440 px. Screenshot diperiksa dan disimpan lokal/ignored pada `workers/.wrangler/learning-artifacts/`.
- `git diff --check`: lulus, tanpa whitespace error. Peringatan konversi LF/CRLF Git bukan kegagalan tes.

Browser in-app tidak tersedia pada sesi ini; pengujian lokal memakai Chromium/Chrome headless melalui Playwright yang sudah tersedia. Browser lokal memakai fixture, bukan Firebase, API terautentikasi, model wajah, upload Cloudinary, perangkat fisik atau Pages produksi.

## Berkas dan penerapan

Berkas utama: `src/features/materials/reading-progress.js`, `hooks/useReadingProgress.js`, `MaterialBlocks.jsx`, `src/pages/MaterialReader.jsx`, `src/services/api.js`, `material.service.js`, `workers/src/repositories/material.repository.js`, `agenda.repository.js`, `workers/src/routes/agenda.js`, `workers/src/index.js`, `src/services/agenda.service.js`, `src/features/agenda/calendar.js`, `src/components/dashboard/DashboardWidgets.jsx`, `src/pages/student/StudentDashboard.jsx`, CSS materi/dashboard, `config/backend-target.js`, `vite.config.js`, regresi baru, dan `workers/scripts/smoke-learning-local.mjs`.

Perubahan berada di working tree di atas `bbe0c95`; **belum commit, push, atau deploy** dalam tugas ini. Tidak ada migrasi baru. Push Pages dan deployment Worker adalah langkah terpisah. Untuk penerapan kemudian, deploy Worker menggunakan konfigurasi dalam direktori `workers/` dan pertahankan vars dashboard. Konfigurasi Wrangler root masih milik gateway lama `quizzy`; jangan menganggap deploy dari root otomatis menerapkan `nalaro-api`.
