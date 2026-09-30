import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Compass, GraduationCap, CheckCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            <Head title="UniWise - Sistem Bimbingan Halatuju Pendidikan SPM" />

            {/* Top Orange Header per Figure 3.2.1.1.2 */}
            <header className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950 text-white flex items-center justify-center font-extrabold text-base shadow">
                        UW
                    </div>
                    <span className="text-2xl font-black tracking-wide text-indigo-950">
                        UniWise
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-5 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase bg-sky-600 hover:bg-sky-700 text-white shadow transition"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/register"
                        className="px-5 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase bg-amber-400 hover:bg-amber-300 text-indigo-950 shadow-sm transition"
                    >
                        Register
                    </Link>
                </div>
            </header>

            {/* Hero Introduction Section per Figure 3.2.1.1.2 */}
            <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 border border-sky-200">
                            <Sparkles className="w-3.5 h-3.5" />
                            SPM Educational Guidance System
                        </span>

                        <h1 className="text-4xl md:text-5xl font-black text-indigo-950 tracking-tight leading-tight">
                            Personalised Educational Recommendation
                        </h1>

                        <p className="text-base text-slate-600 leading-relaxed">
                            UniWise membantu lepasan SPM memilih program pengajian tinggi awam (IPTA) yang tepat melalui gabungan padanan <strong>kelayakan akademik SPM</strong> dan <strong>penilaian personaliti RIASEC</strong>.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                            >
                                <span>Mula Sekarang</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl shadow-sm transition"
                            >
                                <span>Log Masuk</span>
                            </Link>
                        </div>
                    </div>

                    {/* RIASEC Hexagon Illustration per Figure 3.2.1.1.2 */}
                    <div className="flex justify-center">
                        <div className="relative w-80 h-80 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col items-center justify-center">
                            <div className="grid grid-cols-2 gap-3 w-full">
                                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                                    <span className="block text-xs font-black text-rose-700">R</span>
                                    <span className="text-[11px] font-bold text-slate-600">Realistic</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                                    <span className="block text-xs font-black text-amber-700">I</span>
                                    <span className="text-[11px] font-bold text-slate-600">Investigative</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 text-center">
                                    <span className="block text-xs font-black text-violet-700">A</span>
                                    <span className="text-[11px] font-bold text-slate-600">Artistic</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                                    <span className="block text-xs font-black text-emerald-700">S</span>
                                    <span className="text-[11px] font-bold text-slate-600">Social</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                                    <span className="block text-xs font-black text-sky-700">E</span>
                                    <span className="text-[11px] font-bold text-slate-600">Enterprising</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                                    <span className="block text-xs font-black text-indigo-700">C</span>
                                    <span className="text-[11px] font-bold text-slate-600">Conventional</span>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                                    Holland RIASEC Framework
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ABOUT US Section per Figure 3.2.1.1.2 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-indigo-950 uppercase tracking-wide mb-2">
                            ABOUT US
                        </h2>
                        <p className="text-sm text-slate-500">
                            Platform pintar untuk membimbing lepasan Sijil Pelajaran Malaysia ke menara gading.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                                Kiraan Markah Merit
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Pengiraan markah merit automatik berasaskan gred peperiksaan SPM dan subjek teras serta elektif terbaik.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                <Compass className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                                Ujian RIASEC Standard
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Mengenal pasti dimensi minat kerjaya (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                                Padanan Program IPTA
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Cadangan khusus Diploma, Asasi, dan Sijil daripada IPTA terkemuka Malaysia lengkap dengan syarat kemasukan.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
                <p>&copy; 2026 UniWise - Final Year Project Archive. All rights reserved.</p>
            </footer>
        </div>
    );
}