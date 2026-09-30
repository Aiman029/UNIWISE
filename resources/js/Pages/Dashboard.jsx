import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
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

    return (
        <UserLayout activePage="dashboard">
            <Head title="User Dashboard - UniWise" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Selamat Kembali, {user?.name}!
                </h1>
                <p className="text-sm text-slate-500">
                    Pantau status keputusan akademik SPM, penilaian personaliti RIASEC, dan rekod cadangan program IPTA anda.
                </p>
            </div>

            {/* Dashboard Grid matching Figure 3.2.1.1.5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Profile Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                                Ringkasan Profil
                            </span>
                            <Link
                                href="/profile"
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Urus Profil &rarr;
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 my-2">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full object-cover ring-4 ring-sky-100"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
                                <p className="text-sm text-slate-500">{user?.email}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Akaun Aktif
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        Peranan: SPM Graduate
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span>UniWise ID: #{user?.id}</span>
                        <Link
                            href="/profile/edit"
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition"
                        >
                            Kemaskini Gambar / Kata Laluan
                        </Link>
                    </div>
                </div>

                {/* 2. RIASEC Traits Graph Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                Graf Ciri Personaliti RIASEC
                            </span>
                            {dominantTrait && (
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                                    Dominan: {dominantTrait.toUpperCase()}
                                </span>
                            )}
                        </div>

                        {riasecScores ? (
                            <div className="py-2">
                                <RiasecRadarChart scores={riasecScores} size={240} />
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                                <HelpCircle className="w-12 h-12 text-slate-300 mb-2" />
                                <p className="text-sm font-medium text-slate-700">
                                    Penilaian RIASEC belum diambil
                                </p>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                    Lengkapkan 30 soalan minat kerjaya untuk menjana graf personaliti anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                            {dominantTrait ? 'Personaliti dinilai' : 'Memerlukan keputusan SPM'}
                        </span>
                        <Link
                            href="/riasec"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                            <span>{dominantTrait ? 'Uji Semula Kuiz' : 'Ambil Kuiz Sekarang'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* 3. Academic Result Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                Ringkasan Keputusan SPM
                            </span>
                            <Link
                                href="/spm-results"
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                            >
                                {hasSpm ? 'Kemaskini Keputusan &rarr;' : 'Isi Sekarang &rarr;'}
                            </Link>
                        </div>

                        {hasSpm ? (
                            <div className="flex items-center gap-6 my-2">
                                {/* Circular Merit Score Widget */}
                                <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                                    <svg className="w-28 h-28 transform -rotate-90">
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="45"
                                            stroke="#e2e8f0"
                                            strokeWidth="8"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="45"
                                            stroke="#0284c7"
                                            strokeWidth="8"
                                            strokeDasharray={282.7}
                                            strokeDashoffset={282.7 - (282.7 * (meritScore || 0)) / 100}
                                            strokeLinecap="round"
                                            fill="transparent"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="text-xl font-extrabold text-slate-900">
                                            {meritScore}%
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                            Markah Merit
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">
                                        {stream || 'Aliran SPM'}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {spmCount} mata pelajaran disimpan
                                    </p>
                                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        Kelayakan akademik dioptimumkan untuk padanan IPTA.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-32 flex flex-col items-center justify-center text-center p-4">
                                <GraduationCap className="w-10 h-10 text-slate-300 mb-2" />
                                <p className="text-sm font-semibold text-slate-700">
                                    Keputusan SPM belum dimasukkan
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Sila masukkan mata pelajaran universal dan elektif anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                            {hasSpm ? 'Keputusan disimpan' : 'Prasyarat untuk penilaian RIASEC'}
                        </span>
                        <Link
                            href="/spm-results"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white hover:bg-sky-700 text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                            <span>{hasSpm ? 'Edit Keputusan SPM' : 'Masukkan Keputusan SPM'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* 4. Recent History Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                                Sejarah Terkini
                            </span>
                            <Link
                                href="/history"
                                className="text-xs font-semibold text-amber-600 hover:text-amber-800"
                            >
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        {recentHistory && recentHistory.length > 0 ? (
                            <div className="space-y-3 my-2">
                                {recentHistory.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/history/${item.session_id}`}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                                                    Ujian RIASEC: {item.dominant_trait}
                                                </div>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1">
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
                                            <span className="text-xs font-extrabold text-sky-700">
                                                {item.merit_score}%
                                            </span>
                                            <span className="block text-[10px] text-slate-400">Merit</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 flex flex-col items-center justify-center text-center p-4">
                                <HistoryIcon className="w-10 h-10 text-slate-300 mb-2" />
                                <p className="text-sm font-semibold text-slate-700">
                                    Tiada sejarah penilaian lagi
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Sejarah ujian RIASEC dan cadangan program akan dipaparkan di sini.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span>Log cadangan automatik</span>
                        <Link
                            href="/history"
                            className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                        >
                            Semak arkib sejarah
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}