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
    const dummyEvents = [
        {
            _id: "dummy-1",
            eventName: "Paris Fashion Week 2025",
            date: "Sep 25, 2025",
            city: "Paris",
            thumbnail: { url: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=2059&auto=format&fit=crop" },
            descriptionSection: { text: "Experience the epitome of haute couture in the fashion capital of the world." },
            headerVideo: { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" },
            tickets: [
                { _id: "t1", type: "Student", price: 100, currency: "EUR" },
                { _id: "t2", type: "General", price: 500, currency: "EUR" },
                { _id: "t3", type: "VIP", price: 1500, currency: "EUR" }
            ]
        },
        {
            _id: "dummy-2",
            eventName: "Milan Runway Galaxy",
            date: "Feb 20, 2025",
            city: "Milan",
            thumbnail: { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070&auto=format&fit=crop" },
            descriptionSection: { text: "Witness the avant-garde designs that define Italian luxury and craftsmanship." },
            headerVideo: { url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" },
            tickets: [
                { _id: "t1", type: "General", price: 400, currency: "EUR" },
                { _id: "t2", type: "VIP", price: 1200, currency: "EUR" }
            ]
        },
        {
            _id: "dummy-3",
            eventName: "Tokyo Style Summit",
            date: "Mar 15, 2025",
            city: "Tokyo",
            thumbnail: { url: "https://images.unsplash.com/photo-1529139574466-a302d2052505?q=80&w=2070&auto=format&fit=crop" },
            descriptionSection: { text: "A fusion of traditional aesthetics and futuristic street style." },
            headerVideo: { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" },
            tickets: [
                { _id: "t1", type: "Student", price: 80, currency: "USD" },
                { _id: "t2", type: "General", price: 250, currency: "USD" }
            ]
        },
        {
            _id: "dummy-4",
            eventName: "NYC Fashion Week 2025",
            date: "Oct 15, 2025",
            city: "New York City",
            thumbnail: { url: "https://images.unsplash.com/photo-1542295474-323b7e614131?q=80&w=2070&auto=format&fit=crop" },
            descriptionSection: { text: "Join us for the most anticipated fashion event of the year." },
            headerVideo: { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2670&auto=format&fit=crop" },
            tickets: [
                { _id: "t1", type: "Student", price: 50, currency: "USD" },
                { _id: "t2", type: "General", price: 150, currency: "USD" },
                { _id: "t3", type: "VIP", price: 450, currency: "USD" }
            ]
        }
    ];

    useEffect(() => {
        // Use dummy data immediately as requested by user
        setEvents(dummyEvents);

        // Original fetch logic commented out for UI demo
        /*
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/events?limit=100`);
                const upcoming = response.data.events.filter(
                    (e) => e.eventType === "upcoming" || e.hasTickets
                );
                // If API returns empty, we could fallback to dummy, but user wants dummy now.
                if (upcoming.length > 0) setEvents(upcoming);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
        */
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
                                        src={event.thumbnail?.url}
                                        alt={event.eventName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                                    {/* Date Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#C7913E] shadow-sm">
                                        {event.date}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#C7913E] transition-colors leading-tight">
                                        {event.eventName}
                                    </h3>

                                    <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm font-medium">
                                        <MapPin size={16} className="text-[#C7913E]" />
                                        <span className="uppercase tracking-wide">{event.city}</span>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                                        {event.descriptionSection?.text || "Join us for an unforgettable evening of fashion and style."}
                                    </p>

                                    <Link
                                        to={`/event-tickets/${event._id}`}
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
