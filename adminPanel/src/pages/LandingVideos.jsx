import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Video, ExternalLink, Loader, GripVertical, Edit2, Upload, X, Eye, Youtube, Layout } from 'lucide-react';
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
import toast from 'react-hot-toast';

// Sortable video row component
const SortableVideoRow = ({ video, onEdit, onDelete, onPreview, activeTab }) => {
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

    const isYoutube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative bg-[#1a1a1a] rounded-xl border transition-all duration-200 ${isDragging
                ? 'shadow-2xl border-[#C7913E] scale-[1.02] ring-2 ring-[#C7913E]/30'
                : 'border-[#2a2a2a] hover:shadow-lg hover:border-[#3a3a3a]'
                }`}
        >
            <div className="flex items-center gap-4 p-4">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-[#252525] text-neutral-500 hover:text-[#C7913E] transition-colors"
                    title="Drag to reorder"
                >
                    <GripVertical size={20} />
                </button>

                {/* Order Badge */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5D25] to-[#C7913E] flex items-center justify-center shadow-lg shadow-[#C7913E]/20">
                    <span className="text-white font-bold text-sm">{video.order}</span>
                </div>

                {/* Video Thumbnail Placeholder */}
                <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center overflow-hidden border border-[#2a2a2a]">
                    {isYoutube ? (
                        <img
                            src={`https://img.youtube.com/vi/${extractYoutubeId(video.videoUrl)}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Video size={24} className="text-neutral-500" />
                    )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{video.title || 'Untitled Video'}</h3>
                    <p className="text-sm text-neutral-500 truncate flex items-center gap-2 mt-1">
                        {isYoutube && <Youtube size={14} className="text-red-500" />}
                        <span className="truncate">{video.videoUrl}</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onPreview(video)}
                        className="p-2.5 rounded-lg bg-[#252525] text-neutral-400 hover:bg-[#303030] hover:text-white transition-colors"
                        title="Preview video"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(video)}
                        className="p-2.5 rounded-lg bg-[#C7913E]/20 text-[#C7913E] hover:bg-[#C7913E]/30 hover:text-[#D4A558] transition-colors"
                        title="Edit video"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(video)}
                        className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        title="Delete video"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const extractYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const LandingVideos = () => {
    const [activeTab, setActiveTab] = useState('landing'); // 'landing' or 'newsroom'
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        order: 0,
        videoUrl: ''
    });
    const [videoFile, setVideoFile] = useState(null);
    const [dragFile, setDragFile] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: '' });
    const [deleting, setDeleting] = useState(false);

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
            setLoading(true);
            const response = await fetch(`${baseURL}/api/landing-videos?type=${activeTab}`);
            const data = await response.json();
            setVideos(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setLoading(false);
            toast.error('Failed to fetch videos');
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [activeTab]);

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
                toast.error('Failed to save order');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setFormData({ ...formData, videoUrl: '' }); // Clear URL if file is selected
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragFile(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
                setFormData({ ...formData, videoUrl: '' });
            }
        }
    };

    const handleEdit = (video) => {
        setEditingId(video._id);
        setFormData({
            title: video.title,
            subtitle: video.subtitle || '',
            order: video.order,
            videoUrl: video.videoUrl
        });
        setVideoFile(null);
        setShowForm(true);
    };

    const handlePreview = (video) => {
        let url = video.videoUrl;
        const ytId = extractYoutubeId(url);

        if (ytId) {
            setPreviewVideo({ ...video, isYoutube: true, ytId });
        } else {
            if (!url.startsWith('http')) {
                url = `${baseURL}${url}`;
            }
            setPreviewVideo({ ...video, isYoutube: false, fullUrl: url });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', subtitle: '', order: videos.length + 1, videoUrl: '' });
        setVideoFile(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('order', formData.order);
            data.append('type', activeTab);

            if (videoFile) {
                data.append('video', videoFile);
            } else if (formData.videoUrl) {
                data.append('videoUrl', formData.videoUrl);
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
                toast.success(editingId ? 'Video updated' : 'Video added');
            } else {
                toast.error('Failed to save video');
            }
        } catch (error) {
            console.error('Error saving video:', error);
            toast.error('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteConfirm = (video) => {
        setDeleteConfirm({ show: true, id: video._id, title: video.title });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, id: null, title: '' });
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            const response = await fetch(`${baseURL}/api/landing-videos/${deleteConfirm.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchVideos();
                closeDeleteConfirm();
                toast.success('Video deleted');
            } else {
                toast.error('Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            toast.error('An error occurred');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Centered Tab Switcher Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="hidden md:block w-32"></div> {/* Spacer for symmetry */}

                <div className="bg-[#1a1a1a] rounded-2xl p-1.5 border border-[#2a2a2a] flex gap-2 w-full max-w-xl shadow-2xl">
                    <button
                        onClick={() => setActiveTab('landing')}
                        className={`flex-1 py-3.5 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-3 ${activeTab === 'landing' ? 'bg-[#C7913E] text-white shadow-xl shadow-[#C7913E]/20' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <Layout size={20} /> Landing Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('newsroom')}
                        className={`flex-1 py-3.5 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-3 ${activeTab === 'newsroom' ? 'bg-[#C7913E] text-white shadow-xl shadow-[#C7913E]/20' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <Youtube size={20} /> News Room Videos
                    </button>
                </div>

                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else {
                            setFormData({ title: '', subtitle: '', order: videos.length + 1, videoUrl: '' });
                            setShowForm(true);
                        }
                    }}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-xl whitespace-nowrap min-w-[140px] justify-center ${showForm
                        ? 'bg-[#2a2a2a] text-neutral-300 hover:bg-[#3a3a3a] shadow-black/20'
                        : 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white hover:from-[#7A5020] hover:to-[#B38135] shadow-[#C7913E]/20'
                        }`}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] animate-fadeIn">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5D25] to-[#C7913E] flex items-center justify-center">
                            {activeTab === 'landing' ? <Video size={20} className="text-white" /> : <Youtube size={20} className="text-white" />}
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                            {editingId ? 'Edit Video' : `Add ${activeTab === 'landing' ? 'Landing' : 'News Room'} Video`}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Video Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] outline-none transition-all hover:border-[#3a3a3a]"
                                    placeholder={activeTab === 'landing' ? "e.g. New York Fashion Week 2025" : "e.g. Behind the Scenes at Paris"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    min="1"
                                    required
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] outline-none transition-all hover:border-[#3a3a3a]"
                                />
                            </div>
                        </div>

                        {activeTab === 'landing' && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Subtitle (Displayed below title)
                                </label>
                                <textarea
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] outline-none transition-all hover:border-[#3a3a3a]"
                                    placeholder="e.g. FASHION DESIGNERS APPLICATIONS NOW OPEN"
                                    rows="2"
                                />
                            </div>
                        )}

                        {activeTab === 'landing' ? (
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Video File {editingId ? '(Optional - leave empty to keep current)' : ''}
                                </label>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragFile(true); }}
                                    onDragLeave={() => setDragFile(false)}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragFile
                                        ? 'border-[#C7913E] bg-[#C7913E]/10'
                                        : videoFile
                                            ? 'border-green-500/50 bg-green-500/10'
                                            : 'border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#C7913E]/50 hover:bg-[#C7913E]/5'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept="video/*"
                                        required={!editingId && !formData.videoUrl}
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {videoFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                <Video size={24} className="text-green-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-green-400">{videoFile.name}</p>
                                                <p className="text-sm text-green-500/70">
                                                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ) : formData.videoUrl && !editingId ? (
                                        <div className="text-neutral-300">File already selected: {formData.videoUrl}</div>
                                    ) : (
                                        <>
                                            <Upload size={40} className={`mx-auto mb-3 ${dragFile ? 'text-[#C7913E]' : 'text-neutral-500'}`} />
                                            <p className="text-neutral-300 font-medium">Drag and drop your video here</p>
                                            <p className="text-sm text-neutral-500 mt-1">or click to browse · MP4, MOV, WebM</p>
                                        </>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    YouTube Video URL
                                </label>
                                <div className="relative">
                                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                                    <input
                                        type="text"
                                        name="videoUrl"
                                        value={formData.videoUrl}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] outline-none transition-all hover:border-[#3a3a3a]"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                {formData.videoUrl && extractYoutubeId(formData.videoUrl) && (
                                    <div className="mt-4 p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a] flex items-center gap-4">
                                        <img
                                            src={`https://img.youtube.com/vi/${extractYoutubeId(formData.videoUrl)}/mqdefault.jpg`}
                                            alt="Preview"
                                            className="w-32 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-[#C7913E] uppercase tracking-wider">Preview Detected</p>
                                            <p className="text-sm text-neutral-400 mt-1">YouTube ID: {extractYoutubeId(formData.videoUrl)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 rounded-xl text-neutral-400 hover:bg-[#252525] font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7913E]/20"
                            >
                                {submitting ? (
                                    <Loader size={18} className="animate-spin" />
                                ) : (
                                    <Upload size={18} />
                                )}
                                {submitting ? 'Saving...' : editingId ? 'Update Video' : 'Save Video'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Videos List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="animate-spin text-[#C7913E] mb-4" size={40} />
                        <p className="text-neutral-500">Loading {activeTab} videos...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-6">
                            {activeTab === 'landing' ? <Video size={32} className="text-neutral-600" /> : <Youtube size={32} className="text-neutral-600" />}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No {activeTab} videos found</h3>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                            Start building your {activeTab === 'landing' ? 'landing page hero section' : 'news room video gallery'} by adding your first video.
                        </p>
                        <button
                            onClick={() => {
                                setFormData({ title: '', subtitle: '', order: 1, videoUrl: '' });
                                setShowForm(true);
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-6 py-3 rounded-xl font-bold hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
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
                                        activeTab={activeTab}
                                        onEdit={handleEdit}
                                        onDelete={openDeleteConfirm}
                                        onPreview={handlePreview}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setPreviewVideo(null)}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-[#2a2a2a] shadow-2xl animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a] bg-[#0f0f0f]/50">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                {previewVideo.isYoutube ? <Youtube className="text-red-500" size={18} /> : <Video className="text-[#C7913E]" size={18} />}
                                {previewVideo.title}
                            </h3>
                            <button
                                onClick={() => setPreviewVideo(null)}
                                className="p-2.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="aspect-video bg-black relative">
                            {previewVideo.isYoutube ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${previewVideo.ytId}?autoplay=1`}
                                    title={previewVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={previewVideo.fullUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDeleteConfirm}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Video?</h3>
                            <p className="text-neutral-400 text-center mb-2">Are you sure you want to remove</p>
                            <p className="text-white font-bold text-center truncate px-4 mb-6 uppercase tracking-tight">"{deleteConfirm.title}"</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    {deleting ? 'Removing...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingVideos;
