import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    School,
    BookOpen,
    Filter,
    X,
    AlertTriangle,
    FileText,
} from 'lucide-react';

export default function ProgrammeIndex({ programmes, institutions = [], filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [levelFilter, setLevelFilter] = useState(filters.level || 'all');
    const [institutionFilter, setInstitutionFilter] = useState(filters.institution || 'all');

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProgramme, setSelectedProgramme] = useState(null);

    // Form state for Add / Edit
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        level: 'Diploma',
        institution: institutions[0] || 'Universiti Pendidikan Sultan Idris',
        merit: '',
        entry_requirement: '',
        notes: '',
        riasec_type: 'Realistic',
        min_grade: 'C',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/programmes',
            { search, level: levelFilter, institution: institutionFilter },
            { preserveState: true }
        );
    };

    const handleFilterChange = (newLevel, newInst) => {
        setLevelFilter(newLevel);
        setInstitutionFilter(newInst);
        router.get(
            '/admin/programmes',
            { search, level: newLevel, institution: newInst },
            { preserveState: true }
        );
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            code: '',
            level: 'Diploma',
            institution: institutions[0] || 'Universiti Pendidikan Sultan Idris',
            merit: '',
            entry_requirement: 'Lulus SPM dengan sekurang-kurangnya 3 kepujian termasuk Bahasa Melayu.',
            notes: '',
            riasec_type: 'Realistic',
            min_grade: 'C',
        });
        setIsAddModalOpen(true);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        router.post('/admin/programmes', formData, {
            onSuccess: () => setIsAddModalOpen(false),
        });
    };

    const openEditModal = (prog) => {
        setSelectedProgramme(prog);
        setFormData({
            name: prog.name,
            code: prog.code || '',
            level: prog.level,
            institution: prog.institution,
            merit: prog.merit || '',
            entry_requirement: prog.entry_requirement || '',
            notes: prog.notes || '',
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        router.put(`/admin/programmes/${selectedProgramme.id}`, formData, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const openDeleteModal = (prog) => {
        setSelectedProgramme(prog);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedProgramme) return;
        router.delete(`/admin/programmes/${selectedProgramme.id}`, {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AdminLayout activePage="programmes">
            <Head title="Pengurusan Maklumat Program - Pentadbir UniWise" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
                            PENGURUSAN DATA PROGRAM
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mt-1">
                            PENGURUSAN MAKLUMAT PROGRAM
                        </h1>
                        <p className="text-xs text-sky-100 mt-1">
                            Pangkalan data program Diploma, Asasi, dan Sijil IPTA Malaysia.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>TAMBAH PROGRAM BAHARU</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar matching Figure 3.2.1.7.2 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari program atau kod..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Peringkat:</span>
                        </div>
                        <select
                            value={levelFilter}
                            onChange={(e) => handleFilterChange(e.target.value, institutionFilter)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Semua Peringkat</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Foundation">Asasi (Foundation)</option>
                            <option value="Certificate">Sijil (Certificate)</option>
                        </select>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold ml-2">
                            <span>Institusi:</span>
                        </div>
                        <select
                            value={institutionFilter}
                            onChange={(e) => handleFilterChange(levelFilter, e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 max-w-xs focus:outline-none focus:ring-2 focus:ring-sky-500 truncate"
                        >
                            <option value="all">Semua Institusi Awam</option>
                            {institutions.map((inst, idx) => (
                                <option key={idx} value={inst}>
                                    {inst}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Programme Data Table matching Figure 3.2.1.7.2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-sky-600 text-white font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="py-3.5 px-5">NAMA PROGRAM</th>
                                    <th className="py-3.5 px-4 text-center">PERINGKAT</th>
                                    <th className="py-3.5 px-5">INSTITUSI</th>
                                    <th className="py-3.5 px-4 text-center">MERIT UPU</th>
                                    <th className="py-3.5 px-5 text-right">TINDAKAN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {programmes.data && programmes.data.length > 0 ? (
                                    programmes.data.map((prog) => (
                                        <tr key={prog.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-4 px-5">
                                                <div>
                                                    <span className="font-extrabold text-slate-900 block uppercase">
                                                        {prog.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {prog.code && (
                                                            <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                                                                {prog.code}
                                                            </span>
                                                        )}
                                                        {prog.notes && prog.notes !== '-' && (
                                                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                                {prog.notes}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-block font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${
                                                    prog.level === 'Foundation'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : prog.level === 'Diploma'
                                                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    {prog.level}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-slate-600 font-semibold">
                                                {prog.institution}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {prog.merit ? (
                                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                        {prog.merit}%
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 italic">Tiada</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(prog)}
                                                        className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition"
                                                        title="Edit Programme"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(prog)}
                                                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition"
                                                        title="Delete Programme"
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
                                            Tiada rekod program pengajian ditemui.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {programmes.links && programmes.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>
                                Menunjukkan {programmes.from || 0} hingga {programmes.to || 0} daripada {programmes.total} rekod
                            </span>
                            <div className="flex gap-1">
                                {programmes.links.map((link, idx) => (
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

            {/* Add New Programme Modal matching Figure 3.2.1.7.3 */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 animate-scale-in border border-slate-200 relative max-h-[90vh] overflow-y-auto">
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
                                    TAMBAH PROGRAM BAHARU
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Tambah program pengajian IPTA baharu ke dalam sistem
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitAdd} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Nama Program Pengajian</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="cth: DIPLOMA SAINS KOMPUTER"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1">Kod Program (UPU)</label>
                                    <input
                                        type="text"
                                        placeholder="cth: UA4481001"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 mb-1">Nilai Merit UPU (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="cth: 88.50"
                                        value={formData.merit}
                                        onChange={(e) => setFormData({ ...formData, merit: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1">Peringkat Pengajian</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                    >
                                        <option value="Diploma">Diploma</option>
                                        <option value="Foundation">Asasi</option>
                                        <option value="Certificate">Sijil</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 mb-1">Institusi</label>
                                    <select
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold truncate"
                                    >
                                        {institutions.map((inst, idx) => (
                                            <option key={idx} value={inst}>
                                                {inst}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1">Padanan Kod RIASEC (Automatik)</label>
                                    <select
                                        value={formData.riasec_type}
                                        onChange={(e) => setFormData({ ...formData, riasec_type: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                    >
                                        <option value="Realistic">Realistik (Teknikal/Kejuruteraan)</option>
                                        <option value="Investigative">Investigatif (Sains/Sains Komputer)</option>
                                        <option value="Artistic">Artistik (Seni/Reka Bentuk/Media)</option>
                                        <option value="Social">Sosial (Pendidikan/Kesihatan)</option>
                                        <option value="Enterprising">Enterprising (Perniagaan/Pengurusan)</option>
                                        <option value="Conventional">Konvensional (Perakaunan/Pentadbiran)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 mb-1">Gred Minimum SPM</label>
                                    <select
                                        value={formData.min_grade}
                                        onChange={(e) => setFormData({ ...formData, min_grade: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A">A</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B">B</option>
                                        <option value="C+">C+</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Syarat Kemasukan (SPM)</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.entry_requirement}
                                    onChange={(e) => setFormData({ ...formData, entry_requirement: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Ciri / Aliran / Nota Khas</label>
                                <input
                                    type="text"
                                    placeholder="cth: Temuduga, STEM, TVET, Bumiputera"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
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
                                    TAMBAH PROGRAM
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Programme Modal */}
            {isEditModalOpen && selectedProgramme && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 animate-scale-in border border-slate-200 relative max-h-[90vh] overflow-y-auto">
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
                                    SUNTING PROGRAM
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Kemaskini butiran program IPTA
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Nama Program Pengajian</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1">Kod Program (UPU)</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 mb-1">Nilai Merit UPU (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={formData.merit}
                                        onChange={(e) => setFormData({ ...formData, merit: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1">Peringkat (Level)</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                    >
                                        <option value="Diploma">Diploma</option>
                                        <option value="Foundation">Foundation (Asasi)</option>
                                        <option value="Certificate">Certificate (Sijil)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 mb-1">Institusi (Institution)</label>
                                    <select
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold truncate"
                                    >
                                        {institutions.map((inst, idx) => (
                                            <option key={idx} value={inst}>
                                                {inst}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Syarat Kemasukan (Entry Requirement)</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.entry_requirement}
                                    onChange={(e) => setFormData({ ...formData, entry_requirement: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Ciri / Aliran / Nota Khas</label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
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
                                    KEMAS KINI PROGRAM
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Programme Confirmation Dialog */}
            {isDeleteModalOpen && selectedProgramme && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in border border-slate-200">
                        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
                            <AlertTriangle className="w-8 h-8" />
                        </div>

                        <h3 className="text-base font-black text-slate-900 uppercase">
                            ADAKAH ANDA PASTI MAHU MEMADAM PROGRAM INI?
                        </h3>
                        <p className="text-xs font-bold text-slate-600 mt-2 uppercase">
                            {selectedProgramme.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {selectedProgramme.institution}
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
