import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Pencil, Trash2, Loader2, ArrowLeft, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const UpcomingEventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/upcoming-events/all`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching upcoming events:", error);
            toast.error("Failed to fetch events");
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
            await axios.delete(`${API_BASE_URL}/api/upcoming-events/delete/${eventToDelete._id}`);
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

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/events')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold">Upcoming Events</h1>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link
                        to="/events/upcoming/add"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
                    >
                        + Add Upcoming Event
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[60vh] text-center border-2 border-dashed border-gray-700 rounded-lg">
                    <p className="text-gray-400 text-xl font-medium">No upcoming events found</p>
                    <p className="text-gray-500 mt-2">Create one to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            onClick={() => navigate(`/events/upcoming/dashboard/${event._id}`)}
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 relative flex flex-col h-full cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={event.coverImage?.url || "https://via.placeholder.com/400x200?text=No+Image"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-60" />

                                <div className="absolute top-3 right-3 flex gap-2 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/events/upcoming/edit/${event._id}`);
                                        }}
                                        className="p-2 bg-white/10 hover:bg-blue-600 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/20 hover:border-blue-500"
                                        title="Edit Event"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            initiateDelete(event);
                                        }}
                                        className="p-2 bg-white/10 hover:bg-red-600 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/20 hover:border-red-500"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {event.ticketTypes?.length > 0 && (
                                    <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                                        <Ticket size={12} />
                                        {event.ticketTypes.length} Ticket Types
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-grow relative">
                                <div className="mb-3">
                                    <h2 className="text-xl font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors" title={event.title}>
                                        {event.title}
                                    </h2>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-gray-300 text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                                        <span className="line-clamp-1">{event.location}</span>
                                    </p>
                                    <p className="text-gray-400 text-xs flex items-center gap-2 font-mono">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                                        {event.eventDate}
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-700/50 flex justify-between items-center">
                                    <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        View Dashboard <ArrowLeft className="rotate-180" size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-white">{eventToDelete?.title}</span>? This action cannot be undone.
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
            )}
        </div>
    );
};

export default UpcomingEventsList;
