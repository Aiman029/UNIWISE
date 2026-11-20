import React, { useState, useMemo } from 'react';
import { Award, ChevronDown, ChevronUp, Info, AlertTriangle, Sparkles } from 'lucide-react';

const IMKS_DIMENSION_META = [
    { code: 'R', label: 'Realistik', divisor: 4, clusters: ['PPR-R', 'PLD-R', 'MHR-R', 'KEJ-R'] },
    { code: 'I', label: 'Investigatif', divisor: 3, clusters: ['SMT-I', 'KDP-I', 'UBT-I'] },
    { code: 'A', label: 'Artistik', divisor: 2, clusters: ['SHI-A', 'UND-A'] },
    { code: 'S', label: 'Sosial', divisor: 3, clusters: ['SUK-S', 'SDN-S', 'SOS-S'] },
    { code: 'E', label: 'Enterprising', divisor: 3, clusters: ['TBR-E', 'ANP-E', 'NGA-E'] },
    { code: 'C', label: 'Conventional', divisor: 2, clusters: ['KER-C', 'KON-C'] },
];

const CLUSTER_NAMES = {
    'PPR-R': 'Pertanian & Perhutanan',
    'PLD-R': 'Perkhidmatan Perlindungan',
    'MHR-R': 'Pekerjaan Berkemahiran',
    'KEJ-R': 'Kejuruteraan',
    'SMT-I': 'Sains & Matematik',
    'KDP-I': 'Kaitan Perubatan',
    'UBT-I': 'Perubatan',
    'SHI-A': 'Seni & Hiburan',
    'UND-A': 'Persuratan & Perundangan',
    'SUK-S': 'Sukan',
    'SDN-S': 'Perkhidmatan Persendirian',
    'SOS-S': 'Perkhidmatan Sosial',
    'TBR-E': 'Pentadbiran Perniagaan',
    'ANP-E': 'Analisis Perniagaan',
    'NGA-E': 'Urusniaga',
    'KER-C': 'Pekerjaan Perkeranian',
    'KON-C': 'Pekerjaan Konvensional',
};

export default function ImksBreakdownCard({ imksResult }) {
    const [showClusters, setShowClusters] = useState(false);

    if (!imksResult) {
        return null;
    }

    const {
        holland_codes: hollandCodes = [],
        holland_code_display: hollandDisplay,
        has_tie: hasTie,
        undetermined,
        note,
        riasec_exact: exact = {},
        riasec_rounded: rounded = {},
        riasec_totals: totals = {},
        cluster_scores: clusters = {},
    } = imksResult;

    // Identify Top 3 threshold so Top 3 dimension cards stand out visually
    const topThreeCutoff = useMemo(() => {
        const sorted = Object.values(rounded)
            .map((v) => Number(v) || 0)
            .sort((a, b) => b - a);
        return sorted[2] ?? 0;
    }, [rounded]);

    const codeChips = Array.isArray(hollandCodes) && hollandCodes.length > 0
        ? hollandCodes
        : hollandDisplay
        ? [hollandDisplay]
        : [];

    return (
        <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-slate-200 space-y-5">
            {/* Header Strip */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Keputusan Rasmi IMKS 2013 &amp; Pecahan 17 Kluster
                    </h3>
                    <p className="text-xs text-slate-500">
                        Ringkasan skor dimensi personaliti RIASEC (skala 0–10) anda.
                    </p>
                </div>
            </div>

            {/* Prominent Holland Three-Letter Code Spotlight */}
            <div
                className={`rounded-2xl p-5 md:p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    undetermined
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-slate-800 text-white shadow-md'
                }`}
            >
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Kod Tiga-Mata Holland Rasmi (Top 3)</span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${undetermined ? 'text-rose-800' : 'text-slate-300'}`}>
                        {hasTie
                            ? 'Terdapat markah seri pada kedudukan 3 teratas. Semua kombinasi Kod Tiga-Mata Holland yang sah dipaparkan di sebelah:'
                            : 'Kombinasi 3 personaliti kerjaya paling dominan berdasarkan skor bulat tertinggi anda:'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {undetermined ? (
                        <span className="font-mono text-lg sm:text-xl font-black px-4 py-2 rounded-xl bg-rose-600 text-white shadow-xs">
                            {hollandDisplay || 'Tidak Dapat Ditentukan'}
                        </span>
                    ) : (
                        codeChips.map((code, idx) => (
                            <span
                                key={code}
                                className={`font-mono text-2xl sm:text-3xl font-black tracking-widest px-4 py-2 rounded-2xl border shadow-sm ${
                                    idx === 0
                                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                                        : 'bg-white/15 text-amber-200 border-white/25'
                                }`}
                            >
                                {code}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {note && hasTie && (
                <div
                    className={`flex items-start gap-2.5 text-xs sm:text-sm p-3.5 rounded-xl border ${
                        undetermined
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50/90 text-amber-900 border-amber-200'
                    }`}
                >
                    {undetermined ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium">{note}</span>
                </div>
            )}

            {/* 6 RIASEC Exact vs Rounded Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {IMKS_DIMENSION_META.map((dim) => {
                    const score = Number(rounded[dim.code] ?? 0);
                    const isTopThree = !undetermined && score > 0 && score >= topThreeCutoff;

                    return (
                        <div
                            key={dim.code}
                            className={`p-3.5 rounded-2xl border text-center space-y-1 transition ${
                                isTopThree
                                    ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-200 shadow-2xs'
                                    : 'bg-slate-50 border-slate-200/80'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-slate-600">
                                <span>{dim.code} — {dim.label}</span>
                            </div>
                            <div className={`text-2xl font-black ${isTopThree ? 'text-sky-700' : 'text-slate-900'}`}>
                                {score}
                                <span className="text-xs font-semibold text-slate-400">/10</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toggle 17 Cluster Breakdown */}
            <div className="pt-2 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => setShowClusters((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                    <span>{showClusters ? 'Sembunyikan' : 'Lihat'} Pecahan Skor 17 Kluster Kerjaya IMKS</span>
                    {showClusters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showClusters && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(CLUSTER_NAMES).map(([code, label]) => (
                            <div
                                key={code}
                                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
                            >
                                <div>
                                    <span className="font-mono font-black text-sky-700 mr-1.5">{code}</span>
                                    <span className="text-slate-700 font-semibold">{label}</span>
                                </div>
                                <span className="font-black text-slate-900">
                                    {clusters[code] ?? 0}
                                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
