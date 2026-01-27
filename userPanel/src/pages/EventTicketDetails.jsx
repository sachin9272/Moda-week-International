import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Check, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";

const AutoScrollCarousel = ({ images }) => {
    const scrollRef = React.useRef(null);
    const [isInteracting, setIsInteracting] = React.useState(false);

    React.useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;
        const scrollSpeed = 1;

        const scroll = () => {
            if (!isInteracting && scrollContainer) {
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isInteracting]);

    return (
        <div
            className="w-full relative group mt-8"
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
        >
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-[10px] pb-0 scrollbar-hide px-0"
                style={{ scrollBehavior: 'auto' }}
            >
                {images.map((img, i) => (
                    <div key={`orig-${i}`} className="h-[400px] md:h-[500px] w-auto relative shrink-0">
                        <img
                            src={img}
                            alt={`Collection ${i}`}
                            className="w-full h-full object-cover select-none"
                            draggable="false"
                        />
                    </div>
                ))}
                {images.map((img, i) => (
                    <div key={`dup-${i}`} className="h-[400px] md:h-[500px] w-auto relative shrink-0">
                        <img
                            src={img}
                            alt={`Collection Duplicate ${i}`}
                            className="w-full h-full object-cover select-none"
                            draggable="false"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function EventTicketDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Correct API endpoint for upcoming events
                const response = await axios.get(`${baseURL}/api/upcoming-events/${id}`);
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
        if (!event || !event.ticketTypes) return;
        let total = 0;
        event.ticketTypes.forEach((ticket) => {
            const qty = quantities[ticket._id] || 0;
            total += qty * ticket.price;
        });
        setTotalPrice(total);
    }, [quantities, event]);

    const getSelectedTickets = () => {
        if (!event || !event.ticketTypes) return [];
        return event.ticketTypes
            .map(t => ({
                ticketTypeId: t._id,
                name: t.name,
                price: t.price,
                quantity: quantities[t._id] || 0
            }))
            .filter(t => t.quantity > 0);
    };

    const handleCheckout = () => {
        // Safe check for ticketTypes
        if (!event.ticketTypes) return;

        const selectedTickets = getSelectedTickets();

        if (selectedTickets.length === 0) {
            alert("Please select at least one ticket.");
            return;
        }

        setIsModalOpen(true);
    };

    const handleFinalCheckout = async (userDetails) => {
        try {
            const selectedTickets = getSelectedTickets().map(t => ({
                ticketTypeId: t.ticketTypeId,
                quantity: t.quantity
            }));

            const response = await axios.post(`${baseURL}/api/payment/create-checkout-session`, {
                eventId: event._id,
                items: selectedTickets,
                buyerName: userDetails.name,
                buyerEmail: userDetails.email,
                buyerAddress: userDetails.address // Sending address to backend
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                alert("Failed to create checkout session.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsModalOpen(false);
        }
    };

    const renderCollection = (collection, index) => {
        const layout = collection.layout || 'grid';
        const images = collection.images.map(img => img?.url || img);

        if (layout === 'carousel') {
            const designerImageUrl = collection.designerImage?.url || collection.designerImage;
            return (
                <div key={index} className="py-12 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row gap-12 items-start mb-12">
                        {designerImageUrl && (
                            <div className="w-full md:w-[350px] shrink-0">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-2xl border border-gray-800">
                                    <img src={designerImageUrl} alt={collection.title} className="w-full h-full object-cover object-top" />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-500 uppercase tracking-wide">{collection.title}</h2>
                                {collection.subtitle && <p className="text-xl uppercase tracking-[0.3em] text-gray-400">{collection.subtitle}</p>}
                            </div>

                            {collection.description ? (
                                <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed text-justify">
                                    {collection.description.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No biography available.</p>
                            )}
                        </div>
                    </div>
                    <AutoScrollCarousel images={images} />
                </div>
            );
        } else {
            const ratioMap = {
                'portrait': '3/4',
                'landscape': '16/9',
                'square': '1/1',
                'auto': 'auto'
            };
            const ratio = ratioMap[collection.gridAspectRatio] || '3/4';
            const itemStyle = ratio === 'auto' ? { height: '500px' } : { aspectRatio: ratio.replace('/', ':') };

            return (
                <div key={index} className="py-12 border-t border-gray-800">
                    <div className="mb-8 flex flex-wrap items-baseline gap-4">
                        <h2 className="text-3xl font-serif font-bold text-amber-500 uppercase">{collection.title}</h2>
                        {collection.subtitle && <span className="text-gray-400 uppercase tracking-widest text-lg">{collection.subtitle}</span>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((img, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-lg shadow-xl" style={itemStyle}>
                                <img src={img} alt={`Walk ${i}`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
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
                    src={event.coverImage?.url || "https://via.placeholder.com/1200x600"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-6 pb-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{event.title}</h1>
                    <div className="flex flex-wrap gap-6 text-lg text-gray-200">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-amber-500" />
                            <span>{event.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="text-amber-500" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Description */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 text-amber-500">About the Event</h2>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p className="whitespace-pre-line">{event.description || "No description available."}</p>
                    </div>
                </div>

                {/* Right Column: Ticket Selection */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-6 sticky top-24">
                        <h3 className="text-2xl font-bold mb-6">Select Tickets</h3>

                        <div className="space-y-6">
                            {event.ticketTypes && event.ticketTypes.length > 0 ? (
                                event.ticketTypes.map((ticket) => (
                                    <div key={ticket._id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg">{ticket.name}</h4>
                                                <p className="text-amber-500 font-semibold">${ticket.price}</p>
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
                                <span>${totalPrice}</span>
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

            {/* Collections Section */}
            <div className="container mx-auto px-6 pb-20">
                {event.collections && event.collections.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-4xl font-serif font-bold mb-12 text-center text-white italic border-b border-amber-500/20 pb-8 tracking-[0.2em] uppercase">
                            Featured Collections
                        </h2>
                        <div className="space-y-20">
                            {event.collections.map((col, idx) => renderCollection(col, idx))}
                        </div>
                    </div>
                )}
            </div>

            <UserDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFinalCheckout}
                totalPrice={totalPrice}
                ticketSummary={getSelectedTickets()}
            />

            <Footer />
        </div>
    );
}
