import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="text-center max-w-2xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-4">UniWise</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Dapatkan cadangan program pengajian IPTA yang sesuai berdasarkan keputusan SPM
                    dan personaliti RIASEC anda.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        Log Masuk
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
                    >
                        Daftar
                    </Link>
                </div>
            </div>
        </div>
    );
}