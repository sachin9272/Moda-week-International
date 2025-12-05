import React from "react";

export default function GlobalEvents() {
  const events = [
    {
      city: "NEW YORK CITY",
      date: "FEB 2026",
      image:
        "https://cdn.britannica.com/48/179448-138-40EABF32/Overview-New-York-City.jpghttps://cdn.britannica.com/48/179448-138-40EABF32/Overview-New-York-City.jpg",
    },
    {
      city: "LETICIA, AMAZONAS COLOMBIA",
      date: "JUNE 08, 2026",
      image:
        "https://cdn.britannica.com/48/179448-138-40EABF32/Overview-New-York-City.jpg",
    },
    {
      city: "TABATINGA, AMAZONAS BRASIL",
      date: "JUNE 15, 2026",
      image:
        "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=800&q=80",
    },
    {
      city: "IQUITOS, PERU",
      date: "JUNE 20, 2026",
      image:
        "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80",
    },
    {
      city: "HUAMBOYA, ECUADOR",
      date: "JUNE 29, 2026",
      image:
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",
    },
    {
      city: "NEW YORK CITY",
      date: "SEPT 2026",
      image:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-7xl md:w-full mx-auto ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="relative inline-block md:text-5xl text-3xl font-light tracking-widest mb-6 
bg-linear-to-b from-[#C7913E] to-[#8C5D25] bg-clip-text text-transparent font-[Playfair_Display]"
          >
            GLOBAL EVENTS
            {/* Gradient underline */}
            <span
              className="absolute left-1/2 -bottom-5 w-1/3 h-0.5 -translate-x-1/2 
  bg-linear-to-b from-[#C7913E] to-[#8C5D25] "
            ></span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm mb-4">
            Experience world-class fashion events in the most iconic cities
            across the globe.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm mb-4">
            Don’t miss this strategic business opportunity to elevate your
            brand, gain visibility, and connect with industry leaders. Stay
            informed about upcoming fashion events, partnership opportunities,
            and participation options.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm">
            For custom inquiries, collaborations, or corporate engagement, contact us at:
            <br />
            info@modaweekinternational.com
            <br />
            We are here to enhance and amplify your company’s brand presence.
          </p>
        </div>
        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="group relative h-48 overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 h-[580px]"
                style={{ backgroundImage: `url(${event.image})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-500 group-hover:bg-opacity-50" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-lg font-light tracking-widest text-center mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                  {event.city}
                </h2>
                <p className="text-xs tracking-wider opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-2">
                  {event.date}
                </p>
              </div>

              {/* Bottom border effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
