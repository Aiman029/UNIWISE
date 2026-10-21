import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    HelpCircle,
    Sparkles,
    Keyboard,
    Wrench,
    Search,
    Palette,
    HeartHandshake,
    Briefcase,
    FileCheck2,
} from 'lucide-react';

export default function Quiz({ questions = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Map question_id -> value (1 for YES, 0 for NO)
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalQuestions = questions.length;
    const currentQ = questions[currentIndex] || {};
    const selectedAnswer = answers[currentQ.id];

    // Category traits metadata
    const categoryMeta = useMemo(() => {
        const cat = currentQ.category?.toUpperCase() || '';
        if (cat.startsWith('R') || cat === 'REALISTIC') {
            return {
                name: 'Realistik (R)',
                desc: 'Kemahiran praktikal, teknikal & fizikal',
                badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                icon: Wrench,
            };
        }
        if (cat.startsWith('I') || cat === 'INVESTIGATIVE') {
            return {
                name: 'Investigatif (I)',
                desc: 'Penyelidikan saintifik, analitikal & intelek',
                badge: 'bg-sky-50 text-sky-800 border-sky-200',
                icon: Search,
            };
        }
        if (cat.startsWith('A') || cat === 'ARTISTIC') {
            return {
                name: 'Artistik (A)',
                desc: 'Kreativiti seni, reka bentuk & imaginasi',
                badge: 'bg-purple-50 text-purple-800 border-purple-200',
                icon: Palette,
            };
        }
        if (cat.startsWith('S') || cat === 'SOCIAL') {
            return {
                name: 'Sosial (S)',
                desc: 'Kerjasama, pendidikan & khidmat masyarakat',
                badge: 'bg-rose-50 text-rose-800 border-rose-200',
                icon: HeartHandshake,
            };
        }
        if (cat.startsWith('E') || cat === 'ENTERPRISING') {
            return {
                name: 'Keusahawanan (E)',
                desc: 'Kepimpinan, pengurusan & perniagaan',
                badge: 'bg-amber-50 text-amber-800 border-amber-200',
                icon: Briefcase,
            };
        }
        if (cat.startsWith('C') || cat === 'CONVENTIONAL') {
            return {
                name: 'Konvensional (C)',
                desc: 'Sistematik, organisasi data & pentadbiran',
                badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                icon: FileCheck2,
            };
        }
        return {
            name: currentQ.category || 'Holland Trait',
            desc: 'Dimensi Minat Personaliti',
            badge: 'bg-slate-50 text-slate-800 border-slate-200',
            icon: Sparkles,
        };
    }, [currentQ.category]);

    const handleSelect = (val) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: val,
        }));
    };

    const handleNext = () => {
        if (selectedAnswer === undefined) {
            alert('Sila pilih YES atau NO untuk soalan ini.');
            return;
        }

        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        // Verify all answered
        const unanswered = questions.filter((q) => answers[q.id] === undefined);
        if (unanswered.length > 0) {
            alert(`Terdapat ${unanswered.length} soalan yang belum dijawab.`);
            return;
        }

        setIsSubmitting(true);

        const payload = Object.entries(answers).map(([qId, val]) => ({
            question_id: parseInt(qId, 10),
            value: val,
        }));

        router.post('/riasec/submit', {
            answers: payload,
        });
    };

    // Keyboard navigation (Y/1, N/2, Enter, ArrowKeys)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if user is inside an input/textarea
            if (['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())) {
                return;
            }

            if (e.key === 'y' || e.key === 'Y' || e.key === '1') {
                e.preventDefault();
                handleSelect(1);
            } else if (e.key === 'n' || e.key === 'N' || e.key === '2' || e.key === '0') {
                e.preventDefault();
                handleSelect(0);
            } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
                if (selectedAnswer !== undefined) {
                    e.preventDefault();
                    handleNext();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
                if (currentIndex > 0) {
                    e.preventDefault();
                    handlePrevious();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, selectedAnswer, currentQ.id, totalQuestions, answers]);

    const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);
    const answeredCount = Object.keys(answers).length;
    const CategoryIcon = categoryMeta.icon;

    return (
        <UserLayout activePage="riasec">
            <Head title={`Soalan ${currentIndex + 1} - Penilaian RIASEC`} />

            <div className="max-w-3xl mx-auto py-4 space-y-4">
                {/* Top Question Tracker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider gap-2">
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <span>Inventori Minat Kerjaya Holland (RIASEC)</span>
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-full border border-sky-100">
                            Soalan {currentIndex + 1} daripada {totalQuestions}
                        </span>
                        <span className="text-slate-400">
                            Dijawab: {answeredCount}/{totalQuestions}
                        </span>
                    </div>
                </div>

                {/* Main Card matching Figure 3.2.1.4.4 with Elevated Polish */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-8 md:p-12 text-center min-h-[460px] flex flex-col justify-between transition-all relative overflow-hidden">
                    {/* Category indicator with trait description */}
                    <div className="flex flex-col items-center">
                        <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border shadow-sm ${categoryMeta.badge}`}>
                            <CategoryIcon className="w-3.5 h-3.5" />
                            <span>{categoryMeta.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 font-medium">
                            {categoryMeta.desc}
                        </span>
                    </div>

                    {/* Question Text */}
                    <div className="my-8 max-w-xl mx-auto">
                        <span className="text-xs font-extrabold text-sky-600 uppercase tracking-widest block mb-2">
                            Pernyataan Minat #{currentIndex + 1}
                        </span>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug uppercase tracking-tight">
                            "{currentQ.question_text}"
                        </h2>
                        <p className="text-xs text-slate-400 mt-3">
                            Adakah aktiviti ini menarik minat anda? Pilih jawapan yang paling mencerminkan diri anda.
                        </p>
                    </div>

                    {/* Big YES / NO response buttons per Figure 3.2.1.4.4 with Tactile Key Badges */}
                    <div className="space-y-4 max-w-xs mx-auto w-full my-2">
                        <button
                            type="button"
                            onClick={() => handleSelect(1)}
                            className={`w-full py-4 px-6 text-base font-black rounded-2xl shadow transition-all transform active:scale-95 flex items-center justify-between ${
                                selectedAnswer === 1
                                    ? 'bg-sky-600 text-white ring-4 ring-sky-200 scale-102 shadow-lg'
                                    : 'bg-sky-500 hover:bg-sky-600 text-white hover:shadow'
                            }`}
                        >
                            <span className="w-8 text-left font-normal text-xs text-sky-100 hidden sm:inline">
                                {selectedAnswer === 1 ? '✓' : ''}
                            </span>
                            <span className="flex-1 text-center font-black tracking-wide">YES (YA)</span>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/20">
                                Y / 1
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelect(0)}
                            className={`w-full py-4 px-6 text-base font-black rounded-2xl shadow transition-all transform active:scale-95 flex items-center justify-between ${
                                selectedAnswer === 0
                                    ? 'bg-sky-800 text-white ring-4 ring-sky-300 scale-102 shadow-lg'
                                    : 'bg-sky-700 hover:bg-sky-800 text-white hover:shadow'
                            }`}
                        >
                            <span className="w-8 text-left font-normal text-xs text-sky-200 hidden sm:inline">
                                {selectedAnswer === 0 ? '✓' : ''}
                            </span>
                            <span className="flex-1 text-center font-black tracking-wide">NO (TIDAK)</span>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/20">
                                N / 2
                            </span>
                        </button>
                    </div>

                    {/* Keyboard Hint */}
                    <div className="hidden sm:flex items-center justify-center gap-1.5 text-[11px] text-slate-400 my-1">
                        <Keyboard className="w-3.5 h-3.5" />
                        <span>Petua: Tekan kekunci <strong>Y</strong> / <strong>N</strong> pada papan kekunci & tekan <strong>Enter</strong> untuk ke soalan seterusnya.</span>
                    </div>

                    {/* Bottom Progress Quiz Bar and Navigation Buttons */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        {/* Progress bar line */}
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6 max-w-md mx-auto relative shadow-inner">
                            <div
                                className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 h-full rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between max-w-md mx-auto gap-4">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>PREVIOUS</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isSubmitting || selectedAnswer === undefined}
                                className="inline-flex items-center gap-1.5 px-8 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
                            >
                                <span>
                                    {currentIndex === totalQuestions - 1
                                        ? isSubmitting
                                            ? 'MEMPROSES...'
                                            : 'SUBMIT QUIZ'
                                        : 'NEXT'}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
