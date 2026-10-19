# Status dan riwayat pengerjaan Nalaro Class

Terakhir diperiksa: 19 Oktober 2026. Dokumen ini adalah catatan kerja yang harus diperbarui setelah setiap tugas selesai. Status mengacu pada kode di repository `hulumzz/Quizzy` dan `khoirulzz/nalaroclass` dan bukti pengujian yang disebutkan; keberadaan kode tidak otomatis berarti fitur sudah lolos uji produksi.

## Aturan pembaruan oleh AI

1. Baca **Posisi saat ini** dan **Pekerjaan tersisa** sebelum mengubah kode.
2. Setelah tugas selesai, perbarui status fitur, lingkungan, dan daftar pekerjaan yang terdampak. Tambahkan entri bertanggal di **Riwayat perubahan**: apa yang berubah, berkas penting, validasi yang benar-benar dijalankan, serta status commit, push, dan deploy.
3. Bedakan `ada di kode`, `lulus tes lokal`, `teruji pada API produksi`, dan `teruji di browser/perangkat`. Jangan menaikkan status hanya karena build atau tes unit lulus.
4. Catat keputusan produk dan temuan baru. Jangan tulis nilai secret, token, atau data pengguna. Jika dokumen lama berbeda, periksa kode dan lingkungan terbaru; dokumen lama tetap berguna sebagai riwayat.

## Tujuan dan keputusan produk

- Nalaro Class adalah LMS guru dan siswa untuk kelas, materi, diskusi, presensi, pertemuan, tugas, kuis mandiri, Bank Kuis, dan Nalaro Live.
- Target arsitektur: React/Vite di Cloudflare Pages; API LMS dan gateway AI di Worker; data LMS di D1; sesi live aktif di Durable Object SQLite; Firebase Authentication tetap; Cloudinary untuk media.
- Klarifikasi pengguna 3 Oktober 2026: backend telah bermigrasi penuh ke Cloudflare. Pages akun lama dan baru masih berdampingan; laporan error pada `nalaro.web.id` berasal dari Pages lama. Seluruh pengembangan aktif mengikuti Cloudflare; source AWS hanya legacy. Push/memindahkan domain ke Pages akun baru akan dilakukan kemudian.
- Profil wajah MVP tetap di Firestore dengan aturan akses pemilik. Kamera, embedding, dan pencocokan 1:1 berlangsung di browser; API presensi masih memeriksa auth, keanggotaan, sesi, duplikasi, dan lokasi.
- Pengguna mengizinkan data LMS lama di DynamoDB ditinggalkan. D1 yang kosong setelah cutover bukan bukti kegagalan migrasi.
- Remote `url` menunjuk `hulumzz/Quizzy` dan remote `pages` menunjuk `khoirulzz/nalaroclass`. Pengguna mengizinkan sinkronisasi keduanya; push `pages/main` terbukti memicu deployment Pages produksi.

## Posisi saat ini

**Pemulihan domain produksi dan integrasi Face API, 20 Oktober 2026:** audit Cloudflare dan konfigurasi publik Firebase membuktikan `class.nalaro.digital` hilang dari allowlist CORS Worker dan Firebase Authorized Domains. Worker `/health` dan Render `/health` merespons sehat di browser; ini bukan bukti login/kelas terautentikasi berhasil. `workers/wrangler.json` kini memuat seluruh domain produksi dan tes preflight/401 menolak domain penyerang. `firebase.json` mencatat daftar Authorized Domains lama plus domain kustom; konfigurasi Firebase ini **belum diterapkan** karena tidak ada sesi/kredensial Firebase yang tersedia. Pengelola perlu menambahkan `class.nalaro.digital` pada Authentication → Settings → Authorized domains. Pesan error Google/profil di UI kini spesifik.

Integrasi wajah: JWT Worker wajib ada untuk metode face (gagal tertutup jika secret belum siap), memeriksa HS256/issuer/uid/attendanceId/classId/masa berlaku maksimal 120 detik, termasuk waktu kedaluwarsa tepat. Browser membaca error `detail` FastAPI, menolak proof tidak lengkap, meneruskan pembatalan scan dan membatasi waktu hingga pembacaan response body. Python di repo `khoirulzz/nalarofaceapi` memeriksa status/model/skema profil dan embedding valid; I/O sinkron Firebase berjalan di threadpool FastAPI. Model dan threshold cosine 0.72 tidak berubah; perpindahan komparasi ke Python belum membuktikan peningkatan akurasi atau liveness server.

Validasi dan status rilis untuk tugas ini dicatat pada entri riwayat terbaru di bawah. Login nyata, kamera/GPS/perangkat fisik, kesamaan secret lintas Render/Worker, dan check-in terautentikasi belum diverifikasi.

**Migrasi Presensi Wajah ke Python Face API (Render), 19 Oktober 2026:** Arsitektur verifikasi presensi wajah ditingkatkan dari kepercayaan client murni menjadi verifikasi server-authoritative. Proyek Python API mandiri dibuat di `../nalaro-face-api` (FastAPI + NumPy cosine similarity + PyJWT + Firebase Admin SDK) yang dirancang ringan (< 512 MB RAM) agar optimal di Render Free Tier (`nalarofaceapi.onrender.com`). Cloudflare Worker dilengkapi validator Web Crypto HS256 (`workers/src/services/face-token.js`) untuk memverifikasi `verificationToken` saat `verificationMethod === 'face'` dengan fallback legacy aman jika `FACE_API_SECRET` belum diatur. Frontend (`FaceCheckInDialog.jsx`, `face-verification.js`, `ClassAttendance.jsx`, `attendance.service.js`) mengirim embedding ke Python API untuk mendapatkan token JWT 60 detik sebelum melakukan check-in ke Worker. Validasi lokal `npm run validate` lulus 100%: 33/33 tes frontend, 126/126 tes backend legacy, 74/74 tes Worker, 56 berkas Worker lolos syntax check, build Vite sukses, dan oxlint 0 error. Seluruh berkas Python lolos `compileall`. Belum commit, push, atau deploy produksi.

**Landing fotografi, 15 Oktober 2026:** perubahan GitHub ditarik fast-forward dari `f598f37` ke `a3ae259`. Landing kini memakai tiga foto guru/siswa Indonesia buatan imagegen (WebP 640/1280), copy yang menjelaskan kegiatan nyata, dan pratinjau seluruh 10 tema dari komponen kelas terbaru dengan data sintetis. Ilustrasi karakter landing lama dihapus; tampilan kelas dan handler auth tidak diubah. Build, 31 tes frontend, 95 keadaan layout sintetis, dan browser hasil build pada 320/390/768/1024/1440 px lulus; lint exit 0 dengan satu warning dependency hook bawaan `LivingWorldEngine.jsx`. Source `7b7003c` sudah di-push ke `origin/main` dan aktif pada deployment Pages `e6822f3a-d047-490f-a49a-3efb603c3523` (success, 15 Oktober 2026 pukul 20:01 WIB). Browser produksi pada lima viewport lulus tanpa runtime/HTTP error; kedua domain kustom juga menampilkan hero baru dan hash WebP yang sama.

**UI landing dan auth, 3 Oktober 2026:** desain editorial terang dengan ilustrasi buku, warna biru/sage/koral, alur scroll bertahap, contoh format kuis interaktif, serta catatan belajar fade pada auth selesai lokal. Logo/nama dipertahankan; handler auth, routing, layanan, dan backend tidak diubah. Lint/build, 26 tes frontend, dan 45 keadaan layout browser lokal 320/390/768/1024/1440 px lulus. Source UI `984d6fe` sudah di-push ke `pages/main` dan aktif di `https://nalaroclass.pages.dev` pada deployment `10479847-26ef-4c6a-8c6f-03c56f54ef9f`. CI validate dan Cloudflare Pages sukses. Browser produksi publik pada 390/1440 px lulus; login Firebase nyata belum diuji ulang.

**Tahap: RELEASE CANDIDATE.** Worker source `1cfb026` dan migrasi D1 `0013`/`0014` sudah diterapkan pada 3 Oktober dengan izin eksplisit pengguna. Route agenda produksi kini tersedia; alur terautentikasi patch terbaru dan deployment Pages terbaru belum diverifikasi ulang. Bukti browser produksi 2 Oktober tetap historis. Gate Live perangkat fisik, kamera/GPS, dan kapasitas masih terbuka. Audit source, bundle publik, dan perbaikan progres/agenda 3 Oktober ada di [laporan audit](nalaro-audit-2026-10-03.md); masih ada gap kuis, UX grading, dan benchmark Insights. Rincian release lama dan rollback ada di [laporan release Oktober](production-release-2026-10.md).

Patch unit rotation wajah, mode verifikasi presensi, dan snapshot nama kuis terlihat pada commit lokal `f4d95d4`, UX rekam/presensi wajah dan card pada `bbe0c95`, serta progres/agenda pada `1cfb026`. Pemeriksaan `git ls-remote pages refs/heads/main` 3 Oktober membuktikan remote Pages sudah pada `1cfb026dd65ad93816dc76263298ee33587ef68e`. Worker source terbaru kini aktif 100% pada versi `4b15b22e-f222-45fe-ac15-dac041e7dc3f`, terdeploy 3 Oktober pukul 14:15:35 UTC (21:15:35 WIB) dengan `--keep-vars`. D1 remote sudah sampai `0014`, tidak ada migrasi tertunda dan pelanggaran foreign key. Endpoint agenda produksi berubah dari HTTP 404 menjadi HTTP 401 `UNAUTHORIZED` tanpa login; health HTTP 200 dan CORS kedua alamat Pages lulus. Audit sebelumnya lulus lint/build, 26 tes frontend, 126 tes kompatibilitas backend legacy, 66 tes Worker/D1, syntax checks, dan browser materi/agenda lokal sintetis 320/1440 px. Pemeriksaan lanjutan mengulang 66 tes Worker, syntax 52 berkas, tujuh tes terarah, dan dry run deployment dengan hasil lulus. Firebase nyata, API terautentikasi patch terbaru, model/kamera/GPS nyata, dan perangkat fisik tidak diverifikasi ulang. Bukti release 2 Oktober tidak memverifikasi patch terbaru.

- Pemeriksaan bundle publik 3 Oktober: `nalaro.web.id` menayangkan `index-Bq4tkA-f.js` dengan API AWS; `nalaroclass.pages.dev` menayangkan `index-CEmCnQrr.js` dengan Worker. Worker `/health` HTTP 200 dan route Insights tanpa auth HTTP 401; Lambda lama route Insights HTTP 404. Kepemilikan akun/dashboard tidak diperiksa. Ini selaras dengan konfirmasi pengguna bahwa pengujian tadi dilakukan di Pages lama.

- PR #5/#6/#7 sudah diintegrasikan ke main. Source runtime final `d91d115` sudah di-push ke remote `url` dan `pages`; Pages membangun repo `khoirulzz/nalaroclass` branch main. Sepuluh variabel build API/AI/Firebase produksi dibandingkan dengan lokal dan cocok tanpa mencetak nilainya.
- Worker `nalaro-api` versi `4b15b22e-f222-45fe-ac15-dac041e7dc3f` aktif 100% dengan keep-vars. Migrasi D1 remote `0013_attendance_verification.sql` dan `0014_quiz_attempt_student_name.sql` berhasil diterapkan; tidak ada pending migration dan FK check bersih. Backup baru sebelum migrasi tersimpan lokal/ignored di `workers/.wrangler/release-backups/nalaro-before-agenda-20261003.sql`, berhasil dipulihkan di SQLite lokal dan direhearsal dengan kedua migrasi tanpa pelanggaran integrity/FK. Versi sebelumnya `247b0f1c-4018-428c-bf5b-ba3f294c67a6` menjadi acuan rollback Worker; migrasi additive tidak otomatis di-rollback.
- Pages https://nalaroclass.pages.dev sudah menayangkan aplikasi final pada deployment `f8b81d3a-7790-48a4-8d85-682aa597b577`. Commit dokumentasi/alat smoke berikutnya tidak mengubah bundle aplikasi; status deployment terbaru diperiksa setelah push akhir.
- API produksi lulus untuk LMS, role negatif, AI, Live socket 1 host + 4 pemain, rejoin/token rotation, receipt recovery, hasil D1/CSV, dan Learning Insights. Browser Chrome desktop/mobile viewport lulus untuk login, kelas, materi/diskusi, kuis, unggahan file nyata/tugas/nilai, presensi online, Bank Kuis, Insights, dan Live/reconnect/deadline/final result.
- Snapshot Live pending tidak masuk mastery/laporan, identitas publik tidak dicocokkan berdasarkan nama, dan anchor role D1 mencegah pergantian role lewat profil yang dibuat ulang.
- Kamera/GPS/ponsel fisik, browser Safari, serta load test di atas 4 pemain belum terukur. AWS legacy tetap ada; frontend produksi memakai Worker dan tidak ada AWS yang dihapus.

- CI repo Pages lulus. CI `hulumzz/Quizzy` tidak mulai karena GitHub mengunci akun akibat billing; pemulihan akun oleh pemilik diperlukan.
- Autentikasi OAuth Wrangler untuk akun Cloudflare aktif telah diverifikasi lokal pada 3 Oktober melalui executable proyek di `workers/node_modules`. Kredensial disimpan terenkripsi oleh Windows Credential Manager; login ini tidak mengubah Worker, D1, Pages, source, atau deployment.

## Riwayat pengerjaan

| Periode | Hasil yang dapat ditelusuri |
| --- | --- |
| 23–24 Sep 2026 | Fondasi React/Firebase, alur guru/siswa, kelas, materi, diskusi, presensi, kuis, AI, Cloudinary, serta handoff pengembangan. Backend awal memakai AWS; lihat histori Git dan [handoff 24 Sep](github-agent-handoff-2026-09-24.md). |
| 25–26 Sep 2026 | Pertemuan pembelajaran, tugas/pengumpulan/penilaian/revisi, kuis umum dan Bank Kuis, editor dan AI Assist, onboarding, dialog, loader, dan kompatibilitas model AI. Commit terakhir sebelum migrasi lokal adalah `856f447` (26 Sep). |
| 29 Sep 2026 | Runtime kuis satu soal per langkah, hasil guru, Nalaro Live, dan presensi wajah MVP. Lihat [batasan presensi wajah](face-attendance-mvp.md). |
| 29–30 Sep 2026 | Worker diperluas dari AI menjadi API LMS modular; D1 `0001`–`0008` dan Durable Object live dibuat. Service frontend diarahkan ke Worker, route inti diuji, Worker dideploy, dan origin Pages baru ditambahkan ke CORS. Proyek Pages `nalaroclass` dibuat pengguna. |
| 30 Sep 2026 | Audit ulang memastikan route inti ada, CORS baru merespons benar, dan gap fitur/validasi di bawah masih terbuka. Dokumen status hidup ini dibuat. |

## Inventaris fitur

`Ada di kode` berarti implementasi terlihat di source, bukan semua alurnya telah diuji di Pages.

| Area | Status saat ini | Acuan utama |
| --- | --- | --- |
| Login, profil, peran guru/siswa | Firebase Auth + role Firestore/D1. Anchor role, race guard, negative API smoke dan login guru/siswa browser produksi lulus | `workers/src/services/account-role.js`, `workers/src/middleware/auth.js`, `firestore.rules` |
| Kelas dan anggota | Buat, gabung, daftar, detail, dan daftar anggota ada. Informasi pengajar/anggota/status digabung dalam satu card; pola card konten dan tab aktif responsif lulus browser lokal sintetis 320?1440 px. Pengaturan anggota lanjutan belum ada | `workers/src/routes/classes.js`, `src/app/routes.jsx` |
| Materi, progres, bookmark, diskusi | Progres aktif per blok dan estimasi menit, autosave/retry/completion, upsert D1 monotonik, query daftar tanpa N+1, dan library berbasis keanggotaan lulus regresi/browser lokal. Patch backend terdeploy; PUT progress tanpa login HTTP 401, alur simpan akun siswa terbaru belum diuji produksi. Lampiran/video memakai alokasi estimasi, bukan parsing isi/durasi sebenarnya; diskusi tetap tersedia | `workers/src/repositories/material.repository.js`, `src/pages/MaterialReader.jsx`, `src/features/materials/reading-progress.js`, `workers/src/routes/discussions.js` |
| Agenda belajar | Kini memakai pertemuan dan tenggat tugas kelas aktif dalam WIB; akses guru/siswa, draf/publikasi, navigasi minggu dan error/retry lulus lokal. Worker terdeploy, route tanpa login HTTP 401 dan CORS lulus; tampilan/data agenda akun guru/siswa terbaru belum diuji produksi. Reminder/kalender pribadi/jam pertemuan belum ada | `workers/src/routes/agenda.js`, `workers/src/repositories/agenda.repository.js`, `src/components/dashboard/DashboardWidgets.jsx` |
| Pertemuan pembelajaran | Ada, termasuk pengaitan materi/kuis/presensi/tugas | `workers/src/routes/learning-sessions.js` |
| Presensi lokasi dan wajah | Rotation/mode/metode dan rekap tersedia. Verifikasi wajah kini didukung server-authoritative JWT dari Python API (`nalarofaceapi.onrender.com`); Worker memeriksa JWT dengan `FACE_API_SECRET` saat `verificationMethod === 'face'` dengan fallback legacy. Pipeline validate lokal lulus 100%; deployment Render/Worker/Pages dan pengujian perangkat nyata masih terbuka | `src/features/face/face-verification.js`, `src/pages/ClassAttendance.jsx`, `workers/src/routes/attendance.js`, `workers/src/services/face-token.js` |
| Kuis kelas dan kuis umum | Editor, publikasi, percobaan, penilaian, hasil, impor/ekspor ada. Snapshot nama self-paced kelas dan fallback attempt lama lulus regresi lokal setelah membership diubah/dihapus; backend dan migrasi 0014 terdeploy, alur terautentikasi patch terbaru belum diuji ulang | `workers/src/repositories/quiz.repository.js`, `workers/migrations/0014_quiz_attempt_student_name.sql`, `workers/src/routes/general-quizzes.js` |
| Tugas | Pengumpulan, lampiran, nilai, feedback, revisi, dan riwayat revisi ada | `workers/src/routes/tasks.js` |
| Bank Kuis | Publikasi katalog, salin sebagai draf, penarikan, impor/ekspor ada; moderasi/rating/analytics belum ada | `workers/src/routes/quiz-bank.js` |
| Nalaro Live | Terdeploy dan teruji produksi dengan socket 1 host + 4 pemain, receipt/reconnect, alarm deadline, hasil complete D1/CSV/Insights. Browser context dan viewport diuji; perangkat fisik dan kapasitas lebih besar belum | `workers/src/durable/LiveQuizRoom.js`, `workers/src/repositories/live-result.repository.js`, `src/pages/LiveQuizHost.jsx`, `src/pages/LiveQuizPlayer.jsx` |
| AI Assist | Gateway dan draf materi/kuis yang ditinjau guru ada; feedback penilaian di layanan AI belum terhubung sebagai alur UI tugas | `workers/src/routes/ai.js`, `workers/src/services/ai.js`, `src/components/AiAssistModal.jsx` |
| Learning Insights | Bukti release 2 Oktober API/browser dan regresi lokal 3 Oktober mendukung evidence/fairness/privacy. Route siswa Worker ada; 404 yang dilaporkan berasal dari Pages/API lama. Benchmark data besar dan browser terautentikasi pada Pages tujuan belum diperiksa ulang | `workers/src/repositories/learning-analytics.repository.js`, `src/pages/ClassAnalytics.jsx`, `docs/learning-insights.md` |

## Pekerjaan tersisa

### Landing publik, 15 Oktober 2026

- [x] Foto imagegen guru/siswa Indonesia, WebP responsif, penggantian karakter landing, dan copy produksi.
- [x] Semua 10 tema dari katalog terbaru memakai screenshot komponen kelas aktual dengan data contoh, bukan reka ulang warna/maskot.
- [x] Build, 31 tes frontend, 95 keadaan layout lokal, dan smoke browser hasil build pada lima viewport lulus. Navigasi auth diuji; login sungguhan dan perangkat fisik tidak diuji ulang.
- [x] Source `7b7003c` di-push ke main, Pages deployment `e6822f3a-d047-490f-a49a-3efb603c3523` sukses, browser landing produksi lima viewport lulus; domain kustom terverifikasi. Backend/D1 tidak termasuk rilis UI ini.

### UI landing dan auth 3 Oktober

- [x] Desain responsif, copy ringkas, ilustrasi lokal, fade catatan belajar, kontrol jeda/reduced motion, akses keyboard, dan contoh empat format soal.
- [x] Browser lokal dengan auth sintetis: 45 keadaan layout pada lima viewport; Google/email/daftar untuk guru dan siswa; tamu; role mismatch; validasi konfirmasi; pemulihan error Google. Tidak ada runtime error.
- [x] Source UI `984d6fe` di-push ke `pages/main`; deployment `10479847-26ef-4c6a-8c6f-03c56f54ef9f` sukses. Browser publik produksi 390/1440 px lulus: hero, contoh soal, navigasi login/beranda, pemilih siswa, kontrol Google/tamu dan kolom daftar, tanpa overflow horizontal atau runtime error.
- [ ] Login Google/Firebase nyata dan perangkat fisik belum diuji ulang oleh tugas UI ini.

### Gate cutover dan beta

- [x] Kedua repository disinkronkan; source/variabel build Pages cocok dengan Worker; deployment Pages sukses.
- [x] Browser produksi guru/siswa, kelas, materi/diskusi, kuis, tugas/nilai, presensi online, Bank Kuis, Insights, Live diuji. Transfer TXT nyata ke Cloudinary dan cleanup aset lulus.
- [x] Live 1 host + 4 browser context, reload, offline/socket reconnect, deadline tanpa host, hasil D1/CSV dan identitas/evidence API diperiksa.
- [x] Canonical, metadata berbagi, sitemap, dan header Pages menggunakan alamat produksi.
- [ ] Ulangi Live 1 host + 3-5 pemain pada perangkat fisik berbeda/jaringan nyata sebelum menyatakan release final READY. Viewport ponsel tidak menggantikan perangkat fisik.
- [ ] Uji kamera/GPS nyata jika presensi opsional itu digunakan; ukur kapasitas Live sebelum trafik lebih besar.
- [ ] Tentukan jadwal/prosedur penonaktifan AWS terpisah setelah cutover diterima; tidak ada penghapusan AWS pada pekerjaan ini.

### Patch Face Attendance dan histori nama 3 Oktober

- [x] Checkpoint A–D: konversi rotation, kontrak mode/metode presensi, UI guru/siswa/rekap, migrasi additive dan snapshot nama dari membership D1 selesai lokal.
- [x] Checkpoint E: lint/build/frontend/backend legacy/59 tes Worker/syntax check dan `git diff --check` lulus; D1 lokal berhasil dimigrasikan sampai `0014`.
- [x] Source patch terdahulu, UX dan progres/agenda sudah masuk `pages/main` pada `1cfb026`; Worker source terbaru aktif pada `4b15b22e-f222-45fe-ac15-dac041e7dc3f` dan migrasi remote `0013`/`0014` berhasil diterapkan 3 Oktober. Penerapan backend terverifikasi; deployment Pages terbaru dan alur browser tetap diperiksa terpisah.
- [ ] Setelah patch diterapkan, uji UI/browser/API ketiga mode, kamera allow/deny/retry, daftar/hapus/daftar ulang profil, wajah benar/salah, challenge, cahaya normal/redup, Chrome desktop/Android, serta GPS di dalam/luar radius pada perangkat nyata. Kalibrasi threshold dan gerakan lintas frame masih pekerjaan lanjutan; threshold tidak diubah.
- [ ] Cleanup kecil di `update.md` (questionOrder draft, Arrange touched, busy grading, benchmark Insights/CSP/model delivery) berada di luar patch ini.

### UX rekam wajah dan card 3 Oktober

- [x] Persetujuan sebelum kamera, satu tombol Rekam wajah, panduan otomatis depan/kanan/kiri/kembali depan, progres langkah, pose stabil lintas frame, timeout, pembatalan, retry, serta cleanup stream selesai di kode.
- [x] Presensi menjalankan depan/challenge arah acak/depan dan mencatat hadir otomatis setelah cocok; kegagalan pencatatan membutuhkan retry eksplisit. Pengaturan wajah wajib serta GPS server tetap berlaku.
- [x] Card kuis umum/kelas, Bank Kuis, tugas, diskusi memakai `ContentCard`; perbaikan tipografi/caption/ikon/aksi dan card materi/filter/riwayat diterapkan. Pengajar/anggota/status memakai satu `ClassSummary`; tab aktif otomatis terlihat pada nav yang dapat digeser.
- [x] Lint, build, 19 tes frontend, syntax smoke script, dan browser lokal sintetis: 10 halaman ? 4 viewport, tambahan enam halaman mode guru pada 320/1440 px, serta alur rekam/presensi/camera-deny/cancel/retry lulus.
- [ ] Source pembaruan UX sudah ada pada remote Pages `1cfb026`; verifikasi deployment Pages terbaru, browser terautentikasi terhadap API/Firestore nyata, dan kamera/model/GPS Android/iOS/desktop nyata. Kalibrasi arah/threshold/gerak dan batas anti-spoof MVP tetap memerlukan perangkat nyata.

### Fitur dan pengembangan lanjutan

- [x] Hubungkan agenda ke pertemuan dan tenggat tugas kelas aktif; implementasi dan regresi/browser lokal lulus 3 Oktober. Worker terbaru sudah deploy dan route tersedia; kalender pribadi/reminder/jam pertemuan tetap pengembangan lanjutan.
- [x] Backup D1, terapkan migrasi remote `0013`/`0014`, deploy Worker source `1cfb026` dengan `--keep-vars`, lalu cek route agenda/health/CORS. Agenda tidak membutuhkan migrasi baru; push Pages saja tidak memperbarui Worker.
- [ ] Verifikasi deployment Pages akun tujuan dan alur agenda/progres/completion terautentikasi setelah backend diperbarui. Samakan API/AI/Firebase, repo/branch build, dan domain. Source sudah di-push ke `pages/main` pada `1cfb026`; deployment Pages tidak dijalankan oleh tugas backend ini.
- [x] Persist `questionOrder` draft kuis agar reload tidak mengacak ulang; pisahkan jawaban awal Arrange dari status sudah disentuh/dikonfirmasi (selesai 4 Oktober 2026).
- [x] Ubah indikator grading dari satu `busy` global menjadi status per siswa (selesai 4 Oktober 2026); benchmark Learning Insights dan CSP masih terbuka.
- [ ] Analisis isi/durasi sebenarnya PDF/Office/video jika estimasi lampiran yang presisi diperlukan. Saat ini estimasi isi teks dimuat ditambah alokasi media yang dijelaskan pada UI.
- [ ] Sesuaikan canonical/OG/sitemap setelah domain produksi pada Pages akun baru ditetapkan; saat ini masih `nalaroclass.pages.dev`.
- [ ] Tambahkan pengaturan anggota kelas lanjutan bila diperlukan, misalnya mengeluarkan anggota atau mengubah hak akses; route sekarang baru menyediakan daftar anggota.
- [ ] Pengembangan setelah beta: laporan progres guru, notifikasi/jadwal, rubrik tugas, moderasi/pencarian/rating Bank Kuis, dan preview PPT/PPTX hasil konversi. Ini roadmap, bukan syarat untuk menyatakan API inti sudah bermigrasi.

## Bukti validasi dan batasnya

- [Status migrasi Cloudflare](cloudflare-backend-migration-status.md) mencatat `npm.cmd run validate`, 23 tes Worker, dry run Worker, smoke test, serta uji API produksi terautentikasi pada pengerjaan sebelumnya. Bila tes diulang, tulis tanggal dan hasil aktual pada riwayat di bawah.
- `.github/workflows/validate.yml` menjalankan lint, build, serta tes pada push/PR `main`; workflow itu tidak deploy Worker atau AWS. Pages yang terhubung ke GitHub lain memiliki jalur deploy tersendiri.
- HTTP/CORS dan tes otomatis tidak menggantikan uji UI browser, transfer Cloudinary nyata, perangkat kamera/lokasi, atau uji beban live.

## Riwayat perubahan

### 19 Okt 2026 - Migrasi Presensi Wajah ke Python Face API (Render)

- **Latar Belakang & Masalah:** Audit arsitektur presensi menemukan bahwa pencocokan wajah sebelumnya berlangsung 100% di browser tanpa bukti kriptografis ke backend (`verificationMethod: 'face'` hanya trust signal client). Selain itu, bundle detector model di client cukup berat. Sesuai instruksi, presensi wajah ditingkatkan dengan menghubungkan ke backend Python mandiri yang di-host pada Render Free Tier (`nalarofaceapi.onrender.com`).
- **Python Face API (`nalaro-face-api/`):**
  - Dibuat di repositori mandiri `../nalaro-face-api` terpisah dari Quizzy.
  - Menggunakan FastAPI, PyJWT, NumPy, dan Firebase Admin SDK.
  - Membandingkan embedding numerik (512 dimensi dari scan panduan browser) terhadap profil tersimpan di Firestore menggunakan Cosine Similarity murni di NumPy. Desain ini menjaga pemakaian memori server sangat rendah (< 100 MB), bebas dari model deep learning berat di server, dan sangat cocok untuk limitasi 512 MB RAM Render Free Tier.
  - Tidak ada transmisi atau penyimpanan foto/video mentah di server Python (privasi biometrik terjaga).
  - Mengeluarkan JWT token bertanda tangan HS256 (`verificationToken`, valid 60 detik) yang memuat klaim `uid`, `attendanceId`, `classId`, dan `similarity`.
  - Berkas: `main.py`, `services/firebase_service.py`, `services/face_verifier.py`, `services/token_service.py`, `requirements.txt`, `Procfile`, `.python-version`, `.env.example`, `README.md`, `tests/test_face_verifier.py`, `tests/test_token_service.py`. Seluruh berkas Python tervalidasi `python -m compileall -q .` tanpa error sintaks.
- **Cloudflare Worker:**
  - Menambahkan modul `workers/src/services/face-token.js` untuk memverifikasi JWT HS256 secara lokal menggunakan Web Crypto API standar (`crypto.subtle`) tanpa dependensi Node.js eksternal.
  - Menambahkan validasi `verificationToken` di `workers/src/validation/attendance.js`.
  - Endpoint `POST /classes/:classId/attendance/:attendanceId/check-in` di `workers/src/routes/attendance.js` mewajibkan `verificationToken` valid jika `verificationMethod === 'face'`. Menyediakan fallback aman (warning log) apabila `FACE_API_SECRET` belum disetel di environment, sehingga deployment berjalan mulus tanpa breaking change.
  - Menambahkan pengujian `workers/test/face-token.test.js` dan kasus uji token di `workers/test/attendance.test.js`.
- **Frontend Quizzy:**
  - Memperbarui `src/features/face/face-verification.js` dengan fungsi `requestFaceVerification()` yang mengirim embedding wajah dan Firebase ID Token ke `https://nalarofaceapi.onrender.com/verify-face`.
  - Memperbarui `src/features/face/FaceCheckInDialog.jsx` untuk memanggil API Python setelah scan panduan selesai, dan meneruskan `verificationToken` ke callback `onVerified`.
  - Memperbarui `src/pages/ClassAttendance.jsx` dan `src/services/attendance.service.js` agar meneruskan `verificationToken` ke endpoint Worker check-in.
  - Menambahkan variabel `VITE_FACE_API_URL=https://nalarofaceapi.onrender.com` pada `.env.example` dan `.env`.
  - Menambahkan pengujian `src/features/face/face-verification.test.js`.
- **Validasi Aktual yang Berhasil Dijalankan:**
  - `npm run lint`: exit code 0 (0 error, 1 pre-existing warning di `LivingWorldEngine.jsx`).
  - `npm run build`: Vite build sukses (11.17 detik).
  - `npm run test:frontend`: 33/33 PASS (termasuk tes error mapping face verification).
  - `npm run test:backend`: 126/126 PASS.
  - `npm run test:workers`: 74/74 PASS (termasuk 6 tes verifikasi token Web Crypto dan validasi skema).
  - `npm --prefix workers run check`: 56 berkas Worker/script lolos syntax check.
  - `npm run validate`: seluruh rangkaian validasi lulus penuh (exit code 0).
  - `git diff --check`: PASS tanpa whitespace/line-ending error.
  - Python `compileall`: PASS (100% modul terkompilasi bersih).
- **Status Komit & Deployment:** Kode telah selesai diimplementasikan dan tervalidasi 100% lokal di working tree. Belum di-commit, di-push, atau dideploy ke Render/Cloudflare Worker/Pages.

### 15 Okt 2026 - Landing fotografi Indonesia dan pratinjau 10 tema terbaru

- `git pull --ff-only origin main` menarik empat commit terbaru hingga `a3ae259` dari `khoirulzz/nalaroclass`; perubahan lokal lama di dokumen status dipertahankan dan tidak disertakan ke commit tugas ini.
- Tiga foto buatan imagegen menggambarkan guru mendampingi siswa, persiapan guru, dan diskusi siswa Indonesia. Enam WebP responsif di `public/images/landing/`; prompt, asal aset, dan cara regenerasi tercatat pada `docs/landing-image-assets.md`. Foto digunakan pada hero dan section materi/diskusi/kuis/guru; karakter SVG landing lama dihapus. Ikon antarmuka dan preview produk tetap digunakan.
- `WorldShowcase.jsx` membaca seluruh 10 tema `CLASS_THEMES`. Screenshot `public/images/class-themes/` memakai `ClassThemeScope`, `ClassOverview`, navigasi, summary/Card, dan artwork asli dari baseline `a3ae259`, dengan data contoh serta reduced motion. Tidak membaca data kelas produksi. Capture dapat diulang melalui `workers/scripts/capture-landing-themes.mjs`.
- Copy hero, fitur, caption, contoh soal, CTA, dan footer dibuat lebih langsung. Layout foto, pilihan tema, dan section mengikuti mobile/desktop melalui `src/styles/landing-photos.css`; handler auth, route, layanan, dan backend tidak berubah.
- Validasi aktual: `npm.cmd run build` PASS (peringatan ukuran chunk aplikasi lama); `npm.cmd run test:frontend` 31/31 PASS; lint exit 0 dengan satu warning dependency hook bawaan `LivingWorldEngine.jsx`; syntax check tiga script dan `git diff --check` PASS. `smoke-public-ui.mjs`: 95 keadaan layout pada 320/390/768/1024/1440 px, 10 tema, foto terdecode, tiga panel cerita, empat format soal, auth sintetis dan handler tetap lulus, tanpa overflow atau runtime error. `smoke-landing-production.mjs` terhadap build lokal `127.0.0.1:4173` lulus pada lima viewport, termasuk anchor desktop dan navigasi masuk; screenshot desktop/mobile diperiksa.
- Tujuan Pages diverifikasi read-only di akun aktif: proyek `nalaroclass`, source `khoirulzz/nalaroclass`, branch `main`, domain `nalaroclass.pages.dev`, `class.nalaro.digital`, dan `nalaro.web.id`; sebelum rilis canonical source `a3ae259` sukses. Status tugas saat entri dibuat: siap commit/push; deployment dan browser produksi belum diverifikasi. Worker, D1, AWS, login Firebase sungguhan, dan perangkat fisik tidak diuji/diubah oleh tugas landing ini.
- Bukti rilis akhir: commit aplikasi `7b7003cce6e69d7bf13ec97baa957eb1459cb485` berhasil di-push ke `origin/main`; canonical deployment `e6822f3a-d047-490f-a49a-3efb603c3523` berstatus success pada 15 Oktober 2026 pukul 20:01 WIB. `smoke-landing-production.mjs` pada `https://nalaroclass.pages.dev` PASS untuk 320/390/768/1024/1440 px, seluruh 10 tema per viewport, foto terdecode, empat format kuis, tiga panel cerita, anchor desktop dan navigasi auth; tanpa overflow, HTTP aset gagal, atau runtime error. Screenshot produksi mobile/desktop diperiksa. `class.nalaro.digital` dan `nalaro.web.id` memberi HTTP 200 dari browser, menampilkan hero baru, dan hash SHA-256 WebP sama dengan source commit. Bukti tersimpan lokal/ignored pada `workers/.wrangler/landing-production-artifacts/`. Pemeriksaan status commit GitHub tidak mengembalikan status CI; tidak ada klaim workflow Actions lulus dari tugas ini. Catatan final dirilis melalui commit dokumentasi terpisah; bundle aplikasi tidak berubah.

### 13 Okt 2026 - Sinkronisasi perubahan remote GitHub (Studio Guru & Lima Tema Kelas)

- Mengambil dan menggabungkan pembaruan dari remote `origin/main` (`khoirulzz/nalaroclass`) yang mencakup commit `9c88f7d` ("Add teaching studio and teacher workflow updates") dan `f598f37` ("feat: NalaroClass five classroom worlds and interactive editorial landing").
- Fitur & pembaruan yang tersinkron:
  - **Studio Guru (`TeacherStudio.jsx`, `studio.css`, rute `/teacher/studio`)**: Ruang kerja dan dashboard persiapan/pengajaran guru beserta penambahan link navigasi dan widget.
  - **Lima tema dunia kelas (`classic`, `space`, `fantasy`, `nature`, `ocean`)**: Komponen `ClassThemeScope.jsx`, maskot SVG orisinal (`ThemeMascot.jsx`), `ThemePicker.jsx`, `classThemes.js`, `class-themes.css`, dan migrasi D1 Cloudflare `0020_class_theme.sql` dengan pembatasan hak edit hanya untuk pemilik kelas (owner).
  - **Halaman landing editorial interaktif**: Komponen `RealClassroomStory.jsx`, `ClassroomEditorialArt.jsx`, `WorldShowcase.jsx`, dan styling `landing-story.css`.
  - **Perbaikan kuis & tugas**: Runtime kuis (`runtime.js`, `runtime.test.js`, `QuizAttempt.jsx`) dan penanganan status simpan nilai / pengumpulan tugas (`TaskDetail.jsx`).
  - **Backend & Worker**: Pembaruan fixture D1 `d1-fixture.js`, penyesuaian Live room test `live-room.test.js`, dan konfigurasi observabilitas di `wrangler.json`.
- Berkas penting: 43 berkas termodifikasi/baru (antara lain `src/pages/teacher/TeacherStudio.jsx`, `src/components/classroom/ClassThemeScope.jsx`, `src/components/classroom/ThemeMascot.jsx`, `workers/migrations/0020_class_theme.sql`, `workers/src/repositories/class.repository.js`, `workers/test/classes.test.js`).
- Validasi lokal yang dijalankan setelah sinkronisasi:
  - `npm run test:frontend`: 28/28 lulus.
  - `npm run test:workers`: 67/67 lulus.
  - `npm run test:backend`: 126/126 lulus.
  - `npm --prefix workers run check`: 53 berkas Worker terverifikasi tanpa error syntax.
  - `npm run lint` & `npm run build`: lulus tanpa error (Vite build sukses 29.03 detik).
- Status commit/push/deploy: Branch lokal `main` telah di-fast-forward ke `f598f37`. Belum ada push atau deploy produksi baru dari sesi lokal ini.

### 4 Okt 2026 - STEP 5 cleanup: questionOrder, Arrange touched, scoped grading busy

- Ruang lingkup: perbaikan kecil kuis siswa dan grading guru tanpa perubahan backend/Worker/D1/Firestore.
- **STEP 5A – Persist questionOrder draft**: Urutan soal teracak kini disimpan ke sessionStorage sebagai `questionOrder` bersama `answers`. Saat siswa reload tab, `useMemo` membaca urutan tersimpan sehingga soal tidak diacak ulang. Jika kuis diedit setelah draft tersimpan, soal baru yang tidak ada di urutan lama ditambahkan di akhir. Shuffle awal memakai `crypto.getRandomValues` seperti sebelumnya.
- **STEP 5B – Pisahkan Arrange "touched"**: `initialiseArrangeAnswers` selalu mengisi nilai awal Arrange sebagai array acak. Sebelumnya `answered()` menganggap semua Arrange sudah dijawab karena `value.length > 0` selalu benar. Sekarang ditambah state `touchedArrangeIds: Set<string>` yang diisi hanya ketika siswa secara eksplisit menggeser item. `answered()` menerima `questionType` dan `touchedIds`; Arrange hanya dianggap terjawab bila `touchedIds.has(questionId)`. State ini ikut dipersistenkan ke draft sehingga survive reload.
- **STEP 5C – Scoped busy state grading tugas**: `TaskDetail.jsx` mengganti satu `busy` state global menjadi `submitBusy` (boolean, untuk form pengumpulan siswa) dan `gradingBusy` (objek `{ [studentId]: true }`). Fungsi `isGradingBusy(studentId)` membaca per-siswa; pada render map tiap card mendapat variabel lokal `busy = isGradingBusy(item.studentId)`. Grading satu siswa tidak mengunci tombol siswa lain.
- Berkas: `src/pages/QuizAttempt.jsx`, `src/pages/TaskDetail.jsx`, `src/features/quiz/runtime.test.js`.
- Validasi: `npm.cmd run validate` — **30/30 frontend** (termasuk 6 tes runtime baru), **126/126 backend legacy**, **66/66 Worker**, lint tanpa warning, build sukses, syntax check 53 Worker files lulus. `git diff --check` hanya CRLF warning normal di Windows. Exit code 1 pada `npm run validate` berasal dari peringatan Vite chunk besar (pre-existing) yang di-redirect melalui PowerShell `2>&1`; bukan kegagalan tes baru.
- Batas bukti: tidak ada uji browser terautentikasi, kamera/GPS, atau perangkat fisik untuk patch ini. Draft baru tidak kompatibel dengan draft sessionStorage lama (schema berbeda: `questionOrder` dan `touchedArrangeIds` tidak ada di draft lama) — draft lama hanya diabaikan dan digenerasi ulang, jawaban non-Arrange tetap terbaca dari field `answers`.
- Status commit/push/deploy: belum; perlu instruksi eksplisit.

### 3 Okt 2026 - Rombak UI landing dan auth

- Ruang lingkup hanya UI/UX publik. Hero memakai tipografi editorial dan ilustrasi buku SVG lokal; narasi belajar memakai kolom sticky desktop, lembar berwarna, reveal saat scroll, daftar fitur, dan contoh format soal yang dapat dipilih. Mobile memakai alur vertikal.
- Auth memakai pemilih Guru/Siswa ringkas, Google mark, form yang tetap utama, dan tiga catatan belajar orisinal berganti fade. Tidak memakai testimoni atau angka pengguna rekaan. Kontrol jeda dan reduced motion tersedia. Login, register, tamu, pemeriksaan peran dan semua handler auth tetap identik dengan source sebelum perubahan.
- Berkas: `src/pages/Landing.jsx`, `src/pages/Auth.jsx`, `src/components/LearningArtwork.jsx`, `src/styles/landing.css`, `workers/scripts/smoke-public-ui.mjs`. Styles terbatas pada halaman publik; tidak ada perubahan konfigurasi, dependensi, API, Worker, D1, atau route.
- Validasi: `npm.cmd run lint`, `npm.cmd run build`, 26 tes `npm.cmd run test:frontend`, `node --check workers/scripts/smoke-public-ui.mjs`, dan `git diff --check` lulus. Smoke browser Chrome headless lokal lulus 45 keadaan layout pada 320/390/768/1024/1440 px, enam kombinasi metode/peran auth, tamu, penolakan role mismatch, konfirmasi tidak sama, pemulihan gagal Google, fade/pause, reduced motion dan skip link keyboard. Perbandingan source membuktikan handler tidak berubah. Screenshot desktop/mobile ditinjau; reveal scroll normal juga diperiksa. Artefak ada di `workers/.wrangler/public-ui-artifacts/` (ignored).
- Batas: layanan auth disimulasikan untuk smoke lokal; belum menguji login Firebase/Google nyata atau perangkat fisik. Build masih melaporkan peringatan chunk besar yang sudah ada pada dependensi aplikasi.
- Pengiriman: commit UI `984d6fe4775a5b0288f222b48df023945c55e653` berhasil di-push hanya ke `pages/main`. Deployment produksi `10479847-26ef-4c6a-8c6f-03c56f54ef9f` dan GitHub CI `validate` berstatus completed/success. HTML publik memuat `index-DqYiasM0.js`, sama dengan build lokal. Browser `https://nalaroclass.pages.dev` pada 390/1440 px lulus untuk hero baru, contoh hotspot, navigasi login/beranda, pilihan Siswa, kontrol Google/tamu, dan kolom pendaftaran; tidak ada overflow horizontal/runtime error. Tidak ada login atau pembuatan akun nyata yang dikirim.
- Pembaruan bukti ini disimpan pada commit dokumentasi terpisah dengan `[skip ci]`; tidak mengubah bundle aplikasi. Perubahan dokumen status yang sudah ada sebelum tugas dipertahankan terpisah di working tree.

### 3 Okt 2026 - Backup D1, migrasi dan deployment perbaikan agenda

- Pengguna memberi izin eksplisit untuk backup, kedua migrasi remote dan deployment Worker, serta menyatakan sudah login Wrangler. Menggunakan executable lokal dengan target `workers/wrangler.json`, Worker `nalaro-api` dan D1 `nalaro`; source aplikasi tetap commit `1cfb026`.
- `wrangler d1 export nalaro --remote --output .wrangler/release-backups/nalaro-before-agenda-20261003.sql --skip-confirmation` berhasil. Backup 23.268 byte tersimpan ignored; SHA-256 dicatat lokal. Backup berhasil dipulihkan pada SQLite in-memory, integrity `ok`, pelanggaran FK 0; kedua migrasi berhasil direhearsal pada salinan backup dengan integrity `ok` dan FK 0. Tidak ada isi data pengguna, link ekspor sementara atau kredensial ditulis pada dokumen ini.
- `wrangler d1 migrations apply nalaro --remote` berhasil menerapkan `0013_attendance_verification.sql` dan `0014_quiz_attempt_student_name.sql`. Pemeriksaan remote setelahnya: tidak ada pending migration, ketiga kolom `verification_mode`, `verification_method`, `student_name` tersedia, serta jumlah pelanggaran FK 0.
- `wrangler deploy --keep-vars` berhasil: Worker versi `4b15b22e-f222-45fe-ac15-dac041e7dc3f`, dibuat 3 Oktober 2026 pukul 14:15:35 UTC / 21:15:35 WIB, aktif 100% menurut `wrangler deployments list --json`. Startup 4 ms; Dashboard-managed variables dipertahankan dengan `--keep-vars`. Versi sebelumnya `247b0f1c-4018-428c-bf5b-ba3f294c67a6` tetap acuan rollback kode; migrasi additive tidak dihapus.
- Validasi HTTP produksi: health 200; GET agenda tanpa login 401 `UNAUTHORIZED`, menggantikan 404 sebelumnya; origin `nalaro.web.id` dan `nalaroclass.pages.dev` mengembalikan CORS yang tepat pada GET/OPTIONS (401/204); origin asing OPTIONS ditolak 403. Route Insights siswa dan PUT progress materi tanpa login merespons 401. Sembilan pemeriksaan HTTP/assertion lulus; ini membuktikan route/auth/CORS tersedia, bukan pembacaan agenda atau penyimpanan progress dengan akun nyata.
- Berkas penting: `workers/wrangler.json`, migrasi `0013`/`0014`, `workers/src/index.js`, route agenda/materials/Insights, backup dan metadata deployment ignored, serta `docs/nalaro-project-status.md`. Parse metadata CLI pertama gagal karena redirection PowerShell menghasilkan UTF-16; parser diperbaiki sesuai BOM dan verifikasi versi aktif lulus. Tidak ada perubahan source aplikasi atau konfigurasi, dan entri dokumentasi/login yang sudah ada dipertahankan.
- Validasi lokal sebelumnya tetap menjadi bukti kode: 66 tes Worker, tujuh tes terarah, syntax 52 berkas dan dry run lulus sebelum deployment. Tidak diulang tanpa perubahan source. `git diff --check` diperiksa pada akhir tugas. Tidak ada uji browser terautentikasi, kamera/GPS/perangkat fisik atau beban baru.
- Commit/push: tidak dilakukan oleh tugas ini; source push pengguna sebelumnya `1cfb026` terverifikasi. Deploy Worker dan migrasi remote berhasil; Pages tidak dideploy ulang, AWS/domain/secrets tidak diubah. Dokumentasi status diperbarui lokal. Pekerjaan tersisa: verifikasi UI akun guru/siswa pada Pages tujuan dan gate perangkat/kapasitas terpisah.

### 3 Okt 2026 - Diagnosis agenda 404 setelah push Pages

- Membandingkan source commit `1cfb026`, remote `pages/main`, endpoint publik, deployment Worker aktif dan daftar migrasi D1 remote. Route agenda terdaftar di `workers/src/index.js`, sedangkan API produksi `/learning/agenda?from=2026-09-28&to=2026-10-04` mengembalikan HTTP 404 dengan kode `NOT_FOUND` dan pesan `Rute tidak ditemukan.`; `/health` HTTP 200. Ini membuktikan route belum tersedia pada Worker live, bukan sekadar agenda tanpa data.
- `pages/main` sudah pada `1cfb026dd65ad93816dc76263298ee33587ef68e`. `wrangler deployments list` menunjukkan versi aktif 100% `247b0f1c-4018-428c-bf5b-ba3f294c67a6`, dibuat 1 Oktober 2026 pukul 18:22:51 UTC. Workflow `.github/workflows/validate.yml` hanya validasi dan tidak deploy Worker. Deployment Pages terbaru belum diperiksa ulang.
- `wrangler d1 migrations list nalaro --remote` menunjukkan `0013_attendance_verification.sql` dan `0014_quiz_attempt_student_name.sql` belum diterapkan. Keduanya additive untuk patch presensi/snapshot nama terdahulu, diperlukan oleh source Worker terbaru; agenda sendiri tidak menambah migrasi dan migrasi tertunda bukan penyebab HTTP 404 route.
- Berkas penting yang diperiksa: `workers/wrangler.json` (target `nalaro-api` dan D1 `nalaro`), `workers/src/index.js`, `workers/src/routes/agenda.js`, dua migrasi di atas, serta `.github/workflows/validate.yml`. Tidak ada perubahan source aplikasi atau infrastruktur. Entri login Wrangler dan perubahan dokumentasi pengguna tetap dipertahankan.
- Validasi aktual: tujuh tes terarah agenda/progres D1 lulus; `npm.cmd run test:workers` 66/66 PASS; `npm.cmd --prefix workers run check` memeriksa 52 berkas; Wrangler lokal `deploy --dry-run --keep-vars --outdir .wrangler/agenda-deploy-preview` lulus dan artefak disimpan ignored. Tidak ada tes browser baru atau API produksi terautentikasi. `git diff --check` diperiksa pada akhir tugas.
- Commit/push/deploy oleh tugas ini: belum ada; hanya dokumentasi diperbarui. Push source pengguna terverifikasi seperti di atas. Backup baru, migrasi remote dan deployment Worker belum dijalankan; menunggu instruksi eksplisit sesuai `update.md` sebelum mutasi produksi. Langkah penerapan yang disiapkan: backup D1, migrasi `0013`/`0014`, deploy Worker dengan `--keep-vars`, lalu cek health/route/CORS dan alur agenda terautentikasi.

### 3 Okt 2026 - Login Wrangler sebelum push

- Menjalankan `npm.cmd --prefix workers exec -- wrangler login --device --use-keyring` memakai Wrangler lokal versi 4.144.0. OAuth Device Authorization Grant disetujui pengguna; `npm.cmd --prefix workers exec -- wrangler whoami` berhasil memverifikasi sesi pada akun Cloudflare aktif, tanpa menulis token atau identitas akun ke dokumen ini.
- Berkas penting: `workers/node_modules/.bin/wrangler.cmd` dipakai sebagai executable lokal; tidak ada perubahan konfigurasi, paket, Worker, D1, Pages, ataupun source aplikasi.
- Validasi aktual: `wrangler whoami` sukses. Tidak ada lint, build, tes aplikasi, migration, atau pemeriksaan browser/produksi yang dijalankan karena tugas hanya autentikasi CLI.
- Commit/push/deploy: belum ada; login tidak melakukan push ataupun deploy. Patch progres/agenda yang sudah ada di working tree tetap tidak disentuh.

### 3 Okt 2026 - Audit Cloudflare, progres materi otomatis dan agenda nyata

- Pengguna menegaskan migrasi backend Cloudflare penuh; error tadi berasal dari Pages akun lama. Audit bundle publik membedakan `nalaro.web.id` (AWS lama) dan `nalaroclass.pages.dev` (Worker). Tidak ada perubahan AWS, akun/dashboard, domain atau deployment. Route Insights Worker merespons 401 tanpa auth, Lambda lama 404; Worker health 200. Tidak ada uji akun produksi terautentikasi baru.
- Reader kini menghitung estimasi kata/menit dan alokasi media, menambah progres dari waktu aktif pada bagian blok yang terlihat, pause hidden/unfocused/idle, serta menyimpan setiap 5 detik dengan antrean/retry/keepalive. Maksimal otomatis 99%; tombol selesai mengirim 100 dan menunggu sukses. D1 mempertahankan persentase maksimum dan tanggal selesai pertama sehingga respons terlambat tidak menurunkan progres. Daftar 100 materi siswa memakai maksimal tiga query termasuk pemeriksaan akses; library mengabaikan keanggotaan yang dicabut.
- Agenda dashboard guru/siswa mengambil pertemuan/tenggat tugas dari Worker dengan filter kelas aktif, akses, publikasi dan tanggal WIB, batas 31 hari/100 agenda, navigasi minggu, loading/empty/error/retry. Ini bukan reminder/kalender pribadi atau jadwal jam pertemuan. Build menolak API AWS/HTTP agar konfigurasi lama tidak lolos build baru. Isi PDF/Office dan durasi video sebenarnya belum dianalisis.
- Audit menyisakan questionOrder draft setelah reload, status Arrange touched, indikator grading per siswa, benchmark Insights, anggota lanjutan, domain/metadata tujuan, serta gate fisik Live/kamera/GPS. Rincian bukti dan batas fitur: `docs/nalaro-audit-2026-10-03.md`.
- Berkas utama: `src/features/materials/reading-progress.js`, `reading-progress.test.js`, `hooks/useReadingProgress.js`, `MaterialBlocks.jsx`, `src/pages/MaterialReader.jsx`, `src/services/api.js`, `material.service.js`, `workers/src/repositories/material.repository.js`, `agenda.repository.js`, `workers/src/routes/agenda.js`, `workers/src/index.js`, `src/services/agenda.service.js`, `src/features/agenda/calendar.js`, `src/components/dashboard/DashboardWidgets.jsx`, `StudentDashboard.jsx`, CSS, `config/backend-target.js`, `vite.config.js`, tes D1 dan `workers/scripts/smoke-learning-local.mjs`.
- Validasi: 14/14 regresi terarah; `npm.cmd run validate` lulus lint/build, 26/26 frontend, 126/126 backend legacy compatibility, 66/66 Worker dan syntax checks. Browser Chrome lokal dengan fixture membuktikan progres >5%, estimasi, pause hidden, selesai/reload, gagal/retry, agenda/link per role/navigasi/loading/error serta layout 320/1440 px; runtime errors 0. Screenshot diperiksa lokal/ignored. `git diff --check` diperiksa pada akhir tugas. Tidak ada validasi API/Firebase/Cloudinary terautentikasi, kamera/GPS/perangkat nyata atau produksi patch.
- Commit/push/deploy: patch ini belum commit/push/deploy; berada di working tree di atas `bbe0c95`. Tidak ada migrasi baru. Status remote/push/deploy `bbe0c95` tidak diperiksa; penerapan Worker dan Pages tetap dua langkah terpisah.

### 3 Okt 2026 - Rekam/presensi wajah otomatis dan konsistensi card

- Persetujuan dipindahkan ke halaman profil sebelum akses kamera. Satu tombol `Rekam wajah` menjalankan kamera, warm-up model, pose depan ? kanan ? kiri ? depan, lalu menyimpan otomatis. Sampel numerik yang disimpan berasal dari pose depan; pose putar hanya menjadi langkah panduan. Setiap pose memerlukan sedikitnya tiga frame selama 700 ms dengan pemeriksaan kualitas dan konsistensi wajah; setiap langkah dibatasi 35 detik. Threshold matching tetap 0,72 dan Human liveness/antispoof tidak diaktifkan.
- Presensi kini memakai satu tombol mulai: pose depan, challenge kiri/kanan acak, kembali depan, lalu submit. Error save/submit menyediakan retry eksplisit; mode wajib memakai label Batal. Pembatalan/unmount menghentikan loop dan stream, termasuk izin kamera yang baru selesai setelah dialog ditutup. Run lama tidak menghentikan stream run baru; panggilan detector diserialkan. Validasi lokasi/mode/metode server tidak diubah.
- `ContentCard` menyamakan wadah ikon, badge, hierarki judul, cuplikan deskripsi tiga baris, metadata yang dapat membungkus, dan aksi di bagian bawah. Dipakai pada hub kuis, kuis umum/kelas, Bank Kuis, tugas, dan diskusi. Caption, card materi, filter/publikasi Bank Kuis, serta riwayat Live diperbaiki; CSS grid/flex yang sebelumnya menargetkan wrapper kini menargetkan body Card. `ClassSummary` menyatukan pengajar/anggota/status untuk siswa dan guru; kode undangan guru tetap tersedia. Nav kelas menggeser tab aktif agar terlihat tanpa menggulir halaman.
- Berkas penting: `src/features/face/guided-face-scan.js`, `guided-face-scan.test.js`, `useGuidedFaceScan.js`, `FaceScanner.jsx`, `face-engine.js`, `FaceCheckInDialog.jsx`, `src/pages/student/FaceProfile.jsx`, `ClassAttendance.jsx`, `src/components/ui/ContentCard.jsx`, `src/components/classroom/ClassSummary.jsx`, `ClassWorkspaceNav.jsx`, halaman daftar terkait, `src/styles/content-cards.css`, `face-scanner.css`, `src/index.css`, `package.json`, dan `workers/scripts/smoke-ux-local.mjs`.
- Validasi aktual: `npm.cmd run lint` tanpa warning, `npm.cmd run build`, `npm.cmd run test:frontend` (19 PASS), `node --check workers/scripts/smoke-ux-local.mjs`, dan `git diff --check` lulus. Browser Chrome headless lokal memeriksa 10 halaman pada 320/390/768/1440 px (40 kombinasi) dan enam halaman mode guru pada 320/1440 px (12 kombinasi tambahan), tidak ada overflow horizontal, bagian card bertumpuk, isi keluar card, atau tab aktif terpotong; screenshot diperiksa untuk ringkasan, diskusi, tugas, hub kuis, dan pemindai. Alur persetujuan ? rekam ? simpan tepat sekali, izin ditolak, error scan/save, retry, batal saat scan/izin tertunda, cleanup track, wajah wajib ? presensi tepat sekali, serta error submit ? retry lulus dengan 0 runtime error.
- Dua rerun smoke sempat gagal di harness: pemeriksaan menunggu teks loading yang terlalu singkat, lalu penulisan ulang fixture dari run lain memicu refresh halaman. Harness kini menunggu tahap scan yang stabil dan hanya menulis fixture bila isi berubah; rerun alur wajah secara terisolasi lulus.
- Batas bukti: browser memakai komponen/CSS asli dengan API/Firestore/detektor diganti data sintetis dan video kamera sintetis. Ini bukan bukti autentikasi/backend/Firestore produksi, pencocokan Human pada wajah asli, atau perangkat fisik. Artefak berada di `workers/.wrangler/ux-artifacts/` (ignored); tidak berisi data pengguna/biometrik nyata.
- Status delivery: perubahan UX belum commit, push, atau deploy; tidak ada migrasi atau perubahan cloud pada tugas ini. Commit `f4d95d4` adalah baseline sebelum tugas. Riwayat release dan perubahan terdahulu dipertahankan.

### 3 Okt 2026 - Audit dan penyelesaian patch Face Attendance serta histori nama

- Membaca `update.md` dan brief `ai-agent-face-attendance-and-history-fixes.md` yang berada di root proyek, lalu memeriksa perubahan pengguna pada checkpoint A–D. Perubahan pengguna dipertahankan. Tautan brief di `update.md` diperbaiki; status aktif dan batas MVP diperbarui tanpa menghapus riwayat release.
- Tujuh tes presensi baru awalnya gagal karena create fixture mengirim field nullable sebagai `undefined` langsung ke SQLite. Tes kini menormalisasi input melalui validator seperti route API; fixture tidak diubah untuk menyembunyikan binding invalid. Matrix enam kombinasi mode/metode lulus; cakupan tambahan memastikan face tidak melewati GPS wajib/radius, retry duplikat mempertahankan metode pertama, dan list/detail/rekap mengembalikan metode tersimpan.
- Regression test menggunakan boundary `readFace()` dengan yaw/pitch Human dalam radian sehingga penghapusan konversi pada salah satu axis terdeteksi; challenge/guidance tetap degree dan threshold tidak berubah. Helper boundary diekspor untuk pengujian numerik tanpa menjalankan kamera/model.
- Regression kuis membuktikan nama berasal dari membership D1 walaupun parameter nama palsu disertakan, tetap tersimpan saat membership berubah/dihapus, serta fallback snapshot null/kosong ke membership atau “Siswa tidak diketahui”. Kontrak hasil siswa tetap sama. Fixture dapat berhenti pada migration `0012`; tes upgrade berisi data historis membuktikan default `standard`, backfill nama tersedia, snapshot null untuk anggota yang sudah tidak ada, record tetap utuh, dan foreign-key check bersih.
- Wrapper badge rekap yang baru ditambahkan disesuaikan dengan grid mobile; selector teks dibatasi agar tidak menimpa warna badge. Ini telah melewati lint/build, belum verifikasi visual browser.
- Berkas penting: `src/features/face/face-engine.js`, `face-engine.test.js`, `src/pages/ClassAttendance.jsx`, `src/services/attendance.service.js`, `src/styles/attendance.css`, Worker attendance validation/repository, `quiz.repository.js`, migration `0013`/`0014`, `workers/test/attendance-d1.test.js`, `quiz-d1.test.js`, `attendance-history-migrations.test.js`, `d1-fixture.js`, `update.md`, dan `docs/face-attendance-mvp.md`.
- Validasi aktual: tes terarah awal 2 PASS/7 FAIL (binding fixture), lalu 17/17 face/attendance/quiz PASS; `npm.cmd --prefix workers run migrate:local` PASS (lokal sebelumnya `0006`, delapan migration `0007`–`0014` diterapkan); `npm.cmd run validate` PASS, mencakup `lint`, `build`, `test:frontend`, `test:backend`, `test:workers` (59/59), `check:backend`, dan Worker check (48 source/script). `git diff --check` PASS setelah membersihkan baris kosong di EOF.
- Status akhir tugas: seluruh checkpoint kode/validasi lokal A–E selesai; belum commit/push/deploy, migrasi remote, API/browser produksi, atau kamera/GPS/perangkat nyata pada patch ini. Face masih trust signal client dalam MVP; embedding/foto/video/similarity tidak ditambahkan ke attendance D1. AWS tidak diubah.

### 2 Okt 2026 - Release candidate live dan verifikasi akhir

- Source aplikasi final `d91d115` disinkronkan ke `url/main` dan `pages/main`; Worker `247b0f1c-4018-428c-bf5b-ba3f294c67a6` dan Pages aplikasi `f8b81d3a-7790-48a4-8d85-682aa597b577` sukses. Dokumentasi/alat smoke akhir ikut commit berikutnya; deployment dari push akhir diperiksa sebelum laporan final.
- Smoke browser lengkap exit 0 pada `1fa2f20`: membuat/join kelas via UI, Insights kosong, label/angka Insights, autosave+refresh+hasil kuis, TXT Cloudinary nyata, tugas/nilai/feedback, presensi online, Bank Kuis, dan Live 1 host+4 browser context. Host finish saat satu pemain offline; score individual dan evidence Live D1 tetap benar.
- Source `d91d115` hanya merapikan padding UI Insights dan alat smoke. API/socket/auth smoke serta uji UI Insights desktop/mobile terarah diulang dan exit 0; screenshot label/angka/padding diperiksa. Akun/profil, D1, dan semua aset uji dibersihkan.
- `npm.cmd run validate` PASS (10 frontend,126 backend legacy,46 Worker), lint/build setelah layout PASS, syntax 48 source/script, diff check, backup/migrasi remote hingga `0012`, deploy keep-vars, dan secret-value scan tracked source/dist tanpa kecocokan. CI repo Pages PASS pada source yang sama; CI repo asal belum dapat mulai karena account lock billing GitHub.
- Berkas penting: `workers/scripts/smoke-auth.mjs`, `smoke-live-sockets.mjs`, `smoke-browser.mjs`, `src/styles/learning-insights.css`, `LiveQuizHost.jsx`, migration `0012`, repository Live/kuis/analytics, `README.md`, `update.md`, handoff, serta `docs/production-release-2026-10.md`.
- Status RC: tidak ada P0/P1 yang masih diketahui dari audit/pengujian ini, tetapi perangkat fisik/jaringan Wi-Fi nyata, kamera/GPS opsional, dan kapasitas besar belum diverifikasi. AWS tidak dihapus; rollback kode/Pages didokumentasikan tanpa reset D1. Histori lama tetap dipertahankan.


### 2 Okt 2026 - Sinkronisasi repository, deploy, dan smoke produksi

- Remote `pages` menunjuk `https://github.com/khoirulzz/nalaroclass.git`. `main` pada remote `url` dan `pages` sudah menerima integrasi hingga `e5cd06d`; Pages berhasil membangun commit itu pada deployment `1bfa4c7d-9406-48a0-ba33-f21949f5c373`. Seluruh variabel build produksi Firebase/API/AI cocok dengan konfigurasi lokal, dibandingkan di proses tanpa mencetak nilainya.
- Worker versi `247b0f1c-4018-428c-bf5b-ba3f294c67a6` terdeploy dengan `--keep-vars`. API produksi lulus untuk LMS, AI, role negatif, duplicate attempt, Live 1 host + 4 pemain, rejoin siswa yang sama dengan rotasi token, penolakan token lama, laporan D1, CSV, dan Learning Insights.
- `workers/scripts/smoke-browser.mjs` menjalankan Chrome terpasang melalui Playwright sementara setelah Browser in-app tidak tersedia. Login guru/siswa, modul kelas, materi/diskusi, refresh progres/hasil kuis, unggahan TXT nyata ke Cloudinary, pengumpulan/penilaian tugas, presensi online, Bank Kuis, serta Live 1 host + 4 browser context lulus pada Pages produksi. Offline/disconnect, reload jawaban terkunci, deadline saat host keluar, dan hasil final D1 ikut diperiksa. Akun/profil, data D1, dan aset Cloudinary uji dibersihkan; fixture file dari percobaan gagal alat uji juga telah dihapus setelah kontennya diverifikasi.
- Pengujian browser memakai desktop 1440x900 dan viewport ponsel 390x844/360x800. Ini bukan uji ponsel fisik, kamera/GPS nyata, Safari, atau pengukuran kapasitas kelas besar.
- Pemeriksaan screenshot menemukan tata letak kartu Insights belum mengikuti wrapper `Card`; label/angka diperbaiki dan alat uji menambah pemeriksaan posisi. Recovery host kuis umum dipisahkan per akun dan storage yang tidak tersedia tidak mematikan sesi.
- `npm.cmd run validate` kembali lulus (10 frontend, 126 backend, 46 Worker; syntax check 48 source/script), lint tanpa warning, build, serta `git diff --check` lulus. Perbaikan tampilan dan alat uji final akan disinkronkan; pemeriksaan Pages akhir masih berjalan. Laporan release dan daftar gate aktual akan diperbarui pada entri akhir.

### 2 Okt 2026 ? Integrasi release dan hardening sebelum deploy

- PR #5, #6, #7 diintegrasikan berurutan pada `main` lokal dengan merge commit; konflik route/dokumen/Live diselesaikan sambil mempertahankan hardening kuis, Learning Insights, WebSocket, dan laporan permanen. Riwayat lama dipertahankan.
- Role D1 yang sudah verified tidak dapat diganti lewat delete/recreate profil Firestore; verifikasi paralel memakai guard SQL. Draft kuis dan recovery host dipisahkan per akun.
- Live memulihkan receipt pribadi setelah reconnect/reload, memakai heartbeat dan stateVersion untuk mencegah state mundur, menutup soal melalui alarm server, serta menolak advance dari fase lama. Hasil gagal tersimpan tidak dibuang saat TTL room berakhir.
- Migration additive `0012_live_result_completion.sql` mencegah snapshot parsial terbaca sebagai laporan/mastery. Migrasi `0009`?`0012` telah diterapkan ke D1 remote setelah export backup lokal; tidak ada reset atau penghapusan data produksi.
- Soal/kunci kuis dikunci setelah ada attempt; randomisasi arrange tidak memakai rotasi jawaban yang dapat dibalik. CSV dinetralkan terhadap formula spreadsheet. Canonical/sitemap menunjuk `nalaroclass.pages.dev` dan header keamanan Pages ditambahkan.
- `npm.cmd install` root/Worker, `npm.cmd run validate` (10 frontend, 126 backend, 46 Worker), syntax check 47 source/script, `git diff --check`, dan Worker dry run `--keep-vars` lulus. Tes lokal tidak menggantikan browser/perangkat/produksi.
- Remote `pages` ditambahkan untuk `khoirulzz/nalaroclass`; `pages/main` adalah ancestor `main`, sehingga sinkronisasi bisa fast-forward tanpa force push.
- Status pada entri ini: merge commit lokal tersedia; perbaikan release belum di-push, Worker/Pages final dan smoke produksi masih dikerjakan. Bukti akhir akan ditambahkan setelah pemeriksaan lingkungan.


Tambahkan entri terbaru di paling atas setelah setiap tugas. Sertakan perubahan, berkas penting, tes yang benar-benar dijalankan, status commit/push/deploy, dan hal yang masih terbuka.

### 1 Okt 2026 — Quiz hardening dan UX interaktif

- Branch `fix/quiz-hardening-ux` dan PR #5 menutup kebocoran answer-key pada payload siswa untuk hotspot dan susun-urutan, menambahkan status attempt siswa, validasi opsi pilihan ganda unik, serta regression test Worker.
- Self-paced quiz sekarang memiliki autosave per tab, restore setelah refresh, navigasi keyboard, transisi antar-soal, pilihan jawaban interaktif, status progres yang lebih jelas, dan tampilan hasil yang lebih ekspresif.
- Nalaro Live mendapat recovery host setelah refresh, timer/progress visual, auto-reveal ketika deadline habis dari sisi host, mode layar penuh, join flow dua tahap, transisi fase, feedback jawaban terkunci, dan animasi leaderboard/hasil.
- Dokumentasi `face-attendance-mvp.md` ditambahkan untuk menegaskan bahwa tantangan gerak kepala saat ini adalah MVP dan belum merupakan anti-spoof/liveness tingkat tinggi.
- GitHub Actions pada PR dan dua run `main` sebelumnya gagal sebelum runner/step dijalankan (`runner_id=0`, `steps=null`). Karena itu lint/build/test untuk branch ini **belum dapat diklaim lulus dari CI**. Review kontrak source dilakukan, tetapi browser/perangkat nyata tetap menjadi gate berikutnya.
- Belum diubah pada PR ini: trusted server-side teacher/student role enforcement, transport WebSocket Nalaro Live, dan penyimpanan hasil Live permanen.

### 1 Okt 2026 — Role enforcement + WebSocket Live + hasil Live permanen

- PR #7 / branch integrasi `feat/live-security-realtime` dibangun di atas `feat/learning-insights` (stacked PR #6). Perubahan Live yang relevan dari PR #5 juga dibawa agar UX/realtime tidak meregresikan hardening kuis sebelumnya.
- Role teacher/student kini diperiksa Worker dari profil Firestore milik Firebase UID yang sama. D1 hanya mempercayai role setelah verifikasi dan cache direvalidasi maksimal 24 jam. Route create/manage kelas, materi, kuis, tugas, presensi, Bank Kuis, AI Assist, Learning Insights, dan host Live diberi boundary teacher/student yang eksplisit.
- Nalaro Live memakai WebSocket Durable Object Hibernation untuk delivery state realtime. Host memakai tiket socket satu kali; peserta dapat mengautentikasi socket dengan participant token. REST tetap dipakai untuk mutation/answer sehingga scoring tetap server-authoritative.
- Hasil sesi Live final disimpan idempotent ke D1 melalui migration `0011_live_quiz_results.sql`: metadata sesi, ranking peserta, dan ringkasan benar/poin per soal. Raw answer tidak disalin ke D1 report. Host dapat retry jika persist gagal; alarm DO mencoba menyimpan lagi sebelum room kedaluwarsa.
- Guru dapat membuka riwayat Live permanen, detail akurasi/ranking, dan ekspor CSV dari Kuis kelas; kuis umum juga mendapat riwayat/detail/CSV.
- Join Live tetap publik. Jika request membawa Firebase token siswa yang verified dan siswa memang anggota kelas, result dipetakan ke `student_id`; peserta publik tidak pernah ditebak identitasnya dari nama.
- Learning Insights sekarang memakai Live terautentikasi sebagai strong evidence dengan bobot mastery 0,90. Hasil Live publik tetap hanya laporan dan tidak masuk profil analitik siswa.
- Test source ditambah/diupdate untuk trusted role cache, Live persistence/report, privacy payload hotspot/arrange, participant reconnect, participant ID contract, dan integrasi Live → Learning Insights. Smoke script produksi juga diperbarui untuk membuat/menghapus profil role Firestore uji.
- **Belum dideploy**: migration `0009`, `0010`, `0011`, Worker terbaru, dan frontend terbaru belum diterapkan ke remote. GitHub Actions PR #7 yang diamati (run #10 dan #11) sama-sama selesai `failure` sebelum satu pun step dijalankan (`steps=null`); jangan menyebut branch ini lulus CI/production sebelum validasi nyata dilakukan.

### 1 Okt 2026 — Nalaro Learning Insights

- Branch `feat/learning-insights` menambahkan engine analitik kelas/siswa yang membaca data authoritative D1 tanpa cache analitik terpisah.
- Mastery hanya memakai hasil kuis dan tugas bernilai; presensi, progres materi, diskusi, task completion, dan ketepatan waktu membentuk konsistensi/keterlibatan tetapi tidak menaikkan mastery.
- Learning Session menjadi unit analitik per topik. Editor materi, kuis, tugas, dan presensi diberi guidance agar aktivitas dipetakan ke pertemuan.
- Ditambahkan fairness siswa baru, analisis respons revisi, confidence/keyakinan data, status perkembangan non-ranking, insight deterministik, dashboard guru, analitik pribadi siswa, dan detail evidence.
- Migration `0009_learning_analytics_indexes.sql` menambah index baca saja; tidak membuat source of truth baru.
- Test source untuk formula, akses, siswa baru, data engagement-only, tugas belum dinilai, dan revisi sudah ditambahkan, tetapi **belum diklaim lulus** pada sesi ini karena workflow GitHub sebelumnya gagal sebelum runner menjalankan step. Deploy Worker/D1/Pages belum dilakukan.

### 30 Sep 2026 — Dokumen status hidup

- Menyatukan riwayat, fitur, target migrasi, keputusan meninggalkan data DynamoDB, dan gate beta berdasarkan source saat ini.
- Pemeriksaan sesi ini: audit source/route, histori Git, konfigurasi, dan HTTP Pages/CORS. `npm.cmd run validate` lulus: lint, build, tes frontend, 126 tes backend, 23 tes Worker, dan syntax check backend/Worker.
- Source migrasi dan dokumen status masuk commit `4d24d96` dan berhasil di-push ke `main` pada `hulumzz/Quizzy`. Push ini tidak men-deploy ulang Worker atau Pages.
- Deploy aplikasi baru tidak dilakukan dalam tugas dokumentasi ini; repository Pages yang berbeda perlu disinkronkan terpisah.

## Dokumen terkait

- [Status migrasi Cloudflare](cloudflare-backend-migration-status.md): bukti deployment dan smoke test terakhir.
- [Batasan presensi wajah](face-attendance-mvp.md): desain dan risiko MVP.
- [Metodologi Learning Insights](learning-insights.md): sumber evidence, formula, fairness, confidence, dan batas implementasi.
- [Handoff AI agent 1 Okt 2026](ai-agent-handoff-2026-10-01.md): arsitektur terbaru, branch stack, role enforcement, realtime Live, persistence, migrasi, merge/deploy order, dan gate validasi.
- [Arsitektur terdahulu](architecture-status.md), [roadmap fase 10+](phase-10-and-learning-roadmap.md), dan [handoff awal](github-agent-handoff-2026-09-24.md): riwayat/baseline yang sebagian masih menjelaskan arsitektur AWS lama.


### Snapshot posisi sebelum integrasi release (riwayat, bukan status aktif)

**Tahap: API inti sudah diimplementasikan pada Worker/D1; verifikasi cutover browser dan sejumlah fitur lanjutan belum selesai.** Jangan menyebut seluruh migrasi dan fitur `100%`.

- Worker `nalaro-api` melayani route LMS, upload signature, AI, Learning Insights, dan Nalaro Live. Pada branch integrasi `feat/live-security-realtime`, role teacher/student diverifikasi server dari profil Firestore immutable lalu dicache 24 jam di D1; Live memakai WebSocket Durable Object dan hasil akhirnya dipersistenkan ke D1. Produksi remote masih pada migrasi `0001`–`0008`; `0009`–`0011` belum diterapkan remote.
- Pages `https://nalaroclass.pages.dev` dan Worker `https://nalaro-api.uniquefactuhl.workers.dev` tersedia. Pada 30 September 2026, halaman depan memberi HTTP 200 dan preflight dari origin Pages ke `/classes?scope=joined` memberi HTTP 204 dengan header CORS yang benar. Ini belum membuktikan alur login atau tampilan kelas.
- Uji API terautentikasi sebelumnya lulus untuk kelas, kuis/hasil, tugas/penilaian, Bank Kuis, kuis umum, signature unggahan, beberapa fase Nalaro Live, dan AI. Akun serta data uji dibersihkan; D1 kemudian memiliki 0 kelas. Rincian ada di [status migrasi Cloudflare](cloudflare-backend-migration-status.md).
- Frontend lokal dan `.env.example` menunjuk Worker lewat `VITE_API_URL`/`VITE_AI_URL`. Variabel build Pages dan kesamaan source dengan repository GitHub lain yang terhubung ke Pages belum diverifikasi dari browser produksi.
- Kode AWS Lambda, DynamoDB, SQS, dan SAM masih ada di `backend/`. Infrastruktur lama belum dinonaktifkan.

### 20 Oktober 2026 — Pemulihan domain produksi dan kontrak verifikasi wajah

- Temuan terverifikasi: CORS Worker tidak memuat `class.nalaro.digital`; Firebase public project config tidak memuat domain tersebut; Pages produksi menjalankan `ccf209d`; Worker dan Render health sehat. Tidak ada perubahan/penghapusan D1.
- Berkas utama: `workers/wrangler.json`, `firebase.json`, `workers/src/routes/attendance.js`, `workers/src/services/face-token.js`, `src/features/auth/auth-error.js`, `src/pages/Auth.jsx`, `src/features/face/face-verification.js`, `src/features/face/useGuidedFaceScan.js`, dan tes domain/token/client. Repo Python: `main.py`, `services/face_verifier.py`, `services/token_service.py`, `tests/test_api.py`, dan CI.
- Validasi: pipeline `npm run validate` mencakup lint/build, 35 tes frontend, 126 tes backend legacy, 76 tes Worker, serta syntax check; satu warning hook `budget.tier` bawaan di `LivingWorldEngine.jsx`. Python exact requirements: 28 tes pytest lulus, compileall lulus; satu warning deprecation testclient. Wrangler dry-run bundle 316.53 KiB lulus. Status push/deploy akan diperbarui setelah penerapan.
- Firebase Authorized Domains masih membutuhkan akses akun pengelola. Jangan menyebut login Google domain kustom sudah pulih sebelum konfigurasi diterapkan dan uji login nyata dijalankan.
