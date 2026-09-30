import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
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

export default function Index({
    existingResults = [],
    existingStream = '',
    meritScore = 0,
    universalSubjects = [],
    availableElectives = [],
    streams = [],
    grades = [],
}) {
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

    const { post, processing } = useForm();

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

        if (duplicateError) {
            return;
        }

        setShowConfirmModal(true);
    };

    // Execute actual submit
    const handleConfirmSave = () => {
        setShowConfirmModal(false);

        const validElectives = electiveRows.filter((r) => r.subject && r.grade);
        const combined = [...universalRows, ...validElectives].map((r) => ({
            subject: r.subject,
            grade: r.grade,
        }));

        post('/spm-results', {
            data: {
                stream,
                results: combined,
            },
        });
    };

    return (
        <UserLayout activePage="academic">
            <Head title="Keputusan Akademik SPM - UniWise" />

            {/* Error Notification Banner per Figure 3.2.1.3.5 */}
            {duplicateError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-600 text-white font-bold text-center tracking-wide uppercase shadow-md flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>SUBJECT DUPLICATE</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Kemasukan Keputusan SPM
                        </h1>
                        <p className="text-sm text-slate-500">
                            Pilih aliran dan masukkan gred peperiksaan SPM anda untuk pengiraan markah merit.
                        </p>
                    </div>

                    {meritScore > 0 && (
                        <div className="bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl flex items-center gap-3">
                            <GraduationCap className="w-6 h-6 text-sky-600" />
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                    Markah Merit Semasa
                                </span>
                                <span className="text-base font-extrabold text-sky-800">
                                    {meritScore}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handlePreSubmit} className="space-y-6">
                    {/* Aliran SPM Section per Figure 3.2.1.3.2 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            JENIS ALIRAN (STREAM SELECTION)
                        </label>
                        <select
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            {streams.map((s, idx) => (
                                <option key={idx} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mata Pelajaran Universal per Figure 3.2.1.3.2 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                    Mata Pelajaran Universal (Wajib)
                                </h3>
                                <p className="text-xs text-slate-400">
                                    4 mata pelajaran teras yang mesti diambil oleh semua calon SPM.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                                4 Subjek Teras
                            </span>
                        </div>

                        <div className="space-y-3">
                            {universalRows.map((row, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                                >
                                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                                            {idx + 1}
                                        </span>
                                        {row.subject}
                                    </span>

                                    <div className="w-full sm:w-44">
                                        <select
                                            value={row.grade}
                                            onChange={(e) =>
                                                handleUniversalGradeChange(idx, e.target.value)
                                            }
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-sm text-indigo-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                    Mata Pelajaran Pakej & Elektif Terbaik
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Pilih subjek pakej aliran dan mata pelajaran terbaik anda.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addElectiveRow}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg border border-sky-200 transition"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Subjek</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {electiveRows.map((row, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                                >
                                    <div className="w-full sm:flex-1">
                                        <select
                                            value={row.subject}
                                            onChange={(e) =>
                                                handleElectiveChange(idx, 'subject', e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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

                                    <div className="w-full sm:w-44">
                                        <select
                                            value={row.grade}
                                            onChange={(e) =>
                                                handleElectiveChange(idx, 'grade', e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-sm text-indigo-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            <option value="">-- Gred --</option>
                                            {grades.map((g) => (
                                                <option key={g} value={g}>
                                                    Gred {g}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {electiveRows.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeElectiveRow(idx)}
                                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Bar with SAVE Button per Figure 3.2.1.3.2 */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing || duplicateError}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm rounded-xl shadow-md transition disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>SAVE</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Modal per Figure 3.2.1.3.4 */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-emerald-800 text-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in border-4 border-emerald-700">
                        <HelpCircle className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                        <h2 className="text-xl font-black uppercase tracking-wide mb-8 leading-snug">
                            ARE YOU SURE WANT TO SAVE YOUR ACADEMIC RESULT?
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-xl shadow-lg transition"
                            >
                                NO
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSave}
                                disabled={processing}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-base rounded-xl shadow-lg transition"
                            >
                                {processing ? 'SAVING...' : 'YES'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
