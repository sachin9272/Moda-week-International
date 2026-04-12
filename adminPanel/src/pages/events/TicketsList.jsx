import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL as API_BASE_URL } from '../../config/api';
import { Ticket, Loader, Calendar, MapPin, ChevronRight, Search, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { optimizeCloudinaryImage } from '../../utils/cloudinary';

const TicketsList = () => {
    const getUpcomingEventName = (event) => event.eventName || event.title;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredEvents = events.filter(event =>
        getUpcomingEventName(event)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#C7913E]/10 rounded-xl border border-[#C7913E]/20 text-[#C7913E]">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Ticket Management</h1>
                        <p className="text-neutral-500 mt-1">View sales stats and manage event tickets</p>
                    </div>
                </div>
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
                        <Ticket size={32} className="text-neutral-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No ticketed events found</h3>
                    <p className="text-neutral-500 max-w-sm mx-auto">Create an event in the Events section to start managing tickets.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div
                            key={event._id}
                            onClick={() => navigate(`/events/upcoming/dashboard/${event._id}`)}
                            className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl border border-[#2a2a2a] relative flex flex-col h-full cursor-pointer hover:border-[#C7913E]/40 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={optimizeCloudinaryImage(event.coverImage?.url || "https://via.placeholder.com/400x200?text=No+Image", { width: 900, height: 500, crop: 'fill' })}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent" />

                                <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${event.status === 'live' ? 'text-green-500' : 'text-neutral-500'}`}>
                                            {event.status === 'live' ? 'Live' : 'Hidden'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/tickets/edit/${event._id}`);
                                        }}
                                        className="rounded-lg border border-white/10 bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-[#C7913E]"
                                        title="Edit tickets"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-5 right-5 z-10">
                                    <div className="flex items-center gap-2 bg-[#C7913E] text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider w-fit mb-3">
                                        <Ticket size={12} />
                                        {event.ticketTypes?.length || 0} Ticket Classes
                                    </div>
                                    <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg group-hover:text-[#C7913E] transition-colors">
                                        {getUpcomingEventName(event)}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow bg-[#1a1a1a]">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center text-[#C7913E]">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-medium line-clamp-1">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center text-[#C7913E]">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="font-medium">{event.eventDate}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-5 border-t border-[#2a2a2a] flex justify-between items-center">
                                    <span className="text-[#C7913E] text-xs font-bold tracking-[0.1em] uppercase flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                        View Stats & Sales <ChevronRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketsList;
