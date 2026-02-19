import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config/api";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BuyTickets = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dummy Data for UI Visualization
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseURL}/api/upcoming-events/all?status=live`);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="bg-white min-h-screen text-black">
            <Navbar />

            {/* Hero Section */}
            <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center py-10 md:py-0 px-6">
                <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
                    <h1 className="text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase mb-6">
                        UPCOMING EVENTS
                    </h1>
                    <p className="max-w-2xl text-[14px] md:text-[18px] text-black leading-7">
                        Secure your spot at the world's most exclusive fashion events.
                        Experience the runway, the glamour, and the networking opportunities.
                    </p>
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-6 py-12 pb-20">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
                        <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No Upcoming Events Found</h3>
                        <p className="text-gray-500 mt-2">Check back later for new dates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={event.coverImage?.url || "https://via.placeholder.com/400x300"}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                                    {/* Date Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#C7913E] shadow-sm">
                                        {event.eventDate}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#C7913E] transition-colors leading-tight">
                                        {event.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm font-medium">
                                        <MapPin size={16} className="text-[#C7913E]" />
                                        <span className="uppercase tracking-wide">{event.location}</span>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                                        {event.description || "Join us for an unforgettable evening of fashion and style."}
                                    </p>

                                    <Link
                                        to={`/event-tickets/${event.slug || event._id}?mode=tickets`}
                                        className="block w-full py-4 text-center text-sm font-bold uppercase tracking-widest text-[#C7913E] border border-[#C7913E] rounded hover:bg-[#C7913E] hover:text-white transition-all duration-300"
                                    >
                                        Get Tickets
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BuyTickets;
