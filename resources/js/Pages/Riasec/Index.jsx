import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import {
    Compass,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Clock,
    Target,
    Award,
    Wrench,
    Search,
    Palette,
    HeartHandshake,
    Briefcase,
    FileCheck2,
} from 'lucide-react';

export default function Index() {
    const traits = [
        { code: 'R', title: 'Realistik', desc: 'Praktikal, fizikal & mekanikal', icon: Wrench, color: 'border-emerald-200 bg-emerald-50/60 text-emerald-800' },
        { code: 'I', title: 'Investigatif', desc: 'Analitikal, saintifik & penyelesaian masalah', icon: Search, color: 'border-sky-200 bg-sky-50/60 text-sky-800' },
        { code: 'A', title: 'Artistik', desc: 'Kreativiti ekspresif, inovatif & seni', icon: Palette, color: 'border-purple-200 bg-purple-50/60 text-purple-800' },
        { code: 'S', title: 'Sosial', desc: 'Mendidik, membimbing & hubungan manusia', icon: HeartHandshake, color: 'border-rose-200 bg-rose-50/60 text-rose-800' },
        { code: 'E', title: 'Keusahawanan', desc: 'Kepimpinan, pengaruh & perniagaan', icon: Briefcase, color: 'border-amber-200 bg-amber-50/60 text-amber-800' },
        { code: 'C', title: 'Konvensional', desc: 'Sistematik, terperinci & organisasi data', icon: FileCheck2, color: 'border-indigo-200 bg-indigo-50/60 text-indigo-800' },
    ];

    return (
        <UserLayout activePage="riasec">
            <Head title="Penilaian RIASEC - UniWise" />

            <div className="max-w-4xl mx-auto py-6 space-y-6">
                {/* Intro Card matching Figure 3.2.1.4.2 with Elevated Aesthetics */}
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-8 md:p-12 text-center relative overflow-hidden transition-all">
                    <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-sky-100/70 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-64 h-64 bg-indigo-100/70 rounded-full blur-3xl pointer-events-none" />

                    {/* Compass Icon Badge */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-400 p-1 shadow-xl group">
                        <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
                            <Compass className="w-12 h-12 text-indigo-600 animate-spin-slow" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 mb-4 border border-indigo-200 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Teori Personaliti Holland &bull; RIASEC Inventory</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        What Should You Study: Personality Quiz
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
                        Adakah anda pasti program pengajian yang anda pilih sepadan dengan minat dan personaliti sebenar anda?
                        Berdasarkan model saintifik Kod Holland, kuiz ini akan mengenal pasti corak personaliti anda dan memadankan program IPTA terbaik untuk masa depan anda.
                    </p>

                    {/* Features Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left">
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-extrabold text-slate-900 block text-xs">30 Soalan Mudah</span>
                                <span className="text-[11px] text-slate-500">Pilihan 'Ya' / 'Tidak' secara spontan</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-extrabold text-slate-900 block text-xs">Masa Diperlukan</span>
                                <span className="text-[11px] text-slate-500">Kira-kira 5 minit sahaja</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-extrabold text-slate-900 block text-xs">Padanan IPTA Pintar</span>
                                <span className="text-[11px] text-slate-500">Asasi, Diploma & Sijil 20 IPTA</span>
                            </div>
                        </div>
                    </div>

                    {/* 6 Holland Dimensions Preview Grid */}
                    <div className="text-left mb-10">
                        <span className="block text-center text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                            6 Dimensi Personaliti yang Diukur
                        </span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {traits.map((t) => {
                                const Icon = t.icon;
                                return (
                                    <div
                                        key={t.code}
                                        className={`p-3 rounded-2xl border ${t.color} flex items-center gap-2.5 transition hover:scale-102`}
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-white/80 shadow-sm flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black">{t.title}</div>
                                            <div className="text-[10px] text-slate-600 line-clamp-1">{t.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Big Call to Action */}
                    <div className="pt-2">
                        <Link
                            href="/riasec/quiz"
                            className="inline-flex items-center gap-3 px-12 py-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
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
