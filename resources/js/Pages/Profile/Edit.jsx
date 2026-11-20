import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Plus, Eye, EyeOff, Save, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Edit({ user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name || '',
        avatar: null,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
            onError: () => {
                reset('current_password', 'new_password', 'new_password_confirmation');
            },
        });
    };

    return (
        <UserLayout activePage="profile">
            <Head title="Kemas Kini Profil - UniWise" />

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Kemas Kini Profil</h1>
                        <p className="text-sm text-slate-500">Kemas kini nama, foto profil, dan kata laluan anda.</p>
                    </div>
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Batal</span>
                    </Link>
                </div>

                {/* Password Mismatch Alert Banner */}
                {(errors.current_password || errors.new_password) && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                        <div className="text-sm font-medium">
                            {errors.current_password || errors.new_password || 'Kata laluan semasa atau pengesahan kata laluan baharu tidak sepadan.'}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                    {/* Top Row: Name and Photo Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                NAMA PENUH
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-medium"
                                placeholder="Contoh: Muhammad Aiman"
                            />
                            {errors.name && (
                                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>
                            )}
                        </div>

                        {/* Upload Profile Photo */}
                        <div className="flex flex-col items-center justify-center">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
                                MUAT NAIK FOTO PROFIL
                            </label>
                            <label className="cursor-pointer group relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 flex items-center justify-center overflow-hidden transition">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Pratonton"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-sky-600">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-[11px] text-slate-400 mt-1">PNG, JPG (Maks. 2MB)</span>
                            {errors.avatar && (
                                <p className="text-xs text-rose-600 mt-1 text-center font-medium">{errors.avatar}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                            Tukar Kata Laluan (Pilihan)
                        </h3>

                        <div className="space-y-4 max-w-lg">
                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Kata Laluan Semasa
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPass ? 'text' : 'password'}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                        placeholder="Masukkan kata laluan semasa"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password & Confirm New Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Kata Laluan Baharu
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPass ? 'text' : 'password'}
                                            value={data.new_password}
                                            onChange={(e) => setData('new_password', e.target.value)}
                                            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                            placeholder="Min. 6 aksara"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Sahkan Kata Laluan Baharu
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPass ? 'text' : 'password'}
                                            value={data.new_password_confirmation}
                                            onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                            placeholder="Ulang kata laluan baharu"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'MENYIMPAN...' : 'SIMPAN'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
