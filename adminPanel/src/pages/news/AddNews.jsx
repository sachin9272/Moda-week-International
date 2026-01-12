import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { baseURL } from '../../config/api';
import toast from 'react-hot-toast';

const AddNews = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentNews, setCurrentNews] = useState({ title: '', content: '', image: null, category: 'FASHION', status: 'hidden' });
    const [isDragging, setIsDragging] = useState(false);

    const CATEGORIES = ['COSMETICS', 'EDUCATION', 'FASHION', 'FINE ART', 'PEFORMANCES', 'PAST EVENTS', 'TRAVEL'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('title', currentNews.title);
        formData.append('content', currentNews.content);
        formData.append('category', currentNews.category || 'FASHION');
        formData.append('status', currentNews.status || 'live');

        if (currentNews.image instanceof File) {
            formData.append('image', currentNews.image);
        }

        try {
            await axios.post(`${baseURL}/api/admin/news/create`, formData);
            toast.success("News created successfully");
            navigate('/news');
        } catch (error) {
            console.error(error);
            toast.error("Failed to create news");
        } finally {
            setLoading(false);
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

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold">Add New Article</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                value={currentNews.title}
                                onChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                value={currentNews.category || 'FASHION'}
                                onChange={(e) => setCurrentNews({ ...currentNews, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <label className="block text-gray-400 mb-1">Content</label>
                    <div className="bg-white text-black rounded-lg overflow-hidden [&_.ql-toolbar]:!bg-gray-100 [&_.ql-container]:!bg-white [&_.ql-editor]:!min-h-[300px] [&_.ql-editor]:!text-base">
                        <ReactQuill
                            theme="snow"
                            value={currentNews.content}
                            onChange={(content) => setCurrentNews({ ...currentNews, content })}
                            className="h-64 mb-12"
                        />
                    </div>

                    <div className="mt-8">
                        <label className="block text-gray-400 mb-2">Cover Image</label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700 ring-2 ring-blue-500/50' : (currentNews.image ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50')}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {currentNews.image ? (
                                <div className="relative w-full">
                                    <img
                                        src={URL.createObjectURL(currentNews.image)}
                                        alt="Preview"
                                        className="max-h-64 w-auto mx-auto rounded shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setCurrentNews({ ...currentNews, image: null })}
                                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                                    >
                                        <X size={16} />
                                    </button>
                                    <p className="mt-2 text-sm text-gray-400">{currentNews.image.name}</p>
                                </div>
                            ) : (
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                    <span className="text-blue-400 font-medium hover:underline">Click to upload</span>
                                    <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
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
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-blue-400"
                    >
                        {loading ? 'Creating...' : 'Create Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNews;
