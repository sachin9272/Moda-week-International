import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config/api";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

const BuyTickets = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dummy Data for UI Visualization
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseURL}/api/upcoming-events/all`, {
                    params: { status: 'live', _t: Date.now() },
                    headers: {
                        'Cache-Control': 'no-cache',
                        Pragma: 'no-cache'
                    }
                });
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
                            <Link
                                key={event._id}
                                to={`/event-details/${event.slug || event._id}?mode=tickets`}
                                className="group cursor-pointer flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden aspect-[3/4] mb-6">
                                    <img
                                        src={optimizeCloudinaryImage(event.coverImage?.url || "https://via.placeholder.com/400x300", { width: 720, height: 960, crop: "fill" })}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col grow">
                                    <h3 className="text-xl md:text-2xl font-[Inter] font-semibold mb-2 uppercase leading-tight group-hover:text-[#C7913E] transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray-500 text-xs tracking-widest uppercase mb-4 font-semibold">
                                        {event.eventDate}
                                    </p>

                                    {event.description && (
                                        <p
                                            className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: event.description,
                                            }}
                                        />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BuyTickets;
