import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, Loader2, Eye, Check, X, Clock, FileText, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { baseURL } from '../../config/api';
import toast from 'react-hot-toast';

const NewsManager = () => {
    const location = useLocation();
    const [news, setNews] = useState([]);
    const [pendingNews, setPendingNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [activeTab, setActiveTab] = useState('published'); // 'published' or 'pending'
    const [processingId, setProcessingId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Filters
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const CATEGORIES = ['COSMETICS', 'EDUCATION', 'FASHION', 'FINE ART', 'PEFORMANCES', 'PAST EVENTS', 'TRAVEL'];

    // Handle URL query param for tab switching (from notification click)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam === 'pending') {
            setActiveTab('pending');
        }
    }, [location.search]);

    useEffect(() => {
        fetchNews();
        fetchPendingNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/news/get-all`);
            if (res.data.status === 'success') {
                // Filter out pending articles - only show live and hidden
                setNews(res.data.data.filter(item => item.status !== 'pending'));
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Failed to load news");
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingNews = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/news/pending`);
            if (res.data.status === 'success') {
                setPendingNews(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching pending news:", error);
        } finally {
            setPendingLoading(false);
        }
    };

    const initiateDelete = (item) => {
        setNewsToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!newsToDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`${baseURL}/api/admin/news/delete/${newsToDelete._id}`);
            fetchNews();
            toast.success("News article deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete news");
        } finally {
            setDeleting(false);
            setIsDeleteModalOpen(false);
            setNewsToDelete(null);
        }
    };

    const toggleStatus = async (item) => {
        setUpdatingStatusId(item._id);
        try {
            const newStatus = item.status === 'live' ? 'hidden' : 'live';
            await axios.put(`${baseURL}/api/admin/news/update/${item._id}`, {
                status: newStatus
            });

            // Update local state
            setNews(news.map(n => n._id === item._id ? { ...n, status: newStatus } : n));
            toast.success(`News ${newStatus === 'live' ? 'Live' : 'Hidden'}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const approveSubmission = async (item) => {
        setProcessingId(item._id);
        try {
            await axios.patch(`${baseURL}/api/news/${item._id}/approve`);
            toast.success("Article approved and published!");
            fetchNews();
            fetchPendingNews();
        } catch (error) {
            console.error("Error approving submission:", error);
            toast.error("Failed to approve article");
        } finally {
            setProcessingId(null);
        }
    };

    const rejectSubmission = async (item) => {
        setProcessingId(item._id);
        try {
            await axios.delete(`${baseURL}/api/news/${item._id}/reject`);
            toast.success("Submission rejected and removed");
            fetchPendingNews();
        } catch (error) {
            console.error("Error rejecting submission:", error);
            toast.error("Failed to reject submission");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredNews = news.filter(item => {
        const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
        const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'live' ? item.status === 'live' : item.status !== 'live');
        return matchesCategory && matchesStatus;
    });

    // Pagination calculations for published news
    const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
    const paginatedNews = filteredNews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Pagination calculations for pending news
    const pendingTotalPages = Math.ceil(pendingNews.length / ITEMS_PER_PAGE);
    const paginatedPendingNews = pendingNews.slice(
        (pendingCurrentPage - 1) * ITEMS_PER_PAGE,
        pendingCurrentPage * ITEMS_PER_PAGE
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterCategory, filterStatus]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">News Management</h1>
                    <p className="text-neutral-500 mt-1">Manage articles, news and community submissions</p>
                </div>
                <Link
                    to="/news/add"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-5 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    <Plus size={20} /> Add News
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[#1a1a1a] rounded-xl w-fit border border-[#2a2a2a] mb-6">
                <button
                    onClick={() => setActiveTab('published')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'published'
                        ? 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                >
                    <FileText size={18} />
                    Published
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'published' ? 'bg-white/20 text-white' : 'bg-[#252525] text-neutral-500'}`}>{news.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'pending'
                        ? 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                >
                    <Clock size={18} />
                    Pending
                    {pendingNews.length > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] animate-pulse ${activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-[#C7913E]/20 text-[#C7913E]'}`}>{pendingNews.length}</span>
                    )}
                </button>
            </div>

            {activeTab === 'published' && (
                <>
                    {/* Filters for Published */}
                    <div className="flex flex-wrap gap-4 items-center mb-6">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-[#1a1a1a] text-white px-4 py-2.5 rounded-xl border border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#C7913E]/20 focus:border-[#C7913E] transition-all"
                        >
                            <option value="ALL">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-[#1a1a1a] text-white px-4 py-2.5 rounded-xl border border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#C7913E]/20 focus:border-[#C7913E] transition-all"
                        >
                            <option value="ALL">All Status</option>
                            <option value="live">Live</option>
                            <option value="hidden">Hidden</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="w-8 h-8 text-[#C7913E] animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedNews.map((item) => (
                                <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all flex flex-col group">
                                    <div className="relative h-56 overflow-hidden">
                                        {item.image && item.image.url ? (
                                            <img src={item.image.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-[#252525] flex items-center justify-center text-neutral-600">
                                                <FileText size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Link
                                                to={`/news/preview/${item._id}`}
                                                className="bg-black/40 hover:bg-[#C7913E] text-white p-2 rounded-lg transition-colors backdrop-blur-md"
                                                title="Preview News"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-[#C7913E] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h2 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-[#C7913E] transition-colors" title={item.title}>
                                                {item.title}
                                            </h2>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                                                <Clock size={14} />
                                                {item.date || new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 ml-auto">
                                                <span className={`text-[10px] uppercase font-bold tracking-widest ${item.status === 'live' ? 'text-green-500' : 'text-neutral-500'}`}>
                                                    {item.status === 'live' ? 'Live' : 'Hidden'}
                                                </span>
                                                <button
                                                    onClick={() => toggleStatus(item)}
                                                    disabled={updatingStatusId === item._id}
                                                    className={`w-9 h-5 rounded-full flex items-center transition-all p-1 ${item.status === 'live' ? 'bg-green-500/20 border border-green-500/50' : 'bg-neutral-800 border border-neutral-700'}`}
                                                >
                                                    {updatingStatusId === item._id ? (
                                                        <Loader className="w-3 h-3 text-white animate-spin mx-auto" />
                                                    ) : (
                                                        <div className={`w-3 h-3 rounded-full shadow-md transform transition-all duration-300 ${item.status === 'live' ? 'translate-x-4 bg-green-500' : 'translate-x-0 bg-neutral-500'}`} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content }} />

                                        <div className="flex justify-between items-center mt-auto border-t border-[#2a2a2a] pt-4 gap-3">
                                            <Link
                                                to={`/news/edit/${item._id}`}
                                                className="flex-1 bg-[#C7913E]/10 hover:bg-[#C7913E] text-[#C7913E] hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-[#C7913E]/20"
                                            >
                                                <Pencil size={16} />
                                                <span className="font-semibold text-sm">Edit</span>
                                            </Link>
                                            <button
                                                onClick={() => initiateDelete(item)}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-red-500/20"
                                            >
                                                <Trash2 size={16} />
                                                <span className="font-semibold text-sm">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredNews.length === 0 && !loading && (
                                <div className="col-span-full text-center py-20 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
                                    <FileText size={48} className="mx-auto text-neutral-700 mb-4" />
                                    <p className="text-neutral-500 text-lg">No news articles found matching your filters.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination for Published */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-10">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-neutral-400 hover:text-white rounded-xl border border-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page
                                            ? 'bg-[#C7913E] text-white shadow-lg shadow-[#C7913E]/20'
                                            : 'bg-[#1a1a1a] text-neutral-400 hover:bg-[#252525] hover:text-white border border-[#2a2a2a]'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-neutral-400 hover:text-white rounded-xl border border-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'pending' && (
                <>
                    {pendingLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="w-8 h-8 text-[#C7913E] animate-spin" />
                        </div>
                    ) : pendingNews.length === 0 ? (
                        <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
                            <Clock size={48} className="mx-auto text-neutral-700 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Pending Submissions</h3>
                            <p className="text-neutral-500">All community submissions have been reviewed.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedPendingNews.map((item) => (
                                <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg border border-[#C7913E]/20 relative flex flex-col h-full group">
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white text-[10px] font-bold py-1 text-center uppercase tracking-[0.2em] shadow-lg z-10">
                                        New Community Submission
                                    </div>
                                    <div className="relative h-56 mt-6 overflow-hidden">
                                        {item.image && item.image.url ? (
                                            <img src={item.image.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-[#252525] flex items-center justify-center text-neutral-600">
                                                <FileText size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Link
                                                to={`/news/preview/${item._id}`}
                                                className="bg-black/40 hover:bg-[#C7913E] text-white p-2 rounded-lg transition-colors backdrop-blur-md"
                                                title="Preview News"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-[#C7913E] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold text-white line-clamp-2 leading-tight mb-4 group-hover:text-[#C7913E] transition-colors" title={item.title}>
                                            {item.title}
                                        </h2>

                                        {/* Submitter Info */}
                                        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8C5D25] to-[#C7913E] flex items-center justify-center text-white font-bold text-xs">
                                                    {(item.submittedBy?.name || item.author || 'U')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-semibold">
                                                        {item.submittedBy?.name || item.author}
                                                    </p>
                                                    <p className="text-neutral-500 text-[10px] uppercase tracking-wider">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {item.submittedBy?.email && (
                                                <p className="text-neutral-500 text-xs mt-2 italic px-1">{item.submittedBy.email}</p>
                                            )}
                                        </div>

                                        <div className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content }} />

                                        <div className="flex justify-between items-center mt-auto border-t border-[#2a2a2a] pt-4 gap-3">
                                            <button
                                                onClick={() => approveSubmission(item)}
                                                disabled={processingId === item._id}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 disabled:opacity-50"
                                            >
                                                {processingId === item._id ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check size={18} />
                                                )}
                                                <span className="font-bold text-sm">Approve</span>
                                            </button>
                                            <button
                                                onClick={() => rejectSubmission(item)}
                                                disabled={processingId === item._id}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/20 disabled:opacity-50"
                                            >
                                                {processingId === item._id ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <X size={18} />
                                                )}
                                                <span className="font-bold text-sm">Reject</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination for Pending */}
                    {!pendingLoading && pendingTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-10">
                            <button
                                onClick={() => setPendingCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={pendingCurrentPage === 1}
                                className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-neutral-400 hover:text-white rounded-xl border border-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: pendingTotalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setPendingCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${pendingCurrentPage === page
                                            ? 'bg-[#C7913E] text-white shadow-lg shadow-[#C7913E]/20'
                                            : 'bg-[#1a1a1a] text-neutral-400 hover:bg-[#252525] hover:text-white border border-[#2a2a2a]'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPendingCurrentPage(prev => Math.min(prev + 1, pendingTotalPages))}
                                disabled={pendingCurrentPage === pendingTotalPages}
                                className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-neutral-400 hover:text-white rounded-xl border border-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete News Article?</h3>
                            <p className="text-neutral-400 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-white font-medium text-center truncate px-4 mb-6">
                                "{newsToDelete?.title}"
                            </p>
                            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-3 mb-6">
                                <p className="text-xs text-red-400/80 text-center">
                                    <span className="font-bold uppercase tracking-widest mr-2">Warning:</span>
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
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
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Deleting...
                                        </>
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

export default NewsManager;
