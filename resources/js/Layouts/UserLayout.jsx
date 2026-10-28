import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    User as UserIcon,
    GraduationCap,
    HelpCircle,
    Compass,
    History as HistoryIcon,
    School,
    LogOut,
    CheckCircle,
    AlertCircle,
    X,
    Menu,
    LogIn,
    UserPlus,
    Sparkles,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import { PageSkeleton } from '@/Components/Skeleton';

export default function UserLayout({ children, activePage = 'dashboard' }) {
    const { auth, flash = {} } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);

    // Close drawers on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setProfileDrawerOpen(false);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Listen to Inertia router events for global progress loading
    useEffect(() => {
        let timer = null;
        const unbindStart = router.on('start', () => {
            timer = setTimeout(() => {
                setIsPageLoading(true);
            }, 80);
        });

        const unbindFinish = router.on('finish', () => {
            if (timer) clearTimeout(timer);
            setIsPageLoading(false);
        });

        const unbindError = router.on('error', () => {
            if (timer) clearTimeout(timer);
            setIsPageLoading(false);
        });

        return () => {
            if (timer) clearTimeout(timer);
            unbindStart();
            unbindFinish();
            unbindError();
        };
    }, []);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'academic', label: 'Keputusan SPM & Merit', href: '/spm-results', icon: GraduationCap },
        { id: 'riasec', label: 'Ujian Minat RIASEC', href: '/riasec', icon: Compass },
        { id: 'directory', label: 'Direktori IPTA', href: '/directory', icon: School },
        { id: 'history', label: 'Rekod Sejarah', href: '/history', icon: HistoryIcon },
    ];

    const guestNavItems = [
        { id: 'home', label: 'Laman Utama', href: '/', icon: LayoutDashboard },
        { id: 'directory', label: 'Direktori IPTA', href: '/directory', icon: School },
        { id: 'login', label: 'Log Masuk', href: '/login', icon: LogIn },
        { id: 'register', label: 'Daftar Akaun', href: '/register', icon: UserPlus },
    ];

    // 5 Touch Points for Mobile Bottom Navigation Dock (High Contrast & Tactile)
    const mobileBottomDock = user
        ? [
              { id: 'dashboard', label: 'Utama', href: '/dashboard', icon: LayoutDashboard },
              { id: 'academic', label: 'Merit SPM', href: '/spm-results', icon: GraduationCap },
              { id: 'riasec', label: 'RIASEC', href: '/riasec', icon: Compass },
              { id: 'directory', label: 'IPTA', href: '/directory', icon: School },
              { id: 'profile', label: 'Akaun', isProfileToggle: true, icon: UserIcon },
          ]
        : [
              { id: 'home', label: 'Utama', href: '/', icon: LayoutDashboard },
              { id: 'directory', label: 'Direktori', href: '/directory', icon: School },
              { id: 'login', label: 'Log Masuk', href: '/login', icon: LogIn },
              { id: 'register', label: 'Daftar', href: '/register', icon: UserPlus },
          ];

    const handleLogout = () => {
        setProfileDrawerOpen(false);
        router.post('/logout');
    };

    const currentNavList = user ? navItems : guestNavItems;

    return (
        <div className="min-h-screen bg-slate-100/80 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
            {/* Top Loading Progress Bar */}
            {isPageLoading && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-100 overflow-hidden pointer-events-none">
                    <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 animate-indeterminate" />
                </div>
            )}

            {/* High-Contrast Modern Topbar */}
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-40 shadow-xs">
                <div className="flex items-center gap-3">
                    {/* Mobile Hamburger Drawer Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition cursor-pointer"
                        aria-label="Buka Menu Sisi"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* UniWise Brand Logo with Vibrant Electric Gradient */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                            UW
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                                UniWise<span className="text-blue-600">.</span>
                            </span>
                            <span className="text-[9px] font-extrabold text-blue-600 tracking-wider uppercase mt-0.5">
                                Panduan Halatuju SPM
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right Side Header Items: Profile Pill or Guest Buttons */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <button
                            type="button"
                            onClick={() => setProfileDrawerOpen((prev) => !prev)}
                            className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 active:scale-95 transition-all px-3 py-1.5 rounded-full shadow-xs cursor-pointer group"
                            title="Buka menu profil pengguna"
                            aria-expanded={profileDrawerOpen}
                            aria-haspopup="dialog"
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500/40"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <span className="text-xs sm:text-sm font-extrabold text-slate-800 pr-0.5 truncate max-w-[110px] sm:max-w-[160px]">
                                {user?.name || 'Pelajar'}
                            </span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                    profileDrawerOpen ? 'rotate-180 text-blue-600' : 'group-hover:translate-y-0.5'
                                }`}
                            />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                            >
                                Log Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-full shadow-sm transition active:scale-95"
                            >
                                Daftar Percuma
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Profile Dropdown Drawer */}
            {profileDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        onClick={() => setProfileDrawerOpen(false)}
                        className="fixed inset-0 bg-slate-950/30 backdrop-blur-[2px] transition-opacity duration-150 animate-fade-in"
                        aria-hidden="true"
                    />

                    <div className="fixed top-14 sm:top-16 right-3 sm:right-6 z-50 w-64 max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all duration-150 animate-scale-up">
                        {/* User Header Summary */}
                        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400 shadow-xs shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-white/30 shadow-xs shrink-0">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-extrabold text-white truncate leading-tight">
                                        {user?.name}
                                    </div>
                                    <div className="text-[10px] text-blue-200 truncate mt-0.5 font-medium">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setProfileDrawerOpen(false)}
                                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
                                aria-label="Tutup"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Navigation Options inside Profile Drawer */}
                        <div className="p-2 space-y-1">
                            <Link
                                href="/profile"
                                onClick={() => setProfileDrawerOpen(false)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                                    <span>Profil Saya</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                            </Link>

                            <Link
                                href="/history"
                                onClick={() => setProfileDrawerOpen(false)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <HistoryIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                                    <span>Rekod Penilaian Sejarah</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                            </Link>

                            <div className="border-t border-slate-100 my-1" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition group active:scale-[0.98] cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 text-rose-500 group-hover:text-rose-600 transition shrink-0" />
                                <span>Log Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flash Banners */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white px-5 py-3 shadow-sm flex items-center justify-between text-xs sm:text-sm font-bold tracking-wide animate-fade-in border-b border-emerald-700">
                    <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="bg-rose-600 text-white px-5 py-3 shadow-sm flex items-center justify-between text-xs sm:text-sm font-bold tracking-wide animate-fade-in border-b border-rose-700">
                    <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex relative">
                {/* Mobile Drawer Backdrop */}
                {mobileMenuOpen && (
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 md:hidden"
                    />
                )}

                {/* Midnight Executive Dark Sidebar (High Contrast, Sleek & Premium) */}
                <aside
                    className={`fixed md:sticky top-[61px] left-0 h-[calc(100vh-61px)] w-64 bg-slate-950 text-slate-100 flex flex-col justify-between shadow-2xl z-30 transition-transform duration-300 ease-in-out shrink-0 border-r border-slate-800/90 ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                >
                    <div className="py-6 px-3.5 overflow-y-auto">
                        <div className="px-3 mb-4 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Menu Navigasi
                            </span>
                            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                        </div>

                        <nav className="space-y-1.5">
                            {currentNavList.map((item) => {
                                const Icon = item.icon;
                                const isActive = activePage === item.id;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm transition-all duration-150 group ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-blue-600/30 ring-1 ring-white/20'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-900/90 font-semibold'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-1.5 rounded-xl transition ${
                                                    isActive
                                                        ? 'bg-white/20 text-white shadow-xs'
                                                        : 'text-slate-500 group-hover:text-slate-300'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span>{item.label}</span>
                                        </div>

                                        {isActive && (
                                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Sidebar Footer Info */}
                    <div className="p-4 border-t border-slate-900 bg-slate-950/90 text-center">
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 font-extrabold tracking-tight">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>UniWise Pro &bull; Bimbingan SPM</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                            UPU & RIASEC Holland Engine
                        </div>
                    </div>
                </aside>

                {/* Main Content Area (Contrast background so cards pop with depth) */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full animate-fade-in relative min-h-[500px] pb-28 md:pb-12">
                    {isPageLoading ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200/80 rounded-2xl text-xs font-bold text-blue-800 shadow-2xs mb-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
                                    <span>Sedang memuat naik data... Sila tunggu sebentar.</span>
                                </div>
                                <span className="text-[10px] uppercase font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs shrink-0">
                                    UniWise Sync
                                </span>
                            </div>
                            <PageSkeleton page={activePage} />
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>

            {/* Mobile Bottom Navigation Dock (High Contrast Midnight Style) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl px-2 py-1.5 flex items-center justify-around">
                {mobileBottomDock.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    if (item.isProfileToggle) {
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setProfileDrawerOpen((prev) => !prev)}
                                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                                    profileDrawerOpen ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <div className="p-1 rounded-xl">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold tracking-tight mt-0.5">
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                                isActive
                                    ? 'text-blue-400 font-extrabold'
                                    : 'text-slate-400 hover:text-white font-medium'
                            }`}
                        >
                            <div className={`p-1 rounded-xl ${isActive ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30' : ''}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-tight mt-0.5">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
