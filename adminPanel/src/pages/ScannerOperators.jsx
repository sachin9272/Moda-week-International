import React, { useState, useEffect, useContext } from 'react';
import { Trash2, Loader, Plus, Shield, ShieldAlert, Key, Mail, RefreshCw, Search, Download, Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../config/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { AuthContext } from '../context/AuthContext';

const ScannerOperators = () => {
    const { hasPermission } = useContext(AuthContext);
    const canCreate = hasPermission('scanner_operators', 'create');
    const canEdit = hasPermission('scanner_operators', 'edit');
    const canDelete = hasPermission('scanner_operators', 'delete');

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

    // Add new states for attendees and tab system
    const [activeTab, setActiveTab] = useState('operators');
    const [attendees, setAttendees] = useState([]);
    const [events, setEvents] = useState([]);
    const [loadingAttendees, setLoadingAttendees] = useState(false);
    const [exporting, setExporting] = useState(false);
    
    const [selectedEvent, setSelectedEvent] = useState('');
    const [attendeeSearch, setAttendeeSearch] = useState('');
    const [attendeePage, setAttendeePage] = useState(1);
    const [attendeeStats, setAttendeeStats] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 });

    useEffect(() => {
        fetchOperators();
        fetchEvents();
    }, []);

    useEffect(() => {
        if (activeTab === 'attendees') {
            const timer = setTimeout(() => {
                fetchAttendees();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeTab, selectedEvent, attendeeSearch, attendeePage]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/upcoming-events/all`);
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        }
    };

    const fetchAttendees = async () => {
        setLoadingAttendees(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const params = new URLSearchParams({
                page: attendeePage,
                limit: 10,
                ...(selectedEvent && { eventId: selectedEvent }),
                ...(attendeeSearch && { search: attendeeSearch })
            });

            const res = await axios.get(`${baseURL}/api/dashboard/event-attendees?${params.toString()}`, config);
            if (res.data.success) {
                setAttendees(res.data.data);
                setAttendeeStats({
                    totalCount: res.data.pagination.totalCount,
                    totalPages: res.data.pagination.totalPages,
                    currentPage: res.data.pagination.currentPage
                });
            }
        } catch (error) {
            console.error('Error fetching attendees:', error);
            toast.error('Failed to load event attendees.');
        } finally {
            setLoadingAttendees(false);
        }
    };

    const handleAttendeePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= attendeeStats.totalPages) {
            setAttendeePage(newPage);
        }
    };

    const handleExportExcel = async () => {
        if (attendees.length === 0) {
            toast.error('No attendees found to export.');
            return;
        }
        setExporting(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
                }
            };
            const params = new URLSearchParams();
            if (selectedEvent) params.append('eventId', selectedEvent);
            if (attendeeSearch) params.append('search', attendeeSearch);
            
            const res = await axios.get(`${baseURL}/api/dashboard/event-attendees/export?${params.toString()}`, config);
            if (res.data.success) {
                const exportData = res.data.data.map(att => ({
                    "Buyer Name": att.buyerName,
                    "Buyer Email": att.buyerEmail,
                    "Event Name": att.eventId?.eventName || att.eventId?.title || 'N/A',
                    "Ticket Type": att.ticketName,
                    "Quantity": att.quantity,
                    "Amount Paid": `$${att.totalAmount}`,
                    "Scanned By": att.scannedBy || 'System',
                    "Scanned At": att.scannedAt ? new Date(att.scannedAt).toLocaleString() : 'N/A',
                    "Purchase Date": att.purchaseDate ? new Date(att.purchaseDate).toLocaleDateString() : 'N/A'
                }));

                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Attendees");
                
                const wscols = [
                    {wch: 20}, {wch: 25}, {wch: 30}, {wch: 15}, {wch: 10}, {wch: 12}, {wch: 25}, {wch: 22}, {wch: 15}
                ];
                ws['!cols'] = wscols;

                XLSX.writeFile(wb, `ModaWeek_Attendees_${new Date().toISOString().split('T')[0]}.xlsx`);
                toast.success('Exported to Excel successfully!');
            }
        } catch (error) {
            console.error("Excel export error:", error);
            toast.error('Failed to export attendee data.');
        } finally {
            setExporting(false);
        }
    };

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
                    <h1 className="text-2xl font-bold text-white">{activeTab === 'operators' ? 'Scanner Operators' : 'Event Attendees'}</h1>
                    <p className="text-neutral-500">
                        {activeTab === 'operators' 
                            ? 'Add & manage emails permitted to log in and scan tickets.' 
                            : 'View, search and export records of scanned/attended tickets.'}
                    </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {activeTab === 'operators' ? (
                        canCreate && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20 cursor-pointer"
                            >
                                <Plus size={20} />
                                Add Operator
                            </button>
                        )
                    ) : (
                        <button
                            onClick={handleExportExcel}
                            disabled={exporting || attendees.length === 0}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
                            Export Excel
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs System */}
            <div className="flex gap-6 border-b border-[#2a2a2a] mb-6">
                <button
                    onClick={() => setActiveTab('operators')}
                    className={`pb-3 px-2 font-semibold text-sm transition-colors flex items-center gap-2 border-b-2 ${
                        activeTab === 'operators' 
                            ? 'text-[#C7913E] border-[#C7913E]' 
                            : 'text-neutral-400 border-transparent hover:text-white'
                    }`}
                >
                    <Shield size={16} />
                    Scanner Operators
                </button>
                <button
                    onClick={() => setActiveTab('attendees')}
                    className={`pb-3 px-2 font-semibold text-sm transition-colors flex items-center gap-2 border-b-2 ${
                        activeTab === 'attendees' 
                            ? 'text-[#C7913E] border-[#C7913E]' 
                            : 'text-neutral-400 border-transparent hover:text-white'
                    }`}
                >
                    <Users size={16} />
                    Scanned Attendees
                </button>
            </div>

            {activeTab === 'operators' ? (
                /* Operators Table */
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
                                                    onClick={() => canEdit && handleToggleStatus(operator)}
                                                    disabled={!canEdit}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                                                        !canEdit ? 'cursor-default opacity-80' : 'cursor-pointer'
                                                    }
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
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => setResetConfirm({ show: true, id: operator._id, name: operator.name })}
                                                            className="p-2 text-[#C7913E] hover:bg-[#C7913E]/10 rounded-lg transition-colors cursor-pointer"
                                                            title="Resend invite / reset password"
                                                        >
                                                            <RefreshCw size={18} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => setDeleteConfirm({ show: true, id: operator._id, name: operator.name })}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete Operator"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
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
            ) : (
                /* Attendees View */
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by buyer name or email..."
                                value={attendeeSearch}
                                onChange={(e) => {
                                    setAttendeeSearch(e.target.value);
                                    setAttendeePage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <select
                                value={selectedEvent}
                                onChange={(e) => {
                                    setSelectedEvent(e.target.value);
                                    setAttendeePage(1);
                                }}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#C7913E] transition-all text-sm appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="">All Events</option>
                                {events.map((evt) => (
                                    <option key={evt._id} value={evt._id}>
                                        {evt.eventName || evt.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Attendees Table */}
                    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-neutral-400 text-sm border-b border-[#2a2a2a] bg-[#151515]">
                                        <th className="py-4 px-6 font-semibold">Buyer Information</th>
                                        <th className="py-4 px-6 font-semibold">Event Details</th>
                                        <th className="py-4 px-6 font-semibold">Ticket Type</th>
                                        <th className="py-4 px-6 font-semibold text-center">Qty</th>
                                        <th className="py-4 px-6 font-semibold">Scanned By</th>
                                        <th className="py-4 px-6 font-semibold">Scanned At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingAttendees ? (
                                        <tr>
                                            <td colSpan="6" className="py-16 text-center">
                                                <Loader className="animate-spin text-[#C7913E] mx-auto" size={32} />
                                                <p className="text-neutral-500 text-sm mt-2">Loading attendee records...</p>
                                            </td>
                                        </tr>
                                    ) : attendees.length > 0 ? (
                                        attendees.map((att) => (
                                            <tr key={att._id} className="border-b border-[#252525] last:border-none hover:bg-[#222] transition-colors text-sm">
                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-white">{att.buyerName}</div>
                                                    <div className="text-xs text-neutral-500 mt-0.5">{att.buyerEmail}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-neutral-200 font-medium">
                                                        {att.eventId?.eventName || att.eventId?.title || 'Deleted Event'}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        Purchased: {new Date(att.purchaseDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-[#333] font-medium text-xs">
                                                        {att.ticketName}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center font-bold text-neutral-300">
                                                    {att.quantity}
                                                </td>
                                                <td className="py-4 px-6 text-neutral-300">
                                                    {att.scannedBy || 'Unknown'}
                                                </td>
                                                <td className="py-4 px-6 text-neutral-400">
                                                    {att.scannedAt ? new Date(att.scannedAt).toLocaleString([], {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    }) : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-16 text-center text-neutral-500">
                                                <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4 border border-[#333]">
                                                    <Users size={28} className="text-neutral-500" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-1">No scanned records found</h3>
                                                <p className="text-sm text-neutral-500 mb-4">Matches will appear here when tickets are scanned successfully.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination inside the card footer */}
                        {!loadingAttendees && attendeeStats.totalPages > 1 && (
                            <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between bg-[#151515] text-sm text-neutral-400">
                                <div>
                                    Showing Page <span className="text-white font-medium">{attendeeStats.currentPage}</span> of <span className="text-white font-medium">{attendeeStats.totalPages}</span>
                                    <span className="mx-2">•</span> Total Scans: <span className="text-white font-medium">{attendeeStats.totalCount}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAttendeePageChange(attendeeStats.currentPage - 1)}
                                        disabled={attendeeStats.currentPage === 1}
                                        className="p-2 border border-[#2a2a2a] rounded-lg hover:bg-[#252525] text-neutral-300 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleAttendeePageChange(attendeeStats.currentPage + 1)}
                                        disabled={attendeeStats.currentPage === attendeeStats.totalPages}
                                        className="p-2 border border-[#2a2a2a] rounded-lg hover:bg-[#252525] text-neutral-300 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


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
