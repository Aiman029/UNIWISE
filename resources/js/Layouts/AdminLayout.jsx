import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    HelpCircle,
    Sliders,
    LogOut,
    CheckCircle,
    AlertCircle,
    Shield,
} from 'lucide-react';

export default function AdminLayout({ children, activePage = 'dashboard' }) {
    const { auth, flash = {} } = usePage().props;
    const user = auth?.user;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Accounts', href: '/admin/users', icon: Users },
        { id: 'programmes', label: 'Programme Info', href: '/admin/programmes', icon: BookOpen },
        { id: 'riasec-questions', label: 'RIASEC Question', href: '/admin/riasec-questions', icon: HelpCircle },
        { id: 'recommendation-rules', label: 'Recommendation Rules', href: '/admin/recommendation-rules', icon: Sliders },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
            {/* Top Navbar matching Figure 3.2.1.1.6 */}
            <header className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950 text-white flex items-center justify-center font-black text-sm shadow">
                        UW
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold tracking-wide text-indigo-950">
                            UniWise
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-950/80 text-amber-300 px-2 py-0.5 rounded">
                            Admin
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-amber-600/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-amber-400/40 text-xs font-bold text-white shadow-sm">
                        <Shield className="w-3.5 h-3.5 text-amber-200" />
                        <span>{user?.name || 'Admin 1'}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Log Keluar ke Laman Utama"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-rose-600 text-white text-xs font-bold border border-white/20 transition shadow-sm group"
                    >
                        <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                        <span>Log Keluar</span>
                    </button>
                </div>
            </header>

            {/* Flash Banners */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white px-6 py-3 shadow-md flex items-center text-sm font-semibold tracking-wide animate-fade-in">
                    <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="bg-rose-600 text-white px-6 py-3 shadow-md flex items-center text-sm font-semibold tracking-wide animate-fade-in">
                    <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex">
                {/* Left Sidebar matching Figure 3.2.1.1.6 */}
                <aside className="w-64 bg-sky-600 text-white flex flex-col justify-between shadow-lg min-h-[calc(100vh-56px)] shrink-0">
                    <div className="py-6 px-3">
                        <div className="px-4 mb-6">
                            <h2 className="text-xs font-bold text-sky-200 uppercase tracking-wider">
                                Panel Kawalan Pentadbir
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
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-sky-700/95 text-white font-bold shadow-inner'
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
