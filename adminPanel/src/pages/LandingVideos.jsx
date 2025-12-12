import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Video, ExternalLink, Loader } from 'lucide-react';

const LandingVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        order: 0
    });
    const [videoFile, setVideoFile] = useState(null);

    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/landing-videos');
            const data = await response.json();
            setVideos(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleEdit = (video) => {
        setEditingId(video._id);
        setFormData({
            title: video.title,
            order: video.order
        });
        setVideoFile(null); // Reset file input
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', order: 0 });
        setVideoFile(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('order', formData.order);
            if (videoFile) {
                data.append('video', videoFile);
            }

            const url = editingId
                ? `http://localhost:5000/api/landing-videos/${editingId}`
                : 'http://localhost:5000/api/landing-videos';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                resetForm();
                fetchVideos();
            } else {
                alert(`Failed to ${editingId ? 'update' : 'add'} video`);
            }
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Error saving video');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/landing-videos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchVideos();
            } else {
                alert('Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Landing Page Videos</h2>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : <><Plus size={20} /> Add Video</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Video' : 'Add New Video'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="e.g. New York Show"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    required
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Video File {editingId ? '(Optional - leave empty to keep current)' : '(MP4, MOV)'}
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                required={!editingId}
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex justify-end pt-2 gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : (editingId ? 'Update Video' : 'Upload Video')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200 font-medium text-slate-500">
                    <div className="col-span-1">Order</div>
                    <div className="col-span-4">Title</div>
                    <div className="col-span-6">URL</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>
                {videos.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No videos found. Add one to get started.</div>
                ) : (
                    videos.map((video) => (
                        <div key={video._id} className="grid grid-cols-12 p-4 border-b border-slate-100 items-center hover:bg-slate-50 transition">
                            <div className="col-span-1 font-mono text-slate-500">#{video.order}</div>
                            <div className="col-span-4 font-medium text-slate-800 flex items-center gap-2">
                                <Video size={16} className="text-blue-500" />
                                {video.title}
                            </div>
                            <div className="col-span-6 text-slate-600 truncate flex items-center gap-2">
                                <span className="truncate">{video.videoUrl}</span>
                                <a
                                    href={video.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-600"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="col-span-1 flex justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                    title="Edit video"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(video._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Delete video"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LandingVideos;
