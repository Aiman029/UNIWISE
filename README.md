# UniWise — Sistem Cadangan Program Pengajian IPTA

Sistem web yang membantu graduan SPM mendapat cadangan program pengajian (Diploma/Asasi/Sijil) di IPTA berdasarkan personaliti RIASEC dan keputusan akademik SPM.

> **Rujukan:** Dibina berdasarkan SRS rasmi FYP "UniWise" (penyelia: Dr Harnani Binti Mat Zin, UPSI), dengan beberapa penyesuaian kejuruteraan untuk memudahkan pembangunan (lihat bahagian *Sisihan daripada SRS* di bawah).

---

## Stack Teknikal

| Komponen | Teknologi |
|---|---|
| Backend | Laravel 12 (PHP), MVC |
| Frontend | React 19 via Inertia.js v3 |
| Styling | Tailwind CSS v4 |
| Database | MySQL |
| Build tool | Vite 7 |
| Auth | Laravel native session auth (bukan Firebase — lihat sisihan) |

---

## Status Keseluruhan

```
[██████████████████░░░░░░░░░░░░░░░░░░░░] Phase 3a selesai — Phase 3b & 3c seterusnya
```

| Phase | Status | Nota |
|---|---|---|
| 1. Setup & Database | ✅ Selesai | Schema penuh, models, seeders |
| 2. Authentication | ✅ Selesai | Register, login, logout, admin middleware |
| 3a. Borang Keputusan SPM | ✅ Selesai | Ikut struktur rasmi kalkulator merit JPT/KPT |
| 3b. Kuiz RIASEC | ⏳ Belum mula | Seterusnya |
| 3c. Pengiraan Merit + Enjin Cadangan | ⏳ Belum mula | Bergantung pada 3a + 3b |
| 4. UI Pengguna (dashboard, hasil, senarai program) | ⏳ Sebahagian | Dashboard asas siap; hasil/senarai belum |
| 5. Panel Admin (CRUD) | ⏳ Belum mula | Shell dashboard admin sedia, CRUD belum |
| 6. Testing & Packaging | ⏳ Belum mula | — |

---

## 1. Setup & Database — ✅ Selesai

- Laravel 12 + Inertia.js (React) + Tailwind v4 discaffold
- 8 jadual database:
  - `users` (dengan `role`, `aliran`, `kokurikulum_score`)
  - `spm_results` (dengan `type`: Universal/Pakej/Tambahan)
  - `riasec_questions` (30 soalan, 6 kategori RIASEC)
  - `riasec_responses`
  - `programmes` (20 program IPTA diseed)
  - `recommendation_rules` (~22 peraturan padanan RIASEC → program)
  - `recommendations`
  - Jadual default Laravel (`sessions`, `cache`, `jobs`, dsb.)
- Semua model Eloquent + relationship siap
- Seeder lengkap untuk soalan RIASEC, program, peraturan cadangan, dan 1 akaun admin (`admin@uniwise.com`)

## 2. Authentication — ✅ Selesai

- Register & login guna Laravel native session auth (bukan Firebase — lihat sisihan di bawah)
- Logout
- Middleware `admin` untuk sekat akses panel admin ikut `role`
- Data `auth.user` di-share secara global ke semua page React melalui Inertia middleware
- Halaman: `Welcome.jsx`, `Auth/Login.jsx`, `Auth/Register.jsx`, `Dashboard.jsx`, `Admin/Dashboard.jsx` (shell asas)

## 3a. Borang Keputusan SPM — ✅ Selesai

- Struktur borang disesuaikan **tepat** dengan kalkulator merit rasmi JPT/KPT (`online.mohe.gov.my/epanduan/kalkulatorMerit/spm`):
  - Pemilihan **Jenis Aliran** (STEM A / STEM B / STEM C / KSI)
  - 4 subjek **Wajib** (BM, BI, Matematik, Sejarah)
  - 2 subjek **Pakej Terbaik**
  - Subjek **Tambahan** (selain di atas)
  - Markah **Ko-kurikulum** (0.00–10.00)
- Data disimpan merentasi `users` (aliran, kokurikulum) dan `spm_results` (subjek, gred, kategori)

### Formula merit yang digunakan (rujukan JPT, Formula Merit 2.0)
1. Tukar gred → markah: `A+=18, A=16, A-=14, B+=12, B=10, C+=8, C=6, D=4, E=2, G=0`
2. Universal (40%): jumlah 4 subjek wajib ÷ 72 × 40
3. Pakej (30%): jumlah 2 subjek ÷ 36 × 30 (STEM C: 1 subjek ÷ 18)
4. Tambahan (10%): jumlah 2 subjek terbaik ÷ 36 × 10
5. Wajaran akademik: jumlah 3 komponen (maks 80) ÷ 80 × 90
6. + Markah Ko-kurikulum (maks 10)
7. **Jumlah = Markah Merit** (peratus, maks 100)

> Logic pengiraan sebenar (kod PHP untuk formula ini) **belum dilaksanakan** — akan dibina dalam Phase 3c bersama enjin cadangan.

---

## Yang Belum Dibina

### 3b. Kuiz RIASEC
- Paparan 30 soalan Likert-scale
- Simpan jawapan ke `riasec_responses`
- Kira skor 6 kategori RIASEC, tentukan jenis personaliti dominan

### 3c. Enjin Cadangan
- Implementasi formula pengiraan merit (lihat di atas) dalam PHP
- Padankan jenis RIASEC dominan + markah merit ≥ `min_grade` dalam `recommendation_rules` → senarai program
- Simpan hasil ke `recommendations`
- Halaman paparan hasil (jenis personaliti + senarai program dicadangkan)

### Phase 4 — UI Pengguna
- Halaman senarai/detail program (`Programmes`)
- Halaman sejarah cadangan (`Recommendations` — lihat cadangan terdahulu)
- Kemas kini profil pengguna

### Phase 5 — Panel Admin
- CRUD Program (`programmes`)
- CRUD Soalan RIASEC (`riasec_questions`)
- CRUD Peraturan Cadangan (`recommendation_rules`)
- Pengurusan akaun pengguna (lihat/nyahaktif)

### Phase 6 — Testing & Packaging
- Testing manual/unit untuk enjin cadangan
- Semakan responsif (mobile/desktop)
- Penyediaan untuk demo/submission FYP

---

## Sisihan daripada SRS (untuk laporan FYP)

SRS asal menetapkan beberapa spesifikasi yang disesuaikan untuk memudahkan pembangunan sebagai projek individu:

| Spesifikasi SRS | Keputusan sebenar | Justifikasi |
|---|---|---|
| Firebase Authentication | Laravel native session auth | Elak dependency pihak ketiga (API keys, billing), lebih mudah demo secara offline/local |
| React sebagai SPA berasingan + Laravel REST API | React via Inertia.js (SSR-style routing) | Masih penuhi keperluan "React frontend", elak kerumitan CORS & pengurusan token antara dua aplikasi berasingan |
| Jadual `admins` berasingan | Satu jadual `users` dengan kolum `role` | Sepadan dengan skema logik SRS sendiri (Seksyen 3.5.3) |

Kedua-dua sisihan ini boleh dinyatakan dalam laporan sebagai keputusan reka bentuk kejuruteraan yang wajar, tanpa menjejaskan pencapaian keperluan fungsian (FR001–FR020).

---

*Dokumen ini dijana untuk rujukan pembangunan projek. Kemas kini setiap kali fasa baharu disiapkan.*