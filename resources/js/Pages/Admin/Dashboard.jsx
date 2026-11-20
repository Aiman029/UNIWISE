import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    BookOpen,
    HelpCircle,
    Sliders,
    Clock,
    TrendingUp,
    ChevronRight,
    ArrowUpRight,
    Sparkles,
    Award,
    School,
    GraduationCap,
    PieChart,
    BarChart3,
    Compass,
    Target,
    Layers,
    Activity,
    CheckCircle2,
    Calendar,
    Flame,
} from 'lucide-react';

export default function Dashboard({
    stats = {},
    riasecDistribution = [],
    meritDistribution = [],
    topUniversities = [],
    topProgrammes = [],
    streamBreakdown = {},
    chartData = {},
    activities = [],
}) {
    // Determine most dominant trait
    const topTrait = riasecDistribution.length > 0
        ? [...riasecDistribution].sort((a, b) => b.count - a.count)[0]
        : null;

    // Stat Cards matching and enhancing Figure 3.2.1.1.6
    const statCards = [
        {
            title: 'Jumlah Pelajar Berdaftar',
            subtitle: 'Calon Lepasan SPM',
            value: stats.totalUsers ?? 0,
            badge: `${stats.totalAssessments ?? 0} Selesai Penilaian`,
            icon: Users,
            color: 'from-sky-500 to-sky-600',
            link: '/admin/users',
        },
        {
            title: 'Katalog Program IPTA',
            subtitle: `${stats.totalUniversities ?? 0} Universiti & Politeknik`,
            value: stats.totalProgrammes ?? 0,
            badge: '21 Institusi Awam',
            icon: BookOpen,
            color: 'from-blue-600 to-indigo-600',
            link: '/admin/programmes',
        },
        {
            title: 'Soalan Inventori RIASEC',
            subtitle: '6 Domain Personaliti',
            value: stats.totalQuestions ?? 0,
            badge: '5 Soalan / Kategori',
            icon: HelpCircle,
            color: 'from-cyan-500 to-blue-600',
            link: '/admin/riasec-questions',
        },
        {
            title: 'Peraturan Padanan Merit',
            subtitle: 'Enjin Pemadanan Pintar',
            value: stats.totalRules ?? 0,
            badge: 'Syarat Gred & Min Merit',
            icon: Sliders,
            color: 'from-sky-600 to-teal-600',
            link: '/admin/recommendation-rules',
        },
    ];

    // Compute max bar value for Programme Levels (SRS Figure 3.2.1.1.6)
    const maxBarValue = Math.max(
        ...(chartData.available || [10]),
        ...(chartData.matched || [10]),
        10
    );

    // Compute max for Merit Distribution Bar Chart
    const maxMeritTierCount = Math.max(
        ...(meritDistribution.map((t) => t.count) || [5]),
        5
    );

    return (
        <AdminLayout activePage="dashboard">
            <Head title="Papan Pemuka Analitik Pentadbir - UniWise" />

            <div className="space-y-8">
                {/* Header */}
                <div className="pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                            <Activity className="w-5 h-5" />
                        </span>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Papan Pemuka & Analitik Pentadbir
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Cerapan analitik masa nyata penilaian RIASEC, taburan skor merit SPM, dan statistik pemadanan program IPTA.
                    </p>
                </div>

                {/* 4 Core Stat Cards (SRS Figure 3.2.1.1.6) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={idx}
                                href={card.link}
                                className={`relative overflow-hidden bg-gradient-to-br ${card.color} text-white rounded-3xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 group`}
                            >
                                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-sm pointer-events-none group-hover:scale-125 transition duration-500" />

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                                        {card.title}
                                    </span>
                                    <div className="p-2 rounded-2xl bg-white/15 backdrop-blur-sm text-white">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="text-3xl font-black tracking-tight mb-1">
                                    {card.value}
                                </div>

                                <div className="text-xs text-sky-100/90 mb-3 font-medium">
                                    {card.subtitle}
                                </div>

                                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-semibold text-sky-100">
                                    <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">
                                        {card.badge}
                                    </span>
                                    <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition">
                                        Urus <ArrowUpRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Merit & Stream Quick Metric Ribbon */}
                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                        {/* Avg Merit */}
                        <div className="flex items-center gap-4 sm:pr-4">
                            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Purata Merit Pelajar
                                </span>
                                <div className="text-2xl font-black text-white">
                                    {stats.avgMerit ? `${stats.avgMerit}%` : '0.0%'}
                                </div>
                                <span className="text-[11px] text-sky-300">
                                    Berasaskan 90% Akademik + 10% Koku
                                </span>
                            </div>
                        </div>

                        {/* Max & Min Merit */}
                        <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
                            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Julat Skor Merit
                                </span>
                                <div className="text-2xl font-black text-white">
                                    {stats.maxMerit ? `${stats.maxMerit}%` : '0%'}
                                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                                        (Min: {stats.minMerit ?? 0}%)
                                    </span>
                                </div>
                                <span className="text-[11px] text-emerald-300">
                                    Skor Tertinggi Direkodkan
                                </span>
                            </div>
                        </div>

                        {/* Top RIASEC Trait */}
                        <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
                            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Personaliti Paling Dominan
                                </span>
                                <div className="text-2xl font-black text-amber-300">
                                    {topTrait ? topTrait.label : 'Tiada Data'}
                                </div>
                                <span className="text-[11px] text-slate-300">
                                    {topTrait ? `${topTrait.percentage}% daripada calon` : 'Belum dinilai'}
                                </span>
                            </div>
                        </div>

                        {/* Stream Ratio */}
                        <div className="flex items-center gap-4 sm:pl-4 pt-4 sm:pt-0">
                            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Pecahan Aliran SPM
                                </span>
                                <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-between">
                                    <span className="text-sky-300">
                                        Sains: {streamBreakdown.science?.percentage ?? 50}%
                                    </span>
                                    <span className="text-purple-300">
                                        Sastera: {streamBreakdown.arts?.percentage ?? 50}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 mt-1.5 flex overflow-hidden">
                                    <div
                                        className="bg-sky-400 h-full"
                                        style={{ width: `${streamBreakdown.science?.percentage ?? 50}%` }}
                                    />
                                    <div
                                        className="bg-purple-400 h-full"
                                        style={{ width: `${streamBreakdown.arts?.percentage ?? 50}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 1: RIASEC Distribution & SPM Merit Tiers (2 Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: RIASEC Dominant Trait Distribution */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <span className="p-2 rounded-xl bg-sky-50 text-sky-700">
                                        <Compass className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-black text-slate-800">
                                            Taburan Personaliti RIASEC Dominan
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Frekuensi sifat personaliti utama bagi calon SPM yang melengkapkan inventori.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                    {stats.totalAssessments ?? 0} Sesi
                                </span>
                            </div>

                            {/* Trait Progress List */}
                            <div className="space-y-4">
                                {riasecDistribution.map((item, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-black"
                                                    style={{ backgroundColor: item.color }}
                                                >
                                                    {item.code}
                                                </span>
                                                <span className="text-slate-700 font-extrabold">
                                                    {item.label}
                                                </span>
                                                <span className="text-slate-400 text-[11px] font-normal">
                                                    ({item.trait})
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500 font-semibold">
                                                    {item.count} calon
                                                </span>
                                                <span className="text-slate-900 font-black min-w-[42px] text-right">
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${Math.max(item.percentage, 2)}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                            <span>Berasaskan Teori Kerjaya John L. Holland</span>
                            <span className="text-sky-700 font-bold">6 Sifat Inventori</span>
                        </div>
                    </div>

                    {/* Right: SPM Merit Score Distribution (5 Tiers) */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                                        <BarChart3 className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-black text-slate-800">
                                            Taburan Skor Merit UPU Calon
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Pecahan prestasi merit akademik SPM calon mengikut 5 kategori pencapaian.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    Purata: {stats.avgMerit}%
                                </span>
                            </div>

                            {/* Tier Bar Chart */}
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="h-44 flex items-end justify-around gap-4 pt-4 pb-2 border-b border-slate-200">
                                    {meritDistribution.map((tier, idx) => {
                                        const barHeight = Math.max(
                                            16,
                                            Math.round((tier.count / maxMeritTierCount) * 130)
                                        );

                                        return (
                                            <div
                                                key={idx}
                                                className="flex-1 flex flex-col items-center justify-end h-full group"
                                            >
                                                <span className="text-[11px] font-black text-slate-700 mb-1">
                                                    {tier.count}
                                                </span>
                                                <div
                                                    className={`w-full max-w-[42px] ${tier.color} rounded-t-xl transition-all duration-500 shadow-sm hover:opacity-90`}
                                                    style={{ height: `${barHeight}px` }}
                                                />
                                                <span className="text-[11px] font-bold text-slate-700 mt-2 text-center whitespace-nowrap">
                                                    {tier.grade}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {tier.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400 font-semibold px-1">
                                    <span>Skor Merit SPM</span>
                                    <span>Pemberatan 90% Akademik + 10% Koku</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                            <span>Formula Pengiraan Rasmi UPU BPKP JPT</span>
                            <span className="text-emerald-700 font-bold">5 Gred Skala</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Top Recommended IPTA & Programmes (2 Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top 5 Recommended Universities */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                                    <School className="w-5 h-5" />
                                </span>
                                <div>
                                    <h2 className="text-base font-black text-slate-800">
                                        Top 5 Institusi Paling Kerap Dipadankan
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        IPTA yang paling banyak menerima padanan kursus berdasarkan profil calon.
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                Mengikut Kekerapan
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {topUniversities && topUniversities.length > 0 ? (
                                topUniversities.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                                #{idx + 1}
                                            </span>
                                            <div>
                                                <div className="text-xs font-extrabold text-slate-800">
                                                    {item.institution}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {item.percentage}% daripada keseluruhan padanan program
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-sm font-black text-blue-700">
                                                {item.count}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block font-semibold">
                                                padanan
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    Tiada data padanan universiti lagi.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top 5 Recommended Programmes */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                                    <GraduationCap className="w-5 h-5" />
                                </span>
                                <div>
                                    <h2 className="text-base font-black text-slate-800">
                                        Top 5 Program Pengajian Paling Popular
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Kursus yang paling kerap dipadankan dengan calon lepasan SPM.
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                Paling Diminati
                            </span>
                        </div>

                        <div className="space-y-3">
                            {topProgrammes && topProgrammes.length > 0 ? (
                                topProgrammes.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition flex items-start justify-between gap-3"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {p.code && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-200 text-slate-800 font-mono">
                                                        {p.code}
                                                    </span>
                                                )}
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                                                    {p.level}
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-500">
                                                    {p.institution}
                                                </span>
                                            </div>
                                            <div className="text-xs font-extrabold text-slate-800 line-clamp-1">
                                                {p.name}
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                                {p.match_count} kali
                                            </span>
                                            {p.merit && (
                                                <span className="text-[10px] text-slate-400 block mt-1 font-semibold">
                                                    Merit UPU: {p.merit}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    Tiada data padanan program lagi.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 3: Baseline SRS Figure 3.2.1.1.6 (Activity Feed & Programme Types by Merit) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Left: System Activity Feed per Figure 3.2.1.1.6 */}
                    <div className="bg-sky-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-sky-500/60 mb-5">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-sky-200" />
                                    <h2 className="text-base font-extrabold uppercase tracking-wide">
                                        Log Aktiviti Sistem
                                    </h2>
                                </div>
                                <span className="text-xs font-semibold bg-sky-700/80 px-2.5 py-1 rounded-md text-sky-100">
                                    Rekod Langsung
                                </span>
                            </div>

                            <div className="space-y-3">
                                {activities && activities.length > 0 ? (
                                    activities.map((act, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3.5 rounded-xl bg-sky-700/60 border border-sky-500/50 flex items-start justify-between gap-3 hover:bg-sky-700/80 transition"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                                    {act.title}
                                                </div>
                                                <div className="text-[11px] text-sky-100 line-clamp-1">
                                                    {act.detail}
                                                </div>
                                            </div>

                                            <span className="text-[10px] font-semibold text-sky-300 whitespace-nowrap shrink-0">
                                                {act.time}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-sky-200 text-xs">
                                        Tiada aktiviti sistem direkodkan lagi.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-sky-500/50 text-[11px] text-sky-200 text-center">
                            Memaparkan pendaftaran terkini dan aktiviti pengiraan merit.
                        </div>
                    </div>

                    {/* Right: Programme Type matched by Merit Bar Chart per Figure 3.2.1.1.6 */}
                    <div className="bg-sky-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-sky-500/60 mb-5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-amber-300" />
                                    <h2 className="text-base font-extrabold uppercase tracking-wide">
                                        Jenis Program Dipadankan Mengikut Merit
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-bold">
                                    <span className="flex items-center gap-1 text-amber-300">
                                        <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm inline-block" />
                                        Tersedia ({chartData.available?.reduce((a, b) => a + b, 0) ?? 0})
                                    </span>
                                    <span className="flex items-center gap-1 text-white">
                                        <span className="w-2.5 h-2.5 bg-indigo-900 rounded-sm inline-block" />
                                        Dipadankan ({chartData.matched?.reduce((a, b) => a + b, 0) ?? 0})
                                    </span>
                                </div>
                            </div>

                            {/* Bar Chart Container */}
                            <div className="bg-white rounded-2xl p-6 shadow-inner text-slate-800 my-2">
                                <div className="h-52 flex items-end justify-around gap-6 pt-6 pb-2 border-b border-slate-200">
                                    {(chartData.levels || ['Diploma', 'Foundation', 'Certificate']).map(
                                        (level, idx) => {
                                            const availVal = chartData.available?.[idx] ?? 0;
                                            const matchVal = chartData.matched?.[idx] ?? 0;

                                            const availHeight = Math.max(
                                                12,
                                                Math.round((availVal / maxBarValue) * 160)
                                            );
                                            const matchHeight = Math.max(
                                                12,
                                                Math.round((matchVal / maxBarValue) * 160)
                                            );

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex-1 flex flex-col items-center justify-end h-full group"
                                                >
                                                    <div className="flex items-end gap-2 w-full justify-center">
                                                        {/* Available bar (Amber) */}
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-amber-600 mb-1 opacity-80 group-hover:opacity-100">
                                                                {availVal}
                                                            </span>
                                                            <div
                                                                className="w-7 sm:w-10 bg-amber-400 hover:bg-amber-500 rounded-t-lg transition-all duration-500 shadow-sm"
                                                                style={{ height: `${availHeight}px` }}
                                                            />
                                                        </div>

                                                        {/* Matched bar (Indigo) */}
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-indigo-700 mb-1 opacity-80 group-hover:opacity-100">
                                                                {matchVal}
                                                            </span>
                                                            <div
                                                                className="w-7 sm:w-10 bg-indigo-900 hover:bg-indigo-950 rounded-t-lg transition-all duration-500 shadow-sm"
                                                                style={{ height: `${matchHeight}px` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <span className="text-xs font-bold text-slate-700 mt-3 truncate max-w-full">
                                                        {level}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400 font-semibold px-2">
                                    <span>Peringkat Pengajian IPTA</span>
                                    <span>Skala Dinamik Automatik</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-sky-500/50 text-[11px] text-sky-200 text-center">
                            Memaparkan program tersedia berbanding yang berjaya dipadankan mengikut merit SPM.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}