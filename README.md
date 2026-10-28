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
| **Fasa 1** | Setup Asas & Skema Pangkalan Data | ✅ Selesai | Laravel 12, Inertia React, Tailwind v4, skema database & migration penuh |
| **Fasa 2** | Pengesahan Pengguna (Authentication & RBAC) | ✅ Selesai | Log masuk, daftar akaun, kawalan akses peranan (`student` vs `admin`) |
| **Fasa 3a** | Pengurusan Keputusan Akademik SPM | ✅ Selesai | Input gred SPM mengikut subjek, pengiraan mata gred standard |
| **Fasa 3b** | Penilaian Personaliti Kerjaya RIASEC | ✅ Selesai | 30 soalan inventori minat kerjaya Holland, pengiraan skor 6 domain |
| **Fasa 3c** | Enjin Cadangan Pintar & Merit | ✅ Selesai | Enjin padanan berasaskan peraturan (*Rule-Based*), penapisan gred minimum & merit |
| **Fasa 4** | Portal Pengguna & Direktori Program | ✅ Selesai | Dashboard pelajar, profil, paparan keputusan, direktori IPTA & sejarah cadangan |
| **Fasa 5** | Panel Kawalan Pentadbir (Admin Management) | ✅ Selesai | Dashboard analitik, CRUD Program IPTA, CRUD Soalan RIASEC, CRUD Peraturan, Pengurusan Pengguna |
| **Fasa 6** | Pengujian & Dokumentasi | ✅ Selesai | Pengujian Feature & Unit (PHPUnit/Pest), penentukuran UI responsif |

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
- **Pendaftaran & Log Masuk Selamat:** Akses berpusat untuk pelajar SPM dengan pengesahan sesi Laravel.
- **Profil Pengguna:** Paparan dan kemas kini maklumat peribadi (nama, emel, nombor telefon, sekolah asal, dan alamat).
- **Kemasukan Keputusan SPM:** Antara muka interaktif untuk memasukkan mata pelajaran dan gred SPM (A+ hingga G) dengan pengesahan input.
- **Ujian Psikometrik RIASEC:** 
  - 30 soalan inventori minat kerjaya berpandukan model Holland (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
  - Skor dikira secara automatik untuk menentukan tret dominan serta pecahan markah penuh bagi setiap domain.
- **Enjin Cadangan Program Pengajian:**
  - Memadankan personaliti dominan pelajar dengan program pengajian IPTA yang bersesuaian.
  - Memeriksa syarat kelayakan akademik minimum (*minimum requirement check*).
  - Menghitung anggaran merit berdasarkan pencapaian gred terbaik subjek SPM.
- **Perincian Program IPTA:** Paparan terperinci mengenai program pengajian termasuk kod program, universiti, fakulti, tahap pengajian, syarat am, dan prospek laluan kerjaya.
- **Direktori IPTA & Kursus (Eksplorasi Bebas):** Carian dan penapisan program pengajian mengikut kata kunci, IPTA, atau kategori bidang tanpa sekatan.
- **Arkib & Sejarah Cadangan:** Rekod sesi cadangan terdahulu disimpan untuk rujukan dan perbandingan pada masa hadapan.

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
   Mengambil kira mata pelajaran terbaik pelajar (sehingga 8 subjek terbaik), dihitung mengikut nisbah markah yang diperoleh berbanding markah maksimum (Maksimum 18 mata per subjek) dan diskalakan kepada peratusan (0 - 100%).
3. **Logik Penentuan Personaliti Dominan:**
   Skor dihitung bagi setiap dimensi (R, I, A, S, E, C). Dimensi dengan markah tertinggi dipilih sebagai personaliti utama (*Primary Dominant Trait*).
4. **Padanan Berasaskan Peraturan (*Rule-based Matching*):**
   Sistem mencari program dalam pangkalan data yang dipetakan kepada tret RIASEC dominan tersebut, kemudian menapis program mengikut syarat gred minimum subjek yang dicapai pelajar.

---

## 📂 Struktur Direktori Utama

```
career-guidance-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AcademicResultController.php   # Pengurusan gred SPM
│   │   │   ├── DashboardController.php        # Paparan papan pemuka pelajar
│   │   │   ├── DirectoryController.php        # Direktori program IPTA
│   │   │   ├── HistoryController.php          # Sejarah penilaian & cadangan
│   │   │   ├── ProfileController.php          # Profil pengguna
│   │   │   ├── RiasecController.php          # Pengendalian kuiz & enjin cadangan
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
│       └── MeritCalculator.php                # Servis logik pengiraan merit & gred
├── database/
│   ├── migrations/                            # Skema jadual pangkalan data
│   └── seeders/                               # Data awal (Admin, soalan RIASEC, IPTA, program)
├── resources/
│   └── js/
│       ├── Layouts/                           # Layout tema (Header, Nav, Footer)
│       └── Pages/                             # Halaman paparan Inertia (React)
│           ├── Academic/                      # Borang input SPM
│           ├── Admin/                         # Panel kawalan Admin
│           ├── Auth/                          # Daftar & Log Masuk
│           ├── Directory/                     # Halaman carian program awam
│           ├── History/                       # Paparan arkib sesi cadangan
│           ├── Profile/                       # Paparan & kemas kini profil
│           ├── Riasec/                        # Kuiz RIASEC & paparan hasil cadangan
│           ├── Dashboard.jsx                  # Dashboard pelajar
│           └── Welcome.jsx                    # Halaman pendaratan (Landing page)
├── routes/
│   └── web.php                                # Definisi routing aplikasi web
└── tests/
    └── Feature/                               # Ujian fungsian (PHPUnit)
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
   DB_DATABASE=career_guidance
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Jana Kunci Aplikasi (*Application Key*):**
   ```bash
   php artisan key:generate
   ```

6. **Laksanakan Migrasi & Seeder Pangkalan Data:**
   Langkah ini akan membina jadual pangkalan data dan memasukkan data awalan (30 soalan RIASEC, IPTA, senarai program, peraturan padanan, dan akaun pentadbir):
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

Untuk menjalankan suite ujian automatik:

```bash
php artisan test
```

Ujian merangkumi:
- Pendaftaran & pengesahan gred SPM (`AcademicResultTest.php`)
- Kebolecapaian dan fungsi direktori program (`DirectoryTest.php`)
- Pengurusan pentadbir & kawalan keselamatan peranan (`AdminManagementTest.php`)

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