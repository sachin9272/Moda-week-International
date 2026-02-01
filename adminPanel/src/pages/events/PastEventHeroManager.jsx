import React, { useState, useEffect } from 'react';
import { Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { baseURL } from '../../config/api';

const PastEventHeroManager = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const response = await fetch(`${baseURL}/api/past-event-hero`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    title: data.title || '',
                    description: data.description || ''
                });
            }
        } catch (error) {
            console.error('Error fetching hero data:', error);
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSaved(false);

        try {
            const response = await fetch(`${baseURL}/api/past-event-hero`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-[#C7913E]" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Past Event Page Header</h1>
                    <p className="text-neutral-400">Manage the title and description for the Past Events page.</p>
                </div>
                {saved && (
                    <div className="flex items-center text-green-500 bg-green-500/10 px-4 py-2 rounded-lg">
                        <CheckCircle size={20} className="mr-2" />
                        <span>Changes Saved</span>
                    </div>
                )}
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

                    <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`
                                flex items-center px-6 py-2.5 rounded-xl font-medium transition-all
                                ${submitting
                                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                    : 'bg-[#C7913E] text-white hover:bg-[#b58135] shadow-lg shadow-[#C7913E]/20'
                                }
                            `}
                        >
                            {submitting ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PastEventHeroManager;
