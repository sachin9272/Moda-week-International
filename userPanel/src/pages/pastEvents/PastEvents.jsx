import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CtaSection from "../../components/CtaSection";
import { baseURL } from "../../config/api";

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/events/all?status=published`);
        const pastEvents = response.data.filter(
          (event) => event.eventType === "past"
        );
        setEvents(pastEvents);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchEvents();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="h-[300px] bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-3xl md:text-[44px] font-bold bg-linear-to-r from-[#3C2306] to-[#C7913E] bg-clip-text text-transparent mb-4 uppercase">
            Past Fashion Shows Events
          </h1>
          <p className="text-black text-[18px] md:text-base max-w-2xl mx-auto">
            Celebrating our past and respectful supporters, collaborators and
            community
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="bg-white text-black py-6 px-10">
        <div className="max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No past events found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {events.slice(0, visibleCount).map((event) => {
                const description =
                  event.bottomSection?.text ||
                  event.description ||
                  event.descriptionSection?.text;

                return (
                  <Link
                    key={event._id}
                    to={`/event-details/${event._id}`}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[3/4] mb-6">
                      <img
                        src={event.thumbnail?.url || event.thumbnail}
                        alt={event.eventName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col grow">
                      <h3 className="text-xl md:text-2xl font-[Inter] font-semibold mb-2 uppercase leading-tight group-hover:text-[#C7913E] transition-colors">
                        {event.eventName}
                      </h3>

                      <p className="text-gray-500 text-xs tracking-widest uppercase mb-4 font-semibold">
                        {event.date}
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
          )}

          {visibleCount < events.length && (
            <div className="mt-16 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#C7913E] transition-colors duration-300"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      <CtaSection />
      <Footer />
    </div>
  );
}
