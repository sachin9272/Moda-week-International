import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import ApplicationDetailsModal from '../../components/ApplicationDetailsModal';
import { baseURL } from '../../config/api';
import { ArrowLeft, Search, Download, Trash2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportRecordsToExcel } from '../../utils/exportExcel';
import { BUYER_FIELDS } from '../../utils/applicationExportFields';
import { useBulkSelection } from '../../hooks/useBulkSelection';

const Buyers = () => {
    const navigate = useNavigate();
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [deleting, setDeleting] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const { selectedIds, toggleSelect, toggleSelectAll, removeFromSelection, clearSelection } = useBulkSelection();
    const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const fetchBuyers = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/buyers`);
            if (res.data.success) {
                setBuyers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching buyers:", error);
            toast.error("Failed to load buyers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    const openDeleteModal = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            await axios.delete(`${baseURL}/api/admin/buyers/${deleteModal.id}`);
            setBuyers(buyers.filter(b => b._id !== deleteModal.id));
            removeFromSelection(deleteModal.id);
            toast.success("Buyer deleted successfully");
        } catch (error) {
            toast.error("Failed to delete buyer");
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, id: null });
        }
    };

    const confirmBulkDelete = async () => {
        if (!selectedIds.length) return;
        setBulkDeleting(true);
        try {
            await axios.post(`${baseURL}/api/admin/buyers/bulk-delete`, { ids: selectedIds });
            setBuyers(buyers.filter(b => !selectedIds.includes(b._id)));
            toast.success(`${selectedIds.length} buyer(s) deleted successfully`);
            clearSelection();
        } catch (error) {
            toast.error("Failed to delete selected buyers");
        } finally {
            setBulkDeleting(false);
            setBulkDeleteModal(false);
        }
    };

    const filteredBuyers = buyers.filter(buyer =>
        buyer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadExcel = () => {
        exportRecordsToExcel('buyer_applications.xlsx', 'Buyer Applications', filteredBuyers, BUYER_FIELDS);
        toast.success("Excel file exported successfully");
    };

    const columns = [
        { header: 'Company Name', key: 'companyName' },
        { header: 'Contact Name', key: 'contactName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Country', key: 'country' },
        { header: 'Business Type', key: 'businessType' },
        { header: 'Product Interests', key: 'productInterests' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader className="w-10 h-10 text-[#C7913E] animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-xl border border-[#2a2a2a] text-neutral-400 hover:text-white transition-all shadow-sm"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Buyers Management</h1>
                        <p className="text-neutral-500 mt-1">Manage registered buyer applications and export data</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search buyers..."
                            className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7913E] transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setBulkDeleteModal(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                        >
                            <Trash2 size={18} />
                            <span>Delete Selected ({selectedIds.length})</span>
                        </button>
                    )}
                    <button
                        onClick={downloadExcel}
                        className="px-4 py-2 bg-[#C7913E] hover:bg-[#B38135] text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#C7913E]/20"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            <Table
                title="All Buyer Registrations"
                columns={columns}
                data={filteredBuyers}
                onView={setSelectedBuyer}
                onRowClick={setSelectedBuyer}
                onDelete={openDeleteModal}
                selectable
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
            />

            <ApplicationDetailsModal
                application={selectedBuyer}
                title="Buyer Application Details"
                onClose={() => setSelectedBuyer(null)}
                onDelete={(buyer) => {
                    setSelectedBuyer(null);
                    openDeleteModal(buyer._id);
                }}
            />

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteModal({ show: false, id: null })}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Buyer Application?</h3>
                            <p className="text-neutral-400 text-center mb-6">
                                Are you sure you want to remove this registration? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, id: null })}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <Loader size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Modal */}
            {bulkDeleteModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setBulkDeleteModal(false)}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete {selectedIds.length} Buyer Application{selectedIds.length !== 1 ? 's' : ''}?</h3>
                            <p className="text-neutral-400 text-center mb-6">
                                Are you sure you want to remove these registrations? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setBulkDeleteModal(false)}
                                    disabled={bulkDeleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBulkDelete}
                                    disabled={bulkDeleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {bulkDeleting ? (
                                        <Loader size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete All
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buyers;
