import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import ApplicationDetailsModal from '../../components/ApplicationDetailsModal';
import { baseURL } from '../../config/api';
import { ArrowLeft, Search, Download, Trash2, Loader, Wrench, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Services = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [deleting, setDeleting] = useState(false);
    const [statusLoading, setStatusLoading] = useState(null); // Track which service is updating
    const [selectedService, setSelectedService] = useState(null);

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/services`);
            if (res.data.success) {
                setServices(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load service inquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const openDeleteModal = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            await axios.delete(`${baseURL}/api/admin/services/${deleteModal.id}`);
            setServices(services.filter(s => s._id !== deleteModal.id));
            toast.success("Service inquiry deleted");
        } catch (error) {
            toast.error("Failed to delete inquiry");
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, id: null });
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setStatusLoading(id);
        try {
            const res = await axios.put(`${baseURL}/api/admin/services/${id}/status`, { status: newStatus });
            if (res.data.success) {
                const updatedService = res.data.data || { _id: id, status: newStatus };
                setServices(services.map(s => s._id === id ? { ...s, ...updatedService, status: newStatus } : s));
                setSelectedService((current) => current?._id === id ? { ...current, ...updatedService, status: newStatus } : current);
                toast.success(`Application ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setStatusLoading(null);
        }
    };

    const filteredServices = services.filter(service =>
        service.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const headers = ["Full Name", "Email", "Phone", "Country", "Request Participation", "Additional Info", "Date"];
        const csvData = filteredServices.map(s => [
            s.fullName,
            s.email,
            s.phoneNumber,
            s.country,
            Array.isArray(s.requestParticipation) ? s.requestParticipation.join("; ") : s.requestParticipation,
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
        link.setAttribute("download", "services_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exported successfully");
    };

    const columns = [
        { header: 'Full Name', key: 'fullName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Country', key: 'country' },
        {
            header: 'Request', render: (item) => (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(item.requestParticipation) ? item.requestParticipation.map((req, i) => (
                        <span key={i} className="bg-[#C7913E]/10 text-[#C7913E] text-[10px] px-2 py-0.5 rounded-full border border-[#C7913E]/20">
                            {req}
                        </span>
                    )) : (
                        <span className="bg-[#C7913E]/10 text-[#C7913E] text-[10px] px-2 py-0.5 rounded-full border border-[#C7913E]/20">
                            {item.requestParticipation}
                        </span>
                    )}
                </div>
            )
        },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
        {
            header: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${item.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        item.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                    {item.status ? item.status.toUpperCase() : 'PENDING'}
                </span>
            )
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex gap-2">
                    {statusLoading === item._id ? (
                        <Loader size={16} className="animate-spin text-[#C7913E]" />
                    ) : (
                        item.status !== 'approved' && item.status !== 'rejected' && (
                            <>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleStatusUpdate(item._id, 'approved');
                                    }}
                                    className="p-1 hover:bg-green-500/10 rounded-lg text-green-500 transition-colors"
                                    title="Approve"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleStatusUpdate(item._id, 'rejected');
                                    }}
                                    className="p-1 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                                    title="Reject"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        )
                    )}
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            openDeleteModal(item._id);
                        }}
                        className="p-1 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
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
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Service Inquiries</h1>
                        <p className="text-neutral-500 mt-1">Track and manage service requests and logistical support</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
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
                title="All Service Inquiries"
                columns={columns}
                data={filteredServices}
                onView={setSelectedService}
                onRowClick={setSelectedService}
            />

            <ApplicationDetailsModal
                application={selectedService}
                title="Service Inquiry Details"
                onClose={() => setSelectedService(null)}
                onApprove={(service) => handleStatusUpdate(service._id, 'approved')}
                onReject={(service) => handleStatusUpdate(service._id, 'rejected')}
                onDelete={(service) => {
                    setSelectedService(null);
                    openDeleteModal(service._id);
                }}
                actionLoading={statusLoading === selectedService?._id}
            />

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteModal({ show: false, id: null })}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Service Inquiry?</h3>
                            <p className="text-neutral-400 text-center mb-6">
                                Are you sure you want to remove this logistical inquiry? This action cannot be undone.
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

export default Services;
