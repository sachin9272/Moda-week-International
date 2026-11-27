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
import { isEventPast, sortEventsByDateDesc } from "../utils/eventDate.js";

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

// Cache keys for instantaneous rendering on page refresh without placeholder flash
const CACHE_KEYS = {
  UPCOMING: "mw_sample_landing_upcoming_events",
  FEATURED: "mw_sample_landing_featured_productions",
  SLIDES: "mw_sample_landing_slides",
};

const getInitialStorage = (key, fallback) => {
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return fallback;
};

// Initial live event data so first paint renders live images immediately
const LIVE_DEFAULT_UPCOMING = [
  {
    _id: "6ad039fc8c447ccb2b97bd9d",
    title: "NEW YORK CITY FASHION SHOW ",
    eventName: "NEW YORK CITY FASHION SHOW",
    slug: "newyorkcityfashionshow",
    eventDate: "September 04, 2027",
    eventTime: "3:00PM - 10:00PM",
    location: "1535 Broadway, New York, NY 10036",
    description: "MODA WEEK INTERNATIONAL (MWINTL) proudly presents New York City Fashion Show (NYCFS) 2027, an international fashion and business event taking place at the prestigious New York Marriott Marquis in the heart of Times Square.",
    ticketBannerImage: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/1794178093129-970553251-064514e6-5052-4676-b059-0187401b6adf.png"
    },
    coverImage: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/1792104896268-180898133-2NYCFS_Poster.png"
    }
  }
];

const LIVE_DEFAULT_FEATURED = [
  {
    _id: "6ac6f8adc2219b7c803ffd7f",
    eventName: "SYRACUSE FASHION WEEKEND",
    slug: "syracusefashionweekend",
    city: "201 E. Washington Street, Syracuse, NY 13202, USA",
    date: "December 19, 2026",
    thumbnail: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/1793662528887-318127423-SFW-Poster.png"
    }
  },
  {
    _id: "6b0935ce849ede1cf5ae230e",
    eventName: "AMAZONAS FASHION WEEK",
    slug: "amazonasfashionweekkm11leticiaam",
    city: "KM11, LETICIA, AM-COLOMBIA",
    date: "DECEMBER 05, 2026",
    thumbnail: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/1792113762893-16642974-AFW-Poster.png"
    }
  },
  {
    _id: "69d48edf880a97b113247479",
    eventName: "NEW YORK CITY FASHION SHOW",
    slug: "newyorkcityfashionshow2026",
    city: "THE MEZZANINE | 55 BROADWAY, NEW YORK, NY 10006",
    date: "SEPTEMBER 19, 2026",
    thumbnail: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/1787857899994-757045417-WhatsAppImage2026-08-27at14.52.35.jpeg"
    }
  },
  {
    _id: "698c11654bb08a1139414ea5",
    eventName: "₿RUNCH FINANCIERO",
    slug: "bitcoinrunchfinanciero",
    city: "CAMPUS WORTEV Ciudad de México, Mexico",
    date: "August 1, 2026",
    thumbnail: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/w6et0vlclo7br4m0fuel.jpg"
    }
  },
  {
    _id: "696e4a7dd18225d99c51482d",
    eventName: "AMAZONAS FASHION WEEK",
    slug: "amazonasfashionweektabatingabrazil",
    city: "GM3 - TABATINGA, AMAZONAS - BRAZIL ",
    date: "SATURDAY JUNE 20, 2026",
    thumbnail: {
      url: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/upcoming-events/1785702529554-450956166-a755efcc-1bfd-416a-aaf7-ac7e3ad4cdbd.png"
    }
  }
];

const LIVE_DEFAULT_SLIDES = [
  {
    video: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/landing-videos/1792118515638-673805255-NewYorkMarriottMarquisvideo.mp4",
    title: "NYC FASHION SHOW",
    subtitle: "VENUE: THE MARRIOTT MARQUIS | DATE: SEPT 04, 2027 | AUTUMN/WINTER -2027/2028",
    isDynamic: true
  },
  {
    video: "https://moda-week.s3.us-east-1.amazonaws.com/moda-week-international/dev/landing-videos/1787194004011-649185267-THEMEZZANINE_VENUE.mp4",
    title: "NYC FASHION SHOW",
    subtitle: "VENUE: THE MEZZANINE |  DATE: SEPT 19,2026 | AUTUMN/WINTER -2026/2027",
    isDynamic: true
  },
  {
    video: `${baseURL}/uploads/videos/video-1776802283690.MP4`,
    title: "AFW TABATINGA, BRAZIL",
    subtitle: "VENUE: GM3 - DATE: JUNE 20,2026 |  SUMMER - 2026/2027",
    isDynamic: true
  }
];

export default function SampleLandingPage() {
  const navigate = useNavigate();

  // Dynamic state from backend APIs with instant cache restoration
  const [upcomingEvents, setUpcomingEvents] = useState(() =>
    getInitialStorage(CACHE_KEYS.UPCOMING, LIVE_DEFAULT_UPCOMING)
  );
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [featuredProductions, setFeaturedProductions] = useState(() =>
    getInitialStorage(CACHE_KEYS.FEATURED, LIVE_DEFAULT_FEATURED)
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [slides, setSlides] = useState(() =>
    getInitialStorage(CACHE_KEYS.SLIDES, LIVE_DEFAULT_SLIDES)
  );

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
            try {
              localStorage.setItem(CACHE_KEYS.SLIDES, JSON.stringify(candidateSlides));
            } catch (err) {}
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
          `${baseURL}/api/upcoming-events/all?status=live&showOnLandingPage=true&_t=${Date.now()}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );
        if (Array.isArray(upRes.data) && upRes.data.length > 0) {
          const activeUpcoming = upRes.data.filter((e) => !isEventPast(e.eventDate));
          if (activeUpcoming.length > 0) {
            setUpcomingEvents(activeUpcoming);
            try {
              localStorage.setItem(CACHE_KEYS.UPCOMING, JSON.stringify(activeUpcoming));
            } catch (err) {}
          }
        }
      } catch (e) {
        console.warn("Fallback upcoming events:", e);
      }

      try {
        const pastRes = await axios.get(
          `${baseURL}/api/events/all?status=published&_t=${Date.now()}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );
        if (Array.isArray(pastRes.data) && pastRes.data.length > 0) {
          const sorted = sortEventsByDateDesc(pastRes.data);
          setFeaturedProductions(sorted);
          try {
            localStorage.setItem(CACHE_KEYS.FEATURED, JSON.stringify(sorted));
          } catch (err) {}
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
    featuredProductions.length > 0
      ? featuredProductions.map((e) => ({
          img: e.thumbnail?.url || e.thumbnail || runwayImg,
          title: (e.eventName || e.city || "MODA PRODUCTION").toUpperCase(),
          subtitle: e.city || "Fashion Showcase",
          link: `/past-event-details/${e.slug || e._id}`,
        }))
      : defaultGalleryImages.map((item) => ({
          ...item,
          link: "/past-events",
        }));

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
      <section className="w-full bg-gradient-to-r from-[#050505] via-[#6F4A17] to-[#D29B33] shadow-[0_10px_22px_rgba(0,0,0,0.16)]">
        <div className="w-full flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12 md:py-4.5">
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
          Balanced 2-panel luxury banner matching reference:
          Left: Event Info & Signature Gold Gradient Button on Ivory (52%)
          Right: Panoramic Event Cover / Production Showcase (48%)
         ========================================================================= */}
      <section className="w-full bg-white relative overflow-hidden">
        <div className="w-full bg-white overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[300px] lg:h-[350px] xl:h-[370px] w-full">
            
            {/* Left Panel (~52%): Event Details */}
            <div className="w-full lg:w-[52%] bg-[#FDFCF9] p-6 sm:p-8 lg:p-9 xl:p-12 flex flex-col justify-between relative">
              <div>
                {/* Header row: gold indicator notch + eyebrow + pagination */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
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
                    <div className="flex items-center gap-1.5 bg-white border border-[#E0D0BC] px-2.5 py-1 rounded-xs shadow-2xs">
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
                <div className="mb-3.5">
                  <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#8C5D25] mb-0.5">
                    {eventDate}
                  </p>
                  <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-black">
                    {eventLocation}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-lg line-clamp-2 font-normal mb-5">
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

            {/* Right Panel (~48%): Event Image Showcase with balanced proportions */}
            <div className="w-full lg:w-[48%] relative overflow-hidden bg-[#FAF8F5] min-h-[260px] lg:min-h-full group flex items-center justify-center">
              <img
                src={eventCover}
                alt={eventName}
                className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle bottom badge for luxury touch */}
              <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5D25] bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-[#d2ab59]/60 rounded-xs shadow-xs">
                  OFFICIAL PRODUCTION
                </span>
                <span className="text-[10px] text-white/90 drop-shadow-sm tracking-wider uppercase font-mono font-semibold">
                  GLOBAL SHOWCASE
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BUSINESS OPPORTUNITIES
          White background matching the real landing page.
         ========================================================================= */}
      <section className="w-full bg-[#fafafa] py-16 lg:py-24 border-b border-gray-200">
        <div className="w-full px-5 sm:px-8 lg:px-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {businessCategories.map((cat) => (
              <div
                key={cat.id}
                className="group flex flex-col h-full bg-white border border-gray-200 hover:border-[#C7913E] transition-all duration-300 rounded-sm overflow-hidden shadow-sm hover:shadow-[0_12px_28px_rgba(199,145,62,0.18)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black">
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
          SECTION 4: FEATURES STRIP
          Horizontal features strip with clean icons on white background.
         ========================================================================= */}
      <section className="w-full bg-white border-b border-gray-200 py-12 lg:py-16">
        <div className="w-full px-5 sm:px-8 lg:px-12">
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
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#fff8eb] border border-[#d2ab59]/60 flex items-center justify-center text-[#8C5D25] mb-4 shadow-xs group-hover:border-[#C7913E] group-hover:shadow-[0_4px_16px_rgba(199,145,62,0.25)] group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-[#8C5D25]" />
                  </div>

                  {/* Title */}
                  <h4 className="text-sm sm:text-[15px] font-bold uppercase tracking-wider text-black mb-2 leading-snug">
                    {item.title}
                  </h4>

                  {/* Short description */}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
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
      <section className="w-full bg-[#fafafa] py-16 lg:py-24">
        <div className="w-full px-5 sm:px-8 lg:px-12">
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
          <div className="overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            <div className="flex gap-5 sm:gap-7 snap-x snap-mandatory">
              {galleryItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link || "/past-events"}
                  className="group relative shrink-0 w-[85vw] sm:w-[420px] aspect-[3/4] rounded-sm overflow-hidden bg-black border border-gray-200 cursor-pointer shadow-md block snap-start"
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
                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#d2ab59] font-bold mb-1.5">
                      {item.subtitle}
                    </span>
                    <h3 className="font-playfair text-base sm:text-lg md:text-xl font-bold uppercase text-white leading-snug group-hover:text-[#d2ab59] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FINAL CALL TO ACTION
          Closing section with fashion imagery and conversion buttons in
          website's signature light gold luxury theme.
         ========================================================================= */}
      <section className="w-full py-16 lg:py-24 bg-gradient-to-br from-[#FCFAF6] via-[#F8F3EA] to-[#F4EBDC] text-black">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Fashion Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[500px] rounded-xs overflow-hidden border-2 border-[#C7913E]/50 shadow-xl group">
                <img
                  src={runwayImg}
                  alt="Build Your Business with MWINTL"
                  className="w-full h-[460px] sm:h-[500px] lg:h-[540px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d2ab59] block mb-1.5">
                    MODA WEEK INTERNATIONAL
                  </span>
                  <span className="font-playfair text-lg sm:text-xl text-white font-medium">
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
      </section>

      {/* Existing Shared Footer */}
      <Footer />
    </div>
  );
}
