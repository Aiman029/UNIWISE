import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { User, Mail, ShieldCheck, Edit3 } from 'lucide-react';

export default function Show({ user }) {
    return (
        <UserLayout activePage="profile">
            <Head title="Profil Pengguna - UniWise" />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
                    <p className="text-sm text-slate-500">Maklumat akaun dan butiran peribadi anda.</p>
                </div>

                {/* Profile Card matching Figure 3.2.1.2.2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center">
                    <div className="mb-6 relative">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-100 shadow-md"
                            />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                                <User className="w-14 h-14" />
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-md space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                NAMA PENUH
                            </span>
                            <span className="text-base font-semibold text-slate-800">
                                {user.name}
                            </span>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60">
                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                ALAMAT EMEL
                            </span>
                            <span className="text-base font-semibold text-slate-800">
                                {user.email}
                            </span>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    STATUS AKAUN
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full mt-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {user.status === 'deactivated' ? 'TIDAK AKTIF' : 'AKTIF'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    PERANAN
                                </span>
                                <span className="text-xs font-semibold text-slate-700 mt-1 inline-block">
                                    {user.role === 'admin' ? 'Pentadbir' : 'Pelajar SPM'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end w-full max-w-md">
                        <Link
                            href="/profile/edit"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow transition"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>KEMAS KINI PROFIL</span>
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
