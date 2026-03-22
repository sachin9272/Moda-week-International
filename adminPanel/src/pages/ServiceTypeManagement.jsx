import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Loader, X, Layers } from 'lucide-react';
import { baseURL } from '../config/api';
import { optimizeCloudinaryImage } from '../utils/cloudinary';

const ServiceTypeManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: '' });
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 0
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${baseURL}/api/service-types`);
            const data = await response.json();
            setServices(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleEdit = (service) => {
        setEditingId(service._id);
        setFormData({
            title: service.title,
            description: service.description,
            order: service.order
        });
        setImageFile(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', order: 0 });
        setImageFile(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('order', formData.order);
            if (imageFile) {
                data.append('image', imageFile);
            }

            const url = editingId
                ? `${baseURL}/api/service-types/${editingId}`
                : `${baseURL}/api/service-types`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                resetForm();
                fetchServices();
            }
        } catch (error) {
            console.error('Error saving service:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteConfirm = (service) => {
        setDeleteConfirm({ show: true, id: service._id, title: service.title });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, id: null, title: '' });
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            const response = await fetch(`${baseURL}/api/service-types/${deleteConfirm.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchServices();
                closeDeleteConfirm();
            }
        } catch (error) {
            console.error('Error deleting:', error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center p-10">
            <Loader className="animate-spin text-[#C7913E]" size={40} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Primary Service Types</h2>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${showForm
                        ? 'bg-[#2a2a2a] text-neutral-300 hover:bg-[#3a3a3a]'
                        : 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white hover:from-[#7A5020] hover:to-[#B38135] shadow-lg shadow-[#C7913E]/20'
                        }`}
                >
                    {showForm ? (
                        <>
                            <X size={20} /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus size={20} /> Add Service
                        </>
                    )}
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-[#2a2a2a]">
                    <h3 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1">Image {editingId && '(Optional)'}</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required={!editingId}
                                className="block w-full text-sm text-neutral-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-[#C7913E]/20 file:text-[#C7913E]
                                    hover:file:bg-[#C7913E]/30 file:cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                            {editingId && (
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : 'Save Service'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service._id} className="bg-[#1a1a1a] rounded-xl shadow-lg border border-[#2a2a2a] overflow-hidden flex flex-col hover:border-[#3a3a3a] transition-all group">
                        <img src={optimizeCloudinaryImage(service.image, { width: 720, height: 420, crop: 'fill' })} alt={service.title} className="w-full h-48 object-cover" loading="lazy" decoding="async" />
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-lg text-white mb-2">{service.title}</h3>
                            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{service.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-[#C7913E] bg-[#C7913E]/10 px-2 py-1 rounded">Order: {service.order}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(service)} className="p-2 text-[#C7913E] hover:bg-[#C7913E]/20 rounded-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => openDeleteConfirm(service)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {services.length === 0 && (
                    <div className="col-span-full bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4">
                            <Layers size={28} className="text-neutral-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No services yet</h3>
                        <p className="text-neutral-500">Add your first service to get started.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDeleteConfirm}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Service?</h3>
                            <p className="text-neutral-400 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-white font-medium text-center truncate px-4 mb-6">
                                "{deleteConfirm.title}"
                            </p>
                            <p className="text-xs text-neutral-500 text-center mb-6">
                                This action cannot be undone.
                            </p>
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
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader size={18} className="animate-spin" />
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

export default ServiceTypeManagement;
