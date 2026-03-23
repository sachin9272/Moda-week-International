import React, { useState, useEffect } from 'react';
import { Save, Loader, Check, Upload, X } from 'lucide-react';
import { baseURL } from '../../config/api';
import toast from 'react-hot-toast';

const UpcomingEventHeroManager = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
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
            const response = await fetch(`${baseURL}/api/upcoming-event-hero`);
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
            toast.error('Failed to load content');
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
        setSaved(false);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('description', formData.description);
            data.append('removeImage', currentImage === '' && !imageFile);
            if (imageFile) {
                data.append('image', imageFile);
            }

            const response = await fetch(`${baseURL}/api/upcoming-event-hero`, {
                method: 'PUT',
                body: data
            });

            if (response.ok) {
                const updated = await response.json();
                setCurrentImage(updated.hero.image);
                setImageFile(null);
                setSaved(true);
                toast.success('Content updated successfully!');
                setTimeout(() => setSaved(false), 3000);
            } else {
                toast.error('Failed to update content');
            }
        } catch (error) {
            console.error('Error updating:', error);
            toast.error('Error updating content');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin text-[#C7913E]" size={40} />
        </div>
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Upcoming Events Page Header</h2>
                <p className="text-neutral-500">Update the top section of the Upcoming Events page</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-[#2a2a2a] max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1">Title (Big Text)</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1">Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
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
                            rows="6"
                            className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-3">Hero Image</label>
                        {(imageFile || currentImage) ? (
                            <div className="space-y-3">
                                <div className="relative max-w-md">
                                    <img
                                        src={imageFile ? URL.createObjectURL(imageFile) : currentImage}
                                        alt="Upcoming events hero"
                                        className="w-full h-56 object-cover rounded-xl border border-[#2a2a2a]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setCurrentImage('');
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-2 text-sm text-[#C7913E] hover:bg-[#151515]">
                                    <Upload size={16} />
                                    Replace image
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                        ) : (
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2a2a2a] bg-[#0f0f0f] px-6 py-10 text-center hover:border-[#C7913E] hover:bg-[#151515]">
                                <Upload className="mb-3 text-[#C7913E]" size={24} />
                                <span className="text-sm font-medium text-white">Upload hero image</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7913E]/20"
                        >
                            {submitting ? (
                                <Loader className="animate-spin" size={20} />
                            ) : saved ? (
                                <Check size={20} />
                            ) : (
                                <Save size={20} />
                            )}
                            {saved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpcomingEventHeroManager;
