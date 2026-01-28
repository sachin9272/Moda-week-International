import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Upload, X, ArrowLeft, Plus, Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../../utils/imageCompression';

const EditUpcomingEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        eventDate: '',
        location: '',
        description: '',
        coverImage: null,
        ticketTypes: [],
        collections: [],
        hasTickets: false
    });

    const [currentTicket, setCurrentTicket] = useState({
        name: '',
        price: '',
        description: ''
    });

    const [currentCollection, setCurrentCollection] = useState({
        title: '',
        subtitle: '',
        description: '',
        designerId: null,
        designerImage: null,
        layout: 'carousel',
        gridAspectRatio: 'portrait',
        images: []
    });

    const [designers, setDesigners] = useState([]);

    useEffect(() => {
        const fetchDesigners = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/fashion-designers?limit=100`);
                setDesigners(response.data.designers || []);
            } catch (error) {
                console.error("Error fetching designers:", error);
            }
        };
        fetchDesigners();
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/upcoming-events/${id}`);
                const event = response.data;
                setFormData({
                    title: event.title,
                    eventDate: event.eventDate,
                    location: event.location,
                    description: event.description || '',
                    coverImage: event.coverImage?.url || null,
                    ticketTypes: event.ticketTypes || [],
                    collections: (event.collections || []).map(col => ({
                        ...col,
                        designerImage: col.designerImage?.url || col.designerImage,
                        images: (col.images || []).map(img => typeof img === 'string' ? img : img.url)
                    })),
                    hasTickets: event.hasTickets || false
                });
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to load event details");
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const handleDesignerSelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        const designer = designers.find(d => d._id === selectedId);
        if (designer) {
            setCurrentCollection(prev => ({
                ...prev,
                title: designer.name,
                description: designer.bio,
                designerId: designer._id,
                designerImage: designer.image?.url
            }));
        }
    };

    const handleCollectionChange = (e) => {
        const { name, value } = e.target;
        setCurrentCollection(prev => ({ ...prev, [name]: value }));
    };

    const handleCollectionImages = async (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const processedFiles = [];

            for (const file of newFiles) {
                if (file.type.startsWith('image/')) {
                    const compressed = await compressImageIfNeeded(file);
                    processedFiles.push(compressed);
                } else if (file.size > 10 * 1024 * 1024) {
                    toast.error(`${file.name} is too large. Maximum is 10MB for videos.`);
                } else {
                    processedFiles.push(file);
                }
            }

            if (processedFiles.length > 0) {
                setCurrentCollection(prev => ({
                    ...prev,
                    images: [...prev.images, ...processedFiles]
                }));
            }
            e.target.value = '';
        }
    };

    const handleDesignerImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                file = await compressImageIfNeeded(file);
            } else if (file.size > 10 * 1024 * 1024) {
                toast.error("File size too large. Maximum is 10MB.");
                e.target.value = '';
                return;
            }
            setCurrentCollection(prev => ({ ...prev, designerImage: file }));
        }
    };

    const removeCollectionImage = (index) => {
        setCurrentCollection(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addCollection = () => {
        if (currentCollection.title && currentCollection.images.length > 0) {
            setFormData(prev => ({
                ...prev,
                collections: [...prev.collections, currentCollection]
            }));
            setCurrentCollection({
                title: '',
                subtitle: '',
                description: '',
                designerId: null,
                designerImage: null,
                layout: 'carousel',
                gridAspectRatio: 'portrait',
                images: []
            });
        } else {
            toast.error("Collection must have a Title and at least one image.");
        }
    };

    const removeCollection = (index) => {
        setFormData(prev => ({
            ...prev,
            collections: prev.collections.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.eventDate || !formData.location) {
            toast.error("Please fill in all required fields (Title, Date, Location)");
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('eventDate', formData.eventDate);
        data.append('location', formData.location);
        data.append('description', formData.description);

        if (formData.coverImage instanceof File) {
            data.append('coverImage', formData.coverImage);
        }

        data.append('ticketTypes', JSON.stringify(formData.hasTickets ? formData.ticketTypes : []));
        data.append('hasTickets', formData.hasTickets);
        data.append('collections', JSON.stringify(formData.collections.map(col => ({
            ...col,
            images: col.images.filter(img => !(img instanceof File)),
            designerImage: col.designerImage instanceof File ? null : col.designerImage
        }))));

        formData.collections.forEach((col, index) => {
            col.images.forEach(img => {
                if (img instanceof File) {
                    data.append(`collectionImages_${index}`, img);
                }
            });
            if (col.designerImage instanceof File) {
                data.append(`collectionDesignerImage_${index}`, col.designerImage);
            }
        });

        try {
            await axios.put(`${API_BASE_URL}/api/upcoming-events/update/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Upcoming Event updated successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 1000);
        } catch (error) {
            console.error('Error updating upcoming event:', error);
            toast.error('Failed to update upcoming event.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-white">Loading...</div>;

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-3xl font-bold text-white">Edit Upcoming Event</h1>
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
                            <input type="text" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" />
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
                            <label className="block text-gray-400 mb-1">Cover Image</label>
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-900">
                                {formData.coverImage ? (
                                    <div className="relative">
                                        <img
                                            src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : formData.coverImage}
                                            alt="Preview"
                                            className="max-h-64 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
                                            className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full text-white"
                                            title="Remove Image"
                                        >
                                            <X size={16} />
                                        </button>
                                        {!(formData.coverImage instanceof File) && (
                                            <p className="text-center text-gray-400 text-sm mt-2">Current Image</p>
                                        )}
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-blue-400">Click to upload new image</span>
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`bg-gray-800 p-6 rounded-lg border border-gray-700 ${!formData.hasTickets ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Ticket Types</h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-gray-400 text-sm italic">Enable Tickets</span>
                            <input
                                type="checkbox"
                                name="hasTickets"
                                checked={formData.hasTickets}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                    <div className="flex gap-4 mb-4 items-end">
                        <div className="flex-1">
                            <label className="block text-gray-400 mb-1">Ticket Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentTicket.name}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-gray-400 mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={currentTicket.price}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-400 mb-1">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={currentTicket.description}
                                onChange={handleTicketChange}
                                className="w-full p-2 bg-gray-700 rounded text-white"
                                disabled={!formData.hasTickets}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addTicket}
                            className="bg-blue-600 p-2 rounded hover:bg-blue-700 text-white h-[42px]"
                            disabled={!formData.hasTickets}
                        >
                            <Plus />
                        </button>
                    </div>

                    {formData.hasTickets && formData.ticketTypes.length > 0 && (
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

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Designer Collections</h2>
                    </div>

                    <div className="space-y-6 mb-8 p-4 bg-gray-900 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Select Designer (Optional)</label>
                                <select onChange={handleDesignerSelect} className="w-full p-2 bg-gray-700 rounded text-white text-sm">
                                    <option value="">-- Choose Designer --</option>
                                    {designers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Collection Title <span className="text-red-500">*</span></label>
                                <input type="text" name="title" value={currentCollection.title} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm" placeholder="e.g. Summer Collection" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Subtitle</label>
                                <input type="text" name="subtitle" value={currentCollection.subtitle} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Aspect Ratio</label>
                                <select name="gridAspectRatio" value={currentCollection.gridAspectRatio} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm">
                                    <option value="portrait">Portrait (3:4)</option>
                                    <option value="landscape">Landscape (16:9)</option>
                                    <option value="square">Square (1:1)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 mb-1 text-sm">Designer Biography</label>
                                <textarea name="description" value={currentCollection.description} onChange={handleCollectionChange} className="w-full p-2 bg-gray-700 rounded text-white text-sm min-h-[60px]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Designer Image</label>
                                <div className="flex items-center gap-4">
                                    {currentCollection.designerImage && (
                                        <img src={typeof currentCollection.designerImage === 'string' ? currentCollection.designerImage : URL.createObjectURL(currentCollection.designerImage)} className="w-16 h-16 object-cover rounded shadow-lg border border-gray-600" />
                                    )}
                                    <label className="flex-1 cursor-pointer bg-gray-700 p-2 rounded border border-dashed border-gray-500 text-center hover:bg-gray-600 transition-colors">
                                        <span className="text-xs text-blue-400 flex items-center justify-center gap-2"><Upload size={14} /> Upload Designer Photo</span>
                                        <input type="file" onChange={handleDesignerImage} accept="image/*" className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Collection Images <span className="text-red-500">*</span></label>
                                <label className="cursor-pointer bg-blue-600/20 p-2 rounded border border-dashed border-blue-500/50 block text-center hover:bg-blue-600/30 transition-colors">
                                    <span className="text-xs text-blue-400 flex items-center justify-center gap-2"><Plus size={14} /> Add Images</span>
                                    <input type="file" multiple onChange={handleCollectionImages} accept="image/*" className="hidden" />
                                </label>
                            </div>
                        </div>

                        {currentCollection.images.length > 0 && (
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                {currentCollection.images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img instanceof File ? URL.createObjectURL(img) : img} className="w-full aspect-square object-cover rounded shadow-sm border border-gray-700" />
                                        <button type="button" onClick={() => removeCollectionImage(idx)} className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" onClick={addCollection} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow-lg transition-transform active:scale-[0.98]">
                            Add/Update Collection to Event
                        </button>
                    </div>

                    {formData.collections.length > 0 && (
                        <div className="space-y-3">
                            {formData.collections.map((col, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-700/50 p-3 rounded border border-gray-600">
                                    <div className="flex items-center gap-3">
                                        {col.designerImage && (
                                            <img src={typeof col.designerImage === 'string' ? col.designerImage : URL.createObjectURL(col.designerImage)} className="w-10 h-10 object-cover rounded shadow-sm" />
                                        )}
                                        <div>
                                            <p className="font-bold text-white text-sm leading-tight">{col.title}</p>
                                            <p className="text-xs text-gray-400">{col.images.length} images</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => {
                                            setCurrentCollection(col);
                                            removeCollection(idx);
                                        }} className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-900/20 rounded-full transition-colors">
                                            <Pencil size={16} />
                                        </button>
                                        <button type="button" onClick={() => removeCollection(idx)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-full transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50">
                        {submitting ? 'Updating...' : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUpcomingEvent;
