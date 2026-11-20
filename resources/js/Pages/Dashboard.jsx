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
    Zap,
    TrendingUp,
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

    // Academic merit tier label with vibrant badge styles
    const meritTier = useMemo(() => {
        if (!meritScore && meritScore !== 0) return null;
        if (meritScore >= 85)
            return {
                label: 'Cemerlang Tinggi 🌟',
                color: 'text-emerald-800 bg-emerald-100 border-emerald-300 font-extrabold',
            };
        if (meritScore >= 70)
            return {
                label: 'Cemerlang ✨',
                color: 'text-blue-800 bg-blue-100 border-blue-300 font-extrabold',
            };
        if (meritScore >= 55)
            return {
                label: 'Kepujian 👍',
                color: 'text-indigo-800 bg-indigo-100 border-indigo-300 font-extrabold',
            };
        if (meritScore >= 40)
            return {
                label: 'Lulus 📋',
                color: 'text-amber-800 bg-amber-100 border-amber-300 font-extrabold',
            };
        return {
            label: 'Perlu Bimbingan',
            color: 'text-rose-800 bg-rose-100 border-rose-300 font-extrabold',
        };
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
            <Head title="Papan Pemuka Pelajar - UniWise" />

            {/* Dynamic Hero Banner (Midnight Navy + Ambient Glow) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 md:p-8 text-white shadow-xl mb-8 border border-slate-800/80">
                <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 mb-3 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Sistem Panduan Kerjaya & Halatuju SPM Pintar</span>
                        </div>
                        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                            {greeting.text}, {user?.name}! {greeting.emoji}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                            Pantau keputusan akademik SPM, kenal pasti personaliti RIASEC anda, dan semak kelayakan program IPTA terkini.
                        </p>
                    </div>

                    {/* Quick Profile Pill on Hero */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shrink-0 shadow-lg">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 shadow-md"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-lg shadow-md ring-2 ring-white/20">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <div>
                            <div className="text-xs font-bold text-white truncate max-w-[140px]">
                                {user?.name}
                            </div>
                            <div className="text-[11px] text-blue-200">ID: #{user?.id} &bull; SPM Calon</div>
                            <div className="mt-1">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Akaun Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3-Step Guided Journey Stepper Bar (Vibrant Indicators) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 md:p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Langkah Panduan Kerjaya Anda
                        </span>
                        <h2 className="font-display text-base font-extrabold text-slate-900">
                            Kemajuan Profil & Halatuju Pelajar
                        </h2>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Langkah {journeyProgress} daripada 3
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1: Keputusan SPM */}
                    <div
                        className={`p-4 rounded-2xl border transition-all ${
                            hasSpm
                                ? 'bg-emerald-50/70 border-emerald-300'
                                : 'bg-white border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                                        hasSpm
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-blue-600 text-white'
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
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                            >
                                <span>{hasSpm ? 'Kemaskini Gred' : 'Isi Gred Sekarang'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Step 2: Penilaian RIASEC */}
                    <div
                        className={`p-4 rounded-2xl border transition-all ${
                            dominantTrait
                                ? 'bg-purple-50/70 border-purple-300'
                                : hasSpm
                                ? 'bg-white border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
                                : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                                        dominantTrait
                                            ? 'bg-purple-600 text-white'
                                            : hasSpm
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-slate-300 text-slate-600'
                                    }`}
                                >
                                    {dominantTrait ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">2. Minat RIASEC</div>
                                    <div className="text-[11px] text-slate-500">
                                        {dominantTrait
                                            ? `Dominan: ${dominantTrait.toUpperCase()}`
                                            : 'Ujian 30 Soalan'}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    dominantTrait
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {dominantTrait ? 'Selesai' : 'Langkah 2'}
                            </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                            <Link
                                href="/riasec"
                                className="text-xs font-bold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1"
                            >
                                <span>{dominantTrait ? 'Uji Semula' : 'Mula Ujian'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Step 3: Cadangan Program IPTA */}
                    <div
                        className={`p-4 rounded-2xl border transition-all ${
                            dominantTrait && hasSpm
                                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30'
                                : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                                        dominantTrait && hasSpm
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-slate-300 text-slate-600'
                                    }`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">3. Padanan IPTA</div>
                                    <div className="text-[11px] text-slate-500">
                                        {dominantTrait && hasSpm
                                            ? 'Padanan Bersedia Diperiksa'
                                            : 'Selesaikan Langkah 1 & 2'}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    dominantTrait && hasSpm
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {dominantTrait && hasSpm ? 'Terbuka' : 'Terkunci'}
                            </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                            <Link
                                href={
                                    recentHistory.length > 0
                                        ? `/history/${recentHistory[0].session_id}`
                                        : '/directory'
                                }
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

            {/* Dashboard 4 Core Cards Grid (Midnight Executive: Vibrant Contrast & Rich Gradients) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Profile Summary Card (Cobalt / Indigo Accent) */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 rounded-xl shadow-xs">
                                Ringkasan Profil
                            </span>
                            <Link
                                href="/profile"
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
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
                                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-100 shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-md ring-4 ring-blue-100">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}

                            <div>
                                <h3 className="font-display text-xl font-extrabold text-slate-900 leading-tight">
                                    {user?.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
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
                        <div className="grid grid-cols-2 gap-3 mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                            <div>
                                <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    Status Akademik
                                </span>
                                <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                                    {hasSpm ? `${spmCount} Mata Pelajaran` : 'Belum Dimasukkan'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    Personaliti Kerjaya
                                </span>
                                <span className="text-xs font-black text-purple-700 mt-0.5 block">
                                    {dominantTrait ? dominantTrait.toUpperCase() : 'Belum Dinilai'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center text-xs">
                        <Link
                            href="/profile/edit"
                            className="px-4 py-2.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl font-bold transition inline-flex items-center gap-1.5 active:scale-95"
                        >
                            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>Kemaskini Profil</span>
                        </Link>
                        <button
                            onClick={() => router.post('/logout')}
                            title="Log Keluar"
                            className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition flex items-center gap-1.5 border border-rose-200 active:scale-95 cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Keluar</span>
                        </button>
                    </div>
                </div>

                {/* 2. RIASEC Traits Graph Card (Royal Violet / Purple Accent) */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-purple-600 px-3.5 py-1.5 rounded-xl shadow-xs">
                                Graf Personaliti RIASEC
                            </span>
                            {dominantTrait ? (
                                <span className="text-xs font-black text-violet-800 bg-violet-100 px-3 py-1 rounded-full border border-violet-200 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-violet-600" />
                                    <span>Dominan: {dominantTrait.toUpperCase()}</span>
                                </span>
                            ) : (
                                <span className="text-[11px] font-semibold text-slate-400">
                                    30 Soalan Penilaian
                                </span>
                            )}
                        </div>

                        {riasecScores ? (
                            <div className="py-2 flex items-center justify-center">
                                <RiasecRadarChart scores={riasecScores} size={230} />
                            </div>
                        ) : (
                            <div className="h-52 flex flex-col items-center justify-center text-center p-4 bg-purple-50/30 rounded-2xl border border-dashed border-purple-200">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 shadow-xs">
                                    <Compass className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    Penilaian RIASEC belum diambil
                                </p>
                                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                    Jawab soalan minat kerjaya untuk mengetahui kecenderungan personaliti Holland anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">
                            {dominantTrait ? 'Model Holland Terbukti' : 'Memerlukan keputusan SPM'}
                        </span>
                        <Link
                            href="/riasec"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
                        >
                            <span>{dominantTrait ? 'Uji Semula Kuiz' : 'Ambil Kuiz Sekarang'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* 3. Academic Result Summary Card (Emerald / Teal Accent) */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 rounded-xl shadow-xs">
                                Ringkasan Keputusan SPM
                            </span>
                            {meritTier && (
                                <span className={`text-[11px] px-3 py-1 rounded-full border ${meritTier.color}`}>
                                    {meritTier.label}
                                </span>
                            )}
                        </div>

                        {hasSpm ? (
                            <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
                                {/* Circular Merit Score Widget with Emerald/Teal Gradient */}
                                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                                    <svg className="w-28 h-28 transform -rotate-90">
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="44"
                                            stroke="#E2E8F0"
                                            strokeWidth="9"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="44"
                                            stroke="#059669"
                                            strokeWidth="9"
                                            strokeDasharray={276.4}
                                            strokeDashoffset={276.4 - (276.4 * (meritScore || 0)) / 100}
                                            strokeLinecap="round"
                                            fill="transparent"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="font-display text-2xl font-black text-slate-900 tracking-tight">
                                            {meritScore}%
                                        </span>
                                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                                            Markah Merit
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <div className="inline-block text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mb-1">
                                        {stream || 'Aliran SPM'}
                                    </div>
                                    <h4 className="font-display text-sm font-bold text-slate-900 mt-1">
                                        {spmCount} Mata Pelajaran Direkodkan
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Formula merit standard KPM: Berdasarkan 8 mata pelajaran terbaik untuk penentuan kelayakan IPTA.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-xs">
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
                        <span className="text-xs text-slate-500 font-medium">
                            {hasSpm ? 'Data akademik aktif' : 'Prasyarat untuk kuiz RIASEC'}
                        </span>
                        <Link
                            href="/spm-results"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-md shadow-emerald-500/20 transition active:scale-95"
                        >
                            <span>{hasSpm ? 'Kemaskini Keputusan' : 'Masukkan Keputusan SPM'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* 4. Recent History Card (Warm Amber / Gold Accent) */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 rounded-xl shadow-xs">
                                Sejarah Penilaian Terkini
                            </span>
                            <Link
                                href="/history"
                                className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentHistory && recentHistory.length > 0 ? (
                            <div className="space-y-2.5 my-2">
                                {recentHistory.slice(0, 3).map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/history/${item.session_id}`}
                                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-300 transition group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition shadow-xs">
                                                <Award className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-800 group-hover:text-amber-800 transition">
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
                                            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                                {item.merit_score}%
                                            </span>
                                            <span className="block text-[10px] font-bold text-slate-400 mt-0.5">Merit</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 shadow-xs">
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

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Arkib padanan disimpan selamat</span>
                        <Link
                            href="/history"
                            className="font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                            <span>Buka Rekod Sejarah</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Explore Strip (Polished & Vibrant) */}
            <div className="mt-8 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl border border-slate-700/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md flex items-center justify-center shrink-0">
                        <Search className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-display text-sm font-extrabold text-white">
                            Ingin meneroka kursus universiti awam secara manual?
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                            Semak direktori program Asasi, Diploma, dan Sijil di 20 universiti awam (IPTA) Malaysia.
                        </p>
                    </div>
                </div>
                <Link
                    href="/directory"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700 font-extrabold text-xs rounded-xl shadow-sm transition shrink-0 active:scale-95"
                >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Buka Direktori IPTA</span>
                </Link>
            </div>
        </UserLayout>
    );
}
