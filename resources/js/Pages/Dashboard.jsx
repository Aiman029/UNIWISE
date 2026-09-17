import { Link, router } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-indigo-900">UniWise</span>
                <button
                    onClick={() => router.post('/logout')}
                    className="text-sm text-gray-600 hover:text-red-600"
                >
                    Log Keluar
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Selamat datang, {auth?.user?.name}!
                </h1>
                <p className="text-gray-600 mb-8">
                    Lengkapkan keputusan SPM dan penilaian RIASEC untuk dapatkan cadangan program pengajian.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Link
                        href="/spm-results"
                        className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                        <h2 className="font-semibold text-gray-900 mb-1">Keputusan SPM</h2>
                        <p className="text-sm text-gray-500">Masukkan subjek dan gred SPM anda</p>
                    </Link>

                    <Link
                        href="/riasec-quiz"
                        className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                        <h2 className="font-semibold text-gray-900 mb-1">Penilaian RIASEC</h2>
                        <p className="text-sm text-gray-500">Jawab soalan personaliti (30 soalan)</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}