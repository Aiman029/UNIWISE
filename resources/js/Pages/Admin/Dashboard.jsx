import React from 'react';
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
} from 'lucide-react';

export default function Dashboard({ stats = {}, activities = [], chartData = {} }) {
    const statCards = [
        {
            title: 'Total User',
            value: stats.totalUsers ?? 0,
            icon: Users,
            color: 'from-sky-500 to-sky-600',
            link: '/admin/users',
        },
        {
            title: 'Programmes',
            value: stats.totalProgrammes ?? 0,
            icon: BookOpen,
            color: 'from-blue-600 to-indigo-600',
            link: '/admin/programmes',
        },
        {
            title: 'RIASEC Question',
            value: stats.totalQuestions ?? 0,
            icon: HelpCircle,
            color: 'from-cyan-500 to-blue-600',
            link: '/admin/riasec-questions',
        },
        {
            title: 'Activity Rules',
            value: stats.totalRules ?? 0,
            icon: Sliders,
            color: 'from-sky-600 to-teal-600',
            link: '/admin/recommendation-rules',
        },
    ];

    // Compute max for SVG bar chart scaling
    const maxBarValue = Math.max(
        ...(chartData.available || [10]),
        ...(chartData.matched || [10]),
        10
    );

    return (
        <AdminLayout activePage="dashboard">
            <Head title="Admin Dashboard - UniWise" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Papan Pemuka Pentadbir
                        </h1>
                        <p className="text-sm text-slate-500">
                            Ringkasan sistem UniWise, aktiviti terkini, dan statistik padanan merit program IPTA.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Sistem Beroperasi 100%
                        </span>
                    </div>
                </div>

                {/* 4 Stat Cards matching Figure 3.2.1.1.6 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={idx}
                                href={card.link}
                                className={`relative overflow-hidden bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 group`}
                            >
                                {/* Background decorative wave circle */}
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none group-hover:scale-110 transition" />

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                                        {card.title}
                                    </span>
                                    <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm text-white">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="text-3xl font-black tracking-tight mb-2">
                                    {card.value}
                                </div>

                                <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-100 group-hover:text-white transition">
                                    <span>Urus maklumat</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Two Sections matching Figure 3.2.1.1.6 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Left: System Activity Feed per Figure 3.2.1.1.6 */}
                    <div className="bg-sky-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-sky-500/60 mb-5">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-sky-200" />
                                    <h2 className="text-base font-extrabold uppercase tracking-wide">
                                        System Activity Feed
                                    </h2>
                                </div>
                                <span className="text-xs font-semibold bg-sky-700/80 px-2.5 py-1 rounded-md text-sky-100">
                                    Live Logs
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
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    {act.title}
                                                </div>
                                                <div className="text-[11px] text-sky-200">
                                                    {act.detail}
                                                </div>
                                            </div>

                                            <span className="text-[10px] font-semibold text-sky-300 whitespace-nowrap">
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
                                        Programme Type matched by Merit
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-bold">
                                    <span className="flex items-center gap-1 text-amber-300">
                                        <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm inline-block" />
                                        Tersedia
                                    </span>
                                    <span className="flex items-center gap-1 text-white">
                                        <span className="w-2.5 h-2.5 bg-indigo-900 rounded-sm inline-block" />
                                        Dipadankan
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
                            Nisbah taburan program IPTA dan bilangan pelajar yang layak melepasi merit.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}