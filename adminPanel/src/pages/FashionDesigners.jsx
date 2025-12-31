import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Trash2, Plus, Pencil } from 'lucide-react';
import { baseURL } from '../config/api';
import { countries } from '../utils/countries';

const FashionDesigners = () => {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        countryCode: '',
        socialMedia: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchDesigners();
    }, []);

    const fetchDesigners = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/fashion-designers?limit=1000`);
            const designersData = response.data.designers || response.data;
            setDesigners(Array.isArray(designersData) ? designersData : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching designers:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'country') {
            const selectedCountry = countries.find(c => c.name === value);
            setFormData({
                ...formData,
                country: value,
                countryCode: selectedCountry?.code || ''
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('country', formData.country);
        data.append('countryCode', formData.countryCode);
        data.append('socialMedia', formData.socialMedia);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (isEditing) {
                await axios.put(`${baseURL}/api/fashion-designers/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${baseURL}/api/fashion-designers`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchDesigners();
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.error("Error creating/updating designer:", error);
            alert("Failed to save designer");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this designer?")) {
            try {
                await axios.delete(`${baseURL}/api/fashion-designers/${id}`);
                fetchDesigners();
            } catch (error) {
                console.error("Error deleting designer:", error);
                alert("Failed to delete designer");
            }
        }
    };

    const handleEdit = (designer) => {
        setFormData({
            name: designer.name,
            country: designer.country,
            countryCode: designer.countryCode || '',
            socialMedia: designer.socialMedia || '',
            image: designer.image // Keep reference for logic, though file input won't show it
        });
        setPreviewUrl(designer.image?.url);
        setIsEditing(true);
        setEditId(designer._id);
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', country: '', countryCode: '', socialMedia: '', image: null });
        setPreviewUrl(null);
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Fashion Designers</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Designer
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {designers?.map((designer) => (
                        <div key={designer._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
                            <div className="relative aspect-[3/4]">
                                <img
                                    src={designer.image?.url || 'https://via.placeholder.com/300x400?text=No+Image'}
                                    alt={designer.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(designer)}
                                        className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(designer._id)}
                                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-slate-800">{designer.name}</h3>
                                <p className="text-sm text-slate-500">{designer.country}</p>
                            </div>
                        </div>
                    ))}
                    {designers?.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl">
                            No designers found. Add one to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Designer' : 'Add New Designer'}</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Designer Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Social Media Link (Optional)</label>
                                <input
                                    type="url"
                                    name="socialMedia"
                                    value={formData.socialMedia}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. https://instagram.com/designer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Photo</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="h-40 mx-auto object-cover rounded" />
                                    ) : (
                                        <div className="py-8 text-slate-400">
                                            <Upload className="mx-auto mb-2" size={32} />
                                            <span className="text-sm">Click to upload photo</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || (!isEditing && !formData.image)}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Designer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FashionDesigners;
