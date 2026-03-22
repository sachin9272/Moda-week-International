import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Trash2, Plus, Pencil, Loader, Users, GripVertical } from 'lucide-react';
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
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { baseURL } from '../config/api';
import { countries } from '../utils/countries';
import ImageEditorModal from '../components/ImageEditorModal';
import { optimizeCloudinaryImage } from '../utils/cloudinary';

const SortableMemberCard = ({ member, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: member._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-[#1a1a1a] rounded-xl shadow-lg border overflow-hidden group transition-all ${isDragging
                ? 'border-[#C7913E] ring-2 ring-[#C7913E]/30 scale-[1.02] shadow-2xl'
                : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
        >
            <div className="relative aspect-[3/4]">
                <img
                    src={optimizeCloudinaryImage(member.image?.url || 'https://via.placeholder.com/300x400?text=No+Image', { width: 720, height: 960, crop: 'fill' })}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 rounded-lg bg-black/50 backdrop-blur-md text-neutral-200 hover:text-[#C7913E] hover:bg-black/70 transition-colors"
                        title="Drag to reorder"
                    >
                        <GripVertical size={18} />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-lg text-white">{member.name}</h3>
                        <p className="text-sm text-neutral-500">{member.country}</p>
                        <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold bg-[#C7913E]/20 text-[#C7913E] rounded">
                            {member.role || 'Team Member'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => onEdit(member)}
                            className="p-2.5 rounded-lg bg-[#C7913E]/15 text-[#C7913E] hover:bg-[#C7913E]/25 transition-colors"
                            title="Edit member"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(member)}
                            className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete member"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductionTeam = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reordering, setReordering] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [deleting, setDeleting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        countryCode: '',
        role: 'Team Member',
        instagram: '',
        website: '',
        description: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Image Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorImageSrc, setEditorImageSrc] = useState(null);

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

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/production-team?limit=1000`);
            const membersData = response.data.members || response.data;
            setMembers(Array.isArray(membersData) ? membersData : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching given production team:", error);
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
        const file = new File([blob], 'team_image.jpg', { type: 'image/jpeg' });
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
        data.append('description', formData.description);
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        try {
            if (isEditing) {
                await axios.put(`${baseURL}/api/production-team/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${baseURL}/api/production-team`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchMembers();
            resetForm();
        } catch (error) {
            console.error("Error creating/updating member:", error);
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
            await axios.delete(`${baseURL}/api/production-team/${deleteConfirm.id}`);
            fetchMembers();
            closeDeleteConfirm();
        } catch (error) {
            console.error("Error deleting member:", error);
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
            role: member.role || 'Team Member',
            instagram: member.instagram || '',
            website: member.website || '',
            description: member.description || '',
            image: member.image
        });
        setPreviewUrl(member.image?.url);
        setIsEditing(true);
        setEditId(member._id);
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', country: '', countryCode: '', role: 'Team Member', instagram: '', website: '', description: '', image: null });
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
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = members.findIndex((member) => member._id === active.id);
        const newIndex = members.findIndex((member) => member._id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedMembers = arrayMove(members, oldIndex, newIndex).map((member, index) => ({
            ...member,
            order: index + 1,
        }));

        setMembers(reorderedMembers);
        setReordering(true);

        try {
            const orders = reorderedMembers.map((member) => ({
                id: member._id,
                order: member.order,
            }));

            const response = await axios.put(`${baseURL}/api/production-team/reorder`, { orders });
            const updatedMembers = response.data.members || response.data;
            setMembers(Array.isArray(updatedMembers) ? updatedMembers : reorderedMembers);
        } catch (error) {
            console.error("Error reordering production team members:", error);
            fetchMembers();
        } finally {
            setReordering(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Production Team</h1>
                    <p className="text-neutral-500 mt-1">Manage production team members and drag cards to reorder them.</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-5 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    <Plus size={20} />
                    Add Team Member
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
                <div className="space-y-4">
                    {members?.length > 0 && (
                        <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
                            <p className="text-sm text-neutral-400">
                                Use the drag handle on each card to change the display order.
                            </p>
                            {reordering && (
                                <div className="flex items-center gap-2 text-sm text-[#C7913E]">
                                    <Loader size={16} className="animate-spin" />
                                    Saving order...
                                </div>
                            )}
                        </div>
                    )}

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={members.map((member) => member._id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {members?.map((member) => (
                                    <SortableMemberCard
                                        key={member._id}
                                        member={member}
                                        onEdit={handleEdit}
                                        onDelete={openDeleteConfirm}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {members?.length === 0 && (
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4">
                                <Users size={28} className="text-neutral-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No members yet</h3>
                            <p className="text-neutral-500">Add your first team member to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-[#2a2a2a]">
                        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                            <button onClick={resetForm} className="text-neutral-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="e.g. John Doe"
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
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="e.g. Choreographer"
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
                                    placeholder="e.g. https://instagram.com/designer"
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
                                    placeholder="e.g. https://designer-website.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Description / Bio</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="Brief bio or description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Photo</label>
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
                                    {submitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Team Member')}
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
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Member?</h3>
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

export default ProductionTeam;
