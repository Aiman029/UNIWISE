import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Sliders,
    Filter,
    X,
    AlertTriangle,
    BookOpen,
} from 'lucide-react';

export default function RecommendationRuleIndex({ rules, programmes = [], filters, categories = [], grades = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [riasecFilter, setRiasecFilter] = useState(filters.riasec_type || 'all');

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        riasec_type: 'Realistic',
        programme_id: programmes[0]?.id || '',
        min_grade: 'C',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/recommendation-rules',
            { search, riasec_type: riasecFilter },
            { preserveState: true }
        );
    };

    const handleRiasecFilter = (type) => {
        setRiasecFilter(type);
        router.get(
            '/admin/recommendation-rules',
            { search, riasec_type: type },
            { preserveState: true }
        );
    };

    const openAddModal = () => {
        setFormData({
            riasec_type: 'Realistic',
            programme_id: programmes[0]?.id || '',
            min_grade: 'C',
        });
        setIsAddModalOpen(true);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        router.post('/admin/recommendation-rules', formData, {
            onSuccess: () => setIsAddModalOpen(false),
        });
    };

    const openEditModal = (rule) => {
        setSelectedRule(rule);
        setFormData({
            riasec_type: rule.riasec_type,
            programme_id: rule.programme_id,
            min_grade: rule.min_grade,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        router.put(`/admin/recommendation-rules/${selectedRule.id}`, formData, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const openDeleteModal = (rule) => {
        setSelectedRule(rule);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedRule) return;
        router.delete(`/admin/recommendation-rules/${selectedRule.id}`, {
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
        <AdminLayout activePage="recommendation-rules">
            <Head title="Pengurusan Peraturan Padanan - Pentadbir UniWise" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
                            ENJIN SYORAN &amp; PEMADANAN
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mt-1">
                            PENGURUSAN PERATURAN PADANAN
                        </h1>
                        <p className="text-xs text-sky-100 mt-1">
                            Petakan dimensi RIASEC dan syarat gred minimum kepada program pengajian IPTA.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>TAMBAH PERATURAN BAHARU</span>
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar matching Figure 3.2.1.9.2 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama program atau institusi..."
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
                            value={riasecFilter}
                            onChange={(e) => handleRiasecFilter(e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                        >
                            <option value="all">Semua Jenis RIASEC</option>
                            {categories.map((c, idx) => (
                                <option key={idx} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Rules Table matching Figure 3.2.1.9.2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-sky-600 text-white font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="py-3.5 px-4 text-center w-12">#</th>
                                    <th className="py-3.5 px-4 text-center">DIMENSI RIASEC</th>
                                    <th className="py-3.5 px-5">NAMA PROGRAM</th>
                                    <th className="py-3.5 px-5">INSTITUSI</th>
                                    <th className="py-3.5 px-4 text-center">GRED MIN</th>
                                    <th className="py-3.5 px-5 text-right">TINDAKAN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {rules.data && rules.data.length > 0 ? (
                                    rules.data.map((r, idx) => (
                                        <tr key={r.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-4 px-4 text-center font-bold text-slate-400">
                                                {r.id}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-block font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${categoryBadges[r.riasec_type] || 'bg-slate-100'}`}>
                                                    {r.riasec_type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <span className="font-extrabold text-slate-900 block uppercase">
                                                    {r.programme?.name || 'Programme #' + r.programme_id}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {r.programme?.code && (
                                                        <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                                                            {r.programme.code}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-500 font-semibold">
                                                        {r.programme?.level}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-slate-600 font-semibold">
                                                {r.programme?.institution || '-'}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                                    {r.min_grade}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(r)}
                                                        className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition"
                                                        title="Edit Rule"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(r)}
                                                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition"
                                                        title="Delete Rule"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-slate-400">
                                            Tiada peraturan padanan ditemui.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {rules.links && rules.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>
                                Menunjukkan {rules.from || 0} hingga {rules.to || 0} daripada {rules.total} rekod
                            </span>
                            <div className="flex gap-1">
                                {rules.links.map((link, idx) => (
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

            {/* Add New Rule Modal matching Figure 3.2.1.9.8 */}
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
                                    TAMBAH PERATURAN PADANAN
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Petakan dimensi RIASEC kepada program pengajian
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitAdd} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Dimensi RIASEC</label>
                                <select
                                    value={formData.riasec_type}
                                    onChange={(e) => setFormData({ ...formData, riasec_type: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    <option value="Realistic">Realistik (R)</option>
                                    <option value="Investigative">Investigatif (I)</option>
                                    <option value="Artistic">Artistik (A)</option>
                                    <option value="Social">Sosial (S)</option>
                                    <option value="Enterprising">Enterprising (E)</option>
                                    <option value="Conventional">Konvensional (C)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Pilih Program Pengajian</label>
                                <select
                                    value={formData.programme_id}
                                    onChange={(e) => setFormData({ ...formData, programme_id: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold truncate"
                                >
                                    {programmes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.institution} - {p.level})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Gred Minimum SPM</label>
                                <select
                                    value={formData.min_grade}
                                    onChange={(e) => setFormData({ ...formData, min_grade: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    {grades.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
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
                                    TAMBAH PERATURAN
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Rule Modal */}
            {isEditModalOpen && selectedRule && (
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
                                    SUNTING PERATURAN PADANAN
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Kemaskini padanan RIASEC atau gred minimum
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Dimensi RIASEC</label>
                                <select
                                    value={formData.riasec_type}
                                    onChange={(e) => setFormData({ ...formData, riasec_type: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    <option value="Realistic">Realistik (R)</option>
                                    <option value="Investigative">Investigatif (I)</option>
                                    <option value="Artistic">Artistik (A)</option>
                                    <option value="Social">Sosial (S)</option>
                                    <option value="Enterprising">Enterprising (E)</option>
                                    <option value="Conventional">Konvensional (C)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Pilih Program Pengajian</label>
                                <select
                                    value={formData.programme_id}
                                    onChange={(e) => setFormData({ ...formData, programme_id: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold truncate"
                                >
                                    {programmes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.institution} - {p.level})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Gred Minimum SPM</label>
                                <select
                                    value={formData.min_grade}
                                    onChange={(e) => setFormData({ ...formData, min_grade: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    {grades.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
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
                                    KEMAS KINI PERATURAN
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedRule && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in border border-slate-200">
                        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
                            <AlertTriangle className="w-8 h-8" />
                        </div>

                        <h3 className="text-base font-black text-slate-900 uppercase">
                            ADAKAH ANDA PASTI MAHU MEMADAM PERATURAN INI?
                        </h3>
                        <p className="text-xs font-bold text-slate-700 mt-2 uppercase">
                            {selectedRule.programme?.name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase">
                            {selectedRule.riasec_type} • Gred Min: {selectedRule.min_grade}
                        </p>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition uppercase"
                            >
                                BATAL
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition uppercase"
                            >
                                PADAM
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
