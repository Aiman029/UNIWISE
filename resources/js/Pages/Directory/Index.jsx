import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { calculateAdmissionChance } from '@/Utils/admissionChance';
import {
    School,
    BookOpen,
    Search,
    Filter,
    SlidersHorizontal,
    Sparkles,
    Award,
    TrendingUp,
    CheckCircle2,
    Info,
    X,
    ExternalLink,
    GraduationCap,
    Cpu,
    Wrench,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    FileText,
} from 'lucide-react';

export default function Index({
    programmes = [],
    universities = [],
    userMeritScore = null,
    stats = {},
}) {
    const [selectedProgramme, setSelectedProgramme] = useState(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInst, setSelectedInst] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [selectedChance, setSelectedChance] = useState('all');
    const [selectedSort, setSelectedSort] = useState(userMeritScore ? 'chance_desc' : 'name_asc');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Attach calculated chance to every programme if student has a merit score
    const programmesWithChance = useMemo(() => {
        return programmes.map((p) => {
            const chance = userMeritScore
                ? calculateAdmissionChance(userMeritScore, p.merit, p.notes)
                : null;
            return {
                ...p,
                admissionChance: chance,
            };
        });
    }, [programmes, userMeritScore]);

    // Unique institutions from list
    const instList = useMemo(() => {
        if (universities && universities.length > 0) {
            return universities.map((u) => u.name);
        }
        const set = new Set();
        programmes.forEach((p) => {
            if (p.institution) set.add(p.institution);
        });
        return Array.from(set).sort();
    }, [universities, programmes]);

    // Filter and Sort Logic
    const filteredProgrammes = useMemo(() => {
        let list = programmesWithChance.filter((p) => {
            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = p.name?.toLowerCase().includes(q);
                const matchCode = p.code?.toLowerCase().includes(q);
                const matchInst = p.institution?.toLowerCase().includes(q);
                if (!matchName && !matchCode && !matchInst) return false;
            }

            // Institution filter
            if (selectedInst !== 'all' && p.institution !== selectedInst) {
                return false;
            }

            // Level filter
            if (selectedLevel !== 'all' && p.level !== selectedLevel) {
                return false;
            }

            // Tag filter (STEM / TVET / Temuduga)
            if (selectedTag !== 'all') {
                const notes = (p.notes || '').toLowerCase();
                if (selectedTag === 'stem' && !notes.includes('stem')) return false;
                if (selectedTag === 'tvet' && !notes.includes('tvet')) return false;
                if (selectedTag === 'temuduga' && !notes.includes('temuduga')) return false;
            }

            // Chance filter (only if user has merit)
            if (userMeritScore && selectedChance !== 'all') {
                if (selectedChance === 'tinggi' && p.admissionChance?.status !== 'tinggi') return false;
                if (selectedChance === 'sederhana' && p.admissionChance?.status !== 'sederhana') return false;
                if (selectedChance === 'sasaran' && p.admissionChance?.status !== 'sasaran') return false;
                if (selectedChance === 'temuduga' && !['temuduga', 'terbuka'].includes(p.admissionChance?.status)) return false;
            }

            return true;
        });

        // Sorting
        list.sort((a, b) => {
            if (selectedSort === 'chance_desc' && userMeritScore) {
                if (a.admissionChance?.priority !== b.admissionChance?.priority) {
                    return (a.admissionChance?.priority ?? 9) - (b.admissionChance?.priority ?? 9);
                }
                return (b.admissionChance?.scoreDiff ?? -999) - (a.admissionChance?.scoreDiff ?? -999);
            }
            if (selectedSort === 'merit_desc') {
                return (b.merit ?? 0) - (a.merit ?? 0);
            }
            if (selectedSort === 'merit_asc') {
                return (a.merit ?? 999) - (b.merit ?? 999);
            }
            if (selectedSort === 'code_asc') {
                return (a.code || '').localeCompare(b.code || '');
            }
            // Default name_asc
            return a.name.localeCompare(b.name);
        });

        return list;
    }, [
        programmesWithChance,
        searchQuery,
        selectedInst,
        selectedLevel,
        selectedTag,
        selectedChance,
        selectedSort,
        userMeritScore,
    ]);

    // Reset pagination when filter changes
    const totalPages = Math.ceil(filteredProgrammes.length / itemsPerPage);
    const paginatedProgrammes = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProgrammes.slice(start, start + itemsPerPage);
    }, [filteredProgrammes, currentPage]);

    const handleFilterChange = (setter, val) => {
        setter(val);
        setCurrentPage(1);
    };

    return (
        <UserLayout activePage="directory">
            <Head title="Direktori Program Pengajian IPTA - UniWise" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-sky-900 to-indigo-900 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-indigo-800">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-300/30">
                            <Sparkles className="w-3.5 h-3.5" />
                            Katalog Eksplorasi Program IPTA
                        </span>

                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                            Direktori Program & Institusi Pengajian Tinggi Awam
                        </h1>

                        <p className="text-sm md:text-base text-sky-100/90 leading-relaxed">
                            Terokai {stats.totalProgrammes ?? 256} program pengajian lepasan SPM merangkumi Asasi, Diploma, dan Sijil di {stats.totalUniversities ?? 21} IPTA dan Politeknik seluruh Malaysia berserta purata merit rasmi UPU.
                        </p>

                        {/* User merit score notice */}
                        {userMeritScore ? (
                            <div className="pt-2 flex items-center gap-3">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>
                                        Skor Merit SPM Anda: <strong>{userMeritScore}%</strong> — Penunjuk Peluang Kemasukan diaktifkan secara automatik!
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-2 flex items-center gap-3">
                                <Link
                                    href="/spm-results"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white border border-white/20 text-xs font-bold transition"
                                >
                                    <Info className="w-4 h-4 text-amber-300 shrink-0" />
                                    <span>
                                        Masukkan keputusan SPM anda untuk melihat penunjuk peluang kemasukan pada setiap kursus.
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-8 mt-8 border-t border-indigo-800/80">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                                Jumlah Kursus
                            </span>
                            <span className="text-xl font-black text-white">
                                {stats.totalProgrammes ?? 256}
                            </span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                                Universiti Awam
                            </span>
                            <span className="text-xl font-black text-amber-300">
                                {stats.totalUniversities ?? 21}
                            </span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                                Diploma
                            </span>
                            <span className="text-xl font-black text-sky-300">
                                {stats.diplomaCount ?? 219}
                            </span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                                Asasi (Foundation)
                            </span>
                            <span className="text-xl font-black text-indigo-300">
                                {stats.foundationCount ?? 29}
                            </span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                                Bidang STEM
                            </span>
                            <span className="text-xl font-black text-emerald-300">
                                {stats.stemCount ?? 0}
                            </span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                                Bidang TVET
                            </span>
                            <span className="text-xl font-black text-orange-300">
                                {stats.tvetCount ?? 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Instant Search Bar */}
                        <div className="relative flex-1 w-full">
                            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama kursus, kod UPU (cth: M0010, A0010), atau universiti..."
                                value={searchQuery}
                                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white transition"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => handleFilterChange(setSearchQuery, '')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort Selector */}
                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                            <select
                                value={selectedSort}
                                onChange={(e) => handleFilterChange(setSelectedSort, e.target.value)}
                                className="w-full md:w-56 py-3 px-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                {userMeritScore && (
                                    <option value="chance_desc">Peluang Terbaik Dahulu</option>
                                )}
                                <option value="name_asc">Nama Kursus (A-Z)</option>
                                <option value="merit_desc">Merit UPU Tertinggi</option>
                                <option value="merit_asc">Merit UPU Terendah</option>
                                <option value="code_asc">Kod Program UPU</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Pills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                        {/* University Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Universiti / Institusi
                            </label>
                            <select
                                value={selectedInst}
                                onChange={(e) => handleFilterChange(setSelectedInst, e.target.value)}
                                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="all">Semua Institusi ({instList.length})</option>
                                {instList.map((inst, idx) => (
                                    <option key={idx} value={inst}>
                                        {inst}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Study Level Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Peringkat Pengajian
                            </label>
                            <select
                                value={selectedLevel}
                                onChange={(e) => handleFilterChange(setSelectedLevel, e.target.value)}
                                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="all">Semua Peringkat</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Foundation">Asasi (Foundation)</option>
                                <option value="Certificate">Sijil (Certificate)</option>
                            </select>
                        </div>

                        {/* Field / Tag Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Bidang / Kategori Khas
                            </label>
                            <select
                                value={selectedTag}
                                onChange={(e) => handleFilterChange(setSelectedTag, e.target.value)}
                                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="all">Semua Bidang</option>
                                <option value="stem">Bidang STEM Sahaja</option>
                                <option value="tvet">Bidang TVET Sahaja</option>
                                <option value="temuduga">Kemasukan Temuduga / Ujian</option>
                            </select>
                        </div>

                        {/* Chance Filter (if merit is available) */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Peluang Kemasukan Anda
                            </label>
                            {userMeritScore ? (
                                <select
                                    value={selectedChance}
                                    onChange={(e) => handleFilterChange(setSelectedChance, e.target.value)}
                                    className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="all">Semua Status Peluang</option>
                                    <option value="tinggi">🟢 Peluang Tinggi</option>
                                    <option value="sederhana">🟡 Berdaya Saing</option>
                                    <option value="sasaran">🔵 Sasaran Tinggi</option>
                                    <option value="temuduga">🟣 Temuduga / Syarat Asas</option>
                                </select>
                            ) : (
                                <div className="py-2 px-3 rounded-xl bg-slate-100 text-[11px] text-slate-400 font-medium">
                                    Perlu masukkan gred SPM
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Result count and reset button */}
                    <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-medium">
                        <span>
                            Menjumpai <strong>{filteredProgrammes.length}</strong> program pengajian
                            {(searchQuery || selectedInst !== 'all' || selectedLevel !== 'all' || selectedTag !== 'all' || selectedChance !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedInst('all');
                                        setSelectedLevel('all');
                                        setSelectedTag('all');
                                        setSelectedChance('all');
                                        setCurrentPage(1);
                                    }}
                                    className="ml-2 text-sky-600 hover:text-sky-800 font-bold underline"
                                >
                                    Set Semula Penapis
                                </button>
                            )}
                        </span>

                        <span>
                            Halaman {currentPage} daripada {Math.max(1, totalPages)}
                        </span>
                    </div>
                </div>

                {/* Programmes Grid */}
                {paginatedProgrammes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProgrammes.map((prog) => {
                            const isSTEM = prog.notes && prog.notes.toLowerCase().includes('stem');
                            const isTVET = prog.notes && prog.notes.toLowerCase().includes('tvet');
                            const isInterview = prog.notes && prog.notes.toLowerCase().includes('temuduga');

                            return (
                                <div
                                    key={prog.id}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-sky-300 transition flex flex-col justify-between group"
                                >
                                    <div className="space-y-3.5">
                                        {/* Top Badges */}
                                        <div className="flex items-center justify-between gap-2">
                                            {prog.code ? (
                                                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900 text-amber-300 font-mono shadow-sm">
                                                    {prog.code}
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-500">
                                                    IPTA
                                                </span>
                                            )}

                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                    prog.level === 'Diploma'
                                                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                                        : prog.level === 'Foundation'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}
                                            >
                                                {prog.level}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h3 className="text-base font-black text-slate-800 group-hover:text-sky-700 transition line-clamp-2">
                                            {prog.name}
                                        </h3>

                                        {/* University Name */}
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                            <School className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                            <span className="truncate">{prog.institution}</span>
                                        </div>

                                        {/* Tags (STEM, TVET, Temuduga) */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {isSTEM && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <Cpu className="w-3 h-3" /> STEM
                                                </span>
                                            )}
                                            {isTVET && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Wrench className="w-3 h-3" /> TVET
                                                </span>
                                            )}
                                            {isInterview && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                    Temu duga
                                                </span>
                                            )}
                                        </div>

                                        {/* Merit Score Section */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">
                                                    Purata Merit UPU:
                                                </span>
                                                <span className="font-black text-slate-800">
                                                    {prog.merit && Number(prog.merit) > 0 ? (
                                                        `${Number(prog.merit).toFixed(2)}%`
                                                    ) : isInterview ? (
                                                        <span className="text-purple-600 font-bold">Temuduga Khas</span>
                                                    ) : (
                                                        <span className="text-slate-400 font-semibold">Syarat Asas</span>
                                                    )}
                                                </span>
                                            </div>

                                            {/* Feasibility Indicator if student has merit score */}
                                            {prog.admissionChance && (
                                                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                                    <span className="text-slate-500 text-[11px] font-medium">
                                                        Peluang Anda:
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${prog.admissionChance.badgeClass}`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${prog.admissionChance.indicatorClass}`}
                                                        />
                                                        {prog.admissionChance.shortLabel}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-5 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => setSelectedProgramme(prog)}
                                            className="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white rounded-xl text-xs font-black tracking-wide transition flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>Lihat Syarat & Butiran</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-base font-bold text-slate-700">
                            Tiada program ditemui untuk carian atau penapis ini.
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Cuba tukar kata kunci carian, pilih institusi lain, atau set semula penapis untuk melihat senarai penuh.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedInst('all');
                                setSelectedLevel('all');
                                setSelectedTag('all');
                                setSelectedChance('all');
                                setCurrentPage(1);
                            }}
                            className="mt-2 px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow hover:bg-sky-700 transition"
                        >
                            Set Semula Semua Penapis
                        </button>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                    // Show first, last, and window around current
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                })
                                .map((page, idx, arr) => {
                                    const prevPage = arr[idx - 1];
                                    const showEllipsis = prevPage && page - prevPage > 1;

                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && (
                                                <span className="px-2 text-xs text-slate-400 font-bold">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 h-9 rounded-xl text-xs font-bold transition shadow-sm ${
                                                    currentPage === page
                                                        ? 'bg-sky-600 text-white'
                                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Programme Details Modal */}
                {selectedProgramme && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6 animate-scale-up">
                            {/* Modal Header */}
                            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {selectedProgramme.code && (
                                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-black bg-slate-900 text-amber-300">
                                                {selectedProgramme.code}
                                            </span>
                                        )}
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                                            {selectedProgramme.level}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 pt-1">
                                        {selectedProgramme.name}
                                    </h3>
                                    <p className="text-xs font-bold text-sky-700 flex items-center gap-1">
                                        <School className="w-3.5 h-3.5" />
                                        {selectedProgramme.institution}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedProgramme(null)}
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Admission Chance Breakdown Callout (if student merit available) */}
                            {selectedProgramme.admissionChance && (
                                <div
                                    className={`p-4 rounded-2xl border ${selectedProgramme.admissionChance.badgeClass}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            Analisis Peluang Kemasukan Anda
                                        </span>
                                        <span className="text-xs font-extrabold">
                                            {selectedProgramme.admissionChance.diffFormatted}
                                        </span>
                                    </div>

                                    <p className="text-xs font-medium leading-relaxed">
                                        {selectedProgramme.admissionChance.description}
                                    </p>

                                    <div className="mt-3 pt-3 border-t border-current/20 grid grid-cols-2 gap-2 text-xs font-bold">
                                        <div>
                                            <span className="text-[10px] block font-normal opacity-80">
                                                Merit SPM Anda
                                            </span>
                                            <span>{userMeritScore}%</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] block font-normal opacity-80">
                                                Merit UPU Lepas
                                            </span>
                                            <span>
                                                {selectedProgramme.merit ? `${selectedProgramme.merit}%` : 'Temuduga/Terbuka'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Program Details Table */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">
                                        Purata Merit Kemasukan UPU
                                    </span>
                                    <span className="font-black text-slate-800 text-sm">
                                        {selectedProgramme.merit && Number(selectedProgramme.merit) > 0
                                            ? `${selectedProgramme.merit}%`
                                            : 'Kemasukan Temuduga / Kelayakan Terbuka'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">
                                        Klasifikasi Program
                                    </span>
                                    <span className="font-black text-slate-800 text-sm">
                                        {selectedProgramme.notes || 'Program Pengajian Awam'}
                                    </span>
                                </div>
                            </div>

                            {/* Entry Requirements */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                    Syarat Kelayakan Masuk (SPM)
                                </h4>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                                    {selectedProgramme.entry_requirement ||
                                        'Lulus SPM dengan sekurang-kurangnya 5 kepujian termasuk Bahasa Melayu, Sejarah, dan subjek berkaitan bidang pengajian.'}
                                </div>
                            </div>

                            {/* Prospek Kerjaya */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                    Laluan Pengajian Seterusnya
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Graduan program ini layak memohon kemasukan ke peringkat Ijazah Sarjana Muda (*Degree*) di universiti awam tempatan melalui saluran UPUOnline lepasan Diploma/Asasi.
                                </p>
                            </div>

                            {/* Close Modal Button */}
                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => setSelectedProgramme(null)}
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
