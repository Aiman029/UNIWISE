import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    ArrowLeft,
    AlertCircle,
    ShieldCheck,
} from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white bg-grid-pattern">
            <Head title="Log Masuk - UniWise" />

            {/* Glowing Ambient Mesh Orbs in Background */}
            <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent rounded-full blur-3xl pointer-events-none animate-float" />
            <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-gradient-to-tl from-purple-600/30 via-violet-600/20 to-transparent rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Top Navigation Link */}
            <div className="w-full max-w-md mb-4 flex items-center justify-between z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-slate-200 hover:text-white text-xs font-bold backdrop-blur-md transition-all group shadow-md"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-indigo-400" />
                    <span>Laman Utama</span>
                </Link>

                <span className="text-[11px] font-bold text-slate-400">
                    UniWise v2.0
                </span>
            </div>

            {/* Centered Clean Luxury Card */}
            <div className="relative w-full max-w-md bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_60px_-10px_rgba(99,102,241,0.25)] border border-white/20 overflow-hidden z-10 animate-scale-up">
                {/* Thin Top Ambient Light Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-amber-400" />

                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-6 pt-1">
                    <Link href="/" className="inline-block group mb-3">
                        <img
                            src="/images/uniwise-logo.png"
                            alt="UniWise Logo"
                            className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
                        Log Masuk
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        Sistem Bimbingan Halatuju Pendidikan SPM UniWise
                    </p>
                </div>

                {/* Error Banner */}
                {errors.email && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                        <span>{errors.email}</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                            Alamat Emel
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="nama@contoh.com"
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 text-sm font-medium transition bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 outline-none placeholder:text-slate-400 shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Password Input with Visibility Toggle */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                Kata Laluan
                            </label>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 text-sm font-medium transition bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 outline-none placeholder:text-slate-400 shadow-2xs"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Sembunyi kata laluan' : 'Papar kata laluan'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-rose-600 text-xs mt-1.5 font-semibold">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Register Navigation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-0.5">
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="font-semibold text-slate-700">Ingat saya</span>
                        </label>

                        <p className="text-slate-500">
                            Belum ada akaun?{' '}
                            <Link
                                href="/register"
                                className="font-extrabold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 transition"
                            >
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>

                    {/* Shimmer Glowing Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white text-sm font-black tracking-wider rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 -translate-x-full group-hover:animate-sweep pointer-events-none" />
                            <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            <span>{processing ? 'SEDANG MEMPROSES...' : 'LOG MASUK'}</span>
                        </button>
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dilindungi dengan penyulitan sesi &bull; UPSI FYP</span>
                </div>
            </div>
        </div>
    );
}
