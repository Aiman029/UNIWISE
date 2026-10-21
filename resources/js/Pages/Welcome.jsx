import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Compass,
    GraduationCap,
    CheckCircle,
    ArrowRight,
    BookOpen,
    Sparkles,
    School,
    Award,
    TrendingUp,
    Target,
    Layers,
    ChevronRight,
} from 'lucide-react';

export default function Welcome() {
    const [hoveredTrait, setHoveredTrait] = useState(null);

    const riasecTraits = [
        {
            code: 'R',
            name: 'Realistic',
            label: 'Realistik',
            desc: 'Praktikal, fizikal, meminati mesin, alatan mekanikal & teknologi.',
            career: 'Kejuruteraan, Teknologi Maklumat, Senibina',
            color: 'from-orange-500 to-amber-600',
            border: 'border-orange-200',
            bg: 'bg-orange-50',
            badge: 'bg-orange-600 text-white',
        },
        {
            code: 'I',
            name: 'Investigative',
            label: 'Investigatif',
            desc: 'Analitikal, saintifik, penyelidikan & penyelesaian masalah logik.',
            career: 'Sains Komputer, Perubatan, Bioteknologi',
            color: 'from-sky-500 to-blue-600',
            border: 'border-sky-200',
            bg: 'bg-sky-50',
            badge: 'bg-sky-600 text-white',
        },
        {
            code: 'A',
            name: 'Artistic',
            label: 'Artistik',
            desc: 'Kreatif, imaginatif, bebas berekspresi, reka bentuk & media seni.',
            career: 'Reka Bentuk Grafik, Seni Kreatif, Multimedia',
            color: 'from-purple-500 to-indigo-600',
            border: 'border-purple-200',
            bg: 'bg-purple-50',
            badge: 'bg-purple-600 text-white',
        },
        {
            code: 'S',
            name: 'Social',
            label: 'Sosial',
            desc: 'Prihatin, suka membantu, mendidik, bekerjasama & khidmat komuniti.',
            career: 'Pendidikan, Kaunseling, Kerja Sosial, Kejururawatan',
            color: 'from-emerald-500 to-teal-600',
            border: 'border-emerald-200',
            bg: 'bg-emerald-50',
            badge: 'bg-emerald-600 text-white',
        },
        {
            code: 'E',
            name: 'Enterprising',
            label: 'Perniagaan',
            desc: 'Kepimpinan, berdaya saing, berkarisma, keusahawanan & rundingan.',
            career: 'Pengurusan Perniagaan, Pemasaran, Perundangan',
            color: 'from-amber-500 to-yellow-600',
            border: 'border-amber-200',
            bg: 'bg-amber-50',
            badge: 'bg-amber-600 text-white',
        },
        {
            code: 'C',
            name: 'Conventional',
            label: 'Konvensional',
            desc: 'Teratur, sistematik, terperinci, pengurusan data & perakaunan.',
            career: 'Perakaunan, Kewangan, Pentadbiran Sistem',
            color: 'from-slate-600 to-slate-800',
            border: 'border-slate-300',
            bg: 'bg-slate-100',
            badge: 'bg-slate-700 text-white',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
            <Head title="UniWise - Sistem Bimbingan Halatuju Pendidikan SPM" />

            {/* Top Header Navbar */}
            <header className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 px-6 sm:px-10 py-3.5 flex justify-between items-center shadow-md sticky top-0 z-40 border-b border-amber-600/30">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 text-white flex items-center justify-center font-black text-base shadow-md group-hover:scale-105 transition ring-2 ring-white/30">
                        UW
                    </div>
                    <div>
                        <span className="text-2xl font-black tracking-tight text-indigo-950 leading-none block">
                            UniWise
                        </span>
                        <span className="text-[10px] font-bold text-amber-100 tracking-wider uppercase">
                            SPM Career Guidance
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/directory"
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-950 hover:bg-amber-400/40 transition"
                    >
                        <School className="w-4 h-4" />
                        <span>Direktori IPTA</span>
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black tracking-wide uppercase bg-sky-600 hover:bg-sky-700 text-white shadow transition hover:shadow-md active:scale-95"
                    >
                        Log Masuk
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black tracking-wide uppercase bg-indigo-950 hover:bg-indigo-900 text-white shadow-sm transition hover:shadow-md active:scale-95"
                    >
                        Daftar
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-16 w-full space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Headline & Value Proposition */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-100/90 border border-sky-200 shadow-xs">
                            <Sparkles className="w-4 h-4 text-sky-600 animate-spin-slow" />
                            <span>Sistem Bimbingan Halatuju Lepasan SPM</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-indigo-950 tracking-tight leading-[1.15]">
                            Ketahui Kursus IPTA yang <span className="text-sky-600 underline decoration-amber-400 decoration-wavy decoration-4">Paling Sesuai</span> Untuk Anda
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                            UniWise memadankan <strong>gred SPM sebenar anda</strong> dengan <strong>profil minat kerjaya Holland RIASEC</strong> untuk menghasilkan cadangan program Asasi, Diploma, dan Sijil di 21 universiti awam berserta penunjuk peluang kemasukan merit UPU.
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-2">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                            >
                                <span>Mula Ujian Percuma</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/directory"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-2xl shadow-sm transition"
                            >
                                <BookOpen className="w-4 h-4 text-sky-600" />
                                <span>Terokai 256 Program IPTA</span>
                            </Link>
                        </div>

                        {/* Social proof badges */}
                        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                Formula Rasmi UPU (90% + 10%)
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                Teori Holland RIASEC
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                21 Universiti Awam & Politeknik
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Interactive RIASEC Framework Cards */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 block">
                                        Rangka Kerja Psikometrik
                                    </span>
                                    <h3 className="text-base font-black text-slate-800">
                                        6 Dimensi Personaliti RIASEC
                                    </h3>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                    Holland Theory
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 mb-4">
                                Klik atau halakan tetikus pada mana-mana sifat untuk melihat contoh laluan kerjaya:
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {riasecTraits.map((t) => (
                                    <button
                                        key={t.code}
                                        type="button"
                                        onMouseEnter={() => setHoveredTrait(t)}
                                        onClick={() => setHoveredTrait(t)}
                                        className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                                            hoveredTrait?.code === t.code
                                                ? `${t.bg} ${t.border} shadow-md scale-102 ring-2 ring-sky-400/40`
                                                : `${t.bg} border-slate-100 hover:border-slate-300`
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shadow-xs ${t.badge}`}>
                                                {t.code}
                                            </span>
                                            <span className="text-xs font-extrabold text-slate-800">
                                                {t.label}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 font-medium block">
                                            {t.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Active Trait Preview Callout */}
                            <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white min-h-[90px] flex flex-col justify-center">
                                {hoveredTrait ? (
                                    <div className="space-y-1 animate-fade-in">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-black text-amber-300">
                                                {hoveredTrait.code} - {hoveredTrait.label} ({hoveredTrait.name})
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-snug">
                                            {hoveredTrait.desc}
                                        </p>
                                        <p className="text-[11px] text-sky-300 font-semibold pt-1">
                                            Contoh Bidang: {hoveredTrait.career}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 text-center italic">
                                        Pilih mana-mana sifat RIASEC di atas untuk meneroka ciri personalitinya.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3 Step Guidance Journey */}
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                            Langkah Mudah
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                            3 Langkah Bimbingan Menara Gading
                        </h2>
                        <p className="text-sm text-slate-500">
                            Proses saintifik dan tersusun untuk memandu pilihan kursus UPUOnline anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition shadow-xs">
                                1
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Masukkan Gred SPM
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Masukkan gred bagi 4 subjek teras dan subjek elektif. Sistem mengira secara automatik <strong>skor merit rasmi 90% akademik + 10% kokurikulum</strong>.
                            </p>
                            <div className="pt-2 text-xs font-bold text-sky-600 flex items-center gap-1">
                                <span>Formula UPU Rasmi</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition shadow-xs">
                                2
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Jawab 30 Soalan RIASEC
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Kuiz pantas YES/NO untuk mengukur kecenderungan personaliti anda merentasi 6 domain kerjaya Holland berserta carta radar visual.
                            </p>
                            <div className="pt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                                <span>Psikometrik Holland</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg group-hover:scale-110 transition shadow-xs">
                                3
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Terima Padanan & Peluang
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Enjin pemadanan menyenaraikan kursus IPTA berserta <strong>Penunjuk Peluang Kemasukan</strong> (Peluang Tinggi, Berdaya Saing, Sasaran).
                            </p>
                            <div className="pt-2 text-xs font-bold text-amber-700 flex items-center gap-1">
                                <span>Strategi Permohonan UPU</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us & IPTA Statistics Banner */}
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                                Mengenai UniWise
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                Dibangunkan Khas Untuk Membantu Calon SPM Malaysia
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Diilhamkan daripada cabaran sebenar lepasan SPM yang keliru dalam memilih antara ratusan program di portal UPUOnline. UniWise menggabungkan data merit lepas dan profil minat kerjaya bagi memastikan setiap calon membuat pilihan tepat berasaskan data.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-amber-300 block">
                                    256
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Program Pengajian
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-sky-400 block">
                                    21
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Institusi Awam (IPTA)
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-emerald-400 block">
                                    6
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Domain Personaliti RIASEC
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-purple-400 block">
                                    100%
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Percuma untuk Calon SPM
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-xs border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-900 text-white font-bold flex items-center justify-center text-[10px]">
                            UW
                        </div>
                        <span className="font-extrabold text-white text-sm">UniWise</span>
                        <span className="text-slate-500">| Final Year Project (FYP) UPSI</span>
                    </div>

                    <p className="text-slate-500 text-center sm:text-right">
                        &copy; 2026 UniWise System. Hak Cipta Terpelihara.
                    </p>
                </div>
            </footer>
        </div>
    );
}