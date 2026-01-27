import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Upload, X, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../../utils/imageCompression';

const AddUpcomingEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        eventDate: '',
        location: '',
        description: '',
        coverImage: null,
        ticketTypes: []
    });

    const [currentTicket, setCurrentTicket] = useState({
        name: '',
        price: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];

            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error("File size too large. Maximum is 10MB for videos.");
                e.target.value = '';
                return;
            }
            setFormData(prev => ({ ...prev, coverImage: file }));
        }
    };

    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket(prev => ({ ...prev, [name]: value }));
    };

    const addTicket = () => {
        if (currentTicket.name && currentTicket.price) {
            setFormData(prev => ({
                ...prev,
                ticketTypes: [...prev.ticketTypes, currentTicket]
            }));
            setCurrentTicket({ name: '', price: '', description: '' });
        } else {
            toast.error("Ticket must have a Name and Price.");
        }
    };

    const removeTicket = (index) => {
        setFormData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.eventDate || !formData.location) {
            toast.error("Please fill in all required fields (Title, Date, Location)");
            return;
        }

        if (!formData.coverImage) {
            toast.error("Cover Image is required");
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('eventDate', formData.eventDate);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('coverImage', formData.coverImage);
        data.append('ticketTypes', JSON.stringify(formData.ticketTypes));

        try {
            await axios.post(`${API_BASE_URL}/api/upcoming-events/create`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Upcoming Event created successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 1000);
        } catch (error) {
            console.error('Error creating upcoming event:', error);
            toast.error('Failed to create upcoming event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold">Add Upcoming Event</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Event Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Title <span className="text-red-500">*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Event Date <span className="text-red-500">*</span></label>
                            <input type="text" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" placeholder="e.g. October 15, 2026" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Location <span className="text-red-500">*</span></label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white min-h-[100px]" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Cover Image <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-900">
                                {formData.coverImage ? (
                                    <div className="relative">
                                        <img
                                            src={URL.createObjectURL(formData.coverImage)}
                                            alt="Preview"
                                            className="max-h-64 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
                                            className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full text-white"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-blue-400">Click to upload</span>
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Ticket Types</h2>
                    <div className="flex gap-4 mb-4 items-end">
                        <div className="flex-1">
                            <label className="block text-gray-400 mb-1">Ticket Name</label>
                            <input type="text" name="name" value={currentTicket.name} onChange={handleTicketChange} className="w-full p-2 bg-gray-700 rounded text-white" placeholder="e.g. VIP" />
                        </div>
                        <div className="w-32">
                            <label className="block text-gray-400 mb-1">Price</label>
                            <input type="number" name="price" value={currentTicket.price} onChange={handleTicketChange} className="w-full p-2 bg-gray-700 rounded text-white" placeholder="0.00" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-400 mb-1">Description</label>
                            <input type="text" name="description" value={currentTicket.description} onChange={handleTicketChange} className="w-full p-2 bg-gray-700 rounded text-white" placeholder="Includes..." />
                        </div>
                        <button type="button" onClick={addTicket} className="bg-blue-600 p-2 rounded hover:bg-blue-700 text-white h-[42px]">
                            <Plus />
                        </button>
                    </div>

                    {formData.ticketTypes.length > 0 && (
                        <div className="space-y-2">
                            {formData.ticketTypes.map((ticket, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                                    <div>
                                        <p className="font-bold text-white">{ticket.name} - ${ticket.price}</p>
                                        <p className="text-sm text-gray-400">{ticket.description}</p>
                                    </div>
                                    <button type="button" onClick={() => removeTicket(idx)} className="text-red-400 hover:text-red-300">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUpcomingEvent;
