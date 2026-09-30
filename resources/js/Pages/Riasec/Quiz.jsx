import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { ChevronLeft, ChevronRight, CheckCircle2, HelpCircle } from 'lucide-react';

export default function Quiz({ questions = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Map question_id -> value (1 for YES, 0 for NO)
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalQuestions = questions.length;
    const currentQ = questions[currentIndex] || {};
    const selectedAnswer = answers[currentQ.id];

    const handleSelect = (val) => {
        setAnswers({
            ...answers,
            [currentQ.id]: val,
        });
    };

    const handleNext = () => {
        if (selectedAnswer === undefined) {
            alert('Sila pilih YES atau NO untuk soalan ini.');
            return;
        }

        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
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

    const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

    return (
        <UserLayout activePage="riasec">
            <Head title={`Soalan ${currentIndex + 1} - Penilaian RIASEC`} />

            <div className="max-w-3xl mx-auto py-4">
                {/* Top Question Tracker */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    <span>Penilaian Personaliti RIASEC</span>
                    <span>
                        Soalan {currentIndex + 1} daripada {totalQuestions} ({progressPercentage}%)
                    </span>
                </div>

                {/* Main Card matching Figure 3.2.1.4.4 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 text-center min-h-[440px] flex flex-col justify-between">
                    {/* Category indicator */}
                    <div className="flex justify-center">
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            Kategori: {currentQ.category || 'General'}
                        </span>
                    </div>

                    {/* Question Text */}
                    <div className="my-8 max-w-xl mx-auto">
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug uppercase tracking-tight">
                            {currentQ.question_text}
                        </h2>
                    </div>

                    {/* Big YES / NO response buttons per Figure 3.2.1.4.4 */}
                    <div className="space-y-4 max-w-xs mx-auto w-full my-4">
                        <button
                            type="button"
                            onClick={() => handleSelect(1)}
                            className={`w-full py-4 text-base font-black rounded-2xl shadow transition transform active:scale-95 ${
                                selectedAnswer === 1
                                    ? 'bg-sky-600 text-white ring-4 ring-sky-200 scale-102'
                                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                            }`}
                        >
                            YES
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelect(0)}
                            className={`w-full py-4 text-base font-black rounded-2xl shadow transition transform active:scale-95 ${
                                selectedAnswer === 0
                                    ? 'bg-sky-700 text-white ring-4 ring-sky-200 scale-102'
                                    : 'bg-sky-600/90 hover:bg-sky-700 text-white'
                            }`}
                        >
                            NO
                        </button>
                    </div>

                    {/* Bottom Progress Quiz Bar and Navigation Buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        {/* Progress bar line */}
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 max-w-md mx-auto">
                            <div
                                className="bg-sky-500 h-full rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>PREVIOUS</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isSubmitting || selectedAnswer === undefined}
                                className="inline-flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition disabled:opacity-40"
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
