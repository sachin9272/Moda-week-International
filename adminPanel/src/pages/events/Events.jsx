import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Pencil, Trash2, Eye, Calendar, MapPin, Search, Plus, Loader, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { optimizeCloudinaryImage } from '../../utils/cloudinary';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/events/all`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'published' ? event.status === 'published' : event.status !== 'published');
        const matchesSearch = event.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const initiateDelete = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/events/delete/${eventToDelete._id}`);
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
            const newStatus = event.status === 'published' ? 'draft' : 'published';
            await axios.patch(`${API_BASE_URL}/api/events/update-status/${event._id}`, {
                status: newStatus
            });

            // Update local state
            setEvents(events.map(e => e._id === event._id ? { ...e, status: newStatus } : e));
            toast.success(`Event ${newStatus === 'published' ? 'Published' : 'Drafted'}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdatingStatusId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Events Management</h1>
                    <p className="text-neutral-500 mt-1">Full control over event locations, statuses and details</p>
                </div>
                <Link
                    to="/events/add"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-5 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    <Plus size={20} /> Add Event
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#2a2a2a] flex flex-col md:flex-row gap-4 shadow-xl">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7913E] transition-colors"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#0f0f0f] text-white px-4 py-2.5 rounded-xl border border-[#2a2a2a] focus:outline-none focus:border-[#C7913E] transition-colors min-w-[150px]"
                >
                    <option value="ALL">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
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
                    <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                    <p className="text-neutral-500">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl border border-[#2a2a2a] hover:border-[#C7913E]/40 transition-all flex flex-col group">
                            <div className="relative h-56 overflow-hidden">
                                <img src={optimizeCloudinaryImage(event.thumbnail?.url || event.thumbnail, { width: 900, height: 500, crop: 'fill' })} alt={event.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Link
                                        to={`/events/preview/${event._id}`}
                                        className="bg-black/40 hover:bg-[#C7913E] text-white p-2 rounded-xl transition-all backdrop-blur-md border border-white/10"
                                        title="Preview Event"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </div>

                                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                                    <div>
                                        <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider w-fit mb-2 shadow-lg text-white ${event.eventType === 'past' ? 'bg-red-500' :
                                                event.eventType === 'global' ? 'bg-green-500' : 'bg-[#C7913E]'
                                            }`}>
                                            {event.eventType || 'upcoming'}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                                            {event.city}
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={() => toggleStatus(event)}
                                            disabled={updatingStatusId === event._id}
                                            className={`w-9 h-5 rounded-full flex items-center transition-all p-1 ${event.status === 'published' ? 'bg-green-500/20 border border-green-500/50' : 'bg-neutral-900 border border-neutral-700'}`}
                                        >
                                            {updatingStatusId === event._id ? (
                                                <Loader className="w-3 h-3 text-white animate-spin mx-auto" />
                                            ) : (
                                                <div className={`w-3 h-3 rounded-full shadow-md transform transition-all duration-300 ${event.status === 'published' ? 'translate-x-4 bg-green-500' : 'translate-x-0 bg-neutral-500'}`} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-neutral-300 font-bold mb-1 line-clamp-1">{event.eventName}</p>
                                <div className="flex items-center gap-2 text-neutral-500 text-sm mb-6">
                                    <Calendar size={14} className="text-[#C7913E]" />
                                    {event.date}
                                </div>

                                <div className="flex justify-between items-center mt-auto border-t border-[#2a2a2a] pt-5 gap-3">
                                    <Link
                                        to={`/events/edit/${event._id}`}
                                        className="flex-1 bg-[#C7913E]/10 hover:bg-[#C7913E] text-[#C7913E] hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#C7913E]/20"
                                    >
                                        <Pencil size={16} />
                                        <span className="font-bold text-sm text-[#C7913E] group-hover:text-white">Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => initiateDelete(event)}
                                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Event?</h3>
                            <p className="text-neutral-400 text-center mb-6">
                                Are you sure you want to remove <span className="font-bold text-white uppercase tracking-tight">"{eventToDelete?.city}"</span>? This action cannot be undone.
                            </p>
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
                                        <Loader size={20} className="animate-spin" />
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

export default Events;
