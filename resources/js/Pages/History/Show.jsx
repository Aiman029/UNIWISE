import React, { useState, useRef, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import RiasecRadarChart from '@/Components/RiasecRadarChart';
import { calculateAdmissionChance } from '@/Utils/admissionChance';
import {
    ArrowLeft,
    Calendar,
    School,
    Award,
    FileText,
    X,
    ArrowDown,
    Search,
    Filter,
    SlidersHorizontal,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

export default function Show({
    sessionId,
    dateGenerated,
    meritScore = 0,
    dominantTrait,
    traitInfo = {},
    riasecScores = {},
    spmResults = [],
    programmes = [],
}) {
    const [selectedProgramme, setSelectedProgramme] = useState(null);
    const programmeSectionRef = useRef(null);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInst, setSelectedInst] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedChance, setSelectedChance] = useState('all');
    const [selectedSort, setSelectedSort] = useState('chance_desc');

    const scrollToProgrammes = () => {
        programmeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Extract unique institutions
    const institutions = useMemo(() => {
        const set = new Set();
        programmes.forEach((p) => {
            if (p.institution) set.add(p.institution);
        });
        return Array.from(set).sort();
    }, [programmes]);

    // Attach calculated chance
    const programmesWithChance = useMemo(() => {
        return programmes.map((p) => {
            const chance = calculateAdmissionChance(meritScore, p.merit, p.notes);
            return {
                ...p,
                admissionChance: chance,
            };
        });
    }, [programmes, meritScore]);

    // Filter and Sort
    const filteredProgrammes = useMemo(() => {
        let list = programmesWithChance.filter((p) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = p.name?.toLowerCase().includes(q);
                const matchCode = p.code?.toLowerCase().includes(q);
                const matchInst = p.institution?.toLowerCase().includes(q);
                if (!matchName && !matchCode && !matchInst) return false;
            }

            if (selectedInst !== 'all' && p.institution !== selectedInst) {
                return false;
            }

            if (selectedLevel !== 'all' && p.level !== selectedLevel) {
                return false;
            }

            if (selectedChance !== 'all') {
                if (selectedChance === 'tinggi' && p.admissionChance.status !== 'tinggi') return false;
                if (selectedChance === 'sederhana' && p.admissionChance.status !== 'sederhana') return false;
                if (selectedChance === 'sasaran' && p.admissionChance.status !== 'sasaran') return false;
                if (selectedChance === 'temuduga' && !['temuduga', 'terbuka'].includes(p.admissionChance.status)) return false;
            }

            return true;
        });

        list.sort((a, b) => {
            if (selectedSort === 'chance_desc') {
                if (a.admissionChance.priority !== b.admissionChance.priority) {
                    return a.admissionChance.priority - b.admissionChance.priority;
                }
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
        <UserLayout activePage="history">
            <Head title="Butiran Sejarah Penilaian - UniWise" />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Top header navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/history"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 hover:text-sky-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Senarai Sejarah</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>Sesi: {dateGenerated}</span>
                    </div>
                </div>

                {/* Hero 2-Column Split: SPM Results & RIASEC Graph per Figure 3.2.1.5.4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: SPM Result Display matching Figure 3.2.1.5.4 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-sky-600 px-6 py-4 text-white">
                            <h2 className="text-sm font-extrabold uppercase tracking-wider">
                                SPM Result Summary
                            </h2>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                                            <th className="py-2">SUBJECT</th>
                                            <th className="py-2 text-right">GRADE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                        {spmResults && spmResults.length > 0 ? (
                                            spmResults.map((s, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50">
                                                    <td className="py-2.5">{s.subject}</td>
                                                    <td className="py-2.5 text-right">
                                                        <span className="font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">
                                                            {s.grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="py-4 text-center text-slate-400">
                                                    Tiada rekod subjek SPM disimpan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-500 uppercase">
                                    Calculated Merit Score:
                                </span>
                                <span className="text-base font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                                    {meritScore}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: RIASEC Traits Graph matching Figure 3.2.1.5.4 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-sky-600 px-6 py-4 text-white">
                            <h2 className="text-sm font-extrabold uppercase tracking-wider">
                                RIASEC Traits Graph
                            </h2>
                        </div>

                        <div className="p-6 flex-1 flex flex-col items-center justify-between space-y-4">
                            <div className="w-full flex items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <RiasecRadarChart scores={riasecScores} size={240} />
                            </div>

                            <div className="text-center w-full">
                                <span className="text-xs text-slate-500 font-semibold">
                                    Your dominator traits is:
                                </span>
                                <h3 className="text-lg font-black text-sky-700 uppercase tracking-wide mt-0.5">
                                    {dominantTrait || traitInfo.name}
                                </h3>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                    {traitInfo.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Big Button: VIEW MATCHED PROGRAMME per Figure 3.2.1.5.4 */}
                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={scrollToProgrammes}
                        className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        <span>VIEW MATCHED PROGRAMME</span>
                        <ArrowDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Matched Programme List matching Figure 3.2.1.5.5 */}
                <div ref={programmeSectionRef} className="pt-4 space-y-4">
                    <div className="bg-sky-600 rounded-t-2xl px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h2 className="text-base font-black uppercase tracking-wide">
                                MATCHED PROGRAMME
                            </h2>
                            <p className="text-xs text-sky-100">
                                Senarai program IPTA yang layak berdasarkan merit ({meritScore}%) & personaliti ({dominantTrait}).
                            </p>
                        </div>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                            {filteredProgrammes.length} Pilihan
                        </span>
                    </div>

                    {/* Search & Filter Toolbar inside Matched Section */}
                    <div className="bg-white p-4 border-x border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari program atau kod UPU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
                            <select
                                value={selectedInst}
                                onChange={(e) => setSelectedInst(e.target.value)}
                                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 max-w-xs truncate"
                            >
                                <option value="all">Semua IPTA ({institutions.length})</option>
                                {institutions.map((inst, idx) => (
                                    <option key={idx} value={inst}>
                                        {inst}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedChance}
                                onChange={(e) => setSelectedChance(e.target.value)}
                                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
                            >
                                <option value="all">Semua Peluang</option>
                                <option value="tinggi">🟢 Peluang Tinggi</option>
                                <option value="sederhana">🟡 Berdaya Saing</option>
                                <option value="sasaran">🔵 Sasaran Tinggi</option>
                                <option value="temuduga">🟣 Temuduga / Terbuka</option>
                            </select>

                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
                            >
                                <option value="chance_desc">Peluang Tertinggi</option>
                                <option value="merit_desc">Merit Tertinggi</option>
                                <option value="merit_asc">Merit Terendah</option>
                                <option value="name_asc">Nama A-Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 space-y-3.5">
                        {filteredProgrammes && filteredProgrammes.length > 0 ? (
                            filteredProgrammes.map((prog) => {
                                const chance = prog.admissionChance;

                                return (
                                    <div
                                        key={prog.id}
                                        className={`p-4 rounded-xl bg-slate-50 border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition ${chance.cardBorder}`}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                                                <School className="w-5 h-5" />
                                            </div>

                                            <div className="space-y-1 flex-1">
                                                <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                                                    {prog.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    {prog.code && (
                                                        <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                                                            {prog.code}
                                                        </span>
                                                    )}
                                                    <span className="text-slate-600 font-semibold">
                                                        {prog.institution} ({prog.level})
                                                    </span>
                                                    {prog.notes && prog.notes !== '-' && (
                                                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                            {prog.notes}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Chance badge & comparison */}
                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold border ${chance.badgeClass}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${chance.indicatorClass}`} />
                                                        <span>{chance.shortLabel}</span>
                                                        {chance.diffFormatted && (
                                                            <span className="font-mono text-[10px]">
                                                                ({chance.diffFormatted})
                                                            </span>
                                                        )}
                                                    </span>
                                                    {prog.merit && (
                                                        <span className="text-[11px] text-slate-500">
                                                            Cut-off UPU: <strong>{prog.merit}%</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedProgramme(prog)}
                                            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition shrink-0"
                                        >
                                            DETAILS
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Tiada program padanan ditemui untuk kriteria carian/penapis ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Programme Details Modal matching Figure 3.2.1.4.6 */}
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
                            </div>
                        )}

                        <div className="bg-sky-700/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-400/40 space-y-4">
                            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm tracking-wider uppercase">
                                <FileText className="w-4 h-4" />
                                <span>SYARAT KEMASUKAN</span>
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
