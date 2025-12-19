import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Loader } from 'lucide-react';

const ServiceTypeManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 0
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchServices = async () => {
        try {
            const response = await fetch('https://api.modaweekinternational.com/api/service-types');
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
                ? `https://api.modaweekinternational.com/api/service-types/${editingId}`
                : 'https://api.modaweekinternational.com/api/service-types';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                resetForm();
                fetchServices();
            } else {
                const err = await response.json();
                alert(`Failed: ${err.message}`);
            }
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Error saving service');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await fetch(`https://api.modaweekinternational.com/api/service-types/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchServices();
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Primary Service Types</h2>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : <><Plus size={20} /> Add Service</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                                <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Image {editingId && '(Optional)'}</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} required={!editingId} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-600">Cancel</button>}
                            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                                {submitting ? 'Saving...' : 'Save Service'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Order: {service.order}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(service)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(service._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceTypeManagement;
