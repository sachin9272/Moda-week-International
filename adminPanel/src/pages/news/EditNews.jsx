import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader, Save, FileText, Layout, Eye } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { baseURL } from '../../config/api';
import toast from 'react-hot-toast';

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentNews, setCurrentNews] = useState({ title: '', content: '', image: null, category: 'FASHION', status: 'live', author: '', date: '' });
    const [isDragging, setIsDragging] = useState(false);

    const CATEGORIES = ['COSMETICS', 'EDUCATION', 'FASHION', 'FINE ART', 'PEFORMANCES', 'PAST EVENTS', 'TRAVEL'];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/admin/news/get/${id}`);
                if (res.data.status === 'success') {
                    setCurrentNews(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                toast.error("Failed to load news article");
                navigate('/news');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData();
        formData.append('title', currentNews.title);
        formData.append('content', currentNews.content);
        formData.append('category', currentNews.category || 'FASHION');
        formData.append('status', currentNews.status || 'live');
        formData.append('author', currentNews.author);
        formData.append('date', currentNews.date);

        if (currentNews.image instanceof File) {
            formData.append('image', currentNews.image);
        }

        try {
            await axios.put(`${baseURL}/api/admin/news/update/${id}`, formData);
            toast.success("News article updated successfully");
            navigate('/news');
        } catch (error) {
            console.error(error);
            toast.error("Failed to update news");
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentNews({ ...currentNews, image: file });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setCurrentNews({ ...currentNews, image: file });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader className="w-10 h-10 text-[#C7913E] animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-xl border border-[#2a2a2a] text-neutral-400 hover:text-white transition-all shadow-sm"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Edit News</h1>
                        <p className="text-neutral-500 mt-1">Refine and update your article details</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/news/preview/${id}`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] text-neutral-300 hover:text-white rounded-xl font-medium transition-all"
                >
                    <Eye size={18} />
                    Preview Changes
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-5xl space-y-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a] shadow-xl">
                            <div className="flex items-center gap-2 mb-6 text-[#C7913E]">
                                <FileText size={20} />
                                <h2 className="text-lg font-bold uppercase tracking-wider">Article Content</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Article Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#C7913E] text-white placeholder-neutral-600 transition-colors"
                                        placeholder="Enter article title..."
                                        value={currentNews.title}
                                        onChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Content Editor</label>
                                    <div className="bg-white rounded-xl overflow-hidden quill-custom-container">
                                        <ReactQuill
                                            theme="snow"
                                            value={currentNews.content}
                                            onChange={(content) => setCurrentNews({ ...currentNews, content })}
                                            className="h-80 mb-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Settings & Media */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a] shadow-xl">
                            <div className="flex items-center gap-2 mb-6 text-[#C7913E]">
                                <Layout size={20} />
                                <h2 className="text-lg font-bold uppercase tracking-wider">Publishing Info</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#C7913E] text-white transition-colors appearance-none"
                                        value={currentNews.category || 'FASHION'}
                                        onChange={(e) => setCurrentNews({ ...currentNews, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Author</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#C7913E] text-white placeholder-neutral-600 transition-colors"
                                        value={currentNews.author || ''}
                                        onChange={(e) => setCurrentNews({ ...currentNews, author: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Article Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#C7913E] text-white transition-colors"
                                        value={currentNews.date || ''}
                                        onChange={(e) => setCurrentNews({ ...currentNews, date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a] shadow-xl">
                            <label className="block text-sm font-bold text-[#C7913E] uppercase tracking-wider mb-4">Cover Image</label>
                            <div
                                className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all min-h-[200px] ${isDragging ? 'border-[#C7913E] bg-[#C7913E]/5' : ((currentNews.image && (currentNews.image.url || currentNews.image instanceof File)) ? 'border-[#C7913E]/40 bg-[#0f0f0f]' : 'border-[#2a2a2a] hover:border-[#C7913E]/40 hover:bg-[#C7913E]/5')}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {(currentNews.image && (currentNews.image.url || currentNews.image instanceof File)) ? (
                                    <div className="relative w-full group">
                                        <img
                                            src={currentNews.image instanceof File ? URL.createObjectURL(currentNews.image) : currentNews.image.url}
                                            alt="Preview"
                                            className="w-full h-40 object-cover rounded-xl shadow-lg border border-[#2a2a2a]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setCurrentNews({ ...currentNews, image: null })}
                                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 shadow-xl transition-all border border-white/10"
                                        >
                                            <X size={14} />
                                        </button>
                                        <p className="mt-2 text-[10px] text-neutral-500 truncate px-2">
                                            {currentNews.image instanceof File ? currentNews.image.name : 'Current Article Cover'}
                                        </p>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#C7913E]/10 flex items-center justify-center text-[#C7913E] mb-4">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <span className="text-[#C7913E] text-sm font-bold block mb-1">Update Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white font-bold py-4 rounded-2xl hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader size={20} className="animate-spin" />
                            ) : (
                                <Save size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                            )}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>

            <style dangerouslySetInnerHTML={{
                __html: `
                .quill-custom-container .ql-toolbar { border: none !important; background: #f8f9fa !important; border-bottom: 1px solid #e9ecef !important; padding: 12px !important; }
                .quill-custom-container .ql-container { border: none !important; font-family: inherit !important; }
                .quill-custom-container .ql-editor { font-size: 16px !important; line-height: 1.6 !important; min-height: 250px !important; }
            ` }} />
        </div>
    );
};

export default EditNews;
