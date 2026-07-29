import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    MapPin,
    Calendar,
    Clock,
    Check,
    Minus,
    Plus,
    Crown,
    GraduationCap,
    Armchair,
    Sparkles,
    Globe2,
    Users,
    HeartHandshake
} from "lucide-react";
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

const getPartnerMarqueeDuration = (partnerCount) => `${Math.max(18, partnerCount * 2.5)}s`;

const URL_REGEX = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

const ensureString = (value) => {
    if (typeof value === "string") return value;
    if (value == null) return "";
    return String(value);
};

const getImageUrl = (value) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && typeof value.url === "string") return value.url;
    return "";
};

const getSafeCurrency = (value) => {
    const normalized = ensureString(value).trim().toUpperCase();
    return /^[A-Z]{3}$/.test(normalized) ? normalized : "USD";
};

const getSafeId = (value, fallback) => ensureString(value) || fallback;

const stripHtml = (text = "") => ensureString(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const extractYoutubeId = (url = "") => {
    const normalizedUrl = ensureString(url).trim();
    if (!normalizedUrl) return "";

    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = normalizedUrl.match(regExp);
    return match?.[1] || "";
};

const getVideoEmbedUrl = (videoSection) => {
    if (!videoSection || videoSection.type !== "youtube") return "";

    const videoUrl = ensureString(videoSection.url).trim();
    const youtubeId = extractYoutubeId(videoUrl);

    return youtubeId
        ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0`
        : videoUrl;
};

const getCollectionDayKey = (collection) => {
    if (!collection?.day) return "";
    if (collection.day === "custom") {
        return collection.dayLabel?.trim() ? `custom:${collection.dayLabel.trim()}` : "";
    }
    return String(collection.day);
};

const getCollectionDayLabel = (collection) => {
    if (!collection?.day) return "";

    const dayMap = {
        "1": "FIRST DAY",
        "2": "SECOND DAY",
        "3": "THIRD DAY",
        "4": "FOURTH DAY",
        "5": "FIFTH DAY",
    };

    if (collection.day === "custom") {
        return collection.dayLabel?.trim() || "CUSTOM DAY";
    }

    return dayMap[String(collection.day)] || `DAY ${collection.day}`;
};

const getDescriptionLines = (text = "") =>
    stripHtml(text)
        .split(/\n|•|·|-/)
        .map((line) => line.trim())
        .filter(Boolean);

const getTicketIcon = (ticketName = "", index = 0) => {
    const normalized = ticketName.toLowerCase();

    if (normalized.includes("vip")) return Crown;
    if (normalized.includes("student")) return GraduationCap;
    if (normalized.includes("general") || normalized.includes("seat")) return Armchair;

    const fallbackIcons = [Sparkles, GraduationCap, Armchair, Crown];
    return fallbackIcons[index % fallbackIcons.length];
};

const renderTextWithLinks = (text = "") =>
    ensureString(text).split("\n").map((line, lineIndex) => (
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
    const checkoutSectionRef = React.useRef(null);
    const dayRefs = React.useRef({});
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState("");
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const eventDisplayName = ensureString(event?.eventName);
    const eventMainTitle = ensureString(event?.title);
    const ticketTypes = Array.isArray(event?.ticketTypes) ? event.ticketTypes : [];
    const hasTicketOptions = Boolean(event?.hasTickets) && ticketTypes.length > 0;
    const ticketPageHref = `/event-details/${event?.slug || event?._id}?mode=tickets`;
    const partners = Array.isArray(event?.partners) ? event.partners : [];
    const partnerMarqueeItems = [...partners, ...partners];
    const collections = Array.isArray(event?.collections) ? event.collections : [];
    const collectionDays = useMemo(() => {
        const uniqueDays = [];
        const seen = new Set();

        collections.forEach((collection) => {
            const key = getCollectionDayKey(collection);
            if (!key || seen.has(key)) return;

            seen.add(key);
            uniqueDays.push({
                key,
                label: getCollectionDayLabel(collection),
            });
        });

        return uniqueDays;
    }, [collections]);
    const coverImageUrl = getImageUrl(event?.ticketBannerImage) || getImageUrl(event?.coverImage);
    const aboutTitle = ensureString(event?.descriptionSection?.title) || `About ${eventDisplayName || eventMainTitle || "This Event"}`;
    const aboutText = ensureString(event?.descriptionSection?.text || event?.description || "");
    const aboutImageUrl = getImageUrl(event?.descriptionSection?.image) || coverImageUrl;
    const dressCode = ensureString(event?.dressCode) || "Black Tie / Cocktail Attire";
    const eventTime = ensureString(event?.eventTime);
    const eventFacts = [
        {
            icon: Calendar,
            label: "Date",
            value: formatDateSafe(event?.eventDate),
        },
        {
            icon: Clock,
            label: "Time",
            value: eventTime,
        },
        {
            icon: MapPin,
            label: "Location",
            value: ensureString(event?.location) || "Venue to be announced",
        },
        {
            icon: Sparkles,
            label: "Dress Code",
            value: dressCode,
        },
    ].filter((fact) => ensureString(fact.value));
    const aboutHighlights = [
        { icon: Globe2, title: "International Designers" },
        { icon: Users, title: "Empowering Models" },
        { icon: HeartHandshake, title: "Global Philanthropy" },
    ];
    function formatDate(dateString) {
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
    }

    function formatDateSafe(dateString) {
        if (!dateString) return "";
        return formatDate(dateString);
    }

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

                const eventCollections = Array.isArray(response.data?.collections) ? response.data.collections : [];
                const firstTaggedCollection = eventCollections.find((collection) => getCollectionDayKey(collection));
                setActiveDay(firstTaggedCollection ? getCollectionDayKey(firstTaggedCollection) : "");
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleQuantityChange = (ticketId, delta) => {
        setQuantities((prev) => {
            const currentQty = prev[ticketId] || 0;
            const newQty = Math.max(0, Math.min(10, currentQty + delta));
            return { ...prev, [ticketId]: newQty };
        });
    };

    const handleSelectTicket = (ticketId, quantity) => {
        if (!quantity) {
            handleQuantityChange(ticketId, 1);
            return;
        }

        const checkoutSection = checkoutSectionRef.current;
        if (!checkoutSection) return;

        const rect = checkoutSection.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const centeredTop = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);

        window.scrollTo({
            top: Math.max(0, centeredTop),
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (!ticketTypes.length) return;
        let total = 0;
        ticketTypes.forEach((ticket, index) => {
            const qty = quantities[getSafeId(ticket._id, `ticket-${index}`)] || 0;
            total += qty * ticket.price;
        });
        setTotalPrice(total);
    }, [quantities, ticketTypes]);

    const getSelectedTickets = () => {
        if (!ticketTypes.length) return [];
        return ticketTypes
            .map((t, index) => ({
                ticketTypeId: t._id,
                name: t.name,
                price: t.price,
                quantity: quantities[getSafeId(t._id, `ticket-${index}`)] || 0
            }))
            .filter(t => t.quantity > 0);
    };

    const formatCurrency = (amount, currency = "USD") =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: getSafeCurrency(currency),
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);

    const scrollToDay = (dayKey) => {
        const section = dayRefs.current[dayKey];
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const renderTicketExperienceCards = () => {
        if (ticketTypes.length === 0) {
            return (
                <div className="text-center py-14 italic text-[#6D584D]">
                    No tickets available yet.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {ticketTypes.map((ticket, index) => {
                    const ticketId = getSafeId(ticket._id, `ticket-${index}`);
                    const ticketName = ensureString(ticket.name) || "Ticket";
                    const TicketIcon = getTicketIcon(ticketName, index);
                    const features = getDescriptionLines(ticket.description);
                    const quantity = quantities[ticketId] || 0;
                    const ticketPrice = Number(ticket.price) || 0;
                    const totalForTicket = quantity * ticketPrice;
                    const ticketImageUrl = getImageUrl(ticket.image);

                    return (
                        <article
                            key={ticketId}
                            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 grad-bg" />

                            {ticketImageUrl && (
                                <div className="h-44 overflow-hidden">
                                    <img
                                        src={optimizeCloudinaryImage(ticketImageUrl, { width: 900, height: 600, crop: "fill" })}
                                        alt={ticketName}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            )}

                            <div className="p-6 text-center md:p-7">
                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full grad-bg text-white shadow-lg">
                                    <TicketIcon size={24} />
                                </div>

                                <h4 className="font-playfair text-[1.55rem] leading-tight text-black uppercase">
                                    {ticketName}
                                </h4>

                                <div className="my-5 h-px w-full bg-gray-200" />

                                <ul className="min-h-[150px] space-y-3 text-left text-[15px] leading-6 text-gray-700">
                                    {features.length > 0 ? features.map((feature, featureIndex) => (
                                        <li key={`${ticketId}-feature-${featureIndex}`} className="flex gap-3">
                                            <Check size={15} className="mt-1 shrink-0 text-[#C7913E]" />
                                            <span>{feature}</span>
                                        </li>
                                    )) : (
                                        <li className="flex gap-3">
                                            <Check size={16} className="mt-1 shrink-0 text-[#C7913E]" />
                                            <span>Entry to the featured event experience.</span>
                                        </li>
                                    )}
                                </ul>

                                <div className="my-6 h-px w-full bg-gray-200" />

                                <div className="mb-5">
                                    <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Price</p>
                                    <p className="font-playfair text-[2.15rem] text-black">
                                        {formatCurrency(ticketPrice, ticket.currency)}
                                    </p>
                                    {quantity > 0 && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            {quantity} selected • {formatCurrency(totalForTicket, ticket.currency)}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-5 flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => handleQuantityChange(ticketId, -1)}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-[#734F1C] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        disabled={!quantity}
                                        aria-label={`Decrease ${ticketName} quantity`}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <div className="min-w-[84px] rounded-full border border-gray-300 bg-white px-5 py-2 text-center text-lg font-semibold text-black">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(ticketId, 1)}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-[#734F1C] transition hover:bg-gray-100"
                                        aria-label={`Increase ${ticketName} quantity`}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleSelectTicket(ticketId, quantity)}
                                    className={`w-full rounded-lg px-5 py-3 text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${quantity > 0 ? "grad-bg text-white" : "bg-black text-white hover:bg-gray-800"}`}
                                >
                                    {quantity > 0 ? "Selected" : `Select ${ticketName}`}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        );
    };

    const handleCheckout = () => {
        // Safe check for ticketTypes
        if (!ticketTypes.length) return;

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
        const images = Array.isArray(collection.images) ? collection.images.map(img => getImageUrl(img)).filter(Boolean) : [];
        const designerImageUrl = getImageUrl(collection.designerImage);
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

    try {
    return (
        <div className="bg-white min-h-screen text-black">
            <Navbar />

            {showTicketsOnly ? (
                <div className="bg-white">
                    <section className="relative overflow-hidden pt-24">
                        <div className="relative min-h-[540px] md:min-h-[620px]">
                            {coverImageUrl && (
                                <img
                                    src={optimizeCloudinaryImage(coverImageUrl, { width: 1800, height: 1100, crop: "fill" })}
                                    alt={eventDisplayName || eventMainTitle || "Event"}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    decoding="async"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/45" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                            <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-6 py-16 md:min-h-[620px] md:px-10">
                                <div className="max-w-[430px]">
                                    <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#C7913E] mb-4 font-semibold">
                                        BUY TICKETS
                                    </p>
                                    <h1 className="font-playfair text-5xl leading-[1.02] text-white md:text-7xl">
                                        {eventDisplayName || eventMainTitle}
                                    </h1>
                                    <p className="mt-8 text-lg leading-8 text-white/90">
                                        {stripHtml(aboutText).slice(0, 145) || "A global fashion experience blending luxury, culture, and purpose in the heart of New York City."}
                                    </p>
                                    <button
                                        onClick={() => document.getElementById("ticket-experience-section")?.scrollIntoView({ behavior: "smooth" })}
                                        className="mt-8 grad-bg px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-white transition-colors duration-200"
                                    >
                                        View Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="px-4 py-0 md:px-8 bg-white">
                        <div className="mx-auto max-w-7xl border-x border-b border-gray-200 bg-white px-6 py-10 md:px-10">
                            <div className="mb-8 flex items-center justify-center gap-4">
                                <div className="h-px w-14 grad-bg md:w-24" />
                                <h2 className="font-playfair text-3xl text-black md:text-5xl">Event Details</h2>
                                <div className="h-px w-14 grad-bg md:w-24" />
                            </div>
                            <div className={`grid gap-6 ${eventFacts.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                                {eventFacts.map((fact, index) => {
                                    const Icon = fact.icon;
                                    return (
                                        <div key={`${fact.label}-${index}`} className={`text-center ${index < eventFacts.length - 1 ? "md:border-r md:border-gray-200" : ""} md:px-6`}>
                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-[#C7913E]">
                                                <Icon size={22} />
                                            </div>
                                            <p className="font-playfair text-[2rem] text-black">{fact.label}</p>
                                            <p className="mt-3 text-lg leading-8 text-gray-600">{ensureString(fact.value)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section id="ticket-experience-section" className="px-4 py-12 md:px-8 md:py-16 bg-white">
                        <div className="mx-auto max-w-7xl">
                            <h2 className="text-center font-playfair text-4xl text-black md:text-5xl">Choose Your Experience</h2>
                            <div className="mt-12">
                                {renderTicketExperienceCards()}
                            </div>

                            <div ref={checkoutSectionRef} className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Total Amount</p>
                                        <p className="mt-2 font-playfair text-4xl text-black">
                                            {formatCurrency(totalPrice, ticketTypes[0]?.currency || "USD")}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={totalPrice === 0}
                                        className="grad-bg rounded-lg px-8 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {!showTicketsOnly && (
                        <section className="px-4 pb-16 md:px-8 md:pb-24 bg-white">
                            <div className="mx-auto grid max-w-7xl gap-0 overflow-hidden border border-gray-200 bg-gray-50 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="p-8 md:p-12">
                                    <h2 className="font-playfair text-4xl text-black md:text-5xl">{aboutTitle}</h2>
                                    <div className="rich-text-content event-rich-text mt-5 max-w-none text-lg leading-relaxed font-light text-black">
                                        {aboutText ? renderTextWithLinks(aboutText) : <p>This event brings together fashion, culture, and a premium runway experience.</p>}
                                    </div>
                                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                        {aboutHighlights.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={item.title} className="text-center">
                                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-[#C7913E]">
                                                        <Icon size={24} />
                                                    </div>
                                                    <p className="mt-3 font-playfair text-xl text-black">{item.title}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="min-h-[320px] overflow-hidden bg-white">
                                    {aboutImageUrl ? (
                                        <img
                                            src={optimizeCloudinaryImage(aboutImageUrl, { width: 1000, height: 900, crop: "fill" })}
                                            alt={aboutTitle}
                                            className="h-full w-full object-cover"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[#8a6b56]">Event Image</div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            ) : (
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
                            <span>{ensureString(event.location)}</span>
                        </div>
                    </div>
                </header>
            )}

            <div className={`max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 ${showTicketsOnly ? "hidden" : ""}`}>
                {/* Left Column: Description - Hide on ticket purchase view */}
                {!showTicketsOnly && (
                    <div className="lg:col-span-3">
                        {eventDisplayName && (
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-black mb-8 leading-tight uppercase tracking-wider">
                                {eventDisplayName}
                            </h2>
                        )}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="prose max-w-none flex-1 space-y-1 text-base leading-normal text-gray-700">
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
                                    {hasTicketOptions && (
                                        <div className="mt-10 flex justify-center">
                                            <Link
                                                to={ticketPageHref}
                                                className="grad-bg inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-colors duration-200"
                                            >
                                                Buy Tickets
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {partners.length > 0 && (
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
                                style={{ '--marquee-duration': getPartnerMarqueeDuration(partners.length) }}
                            >
                                {partnerMarqueeItems.map((partner, i) => (
                                    <img
                                        key={`${partner._id || getImageUrl(partner) || 'partner'}-${i}`}
                                        src={optimizeCloudinaryImage(getImageUrl(partner), { width: 320, height: 160, crop: "fit" })}
                                        alt={`Partner ${(i % partners.length) + 1}`}
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

            {!showTicketsOnly && event.videoSection && event.videoSection.isVisible && (event.videoSection.url || event.videoSection.file) && (
                <section className="bg-white px-4 py-12 md:px-8 md:py-16">
                    <div className="mx-auto max-w-5xl">
                        {event.videoSection.title && (
                            <h2 className="mb-6 text-center font-playfair text-3xl font-bold uppercase tracking-wider text-black md:text-4xl">
                                {event.videoSection.title}
                            </h2>
                        )}
                        <div className="relative aspect-video overflow-hidden rounded-sm bg-black shadow-2xl">
                            {event.videoSection.type === "youtube" ? (
                                <iframe
                                    src={getVideoEmbedUrl(event.videoSection)}
                                    title={event.videoSection.title || "Event Video"}
                                    className="absolute inset-0 h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={event.videoSection.url || event.videoSection.file}
                                    className="h-full w-full object-contain"
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
                </section>
            )}

            {!showTicketsOnly && collectionDays.length > 0 && (
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
                                        border ${isActive ? "border-[#C7913E] text-[#C7913E]" : "border-white text-gray-500 hover:text-black"}
                                    `}
                                >
                                    {day.label} &gt;
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Collections Section - Hide on ticket purchase view */}
            {!showTicketsOnly && (
                <div className="mt-10 bg-white">
                    {collections
                        .filter((collection) => !collection.day || getCollectionDayKey(collection) === activeDay)
                        .map((col, idx) => {
                            const dayKey = getCollectionDayKey(col);

                            return (
                                <div
                                    key={col._id || col.id || `${dayKey || "collection"}-${idx}`}
                                    ref={(element) => {
                                        if (dayKey && element) {
                                            dayRefs.current[dayKey] = element;
                                        }
                                    }}
                                >
                                    {renderCollection(col, idx)}
                                </div>
                            );
                        })}
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
    } catch (error) {
        console.error("EventTicketDetails render error:", error, event);
        return (
            <div className="bg-white min-h-screen text-black">
                <Navbar />
                <div className="min-h-[60vh] flex items-center justify-center px-6 text-center">
                    <div>
                        <h1 className="font-playfair text-3xl text-[#2b1811]">Unable to load this ticket page</h1>
                        <p className="mt-4 text-[#6b5649]">
                            This event has some missing or unsupported ticket data. Please try another event or contact support.
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
