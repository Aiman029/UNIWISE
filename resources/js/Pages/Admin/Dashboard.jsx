import { router } from '@inertiajs/react';

export default function AdminDashboard({ auth }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-indigo-900">UniWise Admin</span>
                <button
                    onClick={() => router.post('/logout')}
                    className="text-sm text-gray-600 hover:text-red-600"
                >
                    Log Keluar
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Panel Admin — {auth?.user?.name}
                </h1>
                <p className="text-gray-600">
                    Urus program IPTA, soalan RIASEC, peraturan cadangan, dan akaun pengguna.
                </p>
            </div>
        </div>
    );
}