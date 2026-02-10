import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { baseURL as API_BASE_URL } from '../config/api';

const AutoScrollCarousel = ({ images }) => {
    const scrollRef = React.useRef(null);
    const [isInteracting, setIsInteracting] = React.useState(false);

    React.useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;
        const scrollSpeed = 1; // Adjust speed as needed

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
            className="w-full relative group"
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
        >
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-[10px] pb-0 scrollbar-hide px-0"
                style={{ scrollBehavior: 'auto' }} // auto needed for seamless jump
            >
                {/* Original list */}
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

                {/* Duplicate list for infinite scroll */}
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

const EventDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(1); // Default to Day 1

    // Refs for day sections
    const dayRefs = {
        1: React.useRef(null),
        2: React.useRef(null),
        3: React.useRef(null)
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // If slug is available, use it. The backend should handle finding by slug OR ID.
                const response = await axios.get(`${API_BASE_URL}/api/events/${slug}`);
                setEvent(response.data);

                // Determine initial active day
                const collections = response.data.collections || [];
                const hasDays = collections.some(col => col.day);
                if (hasDays) {
                    // Find first available day
                    const days = collections.map(col => col.day).filter(d => d).sort();
                    if (days.length > 0) setActiveDay(days[0]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug]);

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

    const scrollToDay = (day) => {
        const ref = dayRefs[day];
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderHero = () => {
        return (
            <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-transparent h-[300px] flex flex-col justify-center items-center">
                <h1 className="text-3xl md:text-[44px] font-bold uppercase tracking-wider mb-2 grad-text-up">
                    {event.eventName}
                </h1>
                <p className="text-sm md:text-lg font-medium tracking-wide mb-4 text-black">
                    {formatDate(event.date)}
                </p>
            </header>
        );
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
        } else if (layout === 'carousel') {
            // Designer Profile Layout
            const designerImageUrl = collection.designerImage?.url || collection.designerImage;
            return (
                <div
                    key={index}
                    className="py-10 bg-white"
                    ref={collection.day ? dayRefs[collection.day] : null}
                >
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

            {/* Day Navigation Buttons - Only show for PAST events with day-tagged collections */}


            {event.descriptionSection && event.descriptionSection.isVisible && (
                <div className="py-6 px-8 bg-white relative overflow-hidden mb-8">
                    <div className="max-w-7xl mx-auto flex flex-col gap-10">
                        {/* Top: Title & Top Text */}
                        <div className="w-full text-center md:text-left">
                            {event.descriptionSection.title && (
                                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-black mb-8 leading-tight uppercase tracking-wider">
                                    {event.descriptionSection.title}
                                </h2>
                            )}
                            {event.descriptionSection.text && (
                                <div
                                    className="!text-base rich-text-content text-black leading-relaxed text-lg font-light text-justify"
                                    dangerouslySetInnerHTML={{ __html: event.descriptionSection.text }}
                                />
                            )}
                        </div>

                        {/* Split: Image (Left) & Credits (Right) */}
                        {(() => {
                            const descImage = event.descriptionSection.image;
                            console.log("EventDetail - Description Image:", descImage);
                            const descImageUrl = descImage?.url || descImage;

                            if (!descImageUrl && !event.descriptionSection.credits) return null;

                            const imageSize = event.descriptionSection.imageSize || 'medium';
                            let imageWidthClass = 'md:w-1/2'; // Default medium
                            let textWidthClass = 'md:w-1/2';

                            if (imageSize === 'small') {
                                imageWidthClass = 'md:w-1/3';
                                textWidthClass = 'md:w-2/3';
                            } else if (imageSize === 'large') {
                                imageWidthClass = 'md:w-2/3';
                                textWidthClass = 'md:w-1/3';
                            }

                            // If no image, text is always full width
                            if (!descImageUrl) {
                                textWidthClass = 'md:w-full';
                            }

                            return (
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className={`w-full ${textWidthClass}`}>
                                        {event.descriptionSection.credits && (
                                            <div
                                                className="rich-text-content text-black leading-relaxed text-base font-light tracking-wide space-y-2"
                                                dangerouslySetInnerHTML={{ __html: event.descriptionSection.credits }}
                                            />
                                        )}
                                    </div>

                                    {descImageUrl && (
                                        <div className={`w-full ${imageWidthClass} relative`}>
                                            <div className="relative aspect-[3/4] shadow-xl">
                                                <img src={descImageUrl} alt="Description" className="w-full h-full object-cover rounded-sm" />
                                                <div className="absolute -inset-4 border border-[#C7913E]/30 z-0 pointer-events-none"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Partners Section */}
            {event.partners && event.partners.length > 0 && (
                <div className="py-1 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-black uppercase tracking-wider mb-2">
                            Event Partners
                        </h2>
                        <div className="w-24 h-0.5 bg-[#C7913E] mx-auto"></div>
                    </div>

                    <div className="border-gray-800 py-2">
                        <div className="marquee-container w-full">
                            <div className="marquee-content gap-10">
                                {[...Array(10)].map((_, loopIndex) => (
                                    <React.Fragment key={`loop-${loopIndex}`}>
                                        {event.partners.map((partner, i) => (
                                            <div key={`${loopIndex}-${i}`} className="flex items-center justify-center min-w-[120px]">
                                                <img
                                                    src={partner.url}
                                                    alt={`Partner ${i}`}
                                                    className="h-20 object-contain mx-0 transition-all duration-300"
                                                />
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {event.videoSection && event.videoSection.isVisible && (event.videoSection.url || event.videoSection.file) && (
                <div className="py-16 px-8 bg-white relative overflow-hidden">
                    <div className="max-w-5xl mx-auto flex flex-col gap-8 items-center">
                        {event.videoSection.title && (
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-black text-center uppercase tracking-wider mb-4">
                                {event.videoSection.title}
                            </h2>
                        )}
                        <div className="w-full aspect-video relative shadow-2xl rounded-sm overflow-hidden bg-black">
                            {event.videoSection.type === 'youtube' ? (
                                <iframe
                                    src={(() => {
                                        const url = event.videoSection.url;
                                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                        const match = url.match(regExp);
                                        const id = (match && match[2].length === 11) ? match[2] : null;
                                        // Append autoplay and mute
                                        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1` : url;
                                    })()}
                                    title={event.videoSection.title || 'Event Video'}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={event.videoSection.url || event.videoSection.file} // Handle both just in case
                                    className="w-full h-full object-contain"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {renderTickets()}

            {/* Day Tabs - Only show if data has days */}
            {event.collections && event.collections.some(col => col.day) && (
                <div className="bg-white py-8 px-4 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto flex justify-center flex-wrap gap-6">
                        {['FIRST', 'SECOND', 'THIRD'].map((dayLabel, index) => {
                            const dayNum = index + 1;
                            const hasDay = event.collections.some(col => parseInt(col.day) === dayNum);
                            if (!hasDay) return null;

                            const isActive = activeDay === dayNum;
                            return (
                                <button
                                    key={dayNum}
                                    onClick={() => setActiveDay(dayNum)}
                                    className={`
                                        px-8 py-3 uppercase tracking-widest text-sm font-semibold transition-all duration-300
                                        border ${isActive ? 'border-[#C7913E] text-[#C7913E]' : 'border-white text-gray-500 hover:text-black'}
                                    `}
                                >
                                    {dayLabel} DAY &gt;
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-10 bg-white">
                {event.collections && event.collections
                    .filter(col => !col.day || parseInt(col.day) === activeDay) // Show if no day assigned OR matches active day
                    .map((col, idx) => renderCollection(col, idx))}
            </div>

            {/* <div className='!text-white mb-10'>
                <CtaSection />
            </div> */}
            <Footer />
        </div>
    );
};

export default EventDetail;
