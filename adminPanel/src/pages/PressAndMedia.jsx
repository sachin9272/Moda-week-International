import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Trash2, Plus, Pencil, Loader, Users } from 'lucide-react';
import { baseURL } from '../config/api';
import { countries } from '../utils/countries';
import ImageEditorModal from '../components/ImageEditorModal';

const PressAndMedia = () => {
    const [mediaMembers, setMediaMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [deleting, setDeleting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        countryCode: '',
        role: 'Media Representative',
        instagram: '',
        website: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Image Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorImageSrc, setEditorImageSrc] = useState(null);

    useEffect(() => {
        fetchMediaMembers();
    }, []);

    const fetchMediaMembers = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/press-and-media?limit=1000`);
            const mediaData = response.data.members || response.data;
            setMediaMembers(Array.isArray(mediaData) ? mediaData : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching given media members:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'country') {
            const selectedCountry = countries.find(c => c.name === value);
            setFormData(prev => ({
                ...prev,
                country: value,
                countryCode: selectedCountry?.code || ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setEditorImageSrc(imageUrl);
            setEditorOpen(true);
            e.target.value = '';
        }
    };

    const handleSaveEditedImage = (blob) => {
        const file = new File([blob], 'media_image.jpg', { type: 'image/jpeg' });
        setFormData(prev => ({ ...prev, image: file }));
        setPreviewUrl(URL.createObjectURL(file));
        setEditorOpen(false);
        setEditorImageSrc(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('country', formData.country);
        data.append('countryCode', formData.countryCode);
        data.append('role', formData.role);
        data.append('instagram', formData.instagram);
        data.append('website', formData.website);
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        try {
            if (isEditing) {
                await axios.put(`${baseURL}/api/press-and-media/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${baseURL}/api/press-and-media`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchMediaMembers();
            resetForm();
        } catch (error) {
            console.error("Error creating/updating media member:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteConfirm = (member) => {
        setDeleteConfirm({ show: true, id: member._id, name: member.name });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, id: null, name: '' });
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            await axios.delete(`${baseURL}/api/press-and-media/${deleteConfirm.id}`);
            fetchMediaMembers();
            closeDeleteConfirm();
        } catch (error) {
            console.error("Error deleting media member:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = (member) => {
        resetForm();
        setFormData({
            name: member.name,
            country: member.country,
            countryCode: member.countryCode || '',
            role: member.role || 'Media Representative',
            instagram: member.instagram || '',
            website: member.website || '',
            image: member.image
        });
        setPreviewUrl(member.image?.url);
        setIsEditing(true);
        setEditId(member._id);
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', country: '', countryCode: '', role: 'Media Representative', instagram: '', website: '', image: null });
        setPreviewUrl(null);
        setIsEditing(false);
        setEditId(null);
        setShowAddModal(false);
        setEditorImageSrc(null);
        setEditorOpen(false);
    };

    const handleAddClick = () => {
        resetForm();
        setShowAddModal(true);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Press and Media</h1>
                    <p className="text-neutral-500 mt-1">Manage press and media members</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-5 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    <Plus size={20} />
                    Add Entry
                </button>
            </div>

            <ImageEditorModal
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSave={handleSaveEditedImage}
                image={editorImageSrc}
                aspect={3 / 4}
            />

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader className="animate-spin text-[#C7913E]" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mediaMembers?.map((member) => (
                        <div key={member._id} className="bg-[#1a1a1a] rounded-xl shadow-lg border border-[#2a2a2a] overflow-hidden group hover:border-[#3a3a3a] transition-all">
                            <div className="relative aspect-[3/4]">
                                <img
                                    src={member.image?.url || 'https://via.placeholder.com/300x400?text=No+Image'}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-2.5 bg-[#C7913E] rounded-full text-white hover:bg-[#B38135] transition-colors"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteConfirm(member)}
                                        className="p-2.5 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-white">{member.name}</h3>
                                <p className="text-sm text-neutral-500">{member.country}</p>
                                <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold bg-[#C7913E]/20 text-[#C7913E] rounded">
                                    {member.role || 'Media Representative'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {mediaMembers?.length === 0 && (
                        <div className="col-span-full bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4">
                                <Users size={28} className="text-neutral-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No entries yet</h3>
                            <p className="text-neutral-500">Add your first press or media member to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-[#2a2a2a]">
                        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Entry' : 'Add New Entry'}</h2>
                            <button onClick={resetForm} className="text-neutral-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Company / Representative Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="e.g. Vogue Magazine / Jane Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Country</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((c) => (
                                        <option key={c.code} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Role / Type</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="e.g. Chief Editor / Magazine"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Instagram URL</label>
                                <input
                                    type="url"
                                    name="instagram"
                                    value={formData.instagram || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="e.g. https://instagram.com/agency"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Website URL</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="e.g. https://agency-website.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Photo / Logo</label>
                                <div className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-4 text-center hover:border-[#C7913E]/50 hover:bg-[#C7913E]/5 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${previewUrl ? 'z-10' : ''}`}
                                    />
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img src={previewUrl} alt="Preview" className="h-40 mx-auto object-cover rounded-lg" />
                                            <div className="absolute -top-2 -right-2 z-20">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (formData.image instanceof File) {
                                                            setEditorImageSrc(URL.createObjectURL(formData.image));
                                                            setEditorOpen(true);
                                                        } else if (typeof formData.image === 'object' && formData.image.url) {
                                                            setEditorImageSrc(formData.image.url);
                                                            setEditorOpen(true);
                                                        }
                                                    }}
                                                    className="bg-[#C7913E] hover:bg-[#B38135] text-white rounded-full p-1.5 shadow-md"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-neutral-500">
                                            <Upload className="mx-auto mb-2" size={32} />
                                            <span className="text-sm">Click to upload photo</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2.5 text-neutral-400 hover:bg-[#252525] rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || (!isEditing && !formData.image)}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Entry')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDeleteConfirm}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Entry?</h3>
                            <p className="text-neutral-400 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-white font-medium text-center truncate px-4 mb-6">
                                "{deleteConfirm.name}"
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

export default PressAndMedia;
