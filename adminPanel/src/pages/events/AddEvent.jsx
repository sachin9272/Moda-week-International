import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Upload, X } from 'lucide-react';

const AddEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        city: '',
        eventName: '',
        date: '',
        eventType: 'upcoming',
        thumbnail: null,
        headerVideo: null,
        collections: [],
        bottomSection: {
            image: null,
            title: '',
            text: ''
        }
    });

    const [currentCollection, setCurrentCollection] = useState({
        title: '',
        subtitle: '',
        images: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bottomSection.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                bottomSection: {
                    ...prev.bottomSection,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            if (name === 'bottomSection.image') {
                setFormData(prev => ({
                    ...prev,
                    bottomSection: {
                        ...prev.bottomSection,
                        image: files[0]
                    }
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: files[0] }));
            }
        }
    };

    const handleCollectionChange = (e) => {
        const { name, value } = e.target;
        setCurrentCollection(prev => ({ ...prev, [name]: value }));
    };

    const handleCollectionImages = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setCurrentCollection(prev => ({
                ...prev,
                images: [...prev.images, ...newFiles]
            }));
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
            setCurrentCollection({ title: '', subtitle: '', images: [] });
        } else {
            alert("Collection must have a title and at least one image.");
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
        setLoading(true);

        const data = new FormData();
        data.append('city', formData.city);
        data.append('eventName', formData.eventName);
        data.append('date', formData.date);
        data.append('eventType', formData.eventType);

        if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);
        if (formData.headerVideo) data.append('headerVideo', formData.headerVideo);

        const bottomSectionData = {
            title: formData.bottomSection.title,
            text: formData.bottomSection.text
        };
        data.append('bottomSection', JSON.stringify(bottomSectionData));
        if (formData.bottomSection.image) {
            data.append('bottomSectionImage', formData.bottomSection.image);
        }

        const collectionsMeta = formData.collections.map(col => ({
            title: col.title,
            subtitle: col.subtitle
        }));
        data.append('collections', JSON.stringify(collectionsMeta));

        formData.collections.forEach((col, index) => {
            col.images.forEach((file) => {
                data.append(`collectionImages_${index}`, file);
            });
        });

        try {
            await axios.post(`${API_BASE_URL}/api/events/create`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Event created successfully!');
            navigate('/events');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen text-black">
            <h1 className="text-3xl font-bold mb-6">Add New Event</h1>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Event Name</label>
                            <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <input type="text" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Event Type</label>
                            <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded text-white">
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                                <option value="global">Global</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Thumbnail Image</label>
                            <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="w-full p-2 bg-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Header Video (Optional)</label>
                            <input type="file" name="headerVideo" accept="video/*" onChange={handleFileChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Collections (Designers/Photos)</h2>

                    <div className="mb-4 space-y-4 border p-4 border-gray-600 rounded">
                        <h3 className="font-semibold">Add New Collection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="title" value={currentCollection.title} onChange={handleCollectionChange} placeholder="Title (e.g., Designer Name)" className="w-full p-2 bg-gray-700 rounded text-white" />
                            <input type="text" name="subtitle" value={currentCollection.subtitle} onChange={handleCollectionChange} placeholder="Subtitle (optional)" className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-400 text-sm">Upload Images</label>
                            <input type="file" multiple accept="image/*" onChange={handleCollectionImages} className="w-full p-2 bg-gray-700 rounded text-white" />
                        </div>

                        {currentCollection.images.length > 0 && (
                            <div className="flex gap-2 bg-gray-900 p-2 overflow-x-auto rounded">
                                {currentCollection.images.map((file, idx) => (
                                    <div key={idx} className="relative shrink-0">
                                        <img src={URL.createObjectURL(file)} alt="Preview" className="h-20 w-auto object-cover rounded" />
                                        <button type="button" onClick={() => removeCollectionImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5"><X size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" onClick={addCollection} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-2">Save Collection to Event</button>
                    </div>

                    {formData.collections.length > 0 && (
                        <div className="space-y-4 mt-4">
                            {formData.collections.map((col, idx) => (
                                <div key={idx} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{col.title} <span className="text-sm font-normal text-gray-400">({col.subtitle})</span></div>
                                        <div className="text-xs text-gray-400">{col.images.length} images</div>
                                    </div>
                                    <button type="button" onClick={() => removeCollection(idx)} className="text-red-400 hover:text-red-300">Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Bottom Section (Recap)</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <input type="file" name="bottomSection.image" accept="image/*" onChange={handleFileChange} className="w-full p-2 bg-gray-700 rounded text-white" />
                        <input type="text" name="bottomSection.title" value={formData.bottomSection.title} onChange={handleInputChange} placeholder="Title" className="w-full p-2 bg-gray-700 rounded text-white" />
                        <textarea name="bottomSection.text" value={formData.bottomSection.text} onChange={handleInputChange} placeholder="Description Text" rows="4" className="w-full p-2 bg-gray-700 rounded text-white" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded text-lg flex justify-center items-center">
                    {loading ? 'Creating Event & Uploading...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
};

export default AddEvent;
