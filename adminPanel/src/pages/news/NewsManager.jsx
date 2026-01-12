import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { baseURL } from '../../config/api';
import toast from 'react-hot-toast';

const NewsManager = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    // Filters
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const CATEGORIES = ['COSMETICS', 'EDUCATION', 'FASHION', 'FINE ART', 'PEFORMANCES', 'PAST EVENTS', 'TRAVEL'];

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/news/get-all`);
            if (res.data.status === 'success') {
                setNews(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Failed to load news");
        } finally {
            setLoading(false);
        }
    };

    const initiateDelete = (item) => {
        setNewsToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!newsToDelete) return;
        try {
            await axios.delete(`${baseURL}/api/admin/news/delete/${newsToDelete._id}`);
            fetchNews();
            toast.success("News article deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete news");
        } finally {
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

    const filteredNews = news.filter(item => {
        const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
        const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'live' ? item.status === 'live' : item.status !== 'live');
        return matchesCategory && matchesStatus;
    });

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">News Management</h1>
                <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Status</option>
                        <option value="live">Live</option>
                        <option value="hidden">Hidden</option>
                    </select>

                    <Link
                        to="/news/add"
                        className="flex items-center gap-2 font-bold py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus size={20} /> Add News
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((item) => (
                        <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 relative flex flex-col h-full">
                            <div className="relative h-48">
                                {item.image && item.image.url ? (
                                    <img src={item.image.url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Link
                                        to={`/news/preview/${item._id}`}
                                        className="bg-black/50 hover:bg-black/80 text-white p-1 rounded transition-colors backdrop-blur-sm"
                                        title="Preview News"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold uppercase shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-white line-clamp-1" title={item.title}>
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 uppercase">{item.status === 'live' ? 'Live' : 'Hidden'}</span>
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            disabled={updatingStatusId === item._id}
                                            className={`w-10 h-5 rounded-full flex items-center transition-colors p-1 ${item.status === 'live' ? 'bg-green-500' : 'bg-gray-600'} ${updatingStatusId === item._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {updatingStatusId === item._id ? (
                                                <div className="w-full flex justify-center">
                                                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                                                </div>
                                            ) : (
                                                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${item.status === 'live' ? 'translate-x-5' : 'translate-x-0'}`} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    {item.date || new Date(item.createdAt).toLocaleDateString()}
                                </p>
                                <div className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow" dangerouslySetInnerHTML={{ __html: item.content }} />

                                <div className="flex justify-between items-center mt-auto border-t border-gray-700 pt-4 gap-3">
                                    <Link
                                        to={`/news/edit/${item._id}`}
                                        className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <Pencil size={16} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => initiateDelete(item)}
                                        className="flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredNews.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-400 text-lg">No news articles found matching your filters.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-white">{newsToDelete?.title}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsManager;
