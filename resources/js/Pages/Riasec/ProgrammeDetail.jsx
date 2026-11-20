import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import RiasecBadges from '@/Components/RiasecBadges';
import { School, FileText, ArrowLeft, Award, CheckCircle2 } from 'lucide-react';

export default function ProgrammeDetail({ programme }) {
    return (
        <UserLayout activePage="riasec">
            <Head title={`${programme.name} - UniWise`} />

            <div className="max-w-3xl mx-auto py-4">
                <div className="mb-6">
                    <Link
                        href="/riasec"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 hover:text-sky-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Link>
                </div>

                <div className="bg-sky-600 text-white rounded-3xl shadow-xl p-8 md:p-10 border-4 border-sky-500">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-white text-sky-700 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
                            <School className="w-8 h-8 text-sky-600" />
                        </div>
                        <div>
                            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                                {programme.institution} • {programme.level}
                                {programme.code && ` • ${programme.code}`}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black uppercase mt-1 leading-tight">
                                {programme.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {programme.merit && (
                                    <span className="text-xs font-bold text-sky-900 bg-amber-300 px-2.5 py-1 rounded-lg">
                                        Purata Merit UPU: {programme.merit}%
                                    </span>
                                )}
                                {programme.notes && programme.notes !== '-' && (
                                    <span className="text-xs font-semibold text-white bg-sky-700/80 px-2.5 py-1 rounded-lg border border-sky-400/50">
                                        {programme.notes}
                                    </span>
                                )}
                            </div>
                            <div className="mt-3">
                                <RiasecBadges programme={programme} dark />
                            </div>
                        </div>
                    </div>

                    <div className="bg-sky-700/60 rounded-2xl p-6 border border-sky-400/40 space-y-4">
                        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm tracking-wider uppercase">
                            <FileText className="w-4 h-4" />
                            <span>SYARAT KEMASUKAN (SPM)</span>
                        </div>

                        <div className="text-sm text-sky-50 leading-relaxed font-medium whitespace-pre-line bg-sky-800/50 p-5 rounded-xl border border-sky-500/40">
                            {programme.entry_requirement ||
                                'Lulus SPM dengan minimum 3 kepujian termasuk mata pelajaran yang berkaitan.'}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center text-xs text-sky-200">
                        <span>Peringkat: {programme.level}</span>
                        <span>Institusi Awam (IPTA)</span>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
