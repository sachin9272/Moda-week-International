import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Check, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

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
                            src={optimizeCloudinaryImage(img, { width: 900, height: 1200, crop: "fill" })}
                            alt={`Collection ${i}`}
                            className="w-full h-full object-cover select-none"
                            draggable="false"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}
                {images.map((img, i) => (
                    <div key={`dup-${i}`} className="h-[500px] w-auto relative shrink-0">
                        <img
                            src={optimizeCloudinaryImage(img, { width: 900, height: 1200, crop: "fill" })}
                            alt={`Collection Duplicate ${i}`}
                            className="w-full h-full object-cover select-none"
                            draggable="false"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const URL_REGEX = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

const renderTextWithLinks = (text = "") =>
    text.split("\n").map((line, lineIndex) => (
        <p key={`line-${lineIndex}`}>
            {line.split(URL_REGEX).map((part, partIndex) => {
                if (!part) return null;

                if (part.match(URL_REGEX)) {
                    const href = part.startsWith("http") ? part : `https://${part}`;
                    return (
                        <a
                            key={`link-${lineIndex}-${partIndex}`}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#8C5D25] underline underline-offset-[0.18em] break-all hover:text-[#C7913E]"
                        >
                            {part}
                        </a>
                    );
                }

                return <React.Fragment key={`text-${lineIndex}-${partIndex}`}>{part}</React.Fragment>;
            })}
        </p>
    ));

export default function EventTicketDetails() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const showTicketsOnly = mode === "tickets";
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const eventDisplayName = event?.eventName || '';
    const eventMainTitle = event?.title || '';

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
                const response = await axios.get(`${baseURL}/api/upcoming-events/${id}`, {
                    params: { _t: Date.now() },
                    headers: {
                        'Cache-Control': 'no-cache',
                        Pragma: 'no-cache'
                    }
                });
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
        const designerImageUrl = collection.designerImage?.url || collection.designerImage;
        const hasCollectionImages = images.length > 0;

        const shouldRenderAsDesignerProfile =
            (layout === 'carousel') || (images.length === 0 && designerImageUrl);

        if (shouldRenderAsDesignerProfile) {
            return (
                <div key={index} className={`${hasCollectionImages ? 'py-10' : 'py-6'} bg-white`}>
                    <div className="max-w-[95%] mx-auto font-sans">
                        {/* Designer Header Section */}
                        <div className={`flex flex-col md:flex-row gap-12 items-center ${hasCollectionImages ? 'border-b border-black mb-20 pb-12' : 'mb-10 pb-6'}`}>
                            {/* Left: Designer Image */}
                            {designerImageUrl && (
                                <div className="w-full md:w-[400px] shrink-0">
                                    <div className="relative aspect-[3/4] overflow-hidden shadow-sm">
                                        <img src={optimizeCloudinaryImage(designerImageUrl, { width: 900, height: 1200, crop: "fill" })} alt={collection.title} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
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
                                        {renderTextWithLinks(collection.description)}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No biography available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {hasCollectionImages && (
                        <AutoScrollCarousel images={images} />
                    )}
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
                                    <img src={optimizeCloudinaryImage(img, { width: 900, height: 1200, crop: "fill" })} alt={`Walk ${i}`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
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

            <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-transparent h-[300px] flex flex-col justify-center items-center">
                <div className="max-w-7xl mx-auto">
                    {eventMainTitle && (
                        <h1 className="text-3xl md:text-[44px] font-bold uppercase tracking-wider mb-2 grad-text-up">
                            {eventMainTitle}
                        </h1>
                    )}
                    <p className="text-sm md:text-lg font-medium tracking-wide mb-4 text-black">
                        {formatDate(event.eventDate)}
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-2 text-[#734F1C] font-medium tracking-widest uppercase text-sm">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Description - Hide on ticket purchase view */}
                {!showTicketsOnly && (
                    <div className="lg:col-span-3">
                        {eventDisplayName && (
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-black mb-8 leading-tight uppercase tracking-wider">
                                {eventDisplayName}
                            </h2>
                        )}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="!text-base rich-text-content event-rich-text text-black leading-relaxed text-lg font-light text-justify flex-1 space-y-2">
                                {event.description
                                    ? renderTextWithLinks(event.description)
                                    : <p>No description available.</p>}
                            </div>
                            {event.coverImage && (
                                <div className="w-full md:w-1/2 relative shrink-0">
                                    <div className="relative aspect-[3/4] shadow-xl">
                                        <img
                                            src={optimizeCloudinaryImage(event.coverImage?.url || event.coverImage, { width: 1000, crop: "limit" })}
                                            alt={eventDisplayName || event.title || 'Event cover'}
                                            className="w-full h-full object-contain rounded-sm bg-white"
                                            decoding="async"
                                        />
                                        <div className="absolute -inset-4 border border-[#C7913E]/30 z-0 pointer-events-none"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Ticket Selection - Only show on Buy Tickets flow */}
                {showTicketsOnly && event.hasTickets && (
                    <div className="lg:col-span-3 max-w-4xl mx-auto w-full">
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
                                                <div className="text-sm text-gray-600 font-light space-y-1">
                                                    {renderTextWithLinks(ticket.description)}
                                                </div>
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

            {event.partners && event.partners.length > 0 && (
                <div className="py-1 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-black uppercase tracking-wider mb-2">
                            Event Partners
                        </h2>
                        <div className="w-24 h-0.5 bg-[#C7913E] mx-auto"></div>
                    </div>

                    <div className="border-gray-800 py-8">
                        <div className="marquee-wrapper py-8">
                            <div className="marquee-track">
                                {[...Array(10)].map((_, loopIndex) => (
                                    event.partners.map((partner, i) => (
                                        <img
                                            key={`${loopIndex}-${i}`}
                                            src={optimizeCloudinaryImage(partner.url, { width: 320, height: 160, crop: "fit" })}
                                            alt={`Partner ${i}`}
                                            className="h-20 object-contain -mx-1"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Collections Section - Hide on ticket purchase view */}
            {!showTicketsOnly && (
                <div className="mt-10 bg-white">
                    {event.collections && event.collections.map((col, idx) => renderCollection(col, idx))}
                </div>
            )}

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
