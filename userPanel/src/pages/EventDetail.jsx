import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { baseURL as API_BASE_URL } from '../config/api';
import { optimizeCloudinaryImage } from '../utils/cloudinary';

const LazyCollection = ({ children }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only load once
                }
            },
            { rootMargin: "300px" } // Load a bit before it comes into view
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={{ minHeight: "400px" }}>
            {isVisible ? children : (
                <div className="flex items-center justify-center h-[400px]">
                    <div className="w-8 h-8 border-4 border-[#C7913E] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

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
                            src={optimizeCloudinaryImage(img, { width: 900, height: 1200, crop: 'fill' })}
                            alt={`Collection ${i}`}
                            className="w-full h-full object-cover select-none"
                            draggable="false"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}

                {/* Duplicate list for infinite scroll */}
                {images.map((img, i) => (
                    <div key={`dup-${i}`} className="h-[500px] w-auto relative shrink-0">
                        <img
                            src={optimizeCloudinaryImage(img, { width: 900, height: 1200, crop: 'fill' })}
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

const getPartnerMarqueeDuration = (partnerCount) => `${Math.max(18, partnerCount * 2.5)}s`;

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

const getCollectionDayKey = (collection) => {
    if (!collection?.day) return '';
    if (collection.day === 'custom') {
        return collection.dayLabel?.trim() ? `custom:${collection.dayLabel.trim()}` : '';
    }
    return String(collection.day);
};

const getCollectionDayLabel = (collection) => {
    if (!collection?.day) return '';

    const dayMap = {
        '1': 'FIRST DAY',
        '2': 'SECOND DAY',
        '3': 'THIRD DAY',
        '4': 'FOURTH DAY',
        '5': 'FIFTH DAY'
    };

    if (collection.day === 'custom') {
        return collection.dayLabel?.trim() || 'CUSTOM DAY';
    }

    return dayMap[String(collection.day)] || `DAY ${collection.day}`;
};

const fetcher = (url) => axios.get(url).then(res => res.data);

const EventDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [activeDay, setActiveDay] = useState(''); // Default to first available tagged day
    const dayRefs = React.useRef({});

    const { data: event, error, isLoading: loading } = useSWR(slug ? `${API_BASE_URL}/api/events/${slug}` : null, fetcher, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            const collections = data.collections || [];
            const hasDays = collections.some(col => col.day);
            if (hasDays && !activeDay) {
                const firstTaggedCollection = collections.find(col => getCollectionDayKey(col));
                if (firstTaggedCollection) {
                    setActiveDay(getCollectionDayKey(firstTaggedCollection));
                }
            }
        }
    });

    const collectionDays = React.useMemo(() => {
        const collections = event?.collections || [];
        const uniqueDays = [];
        const seen = new Set();

        collections.forEach((collection) => {
            const key = getCollectionDayKey(collection);
            if (!key || seen.has(key)) return;

            seen.add(key);
            uniqueDays.push({
                key,
                label: getCollectionDayLabel(collection)
            });
        });

        return uniqueDays;
    }, [event]);

    if (error) return <div className="bg-white min-h-screen text-black flex items-center justify-center">Error loading event.</div>;
    if (loading) return <div className="bg-white min-h-screen text-black flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="bg-white min-h-screen text-black flex items-center justify-center">Event not found</div>;

    const eventPartners = Array.isArray(event.partners) ? event.partners : [];
    const partnerMarqueeItems = [...eventPartners, ...eventPartners];

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

    const scrollToDay = (dayKey) => {
        const section = dayRefs.current[dayKey];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const images = collection.images.map((img) => img?.url || img);
        const designerImageUrl = collection.designerImage?.url || collection.designerImage;
        const hasCollectionImages = images.length > 0;
        const shouldRenderAsDesignerProfile =
            (layout === 'carousel') || (images.length === 0 && designerImageUrl);

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
                                <img
                                    src={optimizeCloudinaryImage(img, { width: 900, crop: 'limit' })}
                                    alt={`Collection ${i}`}
                                    className="w-full transition-all duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
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
                                <img
                                    src={optimizeCloudinaryImage(images[0], { width: 1200, height: 1600, crop: 'fill' })}
                                    alt="Highlight"
                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            {images.slice(1).map((img, i) => (
                                <div key={i} className="aspect-[3/4] overflow-hidden group">
                                    <img
                                        src={optimizeCloudinaryImage(img, { width: 700, height: 900, crop: 'fill' })}
                                        alt={`Detail ${i}`}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if (shouldRenderAsDesignerProfile) {
            return (
                <div
                    key={index}
                    className={`${hasCollectionImages ? 'py-10' : 'py-6'} bg-white`}
                    ref={(node) => {
                        const dayKey = getCollectionDayKey(collection);
                        if (!dayKey) return;

                        if (node) {
                            dayRefs.current[dayKey] = node;
                        } else {
                            delete dayRefs.current[dayKey];
                        }
                    }}
                >
                    <div className="max-w-[95%] mx-auto font-sans">
                        {/* Designer Header Section */}
                        <div className={`flex flex-col md:flex-row gap-12 items-center ${hasCollectionImages ? 'border-b border-black mb-20 pb-12' : 'mb-10 pb-6'}`}>
                            {/* Left: Designer Image */}
                            {designerImageUrl && (
                                <div className="w-full md:w-[400px] shrink-0">
                                    <div className="relative aspect-[3/4] overflow-hidden shadow-sm">
                                        <img
                                            src={optimizeCloudinaryImage(designerImageUrl, { width: 900, height: 1200, crop: 'fill' })}
                                            alt={collection.title}
                                            className="w-full h-full object-cover object-top"
                                        />
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
                                    <div className="prose max-w-none text-gray-700 text-base leading-normal space-y-1">
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
                                    <img
                                        src={optimizeCloudinaryImage(img, { width: 900, height: 1200, crop: 'fill' })}
                                        alt={`Walk ${i}`}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
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
                                    src={optimizeCloudinaryImage(ticketPoster, { width: 900, height: 1200, crop: 'fill' })}
                                    alt="Event Poster"
                                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                                    decoding="async"
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
                                                src={optimizeCloudinaryImage(ticketImgUrl, { width: 1200, crop: 'limit' })}
                                                alt={`Ticket ${idx + 1}`}
                                                className="w-full h-auto object-cover"
                                                loading="lazy"
                                                decoding="async"
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
                                    className="!text-base rich-text-content text-black leading-relaxed text-lg font-light"
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
                                                <img
                                                    src={optimizeCloudinaryImage(descImageUrl, { width: 1000, height: 1300, crop: 'fill' })}
                                                    alt="Description"
                                                    className="w-full h-full object-cover rounded-sm"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
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
            {eventPartners.length > 0 && (
                <div className="py-1 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-black uppercase tracking-wider mb-2">
                            Event Partners
                        </h2>
                        <div className="w-24 h-0.5 bg-[#C7913E] mx-auto"></div>
                    </div>

                    <div className="border-gray-800 py-8">
                        <div className="marquee-wrapper py-8">
                            <div
                                className="marquee-track"
                                style={{ '--marquee-duration': getPartnerMarqueeDuration(eventPartners.length) }}
                            >
                                {partnerMarqueeItems.map((partner, i) => (
                                    <img
                                        key={`${partner._id || partner.url || 'partner'}-${i}`}
                                        src={optimizeCloudinaryImage(partner.url, { width: 320, height: 160, crop: 'fit' })}
                                        alt={`Partner ${(i % eventPartners.length) + 1}`}
                                        className="h-20 object-contain -mx-1"
                                        loading="lazy"
                                        decoding="async"
                                    />
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
            {collectionDays.length > 0 && (
                <div className="bg-white py-8 px-4 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto flex justify-center flex-wrap gap-6">
                        {collectionDays.map((day) => {
                            const isActive = activeDay === day.key;

                            return (
                                <button
                                    key={day.key}
                                    onClick={() => {
                                        setActiveDay(day.key);
                                        scrollToDay(day.key);
                                    }}
                                    className={`
                                        px-8 py-3 uppercase tracking-widest text-sm font-semibold transition-all duration-300
                                        border ${isActive ? 'border-[#C7913E] text-[#C7913E]' : 'border-white text-gray-500 hover:text-black'}
                                    `}
                                >
                                    {day.label} &gt;
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-10 bg-white">
                {event.collections && event.collections
                    .filter(col => !col.day || getCollectionDayKey(col) === activeDay) // Show if no day assigned OR matches active day
                    .map((col, idx) => (
                        <LazyCollection key={col._id || col.title || idx}>
                            {renderCollection(col, idx)}
                        </LazyCollection>
                    ))}
            </div>

            {/* <div className='!text-white mb-10'>
                <CtaSection />
            </div> */}
            <Footer />
        </div>
    );
};

export default EventDetail;
