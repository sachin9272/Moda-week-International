import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Eventrsvp from "../assets/eventrsvp.jpg";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import AboutUs from "../assets/aboutus1.png";
import designer1 from "../assets/designer1.jpg";
import designer2 from "../assets/designer2.jpg";
import designer3 from "../assets/designer3.jpg";
import designer4 from "../assets/designer4.png";
import ourservice from "../assets/ourservice.jpg";
import schedule from "../assets/schedule.jpg";
import pastevent1 from "../assets/pastevent1.jpg";
import pastevent2 from "../assets/pastevent2.jpg";
import pastevent3 from "../assets/pastevent3.jpg";
import pastevent4 from "../assets/pastevent4.png";
import calender1 from "../assets/calender1.jpg";
import calender2 from "../assets/calender2.jpg";
import calender3 from "../assets/calender3.png";



function VideoSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);
  const scrollTimeout = useRef(null);

  // Initial play
  useEffect(() => {
    if (videoRefs.current[0]) {
      videoRefs.current[0].play().catch(e => console.log("Autoplay prevented", e));
    }
  }, []);

  const handleEnded = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Sync play state when current changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === current) {
        video.currentTime = 0;
        video.play().catch(e => console.log("Play error", e));
      } else {
        video.pause();
      }
    });
  }, [current, slides]);

  const handleScroll = (e) => {
    if (scrollTimeout.current) return;

    if (e.deltaY > 0) {
      // Scroll Down -> Next
      setCurrent((prev) => (prev + 1) % slides.length);
    } else {
      // Scroll Up -> Prev
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, 1000); // 1 second cooldown for scroll
  };

  return (
    <div className="absolute inset-0 w-full h-full" onWheel={handleScroll}>
      {/* Videos */}
      <div className="absolute inset-0 bg-black">
        {slides.map((slide, index) => (
          <video
            key={index}
            ref={el => videoRefs.current[index] = el}
            src={slide.video}
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000
                          ${current === index ? "opacity-100" : "opacity-0"}
                      `}
            onEnded={handleEnded}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black pointer-events-none"></div>

      {/* Dynamic Content (LEFT) */}
      <div className="relative z-10 container mx-auto h-full px-4 flex flex-col justify-end gap-10 pb-30 md:pb-20 pointer-events-none">
        <h1 className="text-6xl md:text-6xl lg:text-7xl font-bold leading-tight text-white max-w-3xl md:ml-6 ml-4">
          {slides[current].title}
        </h1>
      </div>

      {/* Dots (RIGHT BOTTOM) */}
      <div className="absolute bottom-10 right-20 flex gap-4 z-20 pointer-events-auto">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 w-16 transition-all duration-300
                          ${current === i ? "bg-white scale-125" : "bg-white/50"}
                      `}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  /* Helper to format video URL */
  const getVideoSrc = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url; // Already full URL (or old drive link if any remain)
    return `http://localhost:5000${url}`; // Prepend backend URL for local paths
  };

  const [slides, setSlides] = useState([
    {
      video: video1,
      title: "",
    },
    {
      video: video2,
      title: "NEW YORK CITY",
    },
    {
      video: video3,
      title: "AMAZONAS FASHION WEEK",
    },
  ]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/landing-videos');
        const data = await response.json();

        if (data && data.length > 0) {
          const formattedSlides = data.map(item => ({
            video: getVideoSrc(item.videoUrl),
            title: item.title,
            isDynamic: true
          }));
          setSlides(formattedSlides);
        }
      } catch (error) {
        console.error("Failed to fetch landing videos:", error);
      }
    };

    fetchVideos();
  }, []);


  const designers = [
    {
      name: "LAMIA LATROUS",
      image: designer1,
    },
    {
      name: "NIA & ROSE",
      image: designer2,
    },
    {
      name: "PIETRO PARADISO",
      image: designer3,
    },
    {
      name: "WALID ATALLAH",
      image: designer4,
    },
    {
      name: "NIA & ROSE",
      image: designer2,
    },
    {
      name: "PIETRO PARADISO",
      image: designer3,
    },
    {
      name: "WALID ATALLAH",
      image: designer4,
    },
  ];

  const pastEvents = [
    {
      title: "THE PREMIER - SYRACUSE FASHION WEEKEND 2012",
      image: pastevent1
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2013",
      image: pastevent2
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2014",
      image: pastevent3
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2016",
      image: pastevent4
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2014",
      image: pastevent3
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2016",
      image: pastevent4
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2014",
      image: pastevent3
    },
    {
      title: "SYRACUSE FASHION WEEKEND 2016",
      image: pastevent4
    }
  ];

  const upcomingEvents = [
    {
      title: "NEW YORK CITY FASHION SHOW",
      date: "JUN 15, 2018",
      location: "NEW YORK",
      time: "08:00 - 17:00",
      image: calender1,
      status: "SEATS AVAILABLE",
    },
    {
      title: "APW | LETICIA, COLOMBIA",
      date: "APW | LETICIA, COLOMBIA",
      location: "LETICIA, COLOMBIA",
      time: "08:00 - 17:00",
      image: calender2,
      status: "SOLD OUT",
    },
    {
      title: "APW | TABATINGA, BRAZIL",
      date: "JUN 15, 2018",
      location: "TABATINGA, BRAZIL",
      time: "08:00 - 17:00",
      image: calender3,
      status: "AVAILABLE SOON",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen overflow-hidden"
        onWheel={(e) => {
          // Simple debounce logic could be added here if needed, but for now direct control
          // However, to prevent rapid firing, we might want to check a timestamp or just rely on user intent.
          // A simple debounce is safer for "one scroll = one switch" feel.
          // For now, let's try a direct implementation and refine if it's too sensitive.
          // Actually, standard scroll is very sensitive. Let's add a small timeout lock.
        }}
      >
        <Navbar />
        <VideoSlider slides={slides} />
      </section>

      <div className="bg-black mb-10 ml-10">
        <p>
          FASHION DESIGNERS APPLICATIONS NOW OPEN FOR <br /> FEBRUARY, JUNE &
          SEPTEMBER SS26/AW27
        </p>
        <button className="grad-bg h-[45px] w-[181px] mt-2 text-2xl">
          APPLY NOW
        </button>
      </div>

      {/* MODA Week International */}
      <section className="py-12 px-6 bg-white mt-10">
        <div className="container md:h-96 mx-auto px-5 py-5 md:py-0 bg-black">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 h-full">
            <img
              src={AboutUs}
              alt="Fashion Models"
              className="shadow-2xl md:h-84 h-64 w-[427px]"
            />

            <div>
              <h2 className="text-2xl font-bold mb-6 grad-text">
                MODA WEEK INTERNATIONAL
              </h2>
              <p className="leading-relaxed mr-4">We offer a international exposure business platform that showcases established, emerging fashion designers and business acumen . Our mission is to celebrate diversity,  sustainability, and foster innovation. Through our comprehensive services, including fashion expos, international fashion events, and impactful marketing and promotion strategies, we aim to elevate the visibility and success of all our clientele participants and companies partnership. </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion Designers */}
      <section className="bg-white">
        <div className="container mx-auto pl-4">
          <div className="flex justify-between items-center mb-6 pr-4">
            <h2 className="text-2xl font-bold grad-text">FASHION DESIGNERS</h2>
            <Link to="/fashion-designers" className="grad-text font-semibold">VIEW ALL</Link>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-0 snap-x snap-mandatory">
              {designers.map((designer, idx) => (
                <div
                  key={idx}
                  className="group cursor-pointer shrink-0 w-94 snap-start"
                >
                  <div className="relative overflow-hidden mb-4 aspect-3/4">
                    <img
                      src={designer.image}
                      alt={designer.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/80 to-transparent"></div>

                    <p className="absolute bottom-3 left-3 text-white text-sm font-medium tracking-wide">
                      {designer.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Moments & Schedule */}
      <section className="py-5 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden group cursor-pointer">
              <img
                src={ourservice}
                alt="Best Moments"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 flex items-end p-8  bg-linear-to-t from-black/90 to-transparent">
                {" "}
                <div>
                  <h3 className="text-5xl font-bold mb-2">OUR SERVICES</h3>
                  <button className="grad-bg px-5 py-2" onClick={() => navigate("/service")}>VIEW NOW</button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden group cursor-pointer">
              <img
                src={schedule}
                alt="Best Moments"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-end p-8  bg-linear-to-t from-black/90 to-transparent">
                <div>
                  <h3 className="text-5xl font-bold mb-2">SCHEDULE</h3>
                  <button className="grad-bg px-5 py-2">VIEW NOW</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-5 bg-white">
        <div className="container mx-auto">
          {/* Heading + View All */}
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-2xl font-bold bg-linear-to-l from-[#8C5D25] to-[#C7913E] bg-clip-text text-transparent">
              PAST EVENTS
            </h2>

            <button className="grad-text font-semibold cursor-pointer" onClick={() => navigate("/past-events")}>VIEW ALL</button>
          </div>

          {/* Horizontal scroll */}
          <div className="overflow-x-auto scrollbar-hide pl-4">
            <div className="flex gap-2.5 snap-x snap-mandatory">
              {pastEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="group cursor-pointer shrink-0 w-88 snap-start"
                >
                  <div className="relative overflow-hidden mb-4 aspect-3/4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-sm text-black font-inter">
                    {event.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="flex flex-col md:flex-row">
        {/* Left side */}
        <div className="md:w-1/2">
          <img
            src={Eventrsvp}
            alt=""
            className="w-full h-[400px] object-cover object-top"
          />
        </div>

        {/* Right side */}
        <div className="md:w-1/2 py-20 grad-bg">
          <div className="flex items-center justify-center h-full px-12">
            <div className="">
              <h2 className="text-5xl font-bold mb-2">
                FASHION
                <br />
                EVENT RSVP
              </h2>
              <p className="mb-10">
                Register to Attend Our Upcoming Global <br /> Fashion Showcases.{" "}
              </p>
              <button className="bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition-colors font-semibold">
                RSVP NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion Calendar */}
      <section className="py-20 bg-[#f0f0f0]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold grad-text">FASHION CALENDAR</h2>
            <button className="grad-text hover:text-yellow-500 font-semibold underline grad-bottom-border">
              VIEW ALL
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="bg-white overflow-hidden">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-80 object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-white text-xs text-black px-3 py-1">
                    {event.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#BC8739]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#BC8739]" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 grad-bg text-white py-1.5 transition-colors font-semibold">
                    GET TICKETS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
