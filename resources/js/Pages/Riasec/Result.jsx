import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import RiasecRadarChart from '@/Components/RiasecRadarChart';
import { calculateAdmissionChance } from '@/Utils/admissionChance';
import {
    Award,
    CheckCircle2,
    BookOpen,
    Info,
    ArrowRight,
    School,
    X,
    FileText,
    Search,
    Filter,
    SlidersHorizontal,
    Sparkles,
    Target,
    TrendingUp,
    HelpCircle,
} from 'lucide-react';

export default function Result({
    sessionId,
    dominantTrait,
    traitInfo = {},
    riasecScores = {},
    meritScore = 0,
    programmes = [],
}) {
    const [selectedProgramme, setSelectedProgramme] = useState(null);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInst, setSelectedInst] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedChance, setSelectedChance] = useState('all');
    const [selectedSort, setSelectedSort] = useState('chance_desc');

    // Extract unique institutions from the matched programmes
    const institutions = useMemo(() => {
        const set = new Set();
        programmes.forEach((p) => {
            if (p.institution) set.add(p.institution);
        });
        return Array.from(set).sort();
    }, [programmes]);

    // Attach calculated chance to every programme
    const programmesWithChance = useMemo(() => {
        return programmes.map((p) => {
            const chance = calculateAdmissionChance(meritScore, p.merit, p.notes);
            return {
                ...p,
                admissionChance: chance,
            };
        });
    }, [programmes, meritScore]);

    // Statistics counts
    const stats = useMemo(() => {
        let tinggi = 0;
        let sederhana = 0;
        let sasaran = 0;
        let temuduga = 0;

        programmesWithChance.forEach((p) => {
            if (p.admissionChance.status === 'tinggi') tinggi++;
            else if (p.admissionChance.status === 'sederhana') sederhana++;
            else if (p.admissionChance.status === 'sasaran') sasaran++;
            else temuduga++;
        });

        return {
            total: programmesWithChance.length,
            tinggi,
            sederhana,
            sasaran,
            temuduga,
        };
    }, [programmesWithChance]);

    // Filter and Sort logic
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

            // Chance filter
            if (selectedChance !== 'all') {
                if (selectedChance === 'tinggi' && p.admissionChance.status !== 'tinggi') return false;
                if (selectedChance === 'sederhana' && p.admissionChance.status !== 'sederhana') return false;
                if (selectedChance === 'sasaran' && p.admissionChance.status !== 'sasaran') return false;
                if (selectedChance === 'temuduga' && !['temuduga', 'terbuka'].includes(p.admissionChance.status)) return false;
            }

            return true;
        });

        // Sorting
        list.sort((a, b) => {
            if (selectedSort === 'chance_desc') {
                // Priority ascending (1 = tinggi, 2 = sederhana, etc.)
                if (a.admissionChance.priority !== b.admissionChance.priority) {
                    return a.admissionChance.priority - b.admissionChance.priority;
                }
                // Then by scoreDiff descending
                return (b.admissionChance.scoreDiff ?? -999) - (a.admissionChance.scoreDiff ?? -999);
            }
            if (selectedSort === 'merit_desc') {
                return (b.merit ?? 0) - (a.merit ?? 0);
            }
            if (selectedSort === 'merit_asc') {
                return (a.merit ?? 999) - (b.merit ?? 999);
            }
            if (selectedSort === 'name_asc') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        return list;
    }, [programmesWithChance, searchQuery, selectedInst, selectedLevel, selectedChance, selectedSort]);

    return (
        <UserLayout activePage="riasec">
            <Head title="Keputusan Penilaian RIASEC & Padanan Program IPTA" />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Result Hero Banner matching Figure 3.2.1.4.5 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Radar Chart Display */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                RIASEC TRAITS GRAPH
                            </span>
                            <RiasecRadarChart scores={riasecScores} size={280} />
                        </div>

                        {/* Trait Explanation & Dominant Trait Card */}
                        <div className="w-full lg:w-1/2 space-y-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200">
                                <Award className="w-3.5 h-3.5" />
                                Profil Personaliti Dominan
                            </span>

                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase">
                                Your dominator traits is: <br />
                                <span className="text-sky-600 underline decoration-sky-300">
                                    {traitInfo.name || dominantTrait?.toUpperCase()}
                                </span>
                            </h1>

                            <p className="text-sm font-semibold text-slate-700">
                                {traitInfo.tagline}
                            </p>

                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                {traitInfo.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                    Markah Merit SPM Anda:
                                    <span className="ml-1.5 font-black text-sky-700 text-sm">
                                        {meritScore}%
                                    </span>
                                </div>

                                <div className="text-xs font-medium text-slate-500 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
                                    Program Dipadankan:
                                    <span className="ml-1 font-black text-sm">
                                        {programmes.length} Pilihan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Peluang Kemasukan Quick Stats Pill Bar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-sky-600" />
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                                Analisis Peluang Kemasukan UPU Berdasarkan Skor Merit ({meritScore}%)
                            </h3>
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Klik lencana untuk menapis senarai
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <button
                            type="button"
                            onClick={() => setSelectedChance(selectedChance === 'tinggi' ? 'all' : 'tinggi')}
                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                                selectedChance === 'tinggi'
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                                    : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/60 text-emerald-900'
                            }`}
                        >
                            <div>
                                <span className="text-[11px] font-bold block">Peluang Tinggi</span>
                                <span className="text-[10px] opacity-80">Merit ≥ Cut-off</span>
                            </div>
                            <span className="text-lg font-black">{stats.tinggi}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedChance(selectedChance === 'sederhana' ? 'all' : 'sederhana')}
                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                                selectedChance === 'sederhana'
                                    ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300'
                                    : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/60 text-amber-900'
                            }`}
                        >
                            <div>
                                <span className="text-[11px] font-bold block">Berdaya Saing</span>
                                <span className="text-[10px] opacity-80">Jurang ≤ 3.5%</span>
                            </div>
                            <span className="text-lg font-black">{stats.sederhana}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedChance(selectedChance === 'sasaran' ? 'all' : 'sasaran')}
                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                                selectedChance === 'sasaran'
                                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                                    : 'bg-sky-50/70 border-sky-200 hover:bg-sky-100/60 text-sky-900'
                            }`}
                        >
                            <div>
                                <span className="text-[11px] font-bold block">Sasaran Tinggi</span>
                                <span className="text-[10px] opacity-80">Jurang &gt; 3.5%</span>
                            </div>
                            <span className="text-lg font-black">{stats.sasaran}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedChance(selectedChance === 'temuduga' ? 'all' : 'temuduga')}
                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                                selectedChance === 'temuduga'
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
                                    : 'bg-purple-50/70 border-purple-200 hover:bg-purple-100/60 text-purple-900'
                            }`}
                        >
                            <div>
                                <span className="text-[11px] font-bold block">Temuduga / Asas</span>
                                <span className="text-[10px] opacity-80">Ujian Khas / Terbuka</span>
                            </div>
                            <span className="text-lg font-black">{stats.temuduga}</span>
                        </button>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative w-full md:flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari mengikut nama program, kod UPU (cth: UA4481001), atau universiti..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-9 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 whitespace-nowrap">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>Susun:</span>
                            </div>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="w-full md:w-auto text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="chance_desc">Peluang Kemasukan Tertinggi</option>
                                <option value="merit_desc">Merit UPU Tertinggi ke Terendah</option>
                                <option value="merit_asc">Merit UPU Terendah ke Tertinggi</option>
                                <option value="name_asc">Nama Program (A - Z)</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1 text-slate-500 font-bold mr-1">
                            <Filter className="w-3 h-3" />
                            <span>Penapis:</span>
                        </div>

                        {/* University Filter */}
                        <select
                            value={selectedInst}
                            onChange={(e) => setSelectedInst(e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 max-w-xs truncate"
                        >
                            <option value="all">Semua Institusi ({institutions.length})</option>
                            {institutions.map((inst, idx) => (
                                <option key={idx} value={inst}>
                                    {inst}
                                </option>
                            ))}
                        </select>

                        {/* Level Filter */}
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Semua Peringkat</option>
                            <option value="Diploma">Diploma Sahaja</option>
                            <option value="Foundation">Asasi / Foundation</option>
                            <option value="Certificate">Sijil / Certificate</option>
                        </select>

                        {/* Peluang Filter */}
                        <select
                            value={selectedChance}
                            onChange={(e) => setSelectedChance(e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Semua Peluang</option>
                            <option value="tinggi">🟢 Peluang Tinggi</option>
                            <option value="sederhana">🟡 Berdaya Saing</option>
                            <option value="sasaran">🔵 Sasaran Tinggi</option>
                            <option value="temuduga">🟣 Temuduga / Terbuka</option>
                        </select>

                        {(searchQuery || selectedInst !== 'all' || selectedLevel !== 'all' || selectedChance !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedInst('all');
                                    setSelectedLevel('all');
                                    setSelectedChance('all');
                                }}
                                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline ml-auto"
                            >
                                Reset Penapis
                            </button>
                        )}
                    </div>
                </div>

                {/* Matched Programmes Section matching Figure 3.2.1.4.5 */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800">
                                These areas of study may suit you well with your academic:
                            </h2>
                            <p className="text-xs text-slate-500">
                                Menunjukkan {filteredProgrammes.length} daripada {programmes.length} program IPTA yang sepadan.
                            </p>
                        </div>
                    </div>

                    {filteredProgrammes && filteredProgrammes.length > 0 ? (
                        <div className="space-y-3.5">
                            {filteredProgrammes.map((prog) => {
                                const chance = prog.admissionChance;

                                return (
                                    <div
                                        key={prog.id}
                                        className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition relative ${chance.cardBorder}`}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Institution Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 mt-0.5">
                                                <School className="w-6 h-6" />
                                            </div>

                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-black text-slate-900 uppercase leading-snug">
                                                        {prog.name}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    {prog.code && (
                                                        <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                                                            {prog.code}
                                                        </span>
                                                    )}
                                                    <span className="font-semibold text-slate-600">
                                                        {prog.institution}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                                        {prog.level}
                                                    </span>
                                                    {prog.notes && prog.notes !== '-' && (
                                                        <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                            {prog.notes}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Merit Comparison & Chance Banner */}
                                                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold border ${chance.badgeClass}`}>
                                                        <span className={`w-2 h-2 rounded-full ${chance.indicatorClass}`} />
                                                        <span>{chance.shortLabel}</span>
                                                        {chance.diffFormatted && (
                                                            <span className="font-mono text-[11px] opacity-90">
                                                                ({chance.diffFormatted})
                                                            </span>
                                                        )}
                                                    </span>

                                                    {prog.merit ? (
                                                        <span className="text-[11px] text-slate-500 font-medium">
                                                            Cut-off UPU: <strong className="text-slate-800">{prog.merit}%</strong>
                                                            {' '}| Merit Anda: <strong className="text-sky-700">{meritScore}%</strong>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400 italic">
                                                            Syarat kemasukan berasaskan sesi temu duga / penilaian khas
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button matching Figure 3.2.1.4.5 */}
                                        <div className="flex items-center justify-end md:self-center shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedProgramme(prog)}
                                                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition"
                                            >
                                                DETAILS
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-700">
                                Tiada program padanan ditemui untuk kriteria carian/penapis ini.
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Cuba kurangkan syarat penapis atau gunakan kata kunci lain.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedInst('all');
                                    setSelectedLevel('all');
                                    setSelectedChance('all');
                                }}
                                className="mt-3 px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold transition"
                            >
                                Tunjukkan Semua Program Padanan
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Programme Details Modal matching Figure 3.2.1.4.6 with Chance Explanation */}
            {selectedProgramme && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-sky-600 text-white rounded-3xl shadow-2xl max-w-xl w-full p-8 relative animate-scale-in border-4 border-sky-500 max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedProgramme(null)}
                            className="absolute top-5 right-5 p-2 rounded-full bg-sky-700/60 hover:bg-sky-800 text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-white text-sky-700 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                                <School className="w-7 h-7 text-sky-600" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                                    {selectedProgramme.institution} • {selectedProgramme.level}
                                    {selectedProgramme.code && ` • ${selectedProgramme.code}`}
                                </span>
                                <h2 className="text-xl font-black uppercase mt-0.5 leading-snug">
                                    {selectedProgramme.name}
                                </h2>
                            </div>
                        </div>

                        {/* Admission Chance Breakdown Box */}
                        {selectedProgramme.admissionChance && (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        ANALISIS KELAYAKAN MERIT UPU
                                    </span>
                                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${selectedProgramme.admissionChance.badgeClass}`}>
                                        {selectedProgramme.admissionChance.label}
                                    </span>
                                </div>
                                <p className="text-xs text-sky-100 leading-relaxed">
                                    {selectedProgramme.admissionChance.description}
                                </p>
                                {selectedProgramme.merit && (
                                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                                        <div className="bg-sky-800/40 p-2.5 rounded-xl">
                                            <span className="text-sky-200 block text-[10px]">Markah Merit SPM Anda</span>
                                            <strong className="text-base text-amber-300">{meritScore}%</strong>
                                        </div>
                                        <div className="bg-sky-800/40 p-2.5 rounded-xl">
                                            <span className="text-sky-200 block text-[10px]">Purata Cut-Off UPU</span>
                                            <strong className="text-base text-white">{selectedProgramme.merit}%</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SYARAT KEMASUKAN per Figure 3.2.1.4.6 */}
                        <div className="bg-sky-700/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-400/40 space-y-4">
                            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm tracking-wider uppercase">
                                <FileText className="w-4 h-4" />
                                <span>SYARAT KEMASUKAN (ENTRY REQUIREMENTS)</span>
                            </div>

                            <div className="text-xs text-sky-50 leading-relaxed font-medium whitespace-pre-line bg-sky-800/40 p-4 rounded-xl border border-sky-500/30">
                                {selectedProgramme.entry_requirement ||
                                    'Lulus SPM dengan minimum 3 kepujian termasuk subjek yang berkaitan.'}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedProgramme(null)}
                                className="px-6 py-2.5 bg-white text-sky-800 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-sky-50 transition"
                            >
                                TUTUP (CLOSE)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
