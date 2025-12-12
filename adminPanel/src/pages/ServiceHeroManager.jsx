import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { baseURL } from '../config/api';

const ServiceHeroManager = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const response = await fetch(`${baseURL}/api/service-hero`);
            const data = await response.json();
            setFormData({
                title: data.title || '',
                subtitle: data.subtitle || '',
                description: data.description || ''
            });
            setCurrentImage(data.image);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hero data:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('description', formData.description);
            if (imageFile) {
                data.append('image', imageFile);
            }

            const response = await fetch(`${baseURL}/api/service-hero`, {
                method: 'PUT',
                body: data
            });

            if (response.ok) {
                const updated = await response.json();
                setCurrentImage(updated.hero.image);
                setImageFile(null);
                alert('Updated successfully!');
            } else {
                alert('Failed to update.');
            }
        } catch (error) {
            console.error('Error updating:', error);
            alert('Error updating.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader className="animate-spin" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Service Page Hero</h1>
                <p className="text-slate-500">Update the top section of the Service page</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle (Small Text)</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title (Big Text)</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Background Image</label>
                        {currentImage && (
                            <div className="mb-4">
                                <img src={currentImage} alt="Current Hero" className="h-48 rounded-lg object-cover" />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceHeroManager;
