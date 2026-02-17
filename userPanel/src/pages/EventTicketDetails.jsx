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
            className="w-full relative group mt-10"
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
        >
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-[10px] pb-0 scrollbar-hide px-0"
                style={{ scrollBehavior: 'auto' }}
            >
                {images.map((img, i) => (
                    <div key={`orig-${i}`} className="h-[500px] w-auto relative shrink-0">
                        <img
                            src={img}
                            alt={`Collection ${i}`}
                            className="w-full h-full object-cover select-none"
                            draggable="false"
                        />
                    </div>
                ))}
                {images.map((img, i) => (
                    <div key={`dup-${i}`} className="h-[500px] w-auto relative shrink-0">
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const getOrdinal = (n) => {
            const s = ["th", "st", "nd", "rd"];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        return `${month} ${getOrdinal(day)}, ${year}`;
    };

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
            // Designer Profile Layout
            const designerImageUrl = collection.designerImage?.url || collection.designerImage;
            return (
                <div key={index} className="py-10 bg-white">
                    <div className="max-w-[95%] mx-auto font-sans">
                        {/* Designer Header Section */}
                        <div className="flex flex-col md:flex-row gap-12 items-start mb-20 border-b border-black pb-12">
                            {/* Left: Designer Image */}
                            {designerImageUrl && (
                                <div className="w-full md:w-[400px] shrink-0">
                                    <div className="relative aspect-[3/4] overflow-hidden shadow-sm">
                                        <img src={designerImageUrl} alt={collection.title} className="w-full h-full object-cover object-top" />
                                    </div>
                                </div>
                            )}

                            {/* Right: Bio */}
                            <div className="flex-1 space-y-8 pt-4">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-bold uppercase tracking-wide border-b-2 border-orange-400 inline-block pb-1">{collection.title}</h2>
                                    {collection.subtitle && <p className="text-xl uppercase tracking-widest text-gray-800">{collection.subtitle}</p>}
                                </div>

                                {collection.description ? (
                                    <div className="prose max-w-none text-gray-700 text-base leading-normal space-y-1 text-justify">
                                        {/* Simple formatting: preserve line breaks */}
                                        {collection.description.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No biography available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Collection Images (Bottom) - Auto Scroll Carousel */}
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
            const itemStyle = (ratio === 'auto' || ratio === 'portrait') ? { height: '650px' } : { aspectRatio: ratio.replace('/', ':') };

            return (
                <div key={index} className="py-4 px-4 bg-white">
                    <div className="mx-auto">
                        <div className="mb-4 border-b border-gray-400 pb-2 flex flex-wrap items-baseline gap-3">
                            <h2 className="text-2xl md:text-3xl font-bold uppercase grad-text">{collection.title}</h2>
                            {collection.subtitle && <span className="text-gray-500 uppercase text-lg md:text-xl">{collection.subtitle}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <div key={i} className="relative group overflow-hidden" style={itemStyle}>
                                    <img src={img} alt={`Walk ${i}`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    };

    if (loading) return <div className="bg-white min-h-screen text-black flex justify-center items-center">Loading...</div>;
    if (!event) return <div className="bg-white min-h-screen text-black flex justify-center items-center">Event not found</div>;

    return (
        <div className="bg-white min-h-screen text-black">
            <Navbar />

            {/* Hero Section - Gradient Style */}
            <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-white h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
                <div className="max-w-7xl mx-auto z-10">
                    <h1 className="relative uppercase inline-block md:text-[56px] font-bold text-4xl tracking-widest mb-6 bg-linear-to-br from-[#3C2306] via-[#734F1C] to-[#C7913E] bg-clip-text text-transparent !font-playfair">
                        {event.title}
                        <span className="absolute left-1/2 -bottom-4 w-1/3 h-0.5 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C7913E] to-transparent"></span>
                    </h1>
                    <p className="text-black max-w-3xl mx-auto leading-relaxed md:text-2xl uppercase tracking-[0.2em] font-light !font-montserrat mt-4">
                        {formatDate(event.eventDate)}
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-2 text-[#734F1C] font-medium tracking-widest uppercase text-sm">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* Decorative background element if no cover image is used as background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7913E] opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C7913E] opacity-5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </header>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Description */}
                <div className={event.hasTickets ? "lg:col-span-2" : "lg:col-span-3"}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 grad-text uppercase tracking-wider border-b border-gray-200 pb-4">
                        About the Event
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="prose prose-neutral max-w-none text-gray-800 text-lg leading-relaxed flex-1">
                            <p className="whitespace-pre-line">{event.description || "No description available."}</p>
                        </div>
                        {event.coverImage && (
                            <div className="w-full md:w-2/5 shrink-0">
                                <div className="rounded-sm overflow-hidden shadow-xl border border-gray-100">
                                    <img
                                        src={event.coverImage?.url || event.coverImage}
                                        alt={event.title}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Ticket Selection */}
                {event.hasTickets && (
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 sticky top-24 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-8 uppercase tracking-widest text-[#C7913E]">Select Tickets</h3>

                            <div className="space-y-8">
                                {event.ticketTypes && event.ticketTypes.length > 0 ? (
                                    event.ticketTypes.map((ticket) => (
                                        <div key={ticket._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-lg text-black uppercase">{ticket.name}</h4>
                                                    <p className="text-[#C7913E] font-bold text-xl">${ticket.price}</p>
                                                </div>
                                                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                                    <button
                                                        onClick={() => handleQuantityChange(ticket._id, -1, ticket.price)}
                                                        className="text-gray-500 hover:text-[#C7913E] transition-colors disabled:opacity-30"
                                                        disabled={!quantities[ticket._id]}
                                                    >
                                                        <Minus size={20} />
                                                    </button>
                                                    <span className="w-6 text-center font-bold text-black">{quantities[ticket._id] || 0}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(ticket._id, 1, ticket.price)}
                                                        className="text-gray-500 hover:text-[#C7913E] transition-colors"
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                            {ticket.description && (
                                                <p className="text-sm text-gray-600 font-light">{ticket.description}</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400 text-center py-8 italic font-light">No tickets available yet.</div>
                                )}
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg text-gray-600 uppercase tracking-widest">Total Amount</span>
                                    <span className="text-3xl font-bold text-black">${totalPrice}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={totalPrice === 0}
                                    className="w-full py-5 bg-gradient-to-r from-[#3C2306] via-[#734F1C] to-[#C7913E] text-white font-bold rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] shadow-xl hover:shadow-[#C7913E]/20"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Collections Section */}
            <div className="mt-10 bg-white">
                {event.collections && event.collections.map((col, idx) => renderCollection(col, idx))}
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
