import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Compass, Sparkles, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

export default function Index() {
    return (
        <UserLayout activePage="riasec">
            <Head title="Penilaian RIASEC - UniWise" />

            <div className="max-w-3xl mx-auto py-6">
                {/* Intro Card matching Figure 3.2.1.4.2 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-sky-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8 w-40 h-40 bg-indigo-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

                    {/* Character / Quiz Illustration */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-1 shadow-lg">
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                            <Compass className="w-12 h-12 text-indigo-600 animate-spin-slow" />
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 mb-4 border border-indigo-100">
                        <Sparkles className="w-3.5 h-3.5" />
                        Holland RIASEC Theory
                    </span>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        What Should You Study: Personality Quiz
                    </h1>

                    <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
                        Are you certain that you're choosing a career path that fits your personality?
                        Based on the scientific Holland Code model, this quiz will discover what personality type you are and recommend the best IPTA course and ideal future path for you.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-10 text-left">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-slate-800 block">30 Soalan Mudah</span>
                                <span className="text-slate-500">Pilihan 'Ya' atau 'Tidak'</span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-slate-800 block">Graf Radar RIASEC</span>
                                <span className="text-slate-500">6 Dimensi Minat</span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-slate-800 block">Padanan IPTA</span>
                                <span className="text-slate-500">Diploma, Asasi, Sijil</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Link
                            href="/riasec/quiz"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                        >
                            <span>TAKE QUIZ NOW</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
