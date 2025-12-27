import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import Footer from "../../components/Footer.jsx";
import Pricing from "../../components/Pricing.jsx";
import runnaway from "../../assets/runnaway.jpg";

export default function FashionEvents() {
  const events = [
    {
      city: "NEW YORK CITY",
      date: "FEB 2026",
      image:
        "https://cdn.britannica.com/48/179448-138-40EABF32/Overview-New-York-City.jpg",
    },
    // {
    //   city: "LETICIA, AMAZONAS COLOMBIA",
    //   date: "JUNE 08, 2026",
    //   image:
    //     "https://cdn.britannica.com/48/179448-138-40EABF32/Overview-New-York-City.jpg",
    // },
    // {
    //   city: "TABATINGA, AMAZONAS BRASIL",
    //   date: "JUNE 15, 2026",
    //   image:
    //     "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=800&q=80",
    // },
    // {
    //   city: "IQUITOS, PERU",
    //   date: "JUNE 20, 2026",
    //   image:
    //     "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80",
    // },
    // {
    //   city: "HUAMBOYA, ECUADOR",
    //   date: "JUNE 29, 2026",
    //   image:
    //     "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",
    // },
    {
      city: "NEW YORK CITY",
      date: "SEPT 2026",
      image:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&q=80",
    },
  ];

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

  const upcomingEvents = [
    {
      date: "FEB 1-6, 2026",
      city: "DUBAI",
      event: "DUBAI FASHION WEEK",
    },
    {
      date: "FEB 2026",
      city: "NEW YORK CITY",
      event: "MWINTL | NYCFS",
    },
    {
      date: "FEB 07, 2026",
      city: "NEW YORK CITY",
      event: "COUTURE FASHION WEEK",
    },
    {
      date: "FEB 24 – March 2, 2026",
      city: "LONDON",
      event: "LONDON FASHION WEEK",
    },
    {
      date: "MARCH 2–10, 2026",
      city: "PARIS",
      event: "PARIS FASHION WEEK",
    },
    {
      date: "MARCH 16-21, 2026",
      city: "TOKYO",
      event: "TOKYO FASHION WEEK",
    },
    {
      date: "MAY 12-14, 2026",
      city: "BOGOTA, COLOMBIA",
      event: "BOGOTA FASHION WEEK",
    },
    {
      date: "JUNE 6, 2026",
      city: "LETICIA, AMAZONAS COLOMBIA",
      event: "MWINTL | AFW",
    },
    {
      date: "JUNE 13, 2026",
      city: "TABATINGA, AMAZONAS BRASIL",
      event: "MWINTL | AFW",
    },
    {
      date: "JUNE 20, 2026",
      city: "IQUITOS, PERU",
      event: "MWINTL | AFW",
    },
    {
      date: "JUNE 27, 2026",
      city: "HUAMBOYA, ECUADOR",
      event: "MWINTL | AFW",
    },
    {
      date: "NOVEMBER 1-5, 2026",
      city: "TORONTO",
      event: "TORONTO FASHION WEEK",
    },
    {
      date: "JULY 6-9, 2026",
      city: "PARIS",
      event: "HAUTE COUTURE",
    },
    {
      date: "JULY 28-30, 2026",
      city: "MEDELLIN, COLOMBIA",
      event: "COLOMBIA MODA",
    },
  ];

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
      <div className="bg-gradient-to-b from-[#C7913E] to-white text-black h-[460px]">
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
          {/* Header */}
          <div className="text-center mb-16 max-w-9xl mx-auto">
            <h1 className="relative inline-block md:text-[52px] font-bold text-4xl tracking-widest mb-10 bg-linear-to-br from-[#3C2306] via-[#734F1C] to-[#C7913E] bg-clip-text text-transparent !font-playfair">
              GLOBAL EVENTS
              <span className="absolute left-1/2 -bottom-4 w-1/3 h-0.5 -translate-x-1/2 bg-linear-to-b from-[#3C2306] to-[#C7913E]"></span>
            </h1>

            <p className="text-black max-w-3xl mx-auto leading-relaxed mb-4 !font-montserrat">
              Experience world-class fashion events in the most iconic cities across the globe.
            </p>
            <p className="text-black max-w-4xl mx-auto leading-relaxed mb-4 !font-montserrat">
              Don’t miss this strategic business opportunity to elevate your brand, gain visibility, and connect with industry leaders. Stay informed about upcoming fashion events, partnership opportunities, and participation options.
            </p>
            <p className="text-black max-w-3xl mx-auto leading-relaxed mb-4 !font-montserrat">
              For custom inquiries, collaborations, or corporate engagement, contact us at: <br />
              info@modaweekinternational.com <br />
              We are here to enhance and amplify your company’s brand presence.
            </p>
          </div>

          {/* Events Grid */}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16  bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <Link to={`/event-details?city=${event.city}`} key={index}>
              <div
                className="group relative h-64 md:h-80 overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90 group-hover:bg-black/40 transition-colors duration-500" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <h2 className="text-2xl md:text-3xl font-light tracking-widest text-center mb-2 !font-playfair">
                    {event.city}
                  </h2>
                  {/* <div className="border-b border-[#BB8639] h-[8px] w-[15%] mb-2"></div> */}
                  <div className="border-b-[1.5px] border-[#BB8639] w-[15%] mb-2"></div>

                  <p className="text-sm tracking-[0.2em] font-light">
                    {event.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
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
                  calendarData.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 text-sm text-gray-300"
                    >
                      <div className="p-6 font-semibold border-b border-r border-white/20">
                        {item.date}
                      </div>

                      <div className="p-6 border-b border-r border-white/20">
                        {item.city}
                      </div>

                      <div className="p-6 text-gray-400 border-b border-white/20">
                        {item.event}
                      </div>
                    </div>
                  ))
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
      <div className="bg-white">
        <Pricing />
      </div>

      {/* Get In Touch Section */}
      {/* <div className="py-20 px-4 bg-[#F5F5F5]"> */}
      <div id="contact-us" className="py-20 px-4 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl !font-playfair text-[#C7913E] mb-4">
              GET IN TOUCH
            </h2>
            <div className="w-24 h-px grad-bg mx-auto mb-4"></div>
            <p className="text-gray-500">
              Connect with us to learn more about MODA Week International
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="text-2xl font-[Playfair_Display] text-black">Contact Information</h3>

              <div className="flex items-start gap-4">
                <MapPin className="text-[#C7913E] shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#101010B2] mb-1">Address</h4>
                  <p className="text-black">Global Headquarters<br />New York, NY 10011</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-[#C7913E] shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#101010B2] mb-1">Phone</h4>
                  <p className="text-black">+1 (680) 2145633</p>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <Mail className="text-[#C7913E] shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#101010B2] mb-1">Email</h4>
                  <p className="text-black">info@modaweekinternational.com</p>
                </div>
              </div>

              <div className="mt-4 px-4">
                <p className="text-[#101010B2]">
                  For media inquiries, partnership opportunities, or general questions about MODA Week International, please reach out to us using the contact form or the information provided above.                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-3 bg-white border border-gray-200 focus:outline-none focus:border-[#C7913E] text-black placeholder-[#A7A7A7]"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full p-3 bg-white border border-gray-200 focus:outline-none focus:border-[#C7913E] text-black placeholder-[#A7A7A7]"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full p-3 bg-white border border-gray-200 focus:outline-none focus:border-[#C7913E] text-black placeholder-[#A7A7A7]"
              />
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                className="w-full p-3 bg-white border border-gray-200 focus:outline-none focus:border-[#C7913E] text-black placeholder-[#A7A7A7]"
              ></textarea>

              <button
                type="button"
                onClick={handleWhatsAppMessage}
                className="w-full grad-bg text-white font-bold py-4 tracking-widest hover:opacity-90 transition-opacity"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div >
  );
}
