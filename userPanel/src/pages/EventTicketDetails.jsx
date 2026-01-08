import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Check, Minus, Plus } from "lucide-react";

export default function EventTicketDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Mock Data for Details Page (Must match BuyTickets IDs)
        const dummyEvents = [
            {
                _id: "dummy-1",
                eventName: "Paris Fashion Week 2025",
                date: "Sep 25, 2025",
                city: "Paris",
                thumbnail: { url: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=2059&auto=format&fit=crop" },
                headerVideo: { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" },
                descriptionSection: { text: "Experience the epitome of haute couture in the fashion capital of the world. This exclusive event showcases the Spring/Summer collections from top luxury brands. Guests will enjoy a cocktail reception, runway show, and after-party." },
                tickets: [
                    { _id: "t1", type: "Student", price: 100, currency: "EUR", description: "Standing room only" },
                    { _id: "t2", type: "General", price: 500, currency: "EUR", description: "Standard seating" },
                    { _id: "t3", type: "VIP", price: 1500, currency: "EUR", description: "Front row & backstage access" }
                ]
            },
            {
                _id: "dummy-2",
                eventName: "Milan Runway Galaxy",
                date: "Feb 20, 2025",
                city: "Milan",
                thumbnail: { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070&auto=format&fit=crop" },
                headerVideo: { url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" },
                descriptionSection: { text: "Witness the avant-garde designs that define Italian luxury and craftsmanship. A showcase of innovation and tradition." },
                tickets: [
                    { _id: "t1", type: "General", price: 400, currency: "EUR", description: "Regular seating" },
                    { _id: "t2", type: "VIP", price: 1200, currency: "EUR", description: "Premium seating + gift bag" }
                ]
            },
            {
                _id: "dummy-3",
                eventName: "Tokyo Style Summit",
                date: "Mar 15, 2025",
                city: "Tokyo",
                thumbnail: { url: "https://images.unsplash.com/photo-1529139574466-a302d2052505?q=80&w=2070&auto=format&fit=crop" },
                headerVideo: { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" },
                descriptionSection: { text: "A fusion of traditional aesthetics and futuristic street style. The Tokyo Style Summit brings together the boldest voices in Asian fashion." },
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
                headerVideo: { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2670&auto=format&fit=crop" },
                descriptionSection: { text: "Join us for the most anticipated fashion event of the year. Featuring top designers from around the globe, exclusive runway shows, and networking opportunities with industry leaders." },
                tickets: [
                    { _id: "t1", type: "Student", price: 50, currency: "USD" },
                    { _id: "t2", type: "General", price: 150, currency: "USD" },
                    { _id: "t3", type: "VIP", price: 450, currency: "USD" }
                ]
            }
        ];

        const fetchEvent = async () => {
            try {
                if (id.startsWith("dummy-")) {
                    const mockEvent = dummyEvents.find(e => e._id === id);
                    if (mockEvent) {
                        setEvent(mockEvent);
                        setLoading(false);
                        return;
                    }
                }

                const response = await axios.get(`${baseURL}/api/events/get-event/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleQuantityChange = (ticketId, delta, price) => {
        setQuantities((prev) => {
            const currentQty = prev[ticketId] || 0;
            const newQty = Math.max(0, Math.min(10, currentQty + delta));
            return { ...prev, [ticketId]: newQty };
        });
    };

    useEffect(() => {
        if (!event || !event.tickets) return;
        let total = 0;
        event.tickets.forEach((ticket) => {
            const qty = quantities[ticket._id] || 0;
            total += qty * ticket.price;
        });
        setTotalPrice(total);
    }, [quantities, event]);

    const handleCheckout = () => {
        const selectedTickets = event.tickets
            .map(t => ({ ...t, qty: quantities[t._id] || 0 }))
            .filter(t => t.qty > 0);

        if (selectedTickets.length === 0) {
            alert("Please select at least one ticket.");
            return;
        }

        const summary = selectedTickets
            .map(t => `${t.qty}x ${t.type} ($${t.price})`)
            .join('\n');

        alert(`Checkout Simulated!\n\nEvent: ${event.eventName}\n\n${summary}\n\nTotal: $${totalPrice}`);
    };

    if (loading) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Loading...</div>;
    if (!event) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Event not found</div>;

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <img
                    src={event.headerVideo?.url || event.thumbnail?.url}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-6 pb-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{event.eventName}</h1>
                    <div className="flex flex-wrap gap-6 text-lg text-gray-200">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-amber-500" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="text-amber-500" />
                            <span>{event.city}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Description */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 text-amber-500">About the Event</h2>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p className="whitespace-pre-line">{event.descriptionSection?.text || "No description available."}</p>
                    </div>
                </div>

                {/* Right Column: Ticket Selection */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-6 sticky top-24">
                        <h3 className="text-2xl font-bold mb-6">Select Tickets</h3>

                        <div className="space-y-6">
                            {event.tickets && event.tickets.length > 0 ? (
                                event.tickets.map((ticket) => (
                                    <div key={ticket._id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg">{ticket.type} Pass</h4>
                                                <p className="text-amber-500 font-semibold">${ticket.price} {ticket.currency || 'USD'}</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-900 rounded-lg px-3 py-1">
                                                <button
                                                    onClick={() => handleQuantityChange(ticket._id, -1, ticket.price)}
                                                    className="p-1 hover:text-amber-500 disabled:opacity-50"
                                                    disabled={!quantities[ticket._id]}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-4 text-center">{quantities[ticket._id] || 0}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(ticket._id, 1, ticket.price)}
                                                    className="p-1 hover:text-amber-500"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        {ticket.description && (
                                            <p className="text-sm text-gray-500">{ticket.description}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">No tickets available for this event yet.</div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <div className="flex justify-between items-center mb-6 text-xl font-bold">
                                <span>Total</span>
                                <span>${totalPrice} USD</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={totalPrice === 0}
                                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
