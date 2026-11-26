import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Globe,
  Sparkles,
  Handshake,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { baseURL } from "../config/api.js";
import axios from "axios";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";

// Existing local project assets
import goldenLogo from "../assets/glodenlogo.png";
import ladyImage from "../assets/lady image.png";
import runwayImg from "../assets/runnaway.jpg";
import eventImg1 from "../assets/Events.jpg";
import eventImg2 from "../assets/Events-1.jpg";
import eventImg3 from "../assets/Events-2.jpg";
import eventImg4 from "../assets/Events-3.jpg";
import eventImg5 from "../assets/Events-4.jpg";
import designer1 from "../assets/designer1.jpg";
import designer2 from "../assets/designer2.jpg";
import ourServiceImg from "../assets/ourservice.jpg";
import addon1 from "../assets/addon1.jpg";
import addon3 from "../assets/addon3.jpg";
import eventRsvpImg from "../assets/eventrsvp.jpg";
import nycSkylineReference from "../assets/nyc-skyline-reference.jpg";
import runwayModelsReference from "../assets/runway-models-reference.jpg";

// Video assets from real landing page
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";

/* Header Video Slider Component identical to real landing page */
function VideoSlider({ slides, onSlideChange }) {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);
  const scrollTimeout = useRef(null);

  const goToSlide = useCallback(
    (index) => {
      if (!slides || slides.length === 0) return;
      setCurrent(index);
      if (onSlideChange) onSlideChange(index);
    },
    [onSlideChange, slides]
  );

  const goToNext = useCallback(() => {
    if (!slides || slides.length === 0) return;
    const nextIndex = (current + 1) % slides.length;
    goToSlide(nextIndex);
  }, [current, goToSlide, slides]);

  useEffect(() => {
    if (!slides || slides.length === 0) {
      setCurrent(0);
      videoRefs.current = [];
    } else if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides, current]);

  // Initial play
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    if (videoRefs.current[0]) {
      videoRefs.current[0]
        .play()
        .catch((e) => console.log("Autoplay prevented", e));
    }
  }, [slides]);

  const handleEnded = () => {
    if (!slides || slides.length === 0) return;
    goToNext();
  };

  const handleVideoError = (index, src) => {
    console.error("Landing slider video failed to load:", src);
    if (index === current && slides.length > 1) {
      goToNext();
    }
  };

  // Sync play state when current changes
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === current) {
        video.currentTime = 0;
        video.play().catch((e) => console.log("Play error", e));
      } else {
        video.pause();
      }
    });
  }, [current, slides]);

  const handleScroll = (e) => {
    if (!slides || slides.length === 0) return;
    if (scrollTimeout.current) return;
    if (Math.abs(e.deltaX) > 20) {
      goToNext();
      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 1000);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full" onWheel={handleScroll}>
      {/* Videos */}
      <div className="absolute inset-0 bg-black">
        {slides.map((slide, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            src={slide.video}
            preload="metadata"
            autoPlay={current === index}
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000
              ${current === index ? "opacity-100" : "opacity-0"}
              ${index === 1 ? "object-top" : ""}
            `}
            onEnded={handleEnded}
            onError={() => handleVideoError(index, slide.video)}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <button
          type="button"
          aria-label="Next video"
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45 md:right-8 md:h-14 md:w-14 cursor-pointer"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Dynamic Content (LEFT) - Identical to real landing page */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 md:px-10 md:pb-8">
        {slides[current] && (
          <h1 className="pointer-events-none text-4xl sm:text-5xl md:text-6xl lg:text-[100px] leading-tight text-white max-w-3xl whitespace-pre-line">
            {slides[current].title}
          </h1>
        )}
        {slides[current]?.subtitle && (
          <p className="mt-4 max-w-3xl text-sm uppercase tracking-wide text-white md:text-base">
            <span className="whitespace-pre-line">
              {slides[current].subtitle}
            </span>
          </p>
        )}
        <div className="mt-4">
          <Link to="/service?tab=designer">
            <button className="grad-bg text-white h-[45px] w-[181px] text-2xl">
              APPLY NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SampleLandingPage() {
  const navigate = useNavigate();

  // Dynamic state from backend APIs
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [featuredProductions, setFeaturedProductions] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Default video slides matching real landing page
  const defaultSlides = [
    {
      video: video1,
      title: "NEW YORK\nCITY",
      subtitle: "MODA WEEK INTERNATIONAL",
    },
    {
      video: video2,
      title: "AMAZONAS\nFASHION WEEK",
      subtitle: "GLOBAL RUNWAY SHOWCASE",
    },
    {
      video: video3,
      title: "HAUTE\nCOUTURE",
      subtitle: "WHERE FASHION MEETS CULTURE",
    },
  ];

  const [slides, setSlides] = useState(defaultSlides);

  const getVideoSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${baseURL}${url}`;
  };

  const isPlayableSliderVideo = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      return false;
    }
    return (
      lowerUrl.startsWith("/uploads/") ||
      lowerUrl.endsWith(".mp4") ||
      lowerUrl.endsWith(".webm") ||
      lowerUrl.endsWith(".ogg")
    );
  };

  // Fetch videos identical to real landing page
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${baseURL}/api/landing-videos?type=landing`);
        const data = await response.json();
        if (data && data.length > 0) {
          const candidateSlides = data
            .filter((item) => isPlayableSliderVideo(item.videoUrl))
            .map((item) => ({
              video: getVideoSrc(item.videoUrl),
              title: item.title
                ? item.title
                    .replace("NEW YORK CITY", "NEW YORK\nCITY")
                    .replace("AMAZONAS FASHION WEEK", "AMAZONAS\nFASHION WEEK")
                : "MODA WEEK INTERNATIONAL",
              subtitle: item.subtitle || "GLOBAL RUNWAY SHOWCASE",
              isDynamic: true,
            }));

          if (candidateSlides.length > 0) {
            setSlides(candidateSlides);
            setCurrentSlideIndex(0);
          }
        }
      } catch (error) {
        console.warn("Using fallback local videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Fetch upcoming events, productions, and partners
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const upRes = await axios.get(
          `${baseURL}/api/upcoming-events/all?status=live&showOnLandingPage=true`
        );
        if (Array.isArray(upRes.data) && upRes.data.length > 0) {
          setUpcomingEvents(upRes.data);
        }
      } catch (e) {
        console.warn("Fallback upcoming events:", e);
      }

      try {
        const pastRes = await axios.get(
          `${baseURL}/api/events/all?status=published`
        );
        if (Array.isArray(pastRes.data) && pastRes.data.length > 0) {
          setFeaturedProductions(pastRes.data);
        }
      } catch (e) {
        console.warn("Fallback past events:", e);
      }
    };

    fetchAllData();
  }, []);

  // Auto-rotate events every 8 seconds if multiple events exist
  useEffect(() => {
    if (!upcomingEvents || upcomingEvents.length <= 1) return;
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [upcomingEvents]);

  const handlePrevEvent = () => {
    if (!upcomingEvents || upcomingEvents.length <= 1) return;
    setActiveEventIndex((prev) =>
      prev === 0 ? upcomingEvents.length - 1 : prev - 1
    );
  };

  const handleNextEvent = () => {
    if (!upcomingEvents || upcomingEvents.length <= 1) return;
    setActiveEventIndex((prev) => (prev + 1) % upcomingEvents.length);
  };

  // Active upcoming event for Section 2
  const currentEvent =
    upcomingEvents && upcomingEvents.length > 0
      ? upcomingEvents[activeEventIndex] || upcomingEvents[0]
      : null;

  const eventName =
    currentEvent?.eventName ||
    currentEvent?.title ||
    "MWINTL NEW YORK 2026";
  const eventDate =
    currentEvent?.eventDate ||
    currentEvent?.date ||
    "FEB 12 – 16, 2026";
  const eventLocation =
    currentEvent?.location ||
    currentEvent?.city ||
    "NEW YORK, USA";

  // Clean description: clean up linebreaks and clamp smoothly
  const formatEventDesc = (desc) => {
    if (!desc) {
      return "International designers, global brands, media, buyers and industry leaders.";
    }
    const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
    const text = lines.length > 0 ? lines[0] : desc;
    if (text.length > 150) {
      return text.slice(0, 150) + "...";
    }
    return text;
  };

  const eventDescription = formatEventDesc(currentEvent?.description);

  const eventLink = currentEvent
    ? `/event-details/${currentEvent.slug || currentEvent._id}`
    : "/service?tab=designer";

  const eventCover =
    currentEvent?.ticketBannerImage?.url ||
    currentEvent?.coverImage?.url ||
    (typeof currentEvent?.coverImage === "string" ? currentEvent.coverImage : null) ||
    nycSkylineReference;

  // Business Opportunities categories data
  const businessCategories = [
    {
      id: "designers",
      title: "DESIGNERS",
      description: "Showcase your collection on an international stage.",
      image: designer1,
      link: "/service?tab=designer",
      badge: "RUNWAY",
    },
    {
      id: "sponsors",
      title: "SPONSORS",
      description: "Align your brand with a global fashion platform.",
      image: ourServiceImg,
      link: "/service?tab=sponsor",
      badge: "ALLIANCE",
    },
    {
      id: "exhibitors",
      title: "EXHIBITORS",
      description: "Present your products and services.",
      image: addon1,
      link: "/service?tab=service",
      badge: "EXHIBITION",
    },
    {
      id: "brands",
      title: "BRANDS",
      description: "Create strategic partnerships.",
      image: addon3,
      link: "/service?tab=buyer",
      badge: "COMMERCE",
    },
    {
      id: "media",
      title: "MEDIA",
      description: "Gain exclusive access and coverage.",
      image: eventRsvpImg,
      link: "/news-room",
      badge: "PRESS",
    },
  ];

  // Why Moda Week differentiators
  const differentiators = [
    {
      icon: Globe,
      title: "INTERNATIONAL PLATFORM",
      description: "Global reach connecting designers & markets worldwide",
    },
    {
      icon: Sparkles,
      title: "PROFESSIONAL PRODUCTIONS",
      description: "World-class runway staging, lighting, and creative direction",
    },
    {
      icon: Handshake,
      title: "STRATEGIC PARTNERSHIPS",
      description: "High-value corporate, luxury, and cultural alliances",
    },
    {
      icon: TrendingUp,
      title: "BUSINESS OPPORTUNITIES",
      description: "Direct commercial channels for buyers, brands, and designers",
    },
    {
      icon: Users,
      title: "GLOBAL NETWORK",
      description: "Extensive network of VIPs, influencers, and industry leaders",
    },
    {
      icon: Award,
      title: "INDUSTRY EXPOSURE",
      description: "Unmatched international media, press, and digital visibility",
    },
  ];

  // Gallery items for Section 5
  const defaultGalleryImages = [
    { img: runwayImg, title: "RUNWAY SERIES", subtitle: "Haute Couture" },
    { img: eventImg3, title: "NEW YORK SHOWCASE", subtitle: "International Collections" },
    { img: eventImg1, title: "AMAZONAS FASHION WEEK", subtitle: "Cultural Grandeur" },
    { img: eventImg2, title: "SIGNATURE RUNWAY", subtitle: "Designer Collective" },
    { img: eventImg5, title: "GLOBAL COUTURE", subtitle: "Evening Gala" },
  ];

  const galleryItems =
    featuredProductions.length >= 4
      ? featuredProductions.slice(0, 5).map((e) => ({
          img: e.thumbnail?.url || e.thumbnail || runwayImg,
          title: (e.eventName || e.city || "MODA PRODUCTION").toUpperCase(),
          subtitle: e.city || "Fashion Showcase",
        }))
      : defaultGalleryImages;

  return (
    /* The page background is white (bg-white text-black), matching the real landing page! */
    <div className="min-h-screen bg-white text-black font-inter selection:bg-[#C7913E] selection:text-white overflow-x-hidden">
      {/* Hero Section - Exactly identical to real landing page */}
      <section className="relative h-screen overflow-hidden">
        <Navbar />
        <VideoSlider
          slides={slides}
          onSlideChange={setCurrentSlideIndex}
        />
      </section>

      {/* Calling All Designers Banner (from the real landing page design system) */}
      <section className="bg-gradient-to-r from-[#050505] via-[#6F4A17] to-[#D29B33] shadow-[0_10px_22px_rgba(0,0,0,0.16)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-9 md:py-4.5">
          <div className="text-white">
            <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-[0.03em] md:text-2xl">
              Calling All Designers
            </h2>
            <p className="mt-1 text-xs sm:text-sm tracking-[0.06em] text-white/90 md:text-base">
              Showcase your collections on a global stage.
            </p>
          </div>

          <Link
            to="/service?tab=designer"
            className="inline-flex w-full items-center justify-center border border-[#d2ab59] bg-white px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#8C5D25] shadow-[0_6px_14px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff8eb] md:w-auto md:min-w-[260px] md:px-7"
          >
            Apply to Showcase Today
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: UPCOMING EVENTS SECTION
          Panoramic 3-panel luxury banner aligned with the website's signature
          white & gold theme (no heavy black background):
          Left: Event Info & Signature Gold Gradient Button on Ivory
          Center: Event / Skyline showcase
          Right: "Save the Date" with Runway models on warm light luxury backdrop
         ========================================================================= */}
      <section className="bg-white py-8 lg:py-12 border-b border-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#E4D5BE] bg-white rounded-xs shadow-[0_10px_35px_rgba(140,93,37,0.07)] overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[280px] lg:h-[300px] xl:h-[320px]">
              
              {/* Left Panel (~38%): Event Details */}
              <div className="w-full lg:w-[38%] bg-[#FDFCF9] p-6 sm:p-8 lg:p-8 xl:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#EFE5D7]">
                <div>
                  {/* Header row: gold indicator notch + eyebrow + pagination */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      {/* Golden accent bar & dot indicator matching reference design */}
                      <span className="w-5 sm:w-6 h-[2px] bg-[#C7913E]" />
                      <span className="w-2 h-2 rounded-full bg-[#8C5D25] shadow-[0_0_8px_rgba(199,145,62,0.6)]" />
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#8C5D25]">
                        UPCOMING EVENT
                      </span>
                    </div>

                    {/* Navigation controls if multiple events from backend */}
                    {upcomingEvents.length > 1 && (
                      <div className="flex items-center gap-1.5 bg-white border border-[#E0D0BC] px-2 py-1 rounded-xs shadow-2xs">
                        <button
                          type="button"
                          onClick={handlePrevEvent}
                          aria-label="Previous event"
                          className="text-gray-500 hover:text-[#8C5D25] transition cursor-pointer p-0.5"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-gray-700 font-mono font-semibold tracking-wider">
                          {String(activeEventIndex + 1).padStart(2, "0")} / {String(upcomingEvents.length).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextEvent}
                          aria-label="Next event"
                          className="text-gray-500 hover:text-[#8C5D25] transition cursor-pointer p-0.5"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Event Title in Serif Playfair */}
                  <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[26px] xl:text-[30px] font-bold tracking-tight text-black uppercase leading-snug mb-3">
                    {eventName}
                  </h2>

                  {/* Date and Location */}
                  <div className="mb-4">
                    <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#8C5D25] mb-0.5">
                      {eventDate}
                    </p>
                    <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-black">
                      {eventLocation}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-md line-clamp-2 font-normal mb-6">
                    {eventDescription}
                  </p>
                </div>

                {/* View Event Details Button (Signature Website Brand Gradient) */}
                <div>
                  <Link
                    to={eventLink}
                    className="grad-bg text-white font-bold text-xs uppercase tracking-[0.18em] px-7 py-3.5 shadow-[0_4px_14px_rgba(140,93,37,0.25)] hover:shadow-[0_6px_20px_rgba(140,93,37,0.35)] hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2 group w-fit"
                  >
                    <span>VIEW EVENT DETAILS</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Middle Panel (~35%): Panoramic Event Image / Skyline */}
              <div className="w-full lg:w-[35%] relative overflow-hidden bg-[#FAF8F5] min-h-[220px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-[#EFE5D7] group">
                <img
                  src={eventCover}
                  alt={eventName}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Subtle bottom badge for luxury touch */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5D25] bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-[#d2ab59]/60 rounded-xs shadow-xs">
                    OFFICIAL PRODUCTION
                  </span>
                  <span className="text-[10px] text-white/90 drop-shadow-sm tracking-wider uppercase font-mono font-semibold">
                    GLOBAL SHOWCASE
                  </span>
                </div>
              </div>

              {/* Right Panel (~27%): Save The Date & Runway Models */}
              <div className="w-full lg:w-[27%] relative overflow-hidden bg-[#FAF7F2] min-h-[200px] lg:min-h-full flex items-center group">
                
                {/* Models Image pinned to right half */}
                <div className="absolute top-0 right-0 bottom-0 w-[55%] sm:w-[50%] lg:w-[58%] overflow-hidden pointer-events-none">
                  <img
                    src={runwayModelsReference || runwayImg}
                    alt="Haute Couture Runway"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Soft light fade gradient for flawless legibility of the typography */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/45 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/40 via-transparent to-transparent" />
                </div>

                {/* Text Overlay on Left Side of this Panel */}
                <div className="relative z-10 p-6 sm:p-7 lg:p-7 xl:p-8 max-w-[65%]">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#8C5D25] mb-2.5">
                    SAVE THE DATE
                  </p>
                  <h3 className="font-playfair text-xl sm:text-2xl lg:text-[23px] xl:text-[26px] font-bold uppercase tracking-wider text-black leading-tight">
                    FASHION.
                    <br />
                    BUSINESS.
                    <br />
                    CONNECTIONS.
                  </h3>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BUSINESS OPPORTUNITIES
          White background matching the real landing page.
         ========================================================================= */}
      <section className="bg-[#fafafa] py-16 lg:py-24 border-b border-gray-200">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Heading with subtle ornamental lines */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C7913E]" />
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-l from-[#8C5D25] to-[#C7913E] bg-clip-text text-transparent uppercase text-center">
              EXPLORE BUSINESS OPPORTUNITIES
            </h2>
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C7913E]" />
          </div>
          <p className="text-center text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500 mb-12">
            Clear pathways for each audience to collaborate, grow, and lead
          </p>

          {/* 5 Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {businessCategories.map((cat) => (
              <div
                key={cat.id}
                className="group flex flex-col bg-white border border-gray-200 hover:border-[#C7913E] transition-all duration-300 rounded-sm overflow-hidden shadow-sm hover:shadow-[0_12px_28px_rgba(199,145,62,0.18)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-75" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/95 border border-[#d2ab59]/60 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8C5D25] rounded-xs shadow-xs">
                    {cat.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-playfair text-lg font-bold uppercase tracking-wider text-black mb-2 group-hover:text-[#8C5D25] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-5">
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    to={cat.link}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-[0.16em] text-[#8C5D25] hover:text-[#C7913E] transition-colors group/link pt-2.5 border-t border-gray-100"
                  >
                    LEARN MORE
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: WHY MODA WEEK INTERNATIONAL?
          Horizontal features strip with clean icons on white background.
         ========================================================================= */}
      <section className="bg-white border-b border-gray-200 py-16 lg:py-20">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C5D25] mb-1">
              PLATFORM ADVANTAGES
            </h3>
            <p className="font-playfair text-2xl sm:text-3xl font-bold uppercase text-black">
              WHY MODA WEEK INTERNATIONAL?
            </p>
          </div>

          {/* 6 Horizontal Differentiator Items */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {differentiators.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-4 rounded-sm border border-transparent hover:border-gray-200 hover:bg-[#fafafa] transition-all duration-300 group"
                >
                  {/* Clean Icon Container */}
                  <div className="w-14 h-14 rounded-full bg-[#fff8eb] border border-[#d2ab59]/60 flex items-center justify-center text-[#8C5D25] mb-4 shadow-xs group-hover:border-[#C7913E] group-hover:shadow-[0_4px_16px_rgba(199,145,62,0.25)] group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#8C5D25]" />
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2 leading-snug">
                    {item.title}
                  </h4>

                  {/* Short description */}
                  <p className="text-[11px] text-gray-600 leading-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FEATURED PRODUCTIONS
          Gallery on clean white/light background.
         ========================================================================= */}
      <section className="bg-[#fafafa] py-16 lg:py-24 border-b border-gray-200">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C7913E]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#8C5D25] font-bold">
                  GLOBAL RUNWAYS
                </span>
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black uppercase">
                FEATURED PRODUCTIONS
              </h2>
            </div>

            <div>
              <Link
                to="/past-events"
                className="inline-flex items-center gap-2 border border-[#8C5D25] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8C5D25] hover:bg-[#fff8eb] shadow-xs transition-all duration-300"
              >
                VIEW GALLERY
                <ArrowRight className="w-3.5 h-3.5 text-[#8C5D25]" />
              </Link>
            </div>
          </div>

          {/* Panoramic Production Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/past-events")}
                className="group relative aspect-[3/4] rounded-sm overflow-hidden bg-black border border-gray-200 cursor-pointer shadow-md"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#d2ab59] font-bold mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-playfair text-sm sm:text-base font-bold uppercase text-white leading-snug group-hover:text-[#d2ab59] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FINAL CALL TO ACTION
          Closing section with fashion imagery and conversion buttons in
          website's signature light gold luxury theme.
         ========================================================================= */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="bg-gradient-to-br from-[#FCFAF6] via-[#F8F3EA] to-[#F4EBDC] text-black border-2 border-[#D2AB59]/60 rounded-xs p-8 sm:p-12 lg:p-16 shadow-[0_16px_40px_rgba(140,93,37,0.09)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Fashion Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] rounded-xs overflow-hidden border-2 border-[#C7913E]/50 shadow-xl group">
                  <img
                    src={runwayImg}
                    alt="Build Your Business with MWINTL"
                    className="w-full h-[340px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d2ab59] block mb-1">
                      MODA WEEK INTERNATIONAL
                    </span>
                    <span className="font-playfair text-lg text-white font-medium">
                      Global Runway & Business Platform
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Headline, Message, CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                <span className="text-xs uppercase tracking-[0.25em] text-[#8C5D25] font-bold block mb-3">
                  ELEVATE YOUR FASHION PRESENCE
                </span>

                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-5 leading-tight">
                  BUILD YOUR BUSINESS
                  <br />
                  <span className="grad-text">WITH MWINTL</span>
                </h2>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xl mb-8">
                  Join an international fashion platform creating opportunities,
                  strategic connections, and global impact across premier
                  commercial and cultural markets.
                </p>

                {/* Conversion Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to="/registration"
                    className="grad-bg inline-flex items-center justify-center px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(199,145,62,0.35)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(199,145,62,0.5)] hover:-translate-y-0.5 group"
                  >
                    APPLY NOW
                    <ArrowRight className="ml-2.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center border-2 border-[#8C5D25] bg-white px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#8C5D25] shadow-xs transition-all duration-300 hover:bg-[#fff8eb] hover:-translate-y-0.5 group"
                  >
                    INQUIRE ABOUT PARTNERSHIPS
                    <ArrowRight className="ml-2.5 h-4 w-4 transition-transform group-hover:translate-x-1 text-[#8C5D25]" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Existing Shared Footer */}
      <Footer />
    </div>
  );
}
