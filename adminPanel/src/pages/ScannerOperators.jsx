import React, { useState, useEffect } from 'react';
import { Trash2, Loader, Plus, Shield, ShieldAlert, Key, Mail, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../config/api';
import toast from 'react-hot-toast';

const ScannerOperators = () => {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [deleting, setDeleting] = useState(false);
    
    const [resetConfirm, setResetConfirm] = useState({ show: false, id: null, name: '' });
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        fetchOperators();
    }, []);

    const fetchOperators = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const res = await axios.get(`${baseURL}/api/scanner`, config);
            if (res.data.success) {
                setOperators(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching operators:', error);
            toast.error('Failed to load scanner operators.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOperator = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error('Please enter both name and email.');
            return;
        }

        setSaving(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const res = await axios.post(`${baseURL}/api/scanner`, { name, email }, config);
            if (res.data.success) {
                toast.success(res.data.message || 'Scanner operator added successfully!');
                setOperators([res.data.data, ...operators]);
                setName('');
                setEmail('');
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding operator:', error);
            const msg = error.response?.data?.message || 'Failed to add operator. Please try again.';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (operator) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const res = await axios.patch(`${baseURL}/api/scanner/${operator._id}/toggle`, {}, config);
            if (res.data.success) {
                toast.success(res.data.message);
                setOperators(operators.map(o => o._id === operator._id ? { ...o, isActive: !o.isActive } : o));
            }
        } catch (error) {
            toast.error('Failed to update operator status.');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const res = await axios.delete(`${baseURL}/api/scanner/${deleteConfirm.id}`, config);
            if (res.data.success) {
                toast.success('Operator removed successfully.');
                setOperators(operators.filter(o => o._id !== deleteConfirm.id));
                setDeleteConfirm({ show: false, id: null, name: '' });
            }
        } catch (error) {
            toast.error('Failed to delete operator.');
        } finally {
            setDeleting(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetConfirm.id) return;
        setResetting(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const res = await axios.patch(`${baseURL}/api/scanner/${resetConfirm.id}/reset-password`, {}, config);
            if (res.data.success) {
                toast.success('Password regenerated. Invitation email resent.');
                setResetConfirm({ show: false, id: null, name: '' });
            }
        } catch (error) {
            toast.error('Failed to reset password.');
        } finally {
            setResetting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleString();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader className="animate-spin text-[#C7913E]" size={40} />
        </div>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Scanner Operators</h1>
                    <p className="text-neutral-500">Add & manage emails permitted to log in and scan tickets.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    <Plus size={20} />
                    Add Operator
                </button>
            </div>

            {/* Operators Table */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-neutral-400 text-sm border-b border-[#2a2a2a] bg-[#151515]">
                                <th className="py-4 px-6 font-semibold">Operator Name</th>
                                <th className="py-4 px-6 font-semibold">Email Address</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold">Last Activity</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operators.length > 0 ? (
                                operators.map((operator) => (
                                    <tr key={operator._id} className="border-b border-[#252525] last:border-none hover:bg-[#222] transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-white">{operator.name}</div>
                                            <div className="text-xs text-neutral-500 mt-0.5">Added: {new Date(operator.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="py-4 px-6 text-neutral-300">{operator.email}</td>
                                        <td className="py-4 px-6">
                                            <button 
                                                onClick={() => handleToggleStatus(operator)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border
                                                ${operator.isActive 
                                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/60' 
                                                    : 'bg-red-950/40 text-red-400 border-red-800/50 hover:bg-red-900/60'
                                                }`}
                                            >
                                                {operator.isActive ? (
                                                    <>
                                                        <Shield size={14} /> Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldAlert size={14} /> Deactivated
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-neutral-400 text-sm">
                                            {formatDate(operator.lastLogin)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setResetConfirm({ show: true, id: operator._id, name: operator.name })}
                                                    className="p-2 text-[#C7913E] hover:bg-[#C7913E]/10 rounded-lg transition-colors"
                                                    title="Resend invite / reset password"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm({ show: true, id: operator._id, name: operator.name })}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Operator"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 px-6 text-center text-neutral-500 bg-[#1a1a1a]">
                                        <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4 border border-[#333]">
                                            <Mail size={28} className="text-neutral-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-1">No operators found</h3>
                                        <p className="text-sm text-neutral-500 mb-4">Add scanner operators to help process tickets at events.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Operator Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#2a2a2a] bg-[#151515]">
                            <h3 className="text-xl font-bold text-white">Add Scanner Operator</h3>
                            <p className="text-sm text-neutral-500 mt-1">An automated temporary password and instruction link will be sent to this operator.</p>
                        </div>
                        <form onSubmit={handleAddOperator}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Operator Display Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Operator Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="e.g. johndoe@example.com"
                                        className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] transition-all"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-[#151515] border-t border-[#2a2a2a] flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 rounded-xl text-neutral-300 hover:bg-[#252525] border border-[#2a2a2a] font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />}
                                    Invite Operator
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Operator Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]">
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Scanner Operator?</h3>
                            <p className="text-neutral-400 text-center mb-4">
                                Are you sure you want to revoke scanner access for <strong className="text-white">"{deleteConfirm.name}"</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    Remove Access
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {resetConfirm.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]">
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-[#C7913E]/20 flex items-center justify-center mx-auto mb-4">
                                <Key size={32} className="text-[#C7913E]" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Reset Credentials & Invite?</h3>
                            <p className="text-neutral-400 text-center mb-4">
                                This will generate a brand new temporary password for <strong className="text-white">"{resetConfirm.name}"</strong> and re-send the login invitation email.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setResetConfirm({ show: false, id: null, name: '' })}
                                    disabled={resetting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={resetting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {resetting ? <Loader size={18} className="animate-spin" /> : <Key size={18} />}
                                    Reset & Resend
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScannerOperators;
