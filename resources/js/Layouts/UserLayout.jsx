import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    User as UserIcon,
    GraduationCap,
    HelpCircle,
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

export default function UserLayout({ children, activePage = 'dashboard' }) {
    const { auth, flash = {} } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

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

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'academic', label: 'Academic Result', href: '/spm-results', icon: GraduationCap },
        { id: 'riasec', label: 'Riasec Assessment', href: '/riasec', icon: HelpCircle },
        { id: 'history', label: 'History', href: '/history', icon: HistoryIcon },
        { id: 'directory', label: 'Direktori IPTA', href: '/directory', icon: School },
    ];

    const guestNavItems = [
        { id: 'home', label: 'Laman Utama', href: '/', icon: LayoutDashboard },
        { id: 'directory', label: 'Direktori IPTA', href: '/directory', icon: School },
        { id: 'login', label: 'Log Masuk', href: '/login', icon: LogIn },
        { id: 'register', label: 'Daftar Akaun', href: '/register', icon: UserPlus },
    ];

    const handleLogout = () => {
        setProfileDrawerOpen(false);
        router.post('/logout');
    };

    const currentNavList = user ? navItems : guestNavItems;

    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
            {/* Top Navbar */}
            <header className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-white shadow-md px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-40 border-b border-amber-600/30">
                <div className="flex items-center gap-3">
                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-1.5 rounded-xl bg-amber-600/50 hover:bg-amber-700/60 md:hidden transition text-white"
                        aria-label="Toggle Navigation"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-indigo-950 text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform duration-200 ring-2 ring-white/30">
                            UW
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-indigo-950 leading-none">
                                UniWise
                            </span>
                            <span className="text-[9px] font-bold text-amber-100 tracking-wider uppercase mt-0.5">
                                SPM Career Guidance
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        /* User Name Button - Toggles Right Profile Drawer */
                        <button
                            type="button"
                            onClick={() => setProfileDrawerOpen((prev) => !prev)}
                            className="flex items-center gap-2 bg-amber-600/60 hover:bg-amber-700/70 active:scale-95 transition-all backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-300/40 shadow-sm cursor-pointer group"
                            title="Buka menu profil dan log keluar"
                            aria-expanded={profileDrawerOpen}
                            aria-haspopup="dialog"
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-6 h-6 rounded-full object-cover ring-1 ring-white/80 shadow-xs"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-indigo-950 text-white text-[11px] font-black flex items-center justify-center ring-1 ring-white/50 shadow-xs">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <span className="text-xs sm:text-sm font-extrabold text-white pr-0.5 truncate max-w-[100px] sm:max-w-[150px]">
                                {user?.name || 'User'}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-amber-100 transition-transform duration-200 ${profileDrawerOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-full shadow-sm transition"
                            >
                                Log Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-extrabold rounded-full shadow-sm transition"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Slim & Compact Right-Side User Profile & Logout Drawer */}
            {profileDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Transparent Click-Outside Backdrop */}
                    <div
                        onClick={() => setProfileDrawerOpen(false)}
                        className="fixed inset-0 bg-slate-950/15 backdrop-blur-[1px] transition-opacity duration-150 animate-fade-in"
                        aria-hidden="true"
                    />

                    {/* Compact Floating Drawer / Dropdown */}
                    <div className="fixed top-14 sm:top-15 right-3 sm:right-6 z-50 w-60 sm:w-64 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transform transition-all duration-150 animate-scale-up ring-1 ring-black/5">
                        {/* Compact User Info Header */}
                        <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-white shadow-xs shrink-0">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-black text-slate-800 truncate leading-tight">
                                        {user?.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setProfileDrawerOpen(false)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer shrink-0"
                                aria-label="Tutup"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Slim Action Items: Profile & Logout */}
                        <div className="p-1.5 space-y-0.5">
                            {/* Profile Link */}
                            <Link
                                href="/profile"
                                onClick={() => setProfileDrawerOpen(false)}
                                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition group"
                            >
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition shrink-0" />
                                    <span>Profil Saya</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition" />
                            </Link>

                            <div className="border-t border-slate-100 my-1" />

                            {/* Logout Button */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition group active:scale-[0.98] cursor-pointer"
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
                <div className="bg-emerald-600 text-white px-6 py-3 shadow-md flex items-center justify-between text-sm font-bold tracking-wide animate-fade-in border-b border-emerald-700">
                    <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="bg-rose-600 text-white px-6 py-3 shadow-md flex items-center justify-between text-sm font-bold tracking-wide animate-fade-in border-b border-rose-700">
                    <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex relative">
                {/* Mobile Backdrop */}
                {mobileMenuOpen && (
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
                    />
                )}

                {/* Left Sidebar */}
                <aside
                    className={`fixed md:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-gradient-to-b from-sky-600 via-sky-600 to-sky-700 text-white flex flex-col justify-between shadow-xl z-30 transition-transform duration-300 ease-in-out shrink-0 border-r border-sky-500/40 ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                >
                    <div className="py-6 px-3 overflow-y-auto">
                        <div className="px-3 mb-5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-sky-200 uppercase tracking-widest">
                                Menu Navigasi
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
                                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 group ${
                                            isActive
                                                ? 'bg-sky-800 text-white shadow-inner font-black ring-1 ring-white/20'
                                                : 'text-sky-100 hover:bg-sky-500/60 hover:text-white hover:translate-x-1'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-1.5 rounded-xl transition ${
                                                    isActive
                                                        ? 'bg-amber-400 text-indigo-950 shadow-sm'
                                                        : 'text-sky-200 group-hover:text-white'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span>{item.label}</span>
                                        </div>

                                        {isActive && (
                                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-sky-500/40 bg-sky-700/40 backdrop-blur-xs text-center">
                        <div className="text-[10px] text-sky-200/80 font-semibold tracking-wide">
                            UPSI FYP • UniWise v2.0
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-5 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
