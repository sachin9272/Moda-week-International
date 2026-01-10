import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Pencil, Trash2 } from 'lucide-react';

import toast from 'react-hot-toast';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/all`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const initiateDelete = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/events/delete/${eventToDelete._id}`);
            setEvents(events.filter(event => event._id !== eventToDelete._id));
            toast.success('Event deleted successfully');
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
        } finally {
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        }
    };

    const toggleStatus = async (event) => {
        try {
            const newStatus = event.status === 'published' ? 'draft' : 'published';
            const response = await axios.patch(`${API_BASE_URL}/api/events/update-status/${event._id}`, {
                status: newStatus
            });

            // Update local state
            setEvents(events.map(e => e._id === event._id ? { ...e, status: newStatus } : e));
            toast.success(`Event ${newStatus === 'published' ? 'Published' : 'Drafted'}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Events</h1>
                <Link
                    to="/events/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Add Event
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 relative">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.eventType === 'past' ? 'bg-red-500' :
                                    event.eventType === 'global' ? 'bg-green-500' : 'bg-blue-500'
                                    } text-white`}>
                                    {event.eventType || 'upcoming'}
                                </span>
                            </div>
                            <img src={event.thumbnail?.url || event.thumbnail} alt={event.city} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Link to={`/events/preview/${event._id}`} className="hover:underline">
                                        <h2 className="text-xl font-bold text-white">{event.city}</h2>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 uppercase">{event.status === 'published' ? 'Live' : 'Hidden'}</span>
                                        <button
                                            onClick={() => toggleStatus(event)}
                                            className={`w-10 h-5 rounded-full flex items-center transition-colors p-1 ${event.status === 'published' ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${event.status === 'published' ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-2">{event.eventName}</p>
                                <p className="text-gray-500 text-sm mb-4">{event.date}</p>

                                <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-4 gap-3">
                                    <Link
                                        to={`/events/edit/${event._id}`}
                                        className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <Pencil size={16} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => initiateDelete(event)}
                                        className="flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <p className="text-gray-400">No events found.</p>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-white">{eventToDelete?.eventName}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Events;
