import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Keyboard,
    Wrench,
    Search,
    Palette,
    HeartHandshake,
    Briefcase,
    FileCheck2,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Check,
} from 'lucide-react';
import { DataUploadOverlay } from '@/Components/Skeleton';

// Holland RIASEC trait configuration with names, icons, descriptions, and emojis
const TRAIT_CONFIG = {
    Realistic: {
        name: 'Realistik',
        code: 'R',
        emoji: '🛠️',
        icon: Wrench,
        desc: 'Kemahiran praktikal, teknikal & fizikal',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    Investigative: {
        name: 'Investigatif',
        code: 'I',
        emoji: '🔬',
        icon: Search,
        desc: 'Penyelidikan saintifik, analitikal & intelek',
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    Artistic: {
        name: 'Artistik',
        code: 'A',
        emoji: '🎨',
        icon: Palette,
        desc: 'Kreativiti seni, reka bentuk & imaginasi',
        badge: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    Social: {
        name: 'Sosial',
        code: 'S',
        emoji: '🤝',
        icon: HeartHandshake,
        desc: 'Kerjasama, pendidikan & khidmat masyarakat',
        badge: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    Enterprising: {
        name: 'Keusahawanan',
        code: 'E',
        emoji: '💼',
        icon: Briefcase,
        desc: 'Kepimpinan, pengurusan & perniagaan',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    Conventional: {
        name: 'Konvensional',
        code: 'C',
        emoji: '📋',
        icon: FileCheck2,
        desc: 'Sistematik, organisasi data & pentadbiran',
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
};

// Canonical Holland sequence for display grouping
const CATEGORY_ORDER = [
    'Realistic',
    'Investigative',
    'Artistic',
    'Social',
    'Enterprising',
    'Conventional',
];

export default function Quiz({ questions = [] }) {
    // Sort questions by Holland RIASEC category order for display only
    // Keeps original question IDs intact so answers map identically to backend
    const sortedQuestions = useMemo(() => {
        if (!Array.isArray(questions)) return [];
        return [...questions].sort((a, b) => {
            const orderA = CATEGORY_ORDER.indexOf(a.category);
            const orderB = CATEGORY_ORDER.indexOf(b.category);
            const rankA = orderA === -1 ? 999 : orderA;
            const rankB = orderB === -1 ? 999 : orderB;
            if (rankA !== rankB) return rankA - rankB;
            return (a.id ?? 0) - (b.id ?? 0);
        });
    }, [questions]);

    const totalQuestions = sortedQuestions.length;
    const [currentIndex, setCurrentIndex] = useState(0);
    // Map question_id -> value (1 for YES, 0 for NO)
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-advance & interaction states
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [feedbackVal, setFeedbackVal] = useState(null); // 1 for YES, 0 for NO during the 150ms animation
    const [inlineError, setInlineError] = useState('');
    const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'prev'
    const [milestone, setMilestone] = useState(null); // active chapter milestone popup
    const milestoneTimerRef = useRef(null);

    // Reduced motion preference detection
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Clean up milestone timer on unmount
    useEffect(() => {
        return () => {
            if (milestoneTimerRef.current) {
                clearTimeout(milestoneTimerRef.current);
            }
        };
    }, []);

    const currentQ = sortedQuestions[currentIndex] || {};
    const selectedAnswer = answers[currentQ.id];

    // Trait meta for current question
    const currentTrait = useMemo(() => {
        const cat = currentQ.category;
        return (
            TRAIT_CONFIG[cat] || {
                name: cat || 'Holland Trait',
                code: 'H',
                emoji: '✨',
                icon: Sparkles,
                desc: 'Dimensi Minat Personaliti',
                badge: 'bg-slate-50 text-slate-800 border-slate-200',
            }
        );
    }, [currentQ.category]);

    // Questions in this category for the "Ciri Realistik · 4/10" counter
    const categoryQuestions = useMemo(() => {
        return sortedQuestions.filter((q) => q.category === currentQ.category);
    }, [sortedQuestions, currentQ.category]);

    const indexInCategory = useMemo(() => {
        const idx = categoryQuestions.findIndex((q) => q.id === currentQ.id);
        return idx >= 0 ? idx + 1 : 1;
    }, [categoryQuestions, currentQ.id]);

    const totalInCategory = categoryQuestions.length;

    // Progress metrics
    const progressPercentage = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
    const answeredCount = Object.keys(answers).length;
    const CategoryIcon = currentTrait.icon;

    // Direct submit payload builder
    const executeSubmit = (finalAnswers = answers) => {
        const unanswered = sortedQuestions.filter((q) => finalAnswers[q.id] === undefined);
        if (unanswered.length > 0) {
            setInlineError(`Terdapat ${unanswered.length} soalan yang belum dijawab. Sila lengkapkan semua soalan.`);
            return;
        }

        setIsSubmitting(true);
        const payload = Object.entries(finalAnswers).map(([qId, val]) => ({
            question_id: parseInt(qId, 10),
            value: val,
        }));

        router.post('/riasec/submit', {
            answers: payload,
        });
    };

    // Complete active milestone and advance to next trait question
    const handleDismissMilestone = (targetIndex) => {
        if (milestoneTimerRef.current) {
            clearTimeout(milestoneTimerRef.current);
            milestoneTimerRef.current = null;
        }
        setMilestone(null);
        setSlideDirection('next');
        setCurrentIndex(targetIndex);
        setIsTransitioning(false);
        setFeedbackVal(null);
    };

    // One-tap answer selection with 150ms auto-advance & milestone detection
    const handleSelect = (val) => {
        if (isTransitioning || isSubmitting || milestone) return;

        // Clear error and lock buttons during 150ms to prevent skipping
        setInlineError('');
        setIsTransitioning(true);
        setFeedbackVal(val);

        const updatedAnswers = {
            ...answers,
            [currentQ.id]: val,
        };
        setAnswers(updatedAnswers);

        // Check if current question is the last of this category
        const nextIndex = currentIndex + 1;
        const isEndOfCategory =
            nextIndex < totalQuestions && sortedQuestions[nextIndex]?.category !== currentQ.category;
        const isLastQuestionOverall = nextIndex >= totalQuestions;

        setTimeout(() => {
            if (isEndOfCategory) {
                // Trigger chapter milestone banner for ~2.5 seconds
                const nextQ = sortedQuestions[nextIndex];
                const nextTraitConfig = TRAIT_CONFIG[nextQ?.category] || {
                    name: nextQ?.category || 'Seterusnya',
                    emoji: '✨',
                    desc: 'Dimensi Minat Seterusnya',
                };

                setMilestone({
                    completedTrait: currentTrait,
                    nextTrait: nextTraitConfig,
                    nextIndex,
                });

                milestoneTimerRef.current = setTimeout(() => {
                    handleDismissMilestone(nextIndex);
                }, 2500);
            } else if (isLastQuestionOverall) {
                // Quiz completed: proceed to submit
                setIsTransitioning(false);
                setFeedbackVal(null);
                executeSubmit(updatedAnswers);
            } else {
                // Advance to next question smoothly
                setSlideDirection('next');
                setCurrentIndex(nextIndex);
                setIsTransitioning(false);
                setFeedbackVal(null);
            }
        }, 150);
    };

    // Return to previous question without altering existing saved answers
    const handlePrevious = () => {
        if (isTransitioning || isSubmitting) return;
        setInlineError('');

        if (milestone) {
            if (milestoneTimerRef.current) {
                clearTimeout(milestoneTimerRef.current);
                milestoneTimerRef.current = null;
            }
            setMilestone(null);
            return;
        }

        if (currentIndex > 0) {
            setSlideDirection('prev');
            setCurrentIndex((prev) => prev - 1);
            setFeedbackVal(null);
        }
    };

    // Manual next navigation fallback
    const handleNext = () => {
        if (isTransitioning || isSubmitting || milestone) return;

        if (selectedAnswer === undefined) {
            setInlineError('Sila pilih YA atau TIDAK untuk meneruskan.');
            return;
        }

        if (currentIndex < totalQuestions - 1) {
            const nextIndex = currentIndex + 1;
            const isEndOfCategory = sortedQuestions[nextIndex]?.category !== currentQ.category;

            if (isEndOfCategory) {
                const nextQ = sortedQuestions[nextIndex];
                const nextTraitConfig = TRAIT_CONFIG[nextQ?.category] || {
                    name: nextQ?.category || 'Seterusnya',
                    emoji: '✨',
                    desc: 'Dimensi Minat Seterusnya',
                };
                setMilestone({
                    completedTrait: currentTrait,
                    nextTrait: nextTraitConfig,
                    nextIndex,
                });
                milestoneTimerRef.current = setTimeout(() => {
                    handleDismissMilestone(nextIndex);
                }, 2500);
            } else {
                setSlideDirection('next');
                setCurrentIndex(nextIndex);
            }
        } else {
            executeSubmit();
        }
    };

    // Keyboard shortcuts (Y/1, N/2/0, Enter, ArrowKeys, Backspace)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if active inside an input element or while transitioning/submitting
            if (['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())) {
                return;
            }
            if (isTransitioning || isSubmitting) return;

            if (milestone) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleDismissMilestone(milestone.nextIndex);
                }
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
                } else {
                    setInlineError('Sila pilih YA atau TIDAK untuk meneruskan.');
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
    }, [currentIndex, selectedAnswer, currentQ.id, totalQuestions, answers, isTransitioning, isSubmitting, milestone]);

    // Active visual state for YA button
    const isYaActive = feedbackVal === 1 || (feedbackVal === null && selectedAnswer === 1);
    // Active visual state for TIDAK button
    const isTidakActive = feedbackVal === 0 || (feedbackVal === null && selectedAnswer === 0);

    return (
        <UserLayout activePage="riasec">
            <Head title={`Soalan ${currentIndex + 1} - Penilaian RIASEC`} />

            {/* Main Wrapper with pb-28/pb-32 on mobile to guarantee clearance above mobile navigation dock */}
            <div className="max-w-3xl mx-auto py-3 md:py-6 px-3 sm:px-4 pb-28 md:pb-12 space-y-4">
                {/* Top Status Bar: Trait name, Question counter & Total answered */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-slate-500 gap-2 px-1">
                    <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            <Sparkles className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-display font-bold text-slate-900 tracking-tight">
                            Inventori Minat Kerjaya Holland (RIASEC)
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
                        {/* Current Trait Progress Pill */}
                        <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200/80">
                            Ciri {currentTrait.name} · {indexInCategory}/{totalInCategory}
                        </span>
                        <span className="text-slate-400 font-medium">
                            Dijawab: <strong className="text-slate-700">{answeredCount}</strong>/{totalQuestions}
                        </span>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden shadow-inner">
                    <div
                        className={`bg-blue-600 h-full rounded-full ${
                            prefersReducedMotion ? '' : 'transition-all duration-300 ease-out'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Main Interactive Quiz Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10 md:p-12 text-center min-h-[490px] flex flex-col justify-between relative overflow-hidden transition-all">
                    {/* Chapter Milestone Overlay Banner */}
                    {milestone && (
                        <div
                            role="dialog"
                            aria-live="polite"
                            className={`absolute inset-0 z-30 bg-white/95 backdrop-blur-sm p-6 sm:p-10 flex flex-col items-center justify-center text-center ${
                                prefersReducedMotion ? '' : 'animate-fade-in'
                            }`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-3xl shadow-sm mb-4">
                                {milestone.completedTrait.emoji}
                            </div>

                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200/70 mb-2">
                                Bab Selesai
                            </span>

                            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                Tahniah! Ciri {milestone.completedTrait.name} Selesai.
                            </h3>

                            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                                Anda telah melengkapkan semua soalan untuk ciri ini.{' '}
                                <span className="font-bold text-slate-900 block mt-1">
                                    Seterusnya: {milestone.nextTrait.name} {milestone.nextTrait.emoji}
                                </span>
                            </p>

                            <button
                                type="button"
                                onClick={() => handleDismissMilestone(milestone.nextIndex)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold shadow-md transition"
                            >
                                <span>Teruskan Sekarang</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Milestone auto-timer bar */}
                            <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden mt-6">
                                <div
                                    className={`bg-amber-500 h-full rounded-full ${
                                        prefersReducedMotion ? 'w-full' : 'animate-indeterminate'
                                    }`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Question Content Container with animated slide effect */}
                    <div
                        key={currentQ.id}
                        className={
                            prefersReducedMotion
                                ? ''
                                : slideDirection === 'next'
                                ? 'animate-fade-in'
                                : 'animate-fade-in'
                        }
                    >
                        {/* Trait Badge & Description */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border shadow-2xs ${currentTrait.badge}`}
                            >
                                <span className="text-sm leading-none">{currentTrait.emoji}</span>
                                <span>{currentTrait.name} ({currentTrait.code})</span>
                            </div>
                            <span className="text-xs text-slate-500 mt-1.5 font-medium">
                                {currentTrait.desc}
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="my-6 md:my-10 max-w-xl mx-auto">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2.5">
                                Soalan {currentIndex + 1} daripada {totalQuestions}
                            </span>
                            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
                                "{currentQ.question_text}"
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-3 font-normal">
                                Adakah aktiviti ini menarik minat anda? Pilih jawapan yang paling mencerminkan diri anda.
                            </p>
                        </div>
                    </div>

                    {/* Response Area: Inline Error, Large YA & TIDAK Buttons positioned for thumbs */}
                    <div className="w-full max-w-md mx-auto space-y-3.5 my-2">
                        {/* Inline Error Message replacing alert() */}
                        {inlineError && (
                            <div
                                role="alert"
                                className="w-full px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in"
                            >
                                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>{inlineError}</span>
                            </div>
                        )}

                        {/* Large Full-Width YA Button */}
                        <button
                            type="button"
                            onClick={() => handleSelect(1)}
                            disabled={isTransitioning || isSubmitting}
                            aria-label="Pilih Ya untuk soalan ini"
                            className={`w-full py-4 px-6 text-base font-extrabold rounded-2xl transition-all duration-150 flex items-center justify-between cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed ${
                                isYaActive
                                    ? `bg-emerald-600 text-white border-2 border-emerald-600 shadow-md ring-4 ring-emerald-100 ${
                                          feedbackVal === 1 && !prefersReducedMotion ? 'motion-safe:animate-pulse' : ''
                                      }`
                                    : 'border-2 border-emerald-200/90 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-950 hover:border-emerald-300'
                            }`}
                        >
                            <span className="w-7 text-left">
                                {isYaActive ? (
                                    <Check className="w-5 h-5 text-white stroke-[3]" />
                                ) : (
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                                )}
                            </span>
                            <span className="flex-1 text-center font-display tracking-wide text-base sm:text-lg">
                                YA
                            </span>
                            <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                    isYaActive
                                        ? 'bg-white/20 text-white border-white/20'
                                        : 'bg-emerald-200/50 text-emerald-800 border-emerald-300/40'
                                }`}
                            >
                                Y / 1
                            </span>
                        </button>

                        {/* Large Full-Width TIDAK Button */}
                        <button
                            type="button"
                            onClick={() => handleSelect(0)}
                            disabled={isTransitioning || isSubmitting}
                            aria-label="Pilih Tidak untuk soalan ini"
                            className={`w-full py-4 px-6 text-base font-extrabold rounded-2xl transition-all duration-150 flex items-center justify-between cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed ${
                                isTidakActive
                                    ? 'bg-slate-900 text-white border-2 border-slate-900 shadow-md ring-4 ring-slate-200'
                                    : 'border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-slate-300'
                            }`}
                        >
                            <span className="w-7 text-left">
                                {isTidakActive ? (
                                    <Check className="w-5 h-5 text-white stroke-[3]" />
                                ) : (
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                                )}
                            </span>
                            <span className="flex-1 text-center font-display tracking-wide text-base sm:text-lg">
                                TIDAK
                            </span>
                            <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                    isTidakActive
                                        ? 'bg-white/20 text-white border-white/20'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                            >
                                N / 2
                            </span>
                        </button>

                        {/* Keyboard Hint */}
                        <div className="hidden sm:flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                                Petua: Tekan <strong>Y</strong> / <strong>N</strong> pada papan kekunci untuk auto-mara.
                            </span>
                        </div>
                    </div>

                    {/* Bottom Controls: Kembali (Back) & Seterusnya / Submit Buttons */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between max-w-md mx-auto w-full gap-3">
                        {/* Dedicated Kembali (Back) Button */}
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0 || isTransitioning || isSubmitting}
                            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Kembali</span>
                        </button>

                        {/* Forward / Submit Fallback */}
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isSubmitting || selectedAnswer === undefined || isTransitioning}
                            className={`inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                                currentIndex === totalQuestions - 1
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            <span>
                                {currentIndex === totalQuestions - 1
                                    ? isSubmitting
                                        ? 'Menghantar...'
                                        : 'Hantar Jawapan'
                                    : 'Seterusnya'}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Submission Loading Overlay */}
            {isSubmitting && (
                <DataUploadOverlay
                    title="Menganalisis Jawapan RIASEC & Memadankan IPTA..."
                    subtitle="Sistem sedang mengira skor Holland 6 dimensi personaliti, menilai merit SPM anda, dan menjana padanan kursus universiti yang tepat."
                    badge="Enjin Analisis Personaliti"
                />
            )}
        </UserLayout>
    );
}
