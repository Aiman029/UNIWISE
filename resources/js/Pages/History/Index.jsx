import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import {
    Folder,
    Calendar,
    Award,
    ArrowRight,
    Compass,
    Eye,
} from 'lucide-react';

export default function Index({ history = [] }) {
    return (
        <UserLayout activePage="history">
            <Head title="Sejarah Penilaian - UniWise" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Sejarah Cadangan & Penilaian
                    </h1>
                    <p className="text-sm text-slate-500">
                        Semak semula rekod keputusan SPM, graf ciri RIASEC, dan program pengajian yang pernah dipadankan.
                    </p>
                </div>

                {history && history.length > 0 ? (
                    /* Table matching Figure 3.2.1.5.2: LIST OF HISTORY */
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-sky-600 px-6 py-4 text-white">
                            <h2 className="text-base font-extrabold tracking-wide uppercase">
                                SENARAI SEJARAH PENILAIAN
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                        <th className="px-6 py-3.5">TARIKH</th>
                                        <th className="px-6 py-3.5">SKOR MERIT</th>
                                        <th className="px-6 py-3.5">DOMINAN RIASEC</th>
                                        <th className="px-6 py-3.5 text-right">TINDAKAN</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                    {history.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-slate-50/80 transition group"
                                        >
                                            <td className="px-6 py-4 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                                                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                                                <span>
                                                    {new Date(item.date_generated).toLocaleDateString('ms-MY', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-extrabold text-sky-700 text-sm">
                                                    {item.merit_score}%
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-100">
                                                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                                                    {item.dominant_trait}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/history/${item.session_id}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition shadow-sm"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Lihat Butiran</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Empty state */
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                            <Folder className="w-12 h-12" />
                        </div>

                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">
                            Tiada Rekod Sejarah
                        </h2>

                        <p className="text-xs text-slate-500 mb-6">
                            Anda belum melengkapkan sebarang penilaian RIASEC atau padanan program pengajian.
                        </p>

                        <Link
                            href="/riasec"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow transition"
                        >
                            <Compass className="w-4 h-4" />
                            <span>Mula Penilaian Sekarang</span>
                        </Link>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
