import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import { ChevronRight } from 'lucide-react';
import { baseURL as API_BASE_URL } from '../config/api';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
                setEvent(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) return <div className="bg-white min-h-screen text-black flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="bg-white min-h-screen text-black flex items-center justify-center">Event not found</div>;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid

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

    const renderHero = () => {
        const headerVideoUrl = event.headerVideo?.url || event.headerVideo;
        const thumbnailUrl = event.thumbnail?.url || event.thumbnail;

        if (event.heroLayout === 'full') {
            return (
                <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                    {headerVideoUrl ? (
                        <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover object-top">
                            <source src={headerVideoUrl} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${thumbnailUrl})` }}></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-20 md:px-6 px-2 py-4 max-w-9xl md:max-w-9xl">
                        <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-md break-words">
                            {event.eventName}
                        </h2>
                        <p className="text-white text-sm md:text-2xl uppercase tracking-[0.2em] font-light drop-shadow-md">
                            {formatDate(event.date)}
                        </p>
                    </div>
                </div>
            );
        } else if (event.heroLayout === 'minimal') {
            return (
                <div className="relative h-[60vh] w-full flex items-center justify-center bg-white">
                    <div className="text-center px-4">
                        <p className="text-[#C7913E] text-lg uppercase tracking-[0.3em] mb-4">{formatDate(event.date)}</p>
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-black mb-4">{event.eventName}</h1>
                        <p className="text-xl font-light text-gray-600">{event.city}</p>
                    </div>
                </div>
            );
        } else {
            // Default Split
            const gradientClass = {
                'none': 'bg-white',
                'purple-pink': 'bg-gradient-to-r from-[#A10F01] to-[#5E25EC] text-white',
                'blue-cyan': 'bg-gradient-to-l from-blue-900 to-cyan-800 text-white',
                'sunset': 'bg-gradient-to-br from-orange-700 to-yellow-600 text-white',
                'midnight': 'bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white',
            }[event.heroGradient || 'none'];

            const hasGradient = event.heroGradient && event.heroGradient !== 'none';
            const textColorClass = hasGradient ? 'text-white' : 'text-black';
            const subTextColorClass = hasGradient ? 'text-gray-200' : 'text-gray-600';
            const buttonColorClass = hasGradient ? 'text-white border-white hover:text-gray-200' : 'text-black border-[#C7913E] hover:text-[#C7913E]';

            return (
                <div className="relative min-h-screen flex flex-col md:flex-row">
                    <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-20 z-10 ${gradientClass}`}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] w-12 bg-[#C7913E]"></div>
                                <span className="text-[#C7913E] uppercase tracking-[0.2em] text-sm">{formatDate(event.date)}</span>
                            </div>
                            <h1 className={`text-5xl md:text-6xl font-bold leading-[1.1] ${textColorClass} max-w-2xl`}>
                                {event.eventName}
                            </h1>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative">
                        {headerVideoUrl ? (
                            <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
                                <source src={headerVideoUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={thumbnailUrl} alt={event.eventName} className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:w-1/2"></div>
                    </div>
                </div>
            );
        }
    };

    const renderCollection = (collection, index) => {
        const layout = collection.layout || 'grid';
        // Handle images array (objects or strings)
        const images = collection.images.map(img => img?.url || img);

        if (layout === 'masonry') {
            return (
                <div key={index} className="py-20 px-4 md:px-12 bg-white">
                    <div className="max-w-7xl mx-auto mb-12 text-center">
                        <h2 className="text-4xl md:text-5xl font-playfair text-black mb-4">{collection.title}</h2>
                        {collection.subtitle && <p className="text-black tracking-widest uppercase text-sm">{collection.subtitle}</p>}
                    </div>
                    <div className="columns-1 md:columns-3 gap-8 space-y-8">
                        {images.map((img, i) => (
                            <div key={i} className="break-inside-avoid relative group">
                                <img src={img} alt={`Collection ${i}`} className="w-full transition-all duration-700" />
                                <div className="absolute inset-0 group-hover:bg-transparent transition-all"></div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (layout === 'highlight') {
            return (
                <div key={index} className="py-20 px-4 md:px-12 bg-white">
                    <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row items-end gap-6 border-b border-gray-200 pb-8">
                        <h2 className="text-4xl md:text-6xl font-playfair text-black leading-none">{collection.title}</h2>
                        {collection.subtitle && <p className="text-gray-600 pb-2 text-lg font-light italic">{collection.subtitle}</p>}
                    </div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Large Highlight */}
                        {images[0] && (
                            <div className="md:row-span-2 relative group overflow-hidden">
                                <img src={images[0]} alt="Highlight" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            {images.slice(1).map((img, i) => (
                                <div key={i} className="aspect-[3/4] overflow-hidden group">
                                    <img src={img} alt={`Detail ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else {
            // Determine aspect ratio from collection settings
            const ratioMap = {
                'portrait': '3/4',
                'landscape': '4/3',
                'square': '1/1',
                'auto': 'auto'
            };
            const ratio = ratioMap[collection.gridAspectRatio] || '3/4';
            const itemStyle = (ratio === 'auto' || ratio == 'portrait') ? { height: '650px' } : { aspectRatio: ratio };
            // const itemStyle = { height: '650px' };

            return (
                <div key={index} className="py-4 px-4 bg-white">
                    <div className=" mx-auto">
                        <div className="mb-4 border-b border-gray-400 pb-2 flex flex-wrap items-baseline gap-3">
                            <h2 className="text-2xl md:text-3xl font-bold uppercase grad-text">{collection.title}</h2>
                            {collection.subtitle && <span className="text-gray-500 uppercase text-lg md:text-xl">{collection.subtitle}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <div key={i} className="relative group overflow-hidden object-cover" style={itemStyle}>
                                    <img src={img} alt={`Walk ${i}`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderTickets = () => {
        if (!event.hasTickets || !event.tickets || event.tickets.length === 0) return null;

        const ticketPoster = event.thumbnail?.url || event.thumbnail;

        return (
            <div className="w-full text-black py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        {/* Poster Side */}
                        <div className="w-full md:w-1/3">
                            <div className="h-full min-h-[500px] relative overflow-hidden">
                                <img
                                    src={ticketPoster}
                                    alt="Event Poster"
                                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="text-3xl font-playfair font-bold text-white mb-2">{event.eventName}</h3>
                                    <p className="text-[#C7913E] uppercase tracking-wider font-semibold">{formatDate(event.date)}</p>
                                    <div className="h-[1px] w-16 bg-[#C7913E] mt-4"></div>
                                </div>
                            </div>
                        </div>

                        {/* Tickets List Side */}
                        <div className="w-full md:w-2/3 flex flex-col gap-6 justify-center">
                            {event.tickets.map((ticket, idx) => {
                                const ticketImgUrl = ticket.image?.url || ticket.image;
                                return (
                                    <div
                                        key={idx}
                                        className="block relative group overflow-hidden rounded-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl shadow-[#C7913E]/10"
                                    >
                                        <div className="w-full h-auto">
                                            <img
                                                src={ticketImgUrl}
                                                alt={`Ticket ${idx + 1}`}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen text-black">
            <Navbar />

            {renderHero()}

            {event.descriptionSection && event.descriptionSection.isVisible && (
                <div className="bg-white pt-6 pb-0 px-4">
                    <div className="max-w-9xl mx-auto">
                        <h2 className="text-2xl text-black mb-4 uppercase tracking-wider max-w-3xl">
                            {event.descriptionSection.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-light">
                            {event.descriptionSection.text}
                        </p>
                    </div>
                </div>
            )}

            {renderTickets()}

            <div className="mt-10 bg-white">
                {event.collections && event.collections.map((col, idx) => renderCollection(col, idx))}
            </div>

            {event.bottomSection && (event.bottomSection.title || event.bottomSection.text || event.bottomSection.image) && (
                <div className="py-20 px-8 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-black mb-8 leading-tight">
                                {event.bottomSection.title}
                            </h2>
                            <p className="text-black leading-relaxed text-lg font-light">
                                {event.bottomSection.text}
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 h-[500px] relative">
                            {event.bottomSection.image && (
                                <img src={event.bottomSection.image?.url || event.bottomSection.image} alt="Recap" className="absolute inset-0 w-full h-full object-cover rounded-sm grayscale-[50%] hover:grayscale-0 transition-all duration-700" />
                            )}
                            <div className="absolute -inset-4 border border-[#C7913E]/30 z-0 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className='!text-white mb-10'>
                <CtaSection />
            </div>
            <Footer />
        </div>
    );
};

export default EventDetail;
