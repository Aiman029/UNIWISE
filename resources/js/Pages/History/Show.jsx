import React, { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import RiasecRadarChart from '@/Components/RiasecRadarChart';
import {
    ArrowLeft,
    Calendar,
    School,
    Award,
    FileText,
    X,
    ArrowDown,
} from 'lucide-react';

export default function Show({
    sessionId,
    dateGenerated,
    meritScore,
    dominantTrait,
    traitInfo = {},
    riasecScores = {},
    spmResults = [],
    programmes = [],
}) {
    const [selectedProgramme, setSelectedProgramme] = useState(null);
    const programmeSectionRef = useRef(null);

    const scrollToProgrammes = () => {
        programmeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <UserLayout activePage="history">
            <Head title={`Butiran Sejarah Penilaian - UniWise`} />

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

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{dateGenerated}</span>
                    </div>
                </div>

                {/* Main Split Section matching Figure 3.2.1.5.4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Left: SPM Result Display per Figure 3.2.1.5.4 */}
                    <div className="bg-sky-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-sky-400/50 mb-4">
                                <h2 className="text-base font-black uppercase tracking-wide">
                                    SPM Result
                                </h2>
                                <span className="text-xs font-bold bg-sky-700 px-2.5 py-1 rounded-md">
                                    Merit: {meritScore}%
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-sky-500/60 text-sky-200 font-extrabold uppercase tracking-wider">
                                            <th className="py-2">SUBJECT</th>
                                            <th className="py-2 text-right">GRADE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sky-500/40 font-medium">
                                        {spmResults.map((r, idx) => (
                                            <tr key={idx} className="hover:bg-sky-700/30">
                                                <td className="py-2.5">{r.subject}</td>
                                                <td className="py-2.5 text-right font-black text-amber-300">
                                                    {r.grade}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-sky-500/50 text-[11px] text-sky-200 text-center">
                            Rekod keputusan peperiksaan SPM sewaktu sesi penilaian dijalankan.
                        </div>
                    </div>

                    {/* Right: RIASEC TRAITS GRAPH per Figure 3.2.1.5.4 */}
                    <div className="bg-sky-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-sky-400/50 mb-4">
                                <h2 className="text-base font-black uppercase tracking-wide">
                                    RIASEC TRAITS GRAPH
                                </h2>
                                <span className="text-xs font-bold bg-sky-700 px-2.5 py-1 rounded-md text-amber-300">
                                    {dominantTrait?.toUpperCase()}
                                </span>
                            </div>

                            <div className="bg-white/95 rounded-2xl p-4 shadow-inner my-2">
                                <RiasecRadarChart scores={riasecScores} size={250} />
                            </div>

                            <div className="mt-3 text-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                                    Your dominator traits is:
                                </span>
                                <div className="text-lg font-black text-amber-300 tracking-wide uppercase mt-0.5">
                                    {dominantTrait}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-sky-500/50 text-[11px] text-sky-200 text-center">
                            Profil Holland Code hasil daripada 30 jawapan soalan minat kerjaya.
                        </div>
                    </div>
                </div>

                {/* Big Button: VIEW MATCHED PROGRAMME per Figure 3.2.1.5.4 */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={scrollToProgrammes}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        <span>VIEW MATCHED PROGRAMME</span>
                        <ArrowDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Matched Programme List matching Figure 3.2.1.5.5 */}
                <div ref={programmeSectionRef} className="pt-4">
                    <div className="bg-sky-600 rounded-t-2xl px-6 py-4 text-white">
                        <h2 className="text-base font-black uppercase tracking-wide">
                            MATCHED PROGRAMME
                        </h2>
                    </div>

                    <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 space-y-4">
                        {programmes && programmes.length > 0 ? (
                            programmes.map((prog) => (
                                <div
                                    key={prog.id}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                            <School className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                                                {prog.name}
                                            </h3>
                                            <span className="text-xs text-slate-500">
                                                {prog.institution} ({prog.level})
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedProgramme(prog)}
                                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition"
                                    >
                                        DETAILS
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Tiada program padanan khusus direkodkan untuk sesi ini.
                            </div>
                        )}
                    </div>
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
