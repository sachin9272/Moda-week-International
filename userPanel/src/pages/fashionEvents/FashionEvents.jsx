import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Mail, MapPin, Phone, Star, Check } from "lucide-react";
import Footer from "../../components/Footer.jsx";
import Pricing from "../../components/Pricing.jsx";
import runnaway from "../../assets/runnaway.jpg";
import CtaSection from "../../components/CtaSection.jsx";
import { baseURL } from "../../config/api";

import event1 from "../../assets/Events.jpg";
import event2 from "../../assets/Events-1.jpg";
import event3 from "../../assets/Events-2.jpg";
import event4 from "../../assets/Events-3.jpg";
import event5 from "../../assets/Events-4.jpg";
import event6 from "../../assets/Events-5.jpg";

export default function FashionEvents() {
  // const events - Removed hardcoded events as we now use upcomingEvents from API
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("upcoming");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWhatsAppMessage = () => {
    const { name, email, subject, message } = formData;

    if (!name || !email || !message) {
      // You could use toast here since it's already in the app, but alert is fine for now
      alert("Please fill in your name, email, and message.");
      return;
    }

    const text = `Hello, I would like to get in touch.\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n*Message:* ${message}`;
    const phoneNumber = "16802145633";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank');
  };

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [heroContent, setHeroContent] = useState({
    title: "UPCOMING EVENTS",
    subtitle: "local or shared file",
    description: "Experience world-class fashion events in the most ionic cities across the globe.\nDon't miss this strategic business opportunity to elevate your brand, gain visibility, and connect with industry leaders. Stay informed about upcoming fashion events, partnership opportunities, and participation options.",
    image: null
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [eventsRes, heroRes] = await Promise.all([
          fetch(`${baseURL}/api/upcoming-events/all?status=live`),
          fetch(`${baseURL}/api/upcoming-event-hero`)
        ]);

        const eventsData = await eventsRes.json();
        setUpcomingEvents(eventsData);

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          setHeroContent({
            title: heroData.title || "UPCOMING EVENTS",
            subtitle: heroData.subtitle || "",
            description: heroData.description || "",
            image: heroData.image || null
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchContent();
  }, []);

  // Handle hash scroll when data loads
  useEffect(() => {
    if (location.hash) {
      // Use a timeout to allow for rendering
      const timer = setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // 500ms delay to ensure layout stabilizes
      return () => clearTimeout(timer);
    }
  }, [location.hash, upcomingEvents, heroContent]);

  const pastEvents = [
    {
      date: "SEPT 2025",
      city: "MILAN",
      event: "MILAN FASHION WEEK",
    },
    {
      date: "AUGUST 2025",
      city: "COPENHAGEN",
      event: "COPENHAGEN FASHION WEEK",
    },
    {
      date: "JULY 2025",
      city: "MIAMI",
      event: "MIAMI SWIM WEEK",
    },
    {
      date: "JUNE 2025",
      city: "BERLIN",
      event: "BERLIN FASHION WEEK",
    },
  ];

  const calendarData = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="text-white min-h-screen font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero / Global Events Section */}
      <div className="bg-gradient-to-b from-[#C7913E] to-white text-black md:min-h-[460px] min-h-[300px] h-auto">
        <div className="max-w-7xl mx-auto px-4 pt-36 md:pt-28 pb-8 md:pb-16">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16 max-w-9xl mx-auto">
            <h1 className="relative uppercase inline-block md:text-[52px] font-bold text-4xl tracking-widest mb-6 md:mb-10 bg-linear-to-br from-[#3C2306] via-[#734F1C] to-[#C7913E] bg-clip-text text-transparent !font-playfair">
              {heroContent.title}
              <span className="absolute left-1/2 -bottom-4 w-1/3 h-0.5 -translate-x-1/2 bg-linear-to-b from-[#3C2306] to-[#C7913E]"></span>
            </h1>

            <div className="text-black max-w-4xl mx-auto leading-relaxed mb-4 !font-montserrat whitespace-pre-line">
              {heroContent.description}
            </div>
          </div>

          {/* Events Grid */}
        </div>
      </div>

      <div className="bg-white text-black py-6 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {upcomingEvents.map((event, index) => {
              const description =
                event.bottomSection?.text ||
                event.description ||
                event.descriptionSection?.text;

              return (
                <Link
                  key={event._id}
                  to={`/${event.slug ? event.slug.replace(/-/g, '') : event._id}`}
                  className="group cursor-pointer flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[3/4] mb-6">
                    <img
                      src={event.coverImage?.url || event.coverImage}
                      alt={event.location}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col grow">
                    <h3 className="text-xl md:text-2xl font-[Inter] font-semibold mb-2 uppercase leading-tight group-hover:text-[#C7913E] transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-gray-500 text-xs tracking-widest uppercase mb-4 font-semibold">
                      {event.eventDate}
                    </p>

                    {description && (
                      <p
                        className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: description,
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Runway Calendar Section */}
      <div className="px-4 bg-white">
        <div className="relative py-20 px-4 bg-[#1a1a1a] min-h-[450px]">
          {/* Background Image Overlay */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${runnaway})` }}
          />

          <div className="absolute inset-0 bg-black/40 z-10 bg-linear-to-b from-[#00000] via-[#2A1B04] to-[#BC8739]"></div>

          {/* Content Wrapper */}
          <div className="relative z-10 max-w-6xl mx-auto">

            <h2 className="text-center text-4xl md:text-5xl !font-playfair mb-8 grad-text-rev grad-bg">
              RUNWAY CALENDAR
            </h2>

            {/* Tabs */}
            <div className="flex justify-center gap-12 mb-12 text-sm tracking-[0.2em] font-medium">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`pb-2 border-b-2 transition-colors duration-300 ${activeTab === "upcoming"
                  ? "grad-text-rev border-[#C7913E]"
                  : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
              >
                UPCOMING
              </button>

              <button
                onClick={() => setActiveTab("past")}
                className={`pb-2 border-b-2 transition-colors duration-300 ${activeTab === "past"
                  ? "grad-text-rev border-[#C7913E]"
                  : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
              >
                PAST
              </button>
            </div>

            {/* Table Box */}
            <div className="bg-black/40 backdrop-blur-md border border-white/30 overflow-hidden">

              {/* Table Header */}
              <div className="grid grid-cols-3 text-[#C7913E] text-sm tracking-widest bg-[#241705]">
                <div className="p-6 border-b border-r border-white/30">Date</div>
                <div className="p-6 border-b border-r border-white/30">City</div>
                <div className="p-6 border-b border-white/30">Event</div>
              </div>

              {/* Table Body */}
              <div>
                {calendarData.length > 0 ? (
                  calendarData.map((item, idx) => {
                    if (activeTab === "upcoming") {
                      return (
                        <Link
                          to={`/${item.slug ? item.slug.replace(/-/g, '') : item._id}`}
                          key={idx}
                          className="grid grid-cols-3 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <div className="p-6 font-semibold border-b border-r border-white/20 group-hover:text-[#C7913E] transition-colors">
                            {item.eventDate || item.date}
                          </div>
                          <div className="p-6 border-b border-r border-white/20">
                            {item.location || item.city}
                          </div>
                          <div className="p-6 text-gray-400 border-b border-white/20">
                            {item.title || item.event}
                          </div>
                        </Link>
                      );
                    } else {
                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-3 text-sm text-gray-300"
                        >
                          <div className="p-6 font-semibold border-b border-r border-white/20">
                            {item.eventDate || item.date}
                          </div>
                          <div className="p-6 border-b border-r border-white/20">
                            {item.location || item.city}
                          </div>
                          <div className="p-6 text-gray-400 border-b border-white/20">
                            {item.title || item.event}
                          </div>
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500 italic">
                    No events found.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* Pricing Section */}
      < div className="bg-white" >
        <Pricing />
      </div >

      {/* Get In Touch Section */}
      {/* <div className="py-20 px-4 bg-[#F5F5F5]"> */}

      <div className='!text-white mb-10'>
        <CtaSection />
      </div>
      <Footer />
    </div >
  );
}
