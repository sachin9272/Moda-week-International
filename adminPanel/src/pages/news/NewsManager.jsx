import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { baseURL } from '../../config/api';

const NewsManager = () => {
    const [news, setNews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNews, setCurrentNews] = useState({ title: '', content: '', image: null });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/news/get-all`);
            if (res.data.success) {
                setNews(res.data.news);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this news article?")) {
            try {
                await axios.delete(`${baseURL}/api/admin/news/delete/${id}`);
                fetchNews();
            } catch (error) {
                alert("Failed to delete news");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', currentNews.title);
        formData.append('content', currentNews.content);
        if (currentNews.image) formData.append('image', currentNews.image);

        try {
            if (currentNews._id) {
                await axios.put(`${baseURL}/api/admin/news/update/${currentNews._id}`, currentNews); // Note: Simple update might not need FormData for image unless changed logic, preserving original logic style
            } else {
                await axios.post(`${baseURL}/api/admin/news/create`, formData);
            }
            setIsEditing(false);
            setCurrentNews({ title: '', content: '', image: null });
            fetchNews();
        } catch (error) {
            console.error(error);
            alert("Failed to save news");
        }
    };

    const handleEdit = (item) => {
        setCurrentNews(item);
        setIsEditing(true);
    };

    const columns = [
        { header: 'Title', key: 'title' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">News Management</h1>
                    <p className="text-slate-500">Create and manage news articles</p>
                </div>
                <button
                    onClick={() => { setIsEditing(!isEditing); setCurrentNews({ title: '', content: '', image: null }); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {isEditing ? 'Cancel' : 'Create News'}
                </button>
            </div>

            {isEditing ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                    <h3 className="text-lg font-bold mb-4">{currentNews._id ? 'Edit News' : 'Create New Article'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={currentNews.title}
                                onChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                            <ReactQuill
                                theme="snow"
                                value={currentNews.content}
                                onChange={(content) => setCurrentNews({ ...currentNews, content })}
                                className="h-64 mb-12"
                            />
                        </div>
                        <div className="pt-8">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
                            <input
                                type="file"
                                onChange={(e) => setCurrentNews({ ...currentNews, image: e.target.files[0] })}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Save Article
                        </button>
                    </form>
                </div>
            ) : (
                <Table
                    title="News Articles"
                    columns={columns}
                    data={news}
                    onDelete={handleDelete}
                    onView={handleEdit}
                />
            )}
        </div>
    );
};

export default NewsManager;
