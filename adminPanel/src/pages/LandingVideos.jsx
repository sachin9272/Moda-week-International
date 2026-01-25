import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Video, ExternalLink, Loader, GripVertical, Edit2, Upload, X, Eye } from 'lucide-react';
import { baseURL } from '../config/api';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable video row component
const SortableVideoRow = ({ video, onEdit, onDelete, onPreview }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: video._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative bg-white rounded-xl border transition-all duration-200 ${isDragging
                    ? 'shadow-2xl border-indigo-400 scale-[1.02] ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:shadow-lg hover:border-slate-300'
                }`}
        >
            <div className="flex items-center gap-4 p-4">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Drag to reorder"
                >
                    <GripVertical size={20} />
                </button>

                {/* Order Badge */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                    <span className="text-white font-bold text-sm">{video.order}</span>
                </div>

                {/* Video Thumbnail Placeholder */}
                <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                    <Video size={24} className="text-slate-400" />
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{video.title || 'Untitled Video'}</h3>
                    <p className="text-sm text-slate-500 truncate flex items-center gap-2 mt-1">
                        <span className="truncate">{video.videoUrl}</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onPreview(video)}
                        className="p-2.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                        title="Preview video"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(video)}
                        className="p-2.5 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 transition-colors"
                        title="Edit video"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(video._id)}
                        className="p-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors"
                        title="Delete video"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const LandingVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        order: 0
    });
    const [videoFile, setVideoFile] = useState(null);
    const [dragFile, setDragFile] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${baseURL}/api/landing-videos`);
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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = videos.findIndex((v) => v._id === active.id);
            const newIndex = videos.findIndex((v) => v._id === over.id);

            const newVideos = arrayMove(videos, oldIndex, newIndex);

            // Update local state immediately for smooth UX
            const updatedVideos = newVideos.map((video, index) => ({
                ...video,
                order: index + 1
            }));
            setVideos(updatedVideos);

            // Persist to backend
            try {
                const orders = updatedVideos.map((v) => ({ id: v._id, order: v.order }));
                await fetch(`${baseURL}/api/landing-videos/reorder`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orders })
                });
            } catch (error) {
                console.error('Error reordering videos:', error);
                fetchVideos(); // Revert on error
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragFile(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
            }
        }
    };

    const handleEdit = (video) => {
        setEditingId(video._id);
        setFormData({
            title: video.title,
            order: video.order
        });
        setVideoFile(null);
        setShowForm(true);
    };

    const handlePreview = (video) => {
        let url = video.videoUrl;
        if (!url.startsWith('http')) {
            url = `${baseURL}${url}`;
        }
        setPreviewVideo({ ...video, fullUrl: url });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', order: videos.length + 1 });
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
                ? `${baseURL}/api/landing-videos/${editingId}`
                : `${baseURL}/api/landing-videos`;

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
            const response = await fetch(`${baseURL}/api/landing-videos/${id}`, {
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
                <div className="text-center">
                    <Loader className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-500">Loading videos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Landing Page Videos
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Manage hero videos displayed on the landing page. Drag to reorder.
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else {
                            setFormData({ title: '', order: videos.length + 1 });
                            setShowForm(true);
                        }
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg ${showForm
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-slate-200/50'
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 shadow-indigo-300/50'
                        }`}
                >
                    {showForm ? (
                        <>
                            <X size={20} /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus size={20} /> Add Video
                        </>
                    )}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 animate-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Video size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">
                            {editingId ? 'Edit Video' : 'Add New Video'}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Video Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 hover:bg-white"
                                    placeholder="e.g. New York Fashion Week 2025"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    min="1"
                                    required
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 hover:bg-white"
                                    placeholder="1"
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    You can also drag videos to reorder after adding
                                </p>
                            </div>
                        </div>

                        {/* Drag & Drop Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Video File {editingId ? '(Optional - leave empty to keep current)' : ''}
                            </label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragFile(true); }}
                                onDragLeave={() => setDragFile(false)}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragFile
                                        ? 'border-indigo-400 bg-indigo-50'
                                        : videoFile
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept="video/*"
                                    required={!editingId}
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {videoFile ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                            <Video size={24} className="text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-green-700">{videoFile.name}</p>
                                            <p className="text-sm text-green-500">
                                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={40} className={`mx-auto mb-3 ${dragFile ? 'text-indigo-500' : 'text-slate-400'}`} />
                                        <p className="text-slate-600 font-medium">
                                            Drag and drop your video here
                                        </p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            or click to browse · MP4, MOV, WebM
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200/50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        {editingId ? 'Update Video' : 'Upload Video'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Videos List */}
            <div className="space-y-3">
                {videos.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Video size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No videos yet</h3>
                        <p className="text-slate-500 mb-6">
                            Add your first landing page video to get started
                        </p>
                        <button
                            onClick={() => {
                                setFormData({ title: '', order: 1 });
                                setShowForm(true);
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-200/50"
                        >
                            <Plus size={20} /> Add Your First Video
                        </button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={videos.map((v) => v._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {videos.map((video) => (
                                    <SortableVideoRow
                                        key={video._id}
                                        video={video}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onPreview={handlePreview}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Info Card */}
            {videos.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <GripVertical size={16} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-indigo-800">
                                Pro tip: Drag videos to reorder
                            </p>
                            <p className="text-xs text-indigo-600 mt-0.5">
                                Changes are saved automatically. The order determines how videos appear on the landing page.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewVideo(null)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-800">{previewVideo.title}</h3>
                            <button
                                onClick={() => setPreviewVideo(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="aspect-video bg-black">
                            <video
                                src={previewVideo.fullUrl}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingVideos;
