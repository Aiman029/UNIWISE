import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            <Head title="Create An Account - UniWise" />

            {/* Top Orange Bar per Figure 3.2.1.1.4 */}
            <header className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 flex justify-between items-center shadow-sm">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 text-white flex items-center justify-center font-extrabold text-sm shadow">
                        UW
                    </div>
                    <span className="text-xl font-extrabold tracking-wide text-indigo-950">
                        UniWise
                    </span>
                </Link>

                <Link
                    href="/login"
                    className="text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg shadow-sm transition"
                >
                    Log In
                </Link>
            </header>

            {/* Centered Register Card per Figure 3.2.1.1.4 */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-indigo-950 tracking-tight">
                            Create An Account
                        </h1>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                            Fill in The Details
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                NAME
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Jenny Mathews"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-medium transition"
                            />
                            {errors.name && (
                                <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="hello@reallygreatsite.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-medium transition"
                            />
                            {errors.email && (
                                <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-medium transition"
                            />
                            {errors.password && (
                                <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                CONFIRM PASSWORD
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-medium transition"
                            />
                        </div>

                        <div className="pt-1 text-xs text-center text-slate-500">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-bold text-sky-600 hover:text-sky-800 underline decoration-sky-300"
                            >
                                Log In
                            </Link>
                        </div>

                        {/* Sign Up Button per Figure 3.2.1.1.4 */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-extrabold tracking-wider rounded-xl shadow-md hover:shadow-lg transition transform active:scale-98 disabled:opacity-50"
                            >
                                {processing ? 'REGISTERING...' : 'SIGN UP'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}