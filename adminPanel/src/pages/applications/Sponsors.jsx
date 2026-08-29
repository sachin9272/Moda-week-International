import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import ApplicationDetailsModal from '../../components/ApplicationDetailsModal';
import { baseURL } from '../../config/api';
import { ArrowLeft, Search, Download, Trash2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Sponsors = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [deleting, setDeleting] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState(null);

    const fetchSponsors = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/sponsors`);
            if (res.data.success) {
                setSponsors(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            toast.error("Failed to load sponsors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const openDeleteModal = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            await axios.delete(`${baseURL}/api/admin/sponsors/${deleteModal.id}`);
            setSponsors(sponsors.filter(s => s._id !== deleteModal.id));
            toast.success("Sponsor application deleted");
        } catch (error) {
            toast.error("Failed to delete application");
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, id: null });
        }
    };

    const filteredSponsors = sponsors.filter(sponsor =>
        sponsor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const headers = ["Company Name", "Contact Name", "Email", "Phone", "Country", "Industry", "Interests", "Additional Info", "Date"];
        const csvData = filteredSponsors.map(s => [
            s.companyName,
            s.contactName,
            s.email,
            s.phoneNumber,
            s.country,
            s.industry,
            Array.isArray(s.sponsorshipInterests) ? s.sponsorshipInterests.join("; ") : s.sponsorshipInterests,
            `"${s.additionalInfo?.replace(/"/g, '""') || ''}"`,
            new Date(s.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sponsors_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exported successfully");
    };

    const columns = [
        { header: 'Company Name', key: 'companyName' },
        { header: 'Contact Person', key: 'contactName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Country', key: 'country' },
        { header: 'Industry', key: 'industry' },
        { header: 'Interests', render: (item) => Array.isArray(item.sponsorshipInterests) ? item.sponsorshipInterests.join(", ") : item.sponsorshipInterests },
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
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Sponsors Management</h1>
                        <p className="text-neutral-500 mt-1">Manage brand partnerships and event sponsorships</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search sponsors..."
                            className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7913E] transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-[#C7913E] hover:bg-[#B38135] text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#C7913E]/20"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            <Table
                title="All Sponsor Applications"
                columns={columns}
                data={filteredSponsors}
                onView={setSelectedSponsor}
                onRowClick={setSelectedSponsor}
                onDelete={openDeleteModal}
            />

            <ApplicationDetailsModal
                application={selectedSponsor}
                title="Sponsor Application Details"
                onClose={() => setSelectedSponsor(null)}
                onDelete={(sponsor) => {
                    setSelectedSponsor(null);
                    openDeleteModal(sponsor._id);
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
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Sponsor Inquiry?</h3>
                            <p className="text-neutral-400 text-center mb-6">
                                Are you sure you want to remove this partnership inquiry? This action cannot be undone.
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
        </div>
    );
};

export default Sponsors;
