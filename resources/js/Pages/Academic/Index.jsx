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
    CheckCircle2,
    Sparkles,
    ChevronDown,
    BookOpen,
    Award,
    Info,
    ArrowRight,
    TrendingUp,
    Check,
} from 'lucide-react';
import { DataUploadOverlay } from '@/Components/Skeleton';

// Official KPM Merit Point mapping (18 pts max per subject)
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
    const [inlineError, setInlineError] = useState('');

    // Pre-populate or initialize universal 4 core subjects
    const initialUniversal = useMemo(() => {
        return universalSubjects.map((sub) => {
            const found = existingResults.find((r) => r.subject === sub);
            return {
                subject: sub,
                grade: found ? found.grade : '',
                isUniversal: true,
            };
        });
    }, [universalSubjects, existingResults]);

    // Pre-populate or initialize elective rows (minimum 4 slots)
    const initialElectives = useMemo(() => {
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
    }, [existingResults, universalSubjects]);

    const [stream, setStream] = useState(existingStream || streams[0] || '');
    const [universalRows, setUniversalRows] = useState(initialUniversal);
    const [electiveRows, setElectiveRows] = useState(initialElectives);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Track duplicate subjects across all inputs
    const duplicateMap = useMemo(() => {
        const counts = {};
        const all = [
            ...universalRows.map((r) => r.subject.trim()),
            ...electiveRows.map((r) => r.subject.trim()).filter(Boolean),
        ];
        all.forEach((s) => {
            counts[s] = (counts[s] || 0) + 1;
        });
        return counts;
    }, [universalRows, electiveRows]);

    const hasDuplicate = useMemo(() => {
        return Object.values(duplicateMap).some((count) => count > 1);
    }, [duplicateMap]);

    // Universal grade change handler
    const handleUniversalGradeChange = (index, grade) => {
        setInlineError('');
        const updated = [...universalRows];
        updated[index].grade = grade;
        setUniversalRows(updated);
    };

    // Elective row changes
    const handleElectiveChange = (index, field, value) => {
        setInlineError('');
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
        setInlineError('');
        const updated = electiveRows.filter((_, i) => i !== index);
        setElectiveRows(updated);
    };

    // Live calculation of UPU Merit Score (Best 8 subjects, up to 100%)
    const liveStats = useMemo(() => {
        const validElectives = electiveRows.filter((r) => r.subject.trim() && r.grade.trim());
        const allGraded = [...universalRows, ...validElectives].filter((r) => r.grade);

        if (allGraded.length === 0) {
            return {
                totalGraded: 0,
                estimatedMerit: 0,
                tier: {
                    label: 'Belum Dinilai',
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                    gaugeColor: '#94A3B8',
                    desc: 'Sila masukkan gred sekurang-kurangnya 4 subjek teras.',
                },
                isUniversalComplete: false,
                topSubjects: [],
            };
        }

        // Map subject with points and sort descending
        const scoredSubjects = allGraded
            .map((item) => ({
                subject: item.subject,
                grade: item.grade.toUpperCase(),
                points: GRADE_POINTS[item.grade.toUpperCase()] ?? 0,
            }))
            .sort((a, b) => b.points - a.points);

        const count = Math.min(scoredSubjects.length, 8);
        const topSubjects = scoredSubjects.slice(0, count);
        const totalPoints = topSubjects.reduce((acc, s) => acc + s.points, 0);
        const maxPossible = count * 18;
        const estimatedMerit = count > 0 ? Math.round((totalPoints / maxPossible) * 100 * 10) / 10 : 0;

        let tier = {
            label: 'Perlu Bimbingan',
            color: 'bg-rose-50 text-rose-700 border-rose-200',
            gaugeColor: '#F43F5E',
            desc: 'Fokus pada peluang laluan TVET, sijil kemahiran atau asasi bersyarat.',
        };

        if (estimatedMerit >= 85) {
            tier = {
                label: 'Cemerlang Tinggi 🌟',
                color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                gaugeColor: '#059669',
                desc: 'Peluang cerah untuk kursus kompetitif (Perubatan, Farmasi, Sains Komputer, Kejuruteraan).',
            };
        } else if (estimatedMerit >= 70) {
            tier = {
                label: 'Cemerlang ✨',
                color: 'bg-blue-50 text-blue-800 border-blue-300',
                gaugeColor: '#2563EB',
                desc: 'Kelayakan kukuh bagi kebanyakan program Ijazah Sarjana Muda & Asasi IPTA.',
            };
        } else if (estimatedMerit >= 55) {
            tier = {
                label: 'Kepujian 👍',
                color: 'bg-indigo-50 text-indigo-800 border-indigo-300',
                gaugeColor: '#6366F1',
                desc: 'Sangat sesuai untuk program Diploma Universiti Awam & Politeknik Premier.',
            };
        } else if (estimatedMerit >= 40) {
            tier = {
                label: 'Lulus 📋',
                color: 'bg-amber-50 text-amber-800 border-amber-300',
                gaugeColor: '#D97706',
                desc: 'Kelayakan asas untuk laluan Diploma Politeknik Konvensional atau Sijil Kolej Komuniti.',
            };
        }

        const isUniversalComplete = universalRows.every((r) => !!r.grade);

        return {
            totalGraded: allGraded.length,
            estimatedMerit,
            tier,
            isUniversalComplete,
            topSubjects,
        };
    }, [universalRows, electiveRows]);

    // Color styling for selected grade badges
    const getGradeStyle = (grade) => {
        if (!grade) return 'bg-white text-slate-400 border-slate-200';
        if (['A+', 'A', 'A-'].includes(grade)) {
            return 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
        }
        if (['B+', 'B'].includes(grade)) {
            return 'bg-blue-50 text-blue-700 border-blue-300 font-bold';
        }
        if (['C+', 'C'].includes(grade)) {
            return 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold';
        }
        if (['D', 'E'].includes(grade)) {
            return 'bg-amber-50 text-amber-700 border-amber-300 font-bold';
        }
        return 'bg-slate-100 text-slate-700 border-slate-300 font-bold';
    };

    // Pre-submit validation
    const handlePreSubmit = (e) => {
        e.preventDefault();
        setInlineError('');

        // Check 4 mandatory universal subjects
        const missingUniversal = universalRows.some((r) => !r.grade);
        if (missingUniversal) {
            setInlineError('Sila lengkapkan gred untuk kesemua 4 Mata Pelajaran Teras (Universal).');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Check incomplete electives
        const incompleteElectives = electiveRows.some(
            (r) => (r.subject && !r.grade) || (!r.subject && r.grade)
        );
        if (incompleteElectives) {
            setInlineError('Sila pastikan subjek elektif yang dipilih mempunyai gred yang lengkap.');
            return;
        }

        if (hasDuplicate) {
            setInlineError('Terdapat mata pelajaran berulang. Sila pastikan setiap subjek unik.');
            return;
        }

        setShowConfirmModal(true);
    };

    // Confirm submission
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

    // Radial gauge calculation (SVG circle)
    const circleRadius = 52;
    const circumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset =
        circumference - (Math.min(Math.max(liveStats.estimatedMerit, 0), 100) / 100) * circumference;

    return (
        <UserLayout activePage="academic">
            <Head title="Kemasukan Keputusan SPM & Pengiraan Merit - UniWise" />

            <div className="max-w-6xl mx-auto py-3 md:py-6 px-3 sm:px-4 pb-28 md:pb-12 space-y-6">
                {/* Header Banner: Clean Smart Mentorship Style */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                                <span>Langkah 1: Potensi Akademik</span>
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Keputusan Peperiksaan & Skor Merit SPM
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                                Masukkan gred sebenar atau anggaran percubaan SPM anda. Sistem mengira markah merit
                                UPU rasmi (90% akademik daripada 8 subjek terbaik) secara masa nyata.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Inline Error & Warning Banners */}
                {inlineError && (
                    <div
                        role="alert"
                        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-fade-in"
                    >
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                        <span>{inlineError}</span>
                    </div>
                )}

                {hasDuplicate && (
                    <div
                        role="alert"
                        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-fade-in"
                    >
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                        <span>Terdapat subjek berulang dalam senarai. Setiap mata pelajaran mestilah unik.</span>
                    </div>
                )}

                {Object.keys(errors).length > 0 && !hasDuplicate && !inlineError && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-fade-in">
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                        <span>{Object.values(errors)[0]}</span>
                    </div>
                )}

                {/* Main 2-Column Grid (Inputs on Left, Live Meter on Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Form Inputs (7 Cols) */}
                    <form onSubmit={handlePreSubmit} className="lg:col-span-7 space-y-6">
                        {/* Section 1: Aliran SPM (Stream) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <span>Aliran Pengajian SPM</span>
                                </label>
                                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                                    Wajib
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Pilih aliran yang diduduki semasa Tingkatan 4 dan 5 untuk membantu padanan syarat khas program IPTA.
                            </p>

                            <div className="relative pt-1">
                                <select
                                    value={stream}
                                    onChange={(e) => setStream(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white font-bold text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs cursor-pointer appearance-none pr-10"
                                >
                                    {streams.map((s, idx) => (
                                        <option key={idx} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Section 2: 4 Mata Pelajaran Teras (Universal Subjects) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                                <div>
                                    <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <span>4 Mata Pelajaran Teras (Wajib)</span>
                                        <span className="text-rose-500 font-bold">*</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Subjek universal yang diambil oleh semua calon SPM di Malaysia.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shrink-0 self-start sm:self-auto">
                                    {universalRows.filter((r) => r.grade).length} / 4 Diisi
                                </span>
                            </div>

                            <div className="space-y-3">
                                {universalRows.map((row, idx) => {
                                    const isDuplicate = duplicateMap[row.subject] > 1;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                                                row.grade
                                                    ? 'bg-slate-50/90 border-slate-200'
                                                    : 'bg-white border-dashed border-slate-300 hover:border-slate-400'
                                            } ${isDuplicate ? 'ring-2 ring-rose-400 border-rose-300' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center shrink-0 border border-blue-100">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <span className="font-display font-bold text-sm text-slate-900 block leading-tight">
                                                        {row.subject}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        Mata Pelajaran Teras KPM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full sm:w-44 shrink-0">
                                                <div className="relative">
                                                    <select
                                                        value={row.grade}
                                                        onChange={(e) =>
                                                            handleUniversalGradeChange(idx, e.target.value)
                                                        }
                                                        required
                                                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition shadow-2xs appearance-none pr-8 cursor-pointer focus:ring-2 focus:ring-blue-600 ${getGradeStyle(
                                                            row.grade
                                                        )}`}
                                                    >
                                                        <option value="">Pilih Gred</option>
                                                        {grades.map((g) => (
                                                            <option key={g} value={g}>
                                                                Gred {g} ({GRADE_POINTS[g]} mata)
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section 3: Mata Pelajaran Elektif (Best Electives) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                                <div>
                                    <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                                        Mata Pelajaran Elektif & Pakej
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Pilih subjek elektif anda. Sistem akan memilih subjek dengan skor tertinggi secara automatik.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addElectiveRow}
                                    disabled={electiveRows.length >= 8}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0 self-start sm:self-auto cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Subjek</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {electiveRows.map((row, idx) => {
                                    const isDuplicate = row.subject && duplicateMap[row.subject] > 1;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col sm:flex-row items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                                                row.subject && row.grade
                                                    ? 'bg-slate-50/90 border-slate-200'
                                                    : 'bg-white border-slate-200'
                                            } ${isDuplicate ? 'ring-2 ring-rose-400 border-rose-300' : ''}`}
                                        >
                                            {/* Elective Subject Selector */}
                                            <div className="w-full sm:flex-1 relative">
                                                <select
                                                    value={row.subject}
                                                    onChange={(e) =>
                                                        handleElectiveChange(idx, 'subject', e.target.value)
                                                    }
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs appearance-none pr-8 cursor-pointer"
                                                >
                                                    <option value="">-- Pilih Mata Pelajaran Elektif --</option>
                                                    {availableElectives.map((el, elIdx) => (
                                                        <option key={elIdx} value={el}>
                                                            {el}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>

                                            {/* Grade Selector & Trash Button */}
                                            <div className="w-full sm:w-44 flex items-center gap-2 shrink-0">
                                                <div className="relative flex-1">
                                                    <select
                                                        value={row.grade}
                                                        onChange={(e) =>
                                                            handleElectiveChange(idx, 'grade', e.target.value)
                                                        }
                                                        className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition shadow-2xs appearance-none pr-8 cursor-pointer focus:ring-2 focus:ring-blue-600 ${getGradeStyle(
                                                            row.grade
                                                        )}`}
                                                    >
                                                        <option value="">Gred</option>
                                                        {grades.map((g) => (
                                                            <option key={g} value={g}>
                                                                Gred {g}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>

                                                {electiveRows.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeElectiveRow(idx)}
                                                        title="Padam Subjek"
                                                        className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition shrink-0 cursor-pointer active:scale-95"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Help note */}
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                                <Info className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    Tip: Anda boleh masukkan sehingga 8 subjek elektif. Markah merit akan mengira 8 subjek terbaik secara pintar.
                                </span>
                            </div>
                        </div>

                        {/* Mobile Submit Button (Visible on small screens) */}
                        <div className="lg:hidden pt-2">
                            <button
                                type="submit"
                                disabled={isSaving || hasDuplicate}
                                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-display font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                            >
                                <Save className="w-4 h-4" />
                                <span>Sahkan & Simpan Keputusan SPM</span>
                            </button>
                        </div>
                    </form>

                    {/* Right Column: Interactive Live Merit Meter & Guidance Card (5 Cols Sticky) */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
                        {/* Live Radial Gauge Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm text-center relative overflow-hidden">
                            {/* Header Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-4">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                                <span>Meter Merit UPU Langsung</span>
                            </div>

                            {/* SVG Radial Meter */}
                            <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                    {/* Background Track */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r={circleRadius}
                                        stroke="#E2E8F0"
                                        strokeWidth="10"
                                        fill="transparent"
                                    />
                                    {/* Animated Progress Indicator */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r={circleRadius}
                                        stroke={liveStats.tier.gaugeColor}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        style={{ transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.4s ease' }}
                                    />
                                </svg>

                                {/* Inside Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
                                        {liveStats.estimatedMerit}
                                        <span className="text-xl font-bold text-slate-500">%</span>
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5">
                                        Markah Merit
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Tier Pill */}
                            <div className="mt-3">
                                <span
                                    className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${liveStats.tier.color}`}
                                >
                                    {liveStats.tier.label}
                                </span>
                                <p className="text-xs text-slate-500 mt-2 px-2 leading-relaxed">
                                    {liveStats.tier.desc}
                                </p>
                            </div>

                            {/* Breakdown of 8 Best Calculated Subjects */}
                            <div className="mt-6 pt-5 border-t border-slate-100 text-left">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2.5">
                                    <span className="flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Subjek Terbaik Dikira ({liveStats.topSubjects.length}/8)</span>
                                    </span>
                                    <span className="text-[11px] text-slate-400">Mata KPM</span>
                                </div>

                                {liveStats.topSubjects.length > 0 ? (
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                        {liveStats.topSubjects.map((sub, sIdx) => (
                                            <div
                                                key={sIdx}
                                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="w-4 text-center font-bold text-[10px] text-slate-400">
                                                        #{sIdx + 1}
                                                    </span>
                                                    <span className="font-semibold text-slate-800 truncate">
                                                        {sub.subject}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="font-extrabold text-slate-900">{sub.grade}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        ({sub.points} mata)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic text-center py-2">
                                        Pilih gred di sebelah kiri untuk melihat senarai subjek terbaik.
                                    </p>
                                )}
                            </div>

                            {/* Desktop Submit Button */}
                            <div className="mt-6 pt-5 border-t border-slate-100 hidden lg:block">
                                <button
                                    type="button"
                                    onClick={handlePreSubmit}
                                    disabled={isSaving || hasDuplicate}
                                    className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-display font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Simpan Keputusan SPM</span>
                                </button>
                                <span className="text-[10px] text-slate-400 block mt-2">
                                    Keputusan boleh dikemaskini pada bila-bila masa.
                                </span>
                            </div>
                        </div>

                        {/* Parent-Friendly Guidance Box */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm border border-slate-700/80 text-left">
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Panduan Untuk Ibu Bapa & Calon</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Skor merit rasmi UPU dikira daripada <strong>90% akademik</strong> (8 subjek terbaik
                                termasuk Matematik/Sains mengikut aliran) + <strong>10% markah kokurikulum</strong>.
                                Pastikan subjek teras mendapat sekurang-kurangnya gred C untuk memenuhi syarat am IPTA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Clean Confirmation Modal (Smart Mentorship Style) */}
            {showConfirmModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
                >
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center border border-slate-200/90 relative overflow-hidden animate-scale-up">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                            <HelpCircle className="w-7 h-7" />
                        </div>

                        <h3 className="font-display text-xl font-extrabold text-slate-900 mb-2">
                            Sahkan Simpanan Keputusan SPM?
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
                            Keputusan anda akan direkodkan bersama anggaran merit{' '}
                            <strong className="text-blue-600 font-extrabold">{liveStats.estimatedMerit}%</strong>.
                            Data ini akan digunakan untuk mencadangkan kursus universiti yang tepat.
                        </p>

                        {/* Summary Snapshot Card */}
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs mb-6 space-y-1.5">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Aliran Terpilih:</span>
                                <span className="font-bold text-slate-800 truncate max-w-[200px]">{stream}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Jumlah Subjek Bergred:</span>
                                <span className="font-bold text-slate-800">{liveStats.totalGraded} Subjek</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tahap Kelayakan:</span>
                                <span className="font-bold text-slate-800">{liveStats.tier.label}</span>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer active:scale-95"
                            >
                                Kembali Semak
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSave}
                                disabled={isSaving}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? 'Menyimpan...' : 'Ya, Sahkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Skeleton Loading Overlay while Saving SPM Data */}
            {isSaving && (
                <DataUploadOverlay
                    title="Sedang Menyimpan & Mengira Skor Merit..."
                    subtitle="Sistem sedang mengesahkan gred, mengira markah merit akademik secara rasmi, dan menyelaraskan profil IPTA anda."
                    badge="Pengiraan Merit KPM"
                />
            )}
        </UserLayout>
    );
}
