import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    UserCheck,
    UserX,
    Edit2,
    Shield,
    User,
    CheckCircle,
    XCircle,
    X,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function UserIndex({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Modals state
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: 'user',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            { search, role: roleFilter, status: statusFilter },
            { preserveState: true }
        );
    };

    const handleFilterChange = (newRole, newStatus) => {
        setRoleFilter(newRole);
        setStatusFilter(newStatus);
        router.get(
            '/admin/users',
            { search, role: newRole, status: newStatus },
            { preserveState: true }
        );
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        router.put(`/admin/users/${selectedUser.id}`, editForm, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const openDeactivateModal = (user) => {
        setSelectedUser(user);
        setIsDeactivateModalOpen(true);
    };

    const confirmToggleStatus = () => {
        if (!selectedUser) return;
        router.patch(`/admin/users/${selectedUser.id}/toggle-status`, {}, {
            onSuccess: () => setIsDeactivateModalOpen(false),
        });
    };

    return (
        <AdminLayout activePage="users">
            <Head title="User Account Management - UniWise Admin" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header & Title matching Figure 3.2.1.6.2 */}
                <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
                            PENGURUSAN SISTEM
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mt-1">
                            USER ACCOUNT MANAGEMENT
                        </h1>
                        <p className="text-xs text-sky-100 mt-1">
                            Urus senarai akaun pelajar dan pentadbir sistem UniWise.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-sky-500/30 backdrop-blur-sm border border-sky-400/40 px-4 py-2 rounded-2xl text-xs font-bold">
                        <User className="w-4 h-4 text-amber-300" />
                        <span>Jumlah Pengguna: {users.total}</span>
                    </div>
                </div>

                {/* Filter & Search Bar matching Figure 3.2.1.6.2 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama atau emel pengguna..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Peranan:</span>
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => handleFilterChange(e.target.value, statusFilter)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Semua Peranan</option>
                            <option value="user">Pelajar (Student)</option>
                            <option value="admin">Pentadbir (Admin)</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(roleFilter, e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Semua Status</option>
                            <option value="active">Active</option>
                            <option value="deactivated">Deactivated</option>
                        </select>
                    </div>
                </div>

                {/* Users Table matching Figure 3.2.1.6.2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-sky-600 text-white font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="py-3.5 px-5">NAME</th>
                                    <th className="py-3.5 px-5">EMAIL ADDRESS</th>
                                    <th className="py-3.5 px-4 text-center">ROLE</th>
                                    <th className="py-3.5 px-4 text-center">STATUS</th>
                                    <th className="py-3.5 px-5 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                        {u.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">
                                                            {u.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            Daftar: {new Date(u.created_at).toLocaleDateString('ms-MY')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-slate-600">
                                                {u.email}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {u.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
                                                        <Shield className="w-3 h-3" />
                                                        ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-sky-200">
                                                        <User className="w-3 h-3" />
                                                        STUDENT
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {u.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                        <CheckCircle className="w-3 h-3" />
                                                        ACTIVE
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-rose-200">
                                                        <XCircle className="w-3 h-3" />
                                                        DEACTIVATED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Update Info Button per Figure 3.2.1.6.3 */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(u)}
                                                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                        <span>Edit</span>
                                                    </button>

                                                    {/* Toggle Status Button per Figure 3.2.1.6.6 */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeactivateModal(u)}
                                                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition ${
                                                            u.status === 'active'
                                                                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        }`}
                                                    >
                                                        {u.status === 'active' ? (
                                                            <>
                                                                <UserX className="w-3 h-3" />
                                                                <span>Nyahaktif</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="w-3 h-3" />
                                                                <span>Aktifkan</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-400">
                                            Tiada rekod pengguna ditemui.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>
                                Menunjukkan {users.from || 0} hingga {users.to || 0} daripada {users.total} rekod
                            </span>
                            <div className="flex gap-1">
                                {users.links.map((link, idx) => (
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

            {/* Edit User Modal matching Figure 3.2.1.6.4 */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-slate-200 relative">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                                <Edit2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase text-slate-900">
                                    Edit User Details
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Kemaskini profil & peranan pengguna
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-slate-700 mb-1">Nama Penuh</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Alamat Emel</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Peranan (Role)</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    <option value="user">Pelajar (Student)</option>
                                    <option value="admin">Pentadbir (Admin)</option>
                                </select>
                            </div>

                            <div className="pt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition uppercase tracking-wider"
                                >
                                    SAVE CHANGES
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deactivate/Activate Confirmation Modal matching Figure 3.2.1.6.6 */}
            {isDeactivateModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in border border-slate-200">
                        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                            selectedUser.status === 'active' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                            {selectedUser.status === 'active' ? (
                                <UserX className="w-8 h-8" />
                            ) : (
                                <UserCheck className="w-8 h-8" />
                            )}
                        </div>

                        <h3 className="text-base font-black text-slate-900 uppercase">
                            {selectedUser.status === 'active'
                                ? 'ARE YOU SURE WANT TO DEACTIVATE THIS ACCOUNT?'
                                : 'ARE YOU SURE WANT TO ACTIVATE THIS ACCOUNT?'}
                        </h3>
                        <p className="text-xs font-bold text-slate-600 mt-1">
                            {selectedUser.name} ({selectedUser.email})
                        </p>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsDeactivateModalOpen(false)}
                                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition uppercase"
                            >
                                CANCEL
                            </button>
                            <button
                                type="button"
                                onClick={confirmToggleStatus}
                                className={`w-1/2 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition uppercase ${
                                    selectedUser.status === 'active'
                                        ? 'bg-rose-600 hover:bg-rose-700'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                {selectedUser.status === 'active' ? 'DEACTIVATE' : 'ACTIVATE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
