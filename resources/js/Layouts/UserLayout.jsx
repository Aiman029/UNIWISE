import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    User as UserIcon,
    GraduationCap,
    HelpCircle,
    History as HistoryIcon,
    LogOut,
    CheckCircle,
    AlertCircle,
    X,
} from 'lucide-react';

export default function UserLayout({ children, activePage = 'dashboard' }) {
    const { auth, flash = {} } = usePage().props;
    const user = auth?.user;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', href: '/profile', icon: UserIcon },
        { id: 'academic', label: 'Academic Result', href: '/spm-results', icon: GraduationCap },
        { id: 'riasec', label: 'Riasec Assessment', href: '/riasec', icon: HelpCircle },
        { id: 'history', label: 'History', href: '/history', icon: HistoryIcon },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
            {/* Top Navbar */}
            <header className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        UW
                    </div>
                    <span className="text-xl font-extrabold tracking-wide text-indigo-950">UniWise</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-amber-600/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/40">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-7 h-7 rounded-full object-cover ring-2 ring-white/70"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-800 text-white text-xs font-bold flex items-center justify-center">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <span className="text-sm font-semibold text-white pr-1">
                            {user?.name || 'User'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Flash Banners per SRS Figures */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white px-6 py-3 shadow-md flex items-center justify-between text-sm font-semibold tracking-wide animate-fade-in">
                    <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="bg-rose-600 text-white px-6 py-3 shadow-md flex items-center justify-between text-sm font-semibold tracking-wide animate-fade-in">
                    <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex">
                {/* Left Sidebar per SRS Figures */}
                <aside className="w-64 bg-sky-600 text-white flex flex-col justify-between shadow-lg min-h-[calc(100vh-56px)] shrink-0">
                    <div className="py-6 px-3">
                        <div className="px-4 mb-6">
                            <h2 className="text-xs font-bold text-sky-200 uppercase tracking-wider">
                                Menu Utama
                            </h2>
                        </div>

                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activePage === item.id;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-sky-700/90 text-white font-semibold shadow-inner'
                                                : 'text-sky-100 hover:bg-sky-500/50 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Logout in Sidebar Footer */}
                    <div className="p-4 border-t border-sky-500/40">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sky-100 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span>LogOut</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
