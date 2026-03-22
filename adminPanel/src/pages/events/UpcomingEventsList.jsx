import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Pencil, Trash2, ArrowLeft, Ticket, Loader, Calendar, MapPin, ChevronRight, Search, Plus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { optimizeCloudinaryImage } from '../../utils/cloudinary';

const UpcomingEventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState(false);
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
        setDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/upcoming-events/delete/${eventToDelete._id}`);
            setEvents(events.filter(event => event._id !== eventToDelete._id));
            toast.success('Event deleted successfully');
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
        } finally {
            setDeleting(false);
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        }
    };

    const toggleStatus = async (event) => {
        setUpdatingStatusId(event._id);
        try {
            const newStatus = event.status === 'live' ? 'hidden' : 'live';
            // Optimistic update
            const updatedEvents = events.map(e =>
                e._id === event._id ? { ...e, status: newStatus } : e
            );
            setEvents(updatedEvents);

            const formData = new FormData();
            formData.append('status', newStatus);

            await axios.put(`${API_BASE_URL}/api/upcoming-events/update/${event._id}`, formData);
            toast.success(`Event is now ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
            fetchEvents(); // Revert on error
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/events')}
                        className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-xl border border-[#2a2a2a] text-neutral-400 hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Upcoming Events</h1>
                        <p className="text-neutral-500 mt-1">Manage ticketed events and live event dashboards</p>
                    </div>
                </div>
                <Link
                    to="/events/upcoming/add"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-5 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    <Plus size={20} /> Add Event
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                    type="text"
                    placeholder="Search events by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#C7913E]/20 focus:border-[#C7913E] transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="w-10 h-10 text-[#C7913E] animate-spin" />
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[50vh] text-center bg-[#1a1a1a] border border-[#2a2a2a] border-dashed rounded-2xl p-12">
                    <div className="w-20 h-20 bg-[#252525] rounded-full flex items-center justify-center mb-6">
                        <Calendar size={32} className="text-neutral-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
                    <p className="text-neutral-500 max-w-sm mx-auto">Create your first ticketed event to start selling and managing bookings.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all flex flex-col group">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={optimizeCloudinaryImage(event.coverImage?.url || "https://via.placeholder.com/400x200?text=No+Image", { width: 900, height: 500, crop: 'fill' })}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent"></div>

                                <div className="absolute top-3 right-3 flex gap-2">
                                    <Link
                                        to={`/events/preview/${event._id}`}
                                        className="bg-black/40 hover:bg-[#C7913E] text-white p-2 rounded-lg transition-colors backdrop-blur-md border border-white/10"
                                        title="Preview Event"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </div>

                                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                    <div>
                                        <div className="bg-[#C7913E] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.1em] w-fit mb-1.5 shadow-lg">
                                            UPCOMING
                                        </div>
                                        <h2 className="text-2xl font-bold text-white drop-shadow-md">
                                            {event.title}
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] font-bold tracking-widest uppercase ${event.status === 'live' ? 'text-green-500' : 'text-neutral-500'}`}>
                                            {event.status === 'live' ? 'Live' : 'Hidden'}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStatus(event);
                                            }}
                                            disabled={updatingStatusId === event._id}
                                            className={`w-9 h-5 rounded-full flex items-center transition-all p-1 ${event.status === 'live' ? 'bg-green-500/20 border border-green-500/50' : 'bg-neutral-900 border border-neutral-700'}`}
                                        >
                                            {updatingStatusId === event._id ? (
                                                <Loader className="w-3 h-3 text-white animate-spin mx-auto" />
                                            ) : (
                                                <div className={`w-3 h-3 rounded-full shadow-md transform transition-all duration-300 ${event.status === 'live' ? 'translate-x-4 bg-green-500' : 'translate-x-0 bg-neutral-500'}`} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>



                            <div className="p-5 flex flex-col flex-grow">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2.5 text-neutral-400 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center text-[#C7913E]">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="font-medium">{event.eventDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-neutral-400 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center text-[#C7913E]">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-medium line-clamp-1">{event.title}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-auto border-t border-[#2a2a2a] pt-4 gap-3">
                                    <Link
                                        to={`/events/upcoming/edit/${event._id}`}
                                        className="flex-1 bg-[#C7913E]/10 hover:bg-[#C7913E] text-[#C7913E] hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-[#C7913E]/20"
                                    >
                                        <Pencil size={16} />
                                        <span className="font-semibold text-sm">Edit Event</span>
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            initiateDelete(event);
                                        }}
                                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 border border-red-500/20"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Upcoming Event?</h3>
                            <p className="text-neutral-400 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-white font-bold text-center text-lg truncate px-4 mb-6 uppercase tracking-tight">
                                {eventToDelete?.title}
                            </p>
                            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4 mb-6 text-center">
                                <p className="text-xs text-red-400/80 leading-relaxed font-medium">
                                    <span className="font-bold uppercase tracking-widest block mb-1">Permanent Removal</span>
                                    This will delete all sales data, ticket inventory, and the entire public sales page for this event.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEventsList;
