import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import RiasecRadarChart from '@/Components/RiasecRadarChart';
import {
    Award,
    CheckCircle2,
    BookOpen,
    Info,
    ArrowRight,
    School,
    X,
    FileText,
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

    return (
        <UserLayout activePage="riasec">
            <Head title="Keputusan Penilaian RIASEC & Cadangan IPTA" />

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
                                Keputusan Penilaian
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

                            <div className="flex items-center gap-4 pt-2">
                                <div className="text-xs font-medium text-slate-500">
                                    Markah Merit SPM Anda:
                                    <span className="ml-1.5 font-extrabold text-sky-700 text-sm">
                                        {meritScore}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matched Programmes Section matching Figure 3.2.1.4.5 */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                            These areas of study may suit you well with your academic:
                        </h2>
                        <p className="text-xs text-slate-500">
                            Program institusi awam (IPTA) yang dipadankan dengan personaliti dan kelayakan SPM anda.
                        </p>
                    </div>

                    {programmes && programmes.length > 0 ? (
                        <div className="space-y-3">
                            {programmes.map((prog) => (
                                <div
                                    key={prog.id}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                                            <School className="w-6 h-6" />
                                        </div>

                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 uppercase">
                                                {prog.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    {prog.institution}
                                                </span>
                                                <span className="text-xs text-slate-300">•</span>
                                                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                                    {prog.level}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DETAILS Button per Figure 3.2.1.4.5 */}
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProgramme(prog)}
                                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                                        >
                                            DETAILS
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-slate-700">
                                Tiada program padanan khusus ditemui untuk kriteria semasa.
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Anda boleh mengemaskini gred SPM atau mengambil semula penilaian.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Programme Details Modal matching Figure 3.2.1.4.6 */}
            {selectedProgramme && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-sky-600 text-white rounded-3xl shadow-2xl max-w-xl w-full p-8 relative animate-scale-in border-4 border-sky-500">
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
                                </span>
                                <h2 className="text-xl font-black uppercase mt-0.5 leading-snug">
                                    {selectedProgramme.name}
                                </h2>
                            </div>
                        </div>

                        {/* SYARAT KEMASUKAN per Figure 3.2.1.4.6 */}
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
