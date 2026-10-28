import React, { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import {
    Save,
    AlertTriangle,
    Plus,
    Trash2,
    GraduationCap,
    HelpCircle,
    CheckCircle,
} from 'lucide-react';
import { DataUploadOverlay } from '@/Components/Skeleton';

export default function Index({
    existingResults = [],
    existingStream = '',
    meritScore = 0,
    universalSubjects = [],
    availableElectives = [],
    streams = [],
    grades = [],
}) {
    const { errors = {} } = usePage().props;
    const [isSaving, setIsSaving] = useState(false);

    // Map existing results or initialize default 4 universal + 4 elective slots
    const initialUniversal = universalSubjects.map((sub) => {
        const found = existingResults.find((r) => r.subject === sub);
        return {
            subject: sub,
            grade: found ? found.grade : '',
            isUniversal: true,
        };
    });

    const initialElectives = () => {
        const nonUniversal = existingResults.filter((r) => !universalSubjects.includes(r.subject));
        if (nonUniversal.length > 0) {
            return nonUniversal.map((r) => ({
                subject: r.subject,
                grade: r.grade,
                isUniversal: false,
            }));
        }
        return [
            { subject: '', grade: '', isUniversal: false },
            { subject: '', grade: '', isUniversal: false },
            { subject: '', grade: '', isUniversal: false },
            { subject: '', grade: '', isUniversal: false },
        ];
    };

    const [stream, setStream] = useState(existingStream || streams[0] || '');
    const [universalRows, setUniversalRows] = useState(initialUniversal);
    const [electiveRows, setElectiveRows] = useState(initialElectives);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Check for duplicate subjects across all non-empty selections
    const duplicateError = useMemo(() => {
        const allSubjects = [
            ...universalRows.map((r) => r.subject.trim()),
            ...electiveRows.map((r) => r.subject.trim()).filter(Boolean),
        ];
        const seen = new Set();
        for (const s of allSubjects) {
            if (seen.has(s)) {
                return true;
            }
            seen.add(s);
        }
        return false;
    }, [universalRows, electiveRows]);

    const handleUniversalGradeChange = (index, grade) => {
        const updated = [...universalRows];
        updated[index].grade = grade;
        setUniversalRows(updated);
    };

    const handleElectiveChange = (index, field, value) => {
        const updated = [...electiveRows];
        updated[index][field] = value;
        setElectiveRows(updated);
    };

    const addElectiveRow = () => {
        if (electiveRows.length < 8) {
            setElectiveRows([...electiveRows, { subject: '', grade: '', isUniversal: false }]);
        }
    };

    const removeElectiveRow = (index) => {
        const updated = electiveRows.filter((_, i) => i !== index);
        setElectiveRows(updated);
    };

    // Pre-submit validation
    const handlePreSubmit = (e) => {
        e.preventDefault();

        // Check that all universal subjects have grades selected
        const missingUniversal = universalRows.some((r) => !r.grade);
        if (missingUniversal) {
            alert('Sila lengkapkan semua gred untuk 4 Mata Pelajaran Universal!');
            return;
        }

        // Check for partially filled electives (subject without grade or grade without subject)
        const incompleteElectives = electiveRows.some(
            (r) => (r.subject && !r.grade) || (!r.subject && r.grade)
        );
        if (incompleteElectives) {
            alert('Sila pastikan setiap mata pelajaran elektif yang dipilih mempunyai gred yang lengkap!');
            return;
        }

        if (duplicateError) {
            return;
        }

        setShowConfirmModal(true);
    };

    // Execute actual submit via router.post with complete payload
    const handleConfirmSave = () => {
        setShowConfirmModal(false);
        setIsSaving(true);

        const validElectives = electiveRows.filter((r) => r.subject && r.grade);
        const combined = [...universalRows, ...validElectives].map((r) => ({
            subject: r.subject.trim(),
            grade: r.grade.trim(),
        }));

        router.post(
            '/spm-results',
            {
                stream,
                results: combined,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSaving(false);
                },
            }
        );
    };

    // Exact KPM point scale per MeritCalculator.php
    const GRADE_POINTS = {
        'A+': 18,
        'A': 16,
        'A-': 14,
        'B+': 12,
        'B': 10,
        'C+': 8,
        'C': 6,
        'D': 4,
        'E': 2,
        'G': 0,
    };

    // Live calculation of merit and completion status as user selects grades
    const liveStats = useMemo(() => {
        const validElectives = electiveRows.filter((r) => r.subject && r.grade);
        const allGraded = [...universalRows, ...validElectives].filter((r) => r.grade);

        if (allGraded.length === 0) {
            return {
                totalGraded: 0,
                estimatedMerit: 0,
                tier: null,
                isUniversalComplete: false,
                topSubjectsCount: 0,
            };
        }

        const points = allGraded
            .map((r) => GRADE_POINTS[r.grade?.toUpperCase()] ?? 0)
            .sort((a, b) => b - a);

        const count = Math.min(points.length, 8);
        const topPoints = points.slice(0, count);
        const totalPoints = topPoints.reduce((acc, p) => acc + p, 0);
        const maxPossible = count * 18;
        const estimatedMerit = count > 0 ? Math.round((totalPoints / maxPossible) * 100 * 10) / 10 : 0;

        let tier = { label: 'Perlu Bimbingan', color: 'bg-rose-50 text-rose-700 border-rose-200' };
        if (estimatedMerit >= 85) tier = { label: 'Cemerlang Tinggi 🌟', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
        else if (estimatedMerit >= 70) tier = { label: 'Cemerlang ✨', color: 'bg-sky-50 text-sky-800 border-sky-300' };
        else if (estimatedMerit >= 55) tier = { label: 'Kepujian 👍', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
        else if (estimatedMerit >= 40) tier = { label: 'Lulus 📋', color: 'bg-amber-50 text-amber-800 border-amber-300' };

        const isUniversalComplete = universalRows.every((r) => !!r.grade);

        return {
            totalGraded: allGraded.length,
            estimatedMerit,
            tier,
            isUniversalComplete,
            topSubjectsCount: count,
        };
    }, [universalRows, electiveRows]);

    const getGradeColor = (g) => {
        if (!g) return 'border-slate-300 text-slate-800';
        if (['A+', 'A', 'A-'].includes(g)) return 'border-emerald-400 bg-emerald-50/60 text-emerald-900 font-black';
        if (['B+', 'B'].includes(g)) return 'border-sky-400 bg-sky-50/60 text-sky-900 font-black';
        if (['C+', 'C'].includes(g)) return 'border-indigo-400 bg-indigo-50/60 text-indigo-900 font-black';
        if (['D', 'E'].includes(g)) return 'border-amber-400 bg-amber-50/60 text-amber-900 font-black';
        return 'border-rose-400 bg-rose-50/60 text-rose-900 font-black';
    };

    return (
        <UserLayout activePage="academic">
            <Head title="Keputusan Akademik SPM - UniWise" />

            {/* Error Notification Banner per Figure 3.2.1.3.5 */}
            {duplicateError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-600 text-white font-black text-center tracking-wide uppercase shadow-lg flex items-center justify-center gap-2 animate-bounce">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>SUBJECT DUPLICATE - Sila pastikan tiada mata pelajaran yang berulang!</span>
                </div>
            )}

            {Object.keys(errors).length > 0 && !duplicateError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-600 text-white font-bold text-center tracking-wide uppercase shadow-lg flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>{Object.values(errors)[0]}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header with Title and Current/Live Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-100">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Kemasukan Keputusan Peperiksaan SPM</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">
                            Rekod Keputusan Akademik SPM
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                            Pilih aliran dan masukkan gred anda. Markah merit dihitung secara automatik dalam masa nyata (real-time).
                        </p>
                    </div>

                    {/* Live Dynamic Merit Gauge */}
                    <div className="flex items-center gap-4 bg-gradient-to-tr from-sky-50 to-indigo-50 border border-sky-200/80 px-5 py-3 rounded-2xl shrink-0 shadow-sm">
                        <div className="text-center">
                            <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                Anggaran Merit Langsung
                            </span>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-2xl md:text-3xl font-black text-sky-800 tracking-tight">
                                    {liveStats.estimatedMerit}%
                                </span>
                            </div>
                            {liveStats.tier && (
                                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border mt-0.5 ${liveStats.tier.color}`}>
                                    {liveStats.tier.label}
                                </span>
                            )}
                        </div>

                        <div className="border-l border-sky-200 pl-4 text-left">
                            <div className="text-[11px] font-bold text-slate-700">
                                {liveStats.totalGraded} Subjek Bergred
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {liveStats.isUniversalComplete ? (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                                        4/4 Universal Lengkap
                                    </span>
                                ) : (
                                    <span className="text-amber-700 font-semibold">
                                        Perlu 4 Universal
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePreSubmit} className="space-y-6">
                    {/* Aliran SPM Section per Figure 3.2.1.3.2 */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                JENIS ALIRAN (STREAM SELECTION)
                            </label>
                            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                                Aliran Terpilih
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                            Pilih aliran yang anda ikuti semasa di tingkatan 4 & 5.
                        </p>
                        <select
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white font-bold text-sm text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm"
                        >
                            {streams.map((s, idx) => (
                                <option key={idx} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mata Pelajaran Universal per Figure 3.2.1.3.2 */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-2">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <span>Mata Pelajaran Universal (Wajib)</span>
                                    <span className="text-rose-500 font-black">*</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    4 mata pelajaran teras yang diwajibkan oleh KPM untuk semua calon SPM.
                                </p>
                            </div>
                            <span className="text-xs font-extrabold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0">
                                4 Subjek Teras
                            </span>
                        </div>

                        <div className="space-y-3">
                            {universalRows.map((row, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition"
                                >
                                    <span className="text-sm font-bold text-slate-800 flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 text-xs font-black flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <span className="font-extrabold">{row.subject}</span>
                                    </span>

                                    <div className="w-full sm:w-48">
                                        <select
                                            value={row.grade}
                                            onChange={(e) =>
                                                handleUniversalGradeChange(idx, e.target.value)
                                            }
                                            required
                                            className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm ${getGradeColor(
                                                row.grade
                                            )}`}
                                        >
                                            <option value="">-- PILIH GRED --</option>
                                            {grades.map((g) => (
                                                <option key={g} value={g}>
                                                    Gred {g}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mata Pelajaran Pakej & Elektif per Figure 3.2.1.3.2 */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-2">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                                    Mata Pelajaran Pakej & Elektif Terbaik
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Pilih subjek pakej elektif anda (Formula merit akan memilih sehingga 8 mata pelajaran terbaik secara automatik).
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addElectiveRow}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl border border-sky-200 transition shrink-0"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Subjek</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {electiveRows.map((row, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition"
                                >
                                    <div className="w-full sm:flex-1">
                                        <select
                                            value={row.subject}
                                            onChange={(e) =>
                                                handleElectiveChange(idx, 'subject', e.target.value)
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm"
                                        >
                                            <option value="">
                                                -- Pilih Mata Pelajaran Pakej / Elektif --
                                            </option>
                                            {availableElectives.map((el, elIdx) => (
                                                <option key={elIdx} value={el}>
                                                    {el}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full sm:w-48 flex items-center gap-2">
                                        <select
                                            value={row.grade}
                                            onChange={(e) =>
                                                handleElectiveChange(idx, 'grade', e.target.value)
                                            }
                                            className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm ${getGradeColor(
                                                row.grade
                                            )}`}
                                        >
                                            <option value="">-- Gred --</option>
                                            {grades.map((g) => (
                                                <option key={g} value={g}>
                                                    Gred {g}
                                                </option>
                                            ))}
                                        </select>

                                        {electiveRows.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeElectiveRow(idx)}
                                                title="Padam Subjek"
                                                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Submit Bar with SAVE Button per Figure 3.2.1.3.2 */}
                    <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                                <strong>Status:</strong> {liveStats.totalGraded} subjek sedia disimpan &bull; Anggaran Merit: <strong>{liveStats.estimatedMerit}%</strong>
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving || duplicateError}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Save className="w-4 h-4" />
                            <span>SAVE KEPUTUSAN</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Modal per Figure 3.2.1.3.4 */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-emerald-800 text-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in border-4 border-emerald-700 relative overflow-hidden">
                        <HelpCircle className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                        <h2 className="text-xl font-black uppercase tracking-wide mb-3 leading-snug">
                            ARE YOU SURE WANT TO SAVE YOUR ACADEMIC RESULT?
                        </h2>
                        <p className="text-xs text-emerald-100 mb-8 max-w-xs mx-auto">
                            Keputusan anda akan disimpan dan markah merit akan dijana secara rasmi untuk penilaian seterusnya.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
                            >
                                NO
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSave}
                                disabled={isSaving}
                                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? 'SAVING...' : 'YES'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Skeleton Loading Overlay while Uploading / Saving SPM Data */}
            {isSaving && (
                <DataUploadOverlay
                    title="Sedang Menyimpan & Memuat Naik Keputusan SPM..."
                    subtitle="Sistem sedang mengesahkan gred, mengira markah merit akademik secara rasmi, dan menyelaraskan rekod anda."
                    badge="Pengiraan Merit KPM"
                />
            )}
        </UserLayout>
    );
}
