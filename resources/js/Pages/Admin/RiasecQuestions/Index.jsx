import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    HelpCircle,
    Filter,
    X,
    AlertTriangle,
} from 'lucide-react';

export default function RiasecQuestionIndex({ questions, categories = [], filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        question_text: '',
        category: 'Realistic',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/riasec-questions',
            { search, category: categoryFilter },
            { preserveState: true }
        );
    };

    const handleCategoryFilter = (cat) => {
        setCategoryFilter(cat);
        router.get(
            '/admin/riasec-questions',
            { search, category: cat },
            { preserveState: true }
        );
    };

    const openAddModal = () => {
        setFormData({
            question_text: '',
            category: 'Realistic',
        });
        setIsAddModalOpen(true);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        router.post('/admin/riasec-questions', formData, {
            onSuccess: () => setIsAddModalOpen(false),
        });
    };

    const openEditModal = (q) => {
        setSelectedQuestion(q);
        setFormData({
            question_text: q.question_text,
            category: q.category,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        router.put(`/admin/riasec-questions/${selectedQuestion.id}`, formData, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const openDeleteModal = (q) => {
        setSelectedQuestion(q);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedQuestion) return;
        router.delete(`/admin/riasec-questions/${selectedQuestion.id}`, {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const categoryBadges = {
        Realistic: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Investigative: 'bg-sky-50 text-sky-700 border-sky-200',
        Artistic: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
        Social: 'bg-amber-50 text-amber-700 border-amber-200',
        Enterprising: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        Conventional: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return (
        <AdminLayout activePage="riasec-questions">
            <Head title="RIASEC Question Management - UniWise Admin" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header matching Figure 3.2.1.8.2 */}
                <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
                            PENGURUSAN INVENTORI PERSONALITI
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mt-1">
                            RIASEC QUESTION MANAGEMENT
                        </h1>
                        <p className="text-xs text-sky-100 mt-1">
                            Urus bank soalan teori Holland RIASEC untuk penilaian personaliti pelajar.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ ADD NEW QUESTION</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar matching Figure 3.2.1.8.2 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari teks soalan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Kategori RIASEC:</span>
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                        >
                            <option value="all">Semua Kategori (R/I/A/S/E/C)</option>
                            {categories.map((c, idx) => (
                                <option key={idx} value={c}>
                                    {c} ({c.charAt(0)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Question Table matching Figure 3.2.1.8.2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-sky-600 text-white font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="py-3.5 px-4 text-center w-12">#</th>
                                    <th className="py-3.5 px-5">QUESTION TEXT</th>
                                    <th className="py-3.5 px-4 text-center">CATEGORY</th>
                                    <th className="py-3.5 px-4 text-center">DATE ADDED</th>
                                    <th className="py-3.5 px-5 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {questions.data && questions.data.length > 0 ? (
                                    questions.data.map((q, idx) => (
                                        <tr key={q.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-4 px-4 text-center font-bold text-slate-400">
                                                {q.id}
                                            </td>
                                            <td className="py-4 px-5 text-slate-800 font-semibold leading-relaxed">
                                                {q.question_text}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-block font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${categoryBadges[q.category] || 'bg-slate-100'}`}>
                                                    {q.category} ({q.category.charAt(0)})
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center text-slate-500 text-[11px]">
                                                {new Date(q.created_at).toLocaleDateString('ms-MY')}
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(q)}
                                                        className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition"
                                                        title="Edit Soalan"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(q)}
                                                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition"
                                                        title="Padam Soalan"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-400">
                                            Tiada rekod soalan RIASEC ditemui.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {questions.links && questions.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>
                                Menunjukkan {questions.from || 0} hingga {questions.to || 0} daripada {questions.total} rekod
                            </span>
                            <div className="flex gap-1">
                                {questions.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-lg font-bold text-xs ${
                                            link.active
                                                ? 'bg-sky-600 text-white'
                                                : link.url
                                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add New Question Modal matching Figure 3.2.1.8.8 */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-scale-in border border-slate-200 relative">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase text-slate-900">
                                    ADD NEW RIASEC QUESTION
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Tambah item soalan baharu ke dalam penilaian personaliti
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitAdd} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Teks Soalan (Question Text)</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="cth: Saya suka membaiki alat elektrik atau perkakasan mekanikal."
                                    value={formData.question_text}
                                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Kategori RIASEC (Category)</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    <option value="Realistic">Realistic (R) - Praktikal & Teknikal</option>
                                    <option value="Investigative">Investigative (I) - Analitikal & Saintifik</option>
                                    <option value="Artistic">Artistic (A) - Kreatif & Inovatif</option>
                                    <option value="Social">Social (S) - Komunikasi & Tolong Menolong</option>
                                    <option value="Enterprising">Enterprising (E) - Kepimpinan & Perniagaan</option>
                                    <option value="Conventional">Conventional (C) - Sistematik & Pengurusan Rekod</option>
                                </select>
                            </div>

                            <div className="pt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition uppercase"
                                >
                                    BATAL
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition uppercase tracking-wider"
                                >
                                    ADD QUESTION
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Question Modal matching Figure 3.2.1.8.4 */}
            {isEditModalOpen && selectedQuestion && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-scale-in border border-slate-200 relative">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                                <Edit2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase text-slate-900">
                                    EDIT RIASEC QUESTION
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Kemaskini pernyataan soalan atau kategori
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Teks Soalan (Question Text)</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.question_text}
                                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Kategori RIASEC (Category)</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    <option value="Realistic">Realistic (R)</option>
                                    <option value="Investigative">Investigative (I)</option>
                                    <option value="Artistic">Artistic (A)</option>
                                    <option value="Social">Social (S)</option>
                                    <option value="Enterprising">Enterprising (E)</option>
                                    <option value="Conventional">Conventional (C)</option>
                                </select>
                            </div>

                            <div className="pt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition uppercase"
                                >
                                    BATAL
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition uppercase tracking-wider"
                                >
                                    UPDATE QUESTION
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal matching Figure 3.2.1.8.6 */}
            {isDeleteModalOpen && selectedQuestion && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in border border-slate-200">
                        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
                            <AlertTriangle className="w-8 h-8" />
                        </div>

                        <h3 className="text-base font-black text-slate-900 uppercase">
                            ARE YOU SURE WANT TO DELETE THIS QUESTION?
                        </h3>
                        <p className="text-xs font-semibold text-slate-700 mt-2 px-2 italic">
                            "{selectedQuestion.question_text}"
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase">
                            Kategori: {selectedQuestion.category}
                        </p>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition uppercase"
                            >
                                CANCEL
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition uppercase"
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
