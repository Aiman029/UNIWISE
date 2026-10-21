import React, { useMemo } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import RiasecRadarChart from '@/Components/RiasecRadarChart';
import {
    GraduationCap,
    HelpCircle,
    User as UserIcon,
    History as HistoryIcon,
    ArrowRight,
    Award,
    CheckCircle2,
    Clock,
    LogOut,
    Sparkles,
    Compass,
    BookOpen,
    Search,
    ChevronRight,
    Check,
    AlertCircle,
    Flame,
} from 'lucide-react';

export default function Dashboard({
    hasSpm,
    stream,
    meritScore,
    spmCount,
    dominantTrait,
    riasecScores,
    recentHistory = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Dynamic greeting based on current hour
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return { text: 'Selamat Pagi', emoji: '🌅' };
        if (hour >= 12 && hour < 15) return { text: 'Selamat Tengah Hari', emoji: '☀️' };
        if (hour >= 15 && hour < 19) return { text: 'Selamat Petang', emoji: '🌤️' };
        return { text: 'Selamat Malam', emoji: '🌙' };
    }, []);

    // Academic merit tier label
    const meritTier = useMemo(() => {
        if (!meritScore && meritScore !== 0) return null;
        if (meritScore >= 85) return { label: 'Cemerlang Tinggi', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
        if (meritScore >= 70) return { label: 'Cemerlang', color: 'text-sky-700 bg-sky-50 border-sky-200' };
        if (meritScore >= 55) return { label: 'Kepujian', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
        if (meritScore >= 40) return { label: 'Lulus', color: 'text-amber-700 bg-amber-50 border-amber-200' };
        return { label: 'Perlu Bimbingan', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }, [meritScore]);

    // Journey progress calculation
    const journeyProgress = useMemo(() => {
        let step = 1;
        if (hasSpm && dominantTrait) step = 3;
        else if (hasSpm) step = 2;
        return step;
    }, [hasSpm, dominantTrait]);

    return (
        <UserLayout activePage="dashboard">
            <Head title="User Dashboard - UniWise" />

            {/* Top Dynamic Greeting Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl mb-8">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Sistem Panduan Kerjaya & Halatuju SPM Pintar</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            {greeting.text}, {user?.name}! {greeting.emoji}
                        </h1>
                        <p className="text-sm text-slate-300 mt-1 max-w-xl">
                            Pantau keputusan akademik SPM, kenal pasti personaliti RIASEC anda, dan semak kelayakan program IPTA terkini.
                        </p>
                    </div>

                    {/* Quick Profile Pill */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/60"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-900 flex items-center justify-center font-black text-lg shadow">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <div>
                            <div className="text-xs font-bold text-white truncate max-w-[140px]">{user?.name}</div>
                            <div className="text-[11px] text-sky-200">ID: #{user?.id} &bull; SPM Calon</div>
                            <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Akaun Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3-Step Guided Journey Stepper Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Langkah Panduan Kerjaya Anda
                        </span>
                        <h2 className="text-base font-extrabold text-slate-900">
                            Kemajuan Profil & Halatuju Pelajar
                        </h2>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                        Langkah {journeyProgress} daripada 3
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1: Keputusan SPM */}
                    <div
                        className={`p-4 rounded-xl border transition-all ${
                            hasSpm
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : 'bg-slate-50 border-slate-200 ring-2 ring-sky-500/30'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                                        hasSpm
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-sky-600 text-white shadow-sm'
                                    }`}
                                >
                                    {hasSpm ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">1. Keputusan SPM</div>
                                    <div className="text-[11px] text-slate-500">
                                        {hasSpm
                                            ? `${spmCount} subjek (${meritScore || 0}% merit)`
                                            : 'Belum dimasukkan'}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    hasSpm
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                }`}
                            >
                                {hasSpm ? 'Selesai' : 'Wajib'}
                            </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                            <Link
                                href="/spm-results"
                                className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1"
                            >
                                <span>{hasSpm ? 'Kemaskini Gred' : 'Isi Gred Sekarang'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Step 2: Penilaian RIASEC */}
                    <div
                        className={`p-4 rounded-xl border transition-all ${
                            dominantTrait
                                ? 'bg-indigo-50/60 border-indigo-200'
                                : hasSpm
                                ? 'bg-white border-slate-300 ring-2 ring-indigo-500/30 shadow-sm'
                                : 'bg-slate-50 border-slate-200 opacity-70'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                                        dominantTrait
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : hasSpm
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-300 text-slate-600'
                                    }`}
                                >
                                    {dominantTrait ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">2. Penilaian RIASEC</div>
                                    <div className="text-[11px] text-slate-500">
                                        {dominantTrait
                                            ? `Kod: ${dominantTrait.toUpperCase()}`
                                            : hasSpm
                                            ? 'Sedia untuk diambil'
                                            : 'Kunci: Masukkan SPM dahulu'}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    dominantTrait
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : hasSpm
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-slate-200 text-slate-600'
                                }`}
                            >
                                {dominantTrait ? 'Selesai' : hasSpm ? 'Langkah Seterusnya' : 'Terkunci'}
                            </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                            <Link
                                href="/riasec"
                                className={`text-xs font-bold inline-flex items-center gap-1 ${
                                    hasSpm
                                        ? 'text-indigo-700 hover:text-indigo-900'
                                        : 'text-slate-400 pointer-events-none'
                                }`}
                            >
                                <span>{dominantTrait ? 'Uji Semula Kuiz' : 'Mula Kuiz RIASEC'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Step 3: Padanan Program IPTA */}
                    <div
                        className={`p-4 rounded-xl border transition-all ${
                            dominantTrait && hasSpm
                                ? 'bg-amber-50/60 border-amber-200'
                                : 'bg-slate-50 border-slate-200 opacity-70'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                                        dominantTrait && hasSpm
                                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                                            : 'bg-slate-300 text-slate-600'
                                    }`}
                                >
                                    {dominantTrait && hasSpm ? <Sparkles className="w-5 h-5" /> : '3'}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">3. Padanan IPTA</div>
                                    <div className="text-[11px] text-slate-500">
                                        {dominantTrait && hasSpm
                                            ? 'Padanan IPTA sedia disemak'
                                            : 'Menunggu langkah 1 & 2'}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    dominantTrait && hasSpm
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'bg-slate-200 text-slate-600'
                                }`}
                            >
                                {dominantTrait && hasSpm ? 'Sedia' : 'Menunggu'}
                            </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                            <Link
                                href={recentHistory.length > 0 ? `/history/${recentHistory[0].session_id}` : '/directory'}
                                className={`text-xs font-bold inline-flex items-center gap-1 ${
                                    dominantTrait && hasSpm
                                        ? 'text-amber-800 hover:text-amber-950'
                                        : 'text-slate-400'
                                }`}
                            >
                                <span>{recentHistory.length > 0 ? 'Semak Padanan Saya' : 'Eksplorasi Direktori'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid matching SRS Figure 3.2.1.1.5 with Modern Polish */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Profile Summary Card */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-6 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100">
                                Ringkasan Profil
                            </span>
                            <Link
                                href="/profile"
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                            >
                                <span>Urus Profil</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 my-2">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-sky-100 shadow-sm"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                                    {user?.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        Akaun Calon SPM
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        UniWise ID #{user?.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Strip */}
                        <div className="grid grid-cols-2 gap-3 mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Status Akademik
                                </span>
                                <span className="text-xs font-extrabold text-slate-800">
                                    {hasSpm ? `${spmCount} Mata Pelajaran` : 'Belum Dimasukkan'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Personaliti Kerjaya
                                </span>
                                <span className="text-xs font-extrabold text-indigo-700">
                                    {dominantTrait ? dominantTrait.toUpperCase() : 'Belum Dinilai'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <Link
                            href="/profile/edit"
                            className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition inline-flex items-center gap-1.5"
                        >
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>Kemaskini Profil</span>
                        </Link>
                        <button
                            onClick={() => router.post('/logout')}
                            title="Log Keluar ke Laman Utama"
                            className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition flex items-center gap-1.5 border border-rose-200"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Keluar</span>
                        </button>
                    </div>
                </div>

                {/* 2. RIASEC Traits Graph Card */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-6 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                Graf Personaliti RIASEC
                            </span>
                            {dominantTrait ? (
                                <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-indigo-600" />
                                    <span>Dominan: {dominantTrait.toUpperCase()}</span>
                                </span>
                            ) : (
                                <span className="text-[11px] font-semibold text-slate-400">
                                    30 Soalan Penilaian
                                </span>
                            )}
                        </div>

                        {riasecScores ? (
                            <div className="py-1">
                                <RiasecRadarChart scores={riasecScores} size={220} />
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                                    <Compass className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    Penilaian RIASEC belum diambil
                                </p>
                                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                    Jawab 30 soalan minat kerjaya untuk mengetahui kecenderungan personaliti Holland anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                            {dominantTrait ? 'Model Holland Terbukti' : 'Memerlukan keputusan SPM'}
                        </span>
                        <Link
                            href="/riasec"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                        >
                            <span>{dominantTrait ? 'Uji Semula Kuiz' : 'Ambil Kuiz Sekarang'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* 3. Academic Result Summary Card with Elevated Merit Ring */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-6 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                Ringkasan Keputusan SPM
                            </span>
                            {meritTier && (
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meritTier.color}`}>
                                    {meritTier.label}
                                </span>
                            )}
                        </div>

                        {hasSpm ? (
                            <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
                                {/* Circular Merit Score Widget */}
                                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                                    <svg className="w-28 h-28 transform -rotate-90">
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="44"
                                            stroke="#f1f5f9"
                                            strokeWidth="9"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="44"
                                            stroke="#0284c7"
                                            strokeWidth="9"
                                            strokeDasharray={276.4}
                                            strokeDashoffset={276.4 - (276.4 * (meritScore || 0)) / 100}
                                            strokeLinecap="round"
                                            fill="transparent"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                                            {meritScore}%
                                        </span>
                                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                                            Markah Merit
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <div className="inline-block text-xs font-extrabold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 mb-1">
                                        {stream || 'Aliran SPM'}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">
                                        {spmCount} Mata Pelajaran Direkodkan
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Formula merit standard KPM: Berdasarkan 5-8 mata pelajaran terbaik untuk penentuan kelayakan IPTA.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-36 flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    Keputusan SPM belum dimasukkan
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Masukkan 4 mata pelajaran universal & elektif anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                            {hasSpm ? 'Data akademik aktif' : 'Prasyarat untuk kuiz RIASEC'}
                        </span>
                        <Link
                            href="/spm-results"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 text-white hover:bg-sky-700 text-xs font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                        >
                            <span>{hasSpm ? 'Kemaskini Keputusan' : 'Masukkan Keputusan SPM'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* 4. Recent History Card */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-6 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                                Sejarah Penilaian Terkini
                            </span>
                            <Link
                                href="/history"
                                className="text-xs font-bold text-amber-600 hover:text-amber-800 inline-flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentHistory && recentHistory.length > 0 ? (
                            <div className="space-y-3 my-2">
                                {recentHistory.slice(0, 3).map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/history/${item.session_id}`}
                                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 transition group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition">
                                                <Award className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-extrabold text-slate-800 group-hover:text-amber-700 transition">
                                                    Ujian RIASEC: {item.dominant_trait}
                                                </div>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.date_generated).toLocaleDateString('ms-MY', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xs font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                                                {item.merit_score}%
                                            </span>
                                            <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">Merit</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="h-36 flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                                    <HistoryIcon className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    Tiada sejarah penilaian lagi
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Sejarah ujian RIASEC dan cadangan program akan disimpan secara automatik.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span>Arkib padanan disimpan selamat</span>
                        <Link
                            href="/history"
                            className="text-xs font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1"
                        >
                            <span>Buka Rekod Sejarah</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Explore Strip */}
            <div className="mt-8 bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 rounded-3xl border border-sky-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sky-600 shrink-0">
                        <Search className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                            Ingin meneroka kursus universiti awam secara manual?
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Semak direktori program Asasi, Diploma, dan Sijil di 20 universiti awam (IPTA) Malaysia.
                        </p>
                    </div>
                </div>
                <Link
                    href="/directory"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 hover:text-sky-600 font-bold text-xs rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition shrink-0"
                >
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Buka Direktori IPTA</span>
                </Link>
            </div>
        </UserLayout>
    );
}