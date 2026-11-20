# UniWise — Sistem Cadangan Program Pengajian IPTA

**UniWise** ialah platform pintar berasaskan web yang dibangunkan untuk membantu lepasan Sijil Pelajaran Malaysia (SPM) meneroka dan mengenal pasti laluan pendidikan tinggi (Diploma, Asasi, dan Sijil) di Institusi Pendidikan Tinggi Awam (IPTA) Malaysia. Cadangan dijana secara automatik dengan menggabungkan profil minat kerjaya **Holland RIASEC** dan keputusan akademik **SPM**.

> **Rujukan Projek:** Dibina berasaskan Spesifikasi Keperluan Perisian (SRS) Projek Tahun Akhir (FYP) *"UniWise"*, Fakulti Seni, Komputeran dan Industri Kreatif (FSKIK), Universiti Pendidikan Sultan Idris (UPSI).  
> **Penyelia:** Dr. Harnani Binti Mat Zin

---

## 🚀 Status Pembangunan Projek

```
[████████████████████████████████████████] 100% Selesai — Sistem Beroperasi Sepenuhnya
```

| Fasa | Modul / Ciri | Status | Penerangan |
|---|---|:---:|---|
| **Fasa 1** | Setup Asas & Skema Pangkalan Data | ✅ Selesai | Laravel 12, Inertia React, Tailwind v4, skema pangkalan data & migrasi penuh (termasuk medan IMKS 2013) |
| **Fasa 2** | Pengesahan Pengguna (Authentication & RBAC) | ✅ Selesai | Log masuk, daftar akaun, kawalan akses peranan (`student` vs `admin`), serta skrin `Auth` berjenama UniWise |
| **Fasa 3a** | Pengurusan Keputusan Akademik SPM | ✅ Selesai | Input gred SPM mengikut aliran & subjek, pengiraan mata gred standard (90% terbaik daripada 8 subjek) |
| **Fasa 3b** | Penilaian Psikometrik IMKS 2013 (170 Item) | ✅ Selesai | Inventori Minat Kerjaya Sidek (Bahagian A: 1–85 & Bahagian B: 86–170), 17 kluster kerjaya, pembahagi rasmi RIASEC & Kod Tiga-Mata Holland |
| **Fasa 3c** | Enjin Cadangan Multi-RIASEC & Merit | ✅ Selesai | Enjin `RiasecMatcher` yang memadankan Top 2 / Top 3 RIASEC pelajar dengan 2–3 tret program (`Utama + Sub 1 + Sub 2`), skor kesesuaian, tier fallback 1–4 & semakan gred minimum |
| **Fasa 4** | Portal Pengguna & Direktori Program | ✅ Selesai | Dashboard pelajar, profil & avatar, carta radar 0–10, sorotan Kod Tiga-Mata Holland, pecahan 17 kluster, kad 2–3 lencana RIASEC, direktori IPTA & sejarah cadangan |
| **Fasa 5** | Panel Kawalan Pentadbir (Admin Management) | ✅ Selesai | Dashboard analitik, CRUD Program IPTA, CRUD Soalan IMKS/RIASEC, CRUD Peraturan Padanan, Pengurusan Pengguna |
| **Fasa 6** | Pengujian Automatik (Unit & Feature) | ✅ Selesai | 17 ujian PHPUnit (1,659 penegasan) merangkumi logik IMKS, kes seri, padanan Multi-RIASEC, merit SPM, direktori & modul admin |
| **Fasa 7** | Penyelarasan Data, UX & Penyetempatan BM | ✅ Selesai | Penyetempatan **100% Bahasa Melayu** (tanpa togol BM/ENG), pemetaan 236 program JSON selari dengan Excel (`Carian RIASEC`), serta penalaan UI kuiz & keputusan |

### 📝 Ringkasan Kemajuan Terkini (*Progress So Far*)
1. **Naik Taraf Modul Psikometrik kepada IMKS 2013 Rasmi:**
   - Menggantikan set 30 soalan ringkas kepada **170 item Inventori Minat Kerjaya Sidek (IMKS 2013)** (`database/data/imks_questions.json`) merangkumi Bahagian A (Item 1–85) dan Bahagian B (Item 86–170) merentasi 17 kluster kerjaya (`PPR-R` hingga `KON-C`).
   - Melaksanakan migrasi `2026_11_18_162000_add_imks_fields_to_riasec_questions_and_recommendations.php` untuk menyimpan metadata soalan (`question_number`, `section`, `cluster_index`, `cluster_code`, `cluster_name`, `holland_code`) serta keputusan terperinci `imks_result` dalam format JSON.
   - Membina servis `ImksCalculator.php` untuk pengiraan skor kluster, purata domain RIASEC (`R÷4`, `I÷3`, `A÷2`, `S÷3`, `E÷3`, `C÷2`), pembundaran nombor bulat terdekat, serta penentuan **Kod Tiga-Mata Holland** berserta semua kombinasi sah apabila berlaku skor seri (*tie-breaker*).
2. **Pemetaan & Padanan Multi-RIASEC (2–3 Dimensi per Program):**
   - Mengklasifikasikan kesemua **236 program pengajian** dalam `database/data/programmes.json` supaya setiap program mempunyai gabungan **2 hingga 3 dimensi RIASEC** (`riasec_type` utama + `sub_riasec_type` / `riasec_types`) dan dijana mengikut urutan oleh `RecommendationRuleSeeder.php`.
   - Membina `RiasecMatcher.php` untuk memadankan **Top 2 / Top 3** profil RIASEC pelajar terhadap tret program menggunakan sistem pemeringkatan 4 tier (*Tier 1–4*) dan skor kesesuaian.
   - Menyelaraskan fail Excel rujukan `data_program_dan_universiti_tersusun.xlsx` supaya sepadan dengan `programmes.json`, termasuk helaian khas **`Carian RIASEC`** menggunakan formula carian menu jatuh turun (*dropdown*).
3. **Penambahbaikan Antara Muka (UI/UX) & Pengalaman Kuiz:**
   - Kuiz berurutan 170 item dengan label Bahagian A/B, status pilihan neutral tanpa berat sebelah visual, serta pintasan papan kekunci (`Y` / `T` / `N` / nombor).
   - Paparan keputusan yang menyerlahkan **Kod Tiga-Mata Holland** pada sepanduk utama, carta radar berskala **0–10**, kad pecahan 17 kluster boleh kembang (`ImksBreakdownCard`), lencana Multi-RIASEC (`RiasecBadges`), dan penyembunyian formula pembahagi dalaman daripada paparan pengguna.
   - Roda RIASEC SVG interaktif pada halaman utama (`Welcome.jsx`), penapis & pengisihan mengikut dimensi RIASEC di `Result.jsx` dan `Directory/Index.jsx`, serta identiti logo rasmi UniWise.
4. **Penyetempatan Penuh 100% Bahasa Melayu:**
   - Mengalih keluar togol bahasa BM/ENG dan menyeragamkan keseluruhan antara muka pelajar, pentadbir, pengesahan, label carta, dan mesej pelayan/pengesahan Laravel kepada **Bahasa Melayu** sepenuhnya (`lang="ms"`).

---

## 🛠️ Stack Teknikal

| Lapisan | Teknologi | Perincian |
|---|---|---|
| **Backend Framework** | Laravel 12 (PHP 8.2+) | Seni bina MVC moden, routing, Eloquent ORM, middleware keselamatan |
| **Frontend Adapter** | Inertia.js v3 | Menghubungkan Laravel & React tanpa memerlukan REST API berasingan |
| **Frontend Library** | React 19 | Komponen antara muka interaktif, state management |
| **Styling & Design** | Tailwind CSS v4 + Lucide Icons | Antara muka moden, responsif, konsisten dan estetik |
| **Pangkalan Data** | MySQL / MariaDB | Penyimpanan berstruktur, perhubungan *foreign keys*, indeks efisien |
| **Build Tooling** | Vite 7 | Pembangunan pantas dengan Hot Module Replacement (HMR) |
| **Pengujian** | PHPUnit 11 | Ujian integrasi (*Feature tests*) untuk modul kritikal |

---

## ✨ Ciri-Ciri Utama Sistem

### 1. Modul Pelajar (Student Portal)
- **Pendaftaran & Log Masuk Selamat:** Akses berpusat untuk pelajar SPM dengan pengesahan sesi Laravel dan pengesahan profil lengkap.
- **Profil Pengguna:** Paparan dan kemas kini maklumat peribadi (nama, emel, nombor telefon, sekolah asal, alamat, serta muat naik avatar).
- **Kemasukan Keputusan SPM:** Antara muka interaktif mengikut aliran untuk memasukkan 4 subjek teras universal dan subjek elektif SPM (A+ hingga G) dengan pengesahan input.
- **Ujian Psikometrik IMKS 2013 (170 Item):**
  - 170 item inventori minat kerjaya rasmi (Bahagian A: Item 1–85 & Bahagian B: Item 86–170) merangkumi 17 kluster kerjaya dan 6 domain Holland (`R`, `I`, `A`, `S`, `E`, `C`).
  - Sokongan pilihan dwikod **YA** / **TIDAK**, pintasan papan kekunci (`Y`, `T`/`N`, nombor), serta penjejak kemajuan bahagian secara masa nyata.
  - Pengiraan automatik skor 17 kluster, skor purata RIASEC (skala 0–10), **Kod Tiga-Mata Holland** (cth: `ARC`, `SEA`), dan semua kombinasi sah sekiranya berlaku skor seri.
- **Enjin Cadangan Program Pengajian Multi-RIASEC:**
  - Memadankan profil **Top 2 / Top 3 RIASEC** pelajar dengan **2–3 tret RIASEC** setiap program (`Utama` + `Sub 1` + `Sub 2`) beserta skor kesesuaian (*match score*).
  - Memaparkan kesemua 2–3 lencana RIASEC berwarna pada setiap kad program, carta radar 0–10, dan pecahan 17 kluster kerjaya.
  - Memeriksa syarat kelayakan gred minimum (*minimum requirement check*) dan menghitung anggaran merit berdasarkan pencapaian gred terbaik subjek SPM.
- **Perincian Program IPTA:** Paparan terperinci mengenai program pengajian termasuk kod UPU/program, universiti, tahap pengajian, lencana Multi-RIASEC, syarat kemasukan, dan catatan temu duga.
- **Direktori IPTA & Kursus (Eksplorasi Bebas):** Carian dan penapisan program pengajian mengikut kata kunci, IPTA, tahap pengajian, atau dimensi RIASEC tanpa sekatan.
- **Arkib & Sejarah Cadangan:** Rekod sesi cadangan terdahulu berserta keputusan IMKS dan program yang dipadankan disimpan untuk rujukan pada masa hadapan.

### 2. Modul Pentadbir (Admin Management Panel)
- **Dashboard Analitik Pentadbir:** Ringkasan statistik jumlah pelajar berdaftar, bilangan penilaian yang telah diambil, taburan personaliti RIASEC, dan program paling popular.
- **Pengurusan Pengguna:** Memantau senarai pengguna, mengemaskini peranan, serta mengaktifkan atau menyahaktifkan akaun pengguna.
- **Pengurusan Program Pengajian (CRUD):** Tambah, kemas kini, lihat, dan padam maklumat program pengajian IPTA berserta syarat kelayakan.
- **Pengurusan Soalan RIASEC (CRUD):** Menguruskan bank soalan inventori RIASEC mengikut kategori.
- **Pengurusan Peraturan Cadangan (*Recommendation Rules*):** Menetapkan peraturan padanan antara personaliti RIASEC dengan program sasaran dan gred kelayakan minimum.

---

## 🧮 Formula & Algoritma Cadangan

1. **Skala Mata Gred SPM:**
   ```
   A+ = 18 mata   |   B+ = 12 mata   |   C  = 6 mata   |   G = 0 mata
   A  = 16 mata   |   B  = 10 mata   |   D  = 4 mata
   A- = 14 mata   |   C+ = 8 mata    |   E  = 2 mata
   ```
2. **Pengiraan Skor Merit Akademik:**
   Mengambil kira hingga 8 mata pelajaran terbaik pelajar, dihitung mengikut nisbah markah yang diperoleh berbanding markah maksimum (18 mata per subjek × 8 = 144 mata) dan diskalakan kepada wajaran 90% / 100% (`MeritCalculator.php`).
3. **Pengiraan Skor IMKS 2013 (170 Item / 17 Kluster):**
   - Setiap jawapan `YA` = 1 markah dan `TIDAK` = 0 markah. Setiap kluster mempunyai 10 item (skor maksimum 10 per kluster).
   - Skor purata 6 domain RIASEC (skala 0–10) dihitung mengikut pembahagi bilangan kluster rasmi dan dibundarkan kepada angka bulat terdekat (`PHP_ROUND_HALF_UP`):
     - **R (Realistik):** Jumlah 4 kluster ÷ 4
     - **I (Investigatif):** Jumlah 3 kluster ÷ 3
     - **A (Artistik):** Jumlah 2 kluster ÷ 2
     - **S (Sosial):** Jumlah 3 kluster ÷ 3
     - **E (Enterprising):** Jumlah 3 kluster ÷ 3
     - **C (Conventional):** Jumlah 2 kluster ÷ 2
4. **Kod Tiga-Mata Holland & Logik Kes Seri (*Tie-Breaker*):**
   - 6 skor purata RIASEC disusun dari tertinggi ke terendah untuk membentuk **Kod Tiga-Mata Holland** (cth: `SEA`, `ARC`).
   - Jika berlaku skor seri pada kedudukan 3 teratas (kedudukan 1–2, 2–3, atau 3–4+), sistem menjana semua kombinasi kod 3-huruf yang sah secara automatik (cth: `ARC, ACR`). Kes seri 6 penjuru dikendalikan sebagai `Tidak Dapat Ditentukan`.
5. **Padanan Multi-RIASEC Top 2 / Top 3 (`RiasecMatcher`):**
   - Setiap program dalam `programmes.json` dipetakan kepada **2–3 tret RIASEC** mengikut urutan kepentingan (`Utama`, `Sub 1`, `Sub 2`).
   - Sistem memadankan **Top 2 / Top 3** profil pelajar dengan tret program mengikut keutamaan Tier 1–4, mengira skor kesesuaian (*match score*), serta menapis kelayakan mengikut gred minimum subjek pelajar.

---

## 📂 Struktur Direktori Utama

```
career-guidance-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AcademicResultController.php   # Pengurusan gred SPM
│   │   │   ├── DashboardController.php        # Paparan papan pemuka pelajar
│   │   │   ├── DirectoryController.php        # Direktori program IPTA & penapis RIASEC
│   │   │   ├── HistoryController.php          # Sejarah penilaian IMKS & cadangan
│   │   │   ├── ProfileController.php          # Profil & avatar pengguna
│   │   │   ├── RiasecController.php           # Pengendalian kuiz IMKS 170 & keputusan
│   │   │   └── Admin/                         # Pengawal selia modul pentadbir
│   │   │       ├── DashboardController.php
│   │   │       ├── ProgrammeController.php
│   │   │       ├── RecommendationRuleController.php
│   │   │       ├── RiasecQuestionController.php
│   │   │       └── UserController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php            # Sekatan laluan pentadbir
│   ├── Models/                                # Model Eloquent & perhubungan data
│   │   ├── Programme.php
│   │   ├── Recommendation.php
│   │   ├── RecommendationRule.php
│   │   ├── RiasecQuestion.php
│   │   ├── RiasecResponse.php
│   │   ├── SpmResult.php
│   │   ├── University.php
│   │   └── User.php
│   └── Services/
│       ├── ImksCalculator.php                 # Servis pengiraan IMKS 2013 & Kod Tiga-Mata
│       ├── MeritCalculator.php                # Servis logik pengiraan merit & gred SPM
│       └── RiasecMatcher.php                  # Servis padanan Multi-RIASEC Top 2 / Top 3
├── database/
│   ├── data/
│   │   ├── imks_questions.json                # 170 item rasmi IMKS 2013 (17 kluster)
│   │   └── programmes.json                    # 236 program IPTA dengan 2–3 tret RIASEC
│   ├── migrations/                            # Skema jadual pangkalan data
│   └── seeders/                               # Data awal (Admin, 170 soalan IMKS, IPTA, program, peraturan)
├── resources/
│   └── js/
│       ├── Components/                        # Komponen UI boleh guna semula
│       │   ├── ImksBreakdownCard.jsx          # Paparan keputusan IMKS & 17 kluster
│       │   ├── RiasecBadges.jsx               # Lencana Multi-RIASEC berwarna (2–3 tret)
│       │   └── RiasecRadarChart.jsx           # Carta radar 6 dimensi (skala 0–10)
│       ├── Layouts/                           # Layout tema (UserLayout & AdminLayout)
│       ├── Utils/
│       │   └── riasec.js                      # Warna, label & pemetaan tret RIASEC (BM)
│       └── Pages/                             # Halaman paparan Inertia (React, 100% BM)
│           ├── Academic/                      # Borang input SPM
│           ├── Admin/                         # Panel kawalan Admin
│           ├── Auth/                          # Daftar & Log Masuk
│           ├── Directory/                     # Halaman carian program awam
│           ├── History/                       # Paparan arkib sesi cadangan
│           ├── Profile/                       # Paparan & kemas kini profil
│           ├── Riasec/                        # Kuiz IMKS 170 item & paparan hasil cadangan
│           ├── Dashboard.jsx                  # Dashboard pelajar
│           └── Welcome.jsx                    # Halaman utama & Roda RIASEC interaktif
├── routes/
│   └── web.php                                # Definisi routing aplikasi web
└── tests/
    ├── Unit/                                  # Ujian unit formula IMKS 2013 & kes seri
    └── Feature/                               # Ujian fungsian modul SPM, IMKS, direktori & admin
```

---

## ⚙️ Panduan Pemasangan & Persediaan (Installation)

### Prasyarat
- **PHP** >= 8.2 (dengan sambungan `pdo_mysql`, `mbstring`, `openssl`, `curl`)
- **Composer** (Pengurus pakej PHP)
- **Node.js** >= 18.0 & **npm**
- **MySQL** / MariaDB (cth: melalui Laragon, XAMPP, atau Docker)

### Langkah Pemasangan

1. **Klon Repositori & Masuk ke Folder:**
   ```bash
   git clone <url-repositori>
   cd career-guidance-system
   ```

2. **Pasang Dependensi Backend (Composer):**
   ```bash
   composer install
   ```

3. **Pasang Dependensi Frontend (NPM):**
   ```bash
   npm install
   ```

4. **Konfigurasi Fail Persekitaran (`.env`):**
   Salin fail contoh `.env.example` kepada `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka fail `.env` dan laraskan konfigurasi pangkalan data anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=career_guidance_system
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Jana Kunci Aplikasi (*Application Key*):**
   ```bash
   php artisan key:generate
   ```

6. **Laksanakan Migrasi & Seeder Pangkalan Data:**
   Langkah ini akan membina jadual pangkalan data dan memasukkan data awalan (170 item IMKS 2013, senarai IPTA, 236 program pengajian dengan pemetaan 2–3 RIASEC, peraturan padanan, dan akaun pentadbir):
   ```bash
   php artisan migrate --seed
   ```

7. **Jalankan Pelayan Pembangunan:**
   Buka dua terminal berasingan atau jalankan bersama:

   *Terminal 1 (Vite HMR):*
   ```bash
   npm run dev
   ```

   *Terminal 2 (Laravel Server):*
   ```bash
   php artisan serve
   ```

8. **Akses Sistem:**
   Buka pelayar web dan layari: `http://127.0.0.1:8000` (atau hos maya Laragon anda).

---

## 🔑 Maklumat Akaun Lalai (Default Credentials)

Selepas menjalankan arahan `php artisan migrate --seed`, anda boleh log masuk menggunakan akaun pentadbir berikut:

| Peranan | Emel | Kata Laluan |
|---|---|---|
| **Administrator** | `admin@uniwise.com` | `admin123` |
| **Pelajar Baru** | *Daftar akaun baru melalui butang "Daftar"* | *Kata laluan pilihan anda* |

---

## 🧪 Pengujian (Testing)

Untuk menjalankan suite ujian automatik (status terkini: **17 ujian lulus, 1,659 penegasan**):

```bash
php artisan test
```

Untuk membina aset frontend produksi (*Vite build*):

```bash
npm run build
```

Ujian merangkumi:
- Formula IMKS 2013 (170 item, 17 kluster, pembahagi & semua senario kes seri Kod Tiga-Mata Holland) (`tests/Unit/ImksCalculatorTest.php`)
- Padanan Multi-RIASEC Top 2 / Top 3, lencana program & penghantaran 170 soalan (`tests/Feature/RiasecRecommendationTest.php`)
- Pendaftaran & pengesahan gred SPM (`tests/Feature/AcademicResultTest.php`)
- Kebolecapaian dan fungsi direktori program serta pengiraan merit (`tests/Feature/DirectoryTest.php`)
- Pengurusan pentadbir & kawalan keselamatan peranan (`tests/Feature/AdminManagementTest.php`)
- Pendaftaran pengguna baharu (`tests/Feature/Auth/RegistrationTest.php`)

---

## 📑 Sisihan Kejuruteraan daripada SRS Asal (Engineering Justifications)

Bagi tujuan dokumentasi dan laporan teknikal Projek Tahun Akhir, beberapa pelarasan seni bina telah dibuat daripada cadangan awal SRS:

| Spesifikasi Asal SRS | Pendekatan Terkini | Justifikasi Kejuruteraan |
|---|---|---|
| **Firebase Authentication** | **Laravel Native Session Auth** | Menghapuskan kebergantungan pihak ketiga (kunci API luaran, had kuota, kos) serta membolehkan sistem dijalankan secara kendiri (*self-hosted* / *offline environment*). |
| **Aplikasi React SPA Berasingan + REST API** | **Monolith Moden (React 19 via Inertia.js v3)** | Mengekalkan kelebihan komponen UI reaktif React sambil menyingkirkan kerumitan pengurusan token JWT/CORS dan redundansi routing di dua aplikasi berbeza. |
| **Jadual Pangkalan Data `admins` Berasingan** | **Satu Jadual `users` dengan Kolum `role`** | Reka bentuk skema yang lebih bersih, memudahkan pengesahan berpusat (*Single Authentication Provider*), dan menyokong penambahan peranan masa hadapan dengan mudah. |

---

## 👥 Pengarang & Penghargaan

- **Pembangun:** Pelajar Tahun Akhir, Universiti Pendidikan Sultan Idris (UPSI)
- **Penyelia:** Dr. Harnani Binti Mat Zin
- **Fakulti:** Fakulti Komputeran dan Meta TeknologI (FKMT), UPSI

---

*Hak Cipta Terpelihara © 2026 UniWise. Dibangunkan untuk tujuan akademik dan penyelidikan.*