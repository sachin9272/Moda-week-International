import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import footerBg from "../assets/footer.png";
import logo from "../assets/glodenlogo.png";
import video1 from "../assets/video1.mp4";
import { Link } from "react-router-dom";

import axios from "axios";
import { baseURL } from "../config/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [partners, setPartners] = useState([]);

  React.useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/partners`);
        setPartners(response.data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-black text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-30" />

      <div className="relative z-10">
        {/* Partner Logos Section */}
        <div className="border-gray-800 py-12">
          <div className="marquee-container w-full">
            <div className="marquee-content gap-12 px-4">
              {/* Duplicate list 4 times for smooth infinite scroll on large screens */}
              {[...Array(4)].map((_, loopIndex) => (
                <React.Fragment key={`loop-${loopIndex}`}>
                  {partners.map((brand, i) => (
                    <div
                      key={`${loopIndex}-${brand._id || i}`}
                      className="flex items-center justify-center min-w-[120px]"
                    >
                      <img
                        src={brand.image?.url}
                        alt={brand.name}
                        className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-black pb-15">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">STAY UPDATED</h2>

            <p className="text-md mb-4 max-w-4xl mx-auto">
              Subscribe to our newsletter for the latest news, event
              announcements, and exclusive content
            </p>

            {/* Only improvement: better mobile spacing and full width inputs */}
            <div className="flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-6 py-3 bg-[#81818199] text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />

              <button
                onClick={handleSubscribe}
                className="h-12 md:w-auto px-8 text-white font-semibold transition-colors grad-bg"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div
          style={{
            backgroundImage: `url(${footerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="relative"
        >
          {/* Gradient Overlay - darker at top */}
          <div className="absolute inset-0 bg-linear-to-b from-black/99 via-black/90 to-black/90"></div>

          {/* Content */}
          <div className="w-full relative z-10 px-6 lg:px-5 py-6 text-sm">
            <div className="flex flex-wrap lg:flex-nowrap justify-between gap-y-8 gap-x-2 md:gap-x-4 lg:gap-x-6 mt-8">
              {/* --- Your sections remain same --- */}
              {/* About Section */}
              <div className="w-full lg:w-1/5 lg:ml-5">
                <div className="mb-6">
                  <video
                    src={video1}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-30 w-auto object-contain"
                  />
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed max-w-4xl">
                  MWINTL. We specialize in international fashion show
                  productions that unite exceptional talent from around the
                  world. Through our global network, we connect strategic
                  partnerships across the business industries.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/modaweekinternationalofficial/"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Instagram size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="https://www.facebook.com/modaweekinternational"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Facebook size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/moda-week-international/"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Linkedin size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="https://www.youtube.com/@modaweekinternational"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Youtube size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@modaweekinternational "
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#9e6826]"
                    >
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className="w-full md:w-1/2 lg:w-auto lg:ml-6">
                <h3 className="text-xl font-bold mb-2">SERVICES</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/service?tab=service"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Consulting Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Digital Marketing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Fashion Show Production
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/membership-program"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Membership Programs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service?tab=sponsor"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Sponsors Partnerships
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="w-full md:w-1/2 lg:w-auto">
                <h3 className="text-xl font-bold mb-2">QUICK LINKS</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      About MWINTL
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Fashion Calendar
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/news-room"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Fashion News
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/past-events"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Past Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/news-room"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Press & Media
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Career */}
              <div className="w-full md:w-1/2 lg:w-auto">
                <h3 className="text-xl font-bold mb-2">CAREER</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/service?tab=buyer"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Buyer
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service?tab=designer"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Designer
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service?tab=service"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Student
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service?tab=service"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Model
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service?tab=service"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Volunteer
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="w-full md:w-1/2 lg:w-auto">
                <h3 className="text-xl font-bold mb-2">LEGAL</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/code-of-conduct"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Code of Conduct
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/data-protection"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Data Protection <br /> (GDPR Compliance)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/media-release-policy"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Media Release Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms-and-conditions"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Inquiry - Commented out as requested */}
              <div id="get-in-touch" className="w-full md:w-1/2 lg:w-auto">
                <h3 className="text-xl font-bold mb-6">CONTACT INQUIRY</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-400">
                    <Mail size={20} className="mt-1 shrink-0 text-[#9e6826]" />
                    <span className="">info@modaweekinternational.com</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <Phone size={20} className="mt-1 shrink-0 text-[#9e6826]" />
                    <span>+1 (680) 2145633</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <MapPin
                      size={20}
                      className="mt-1 shrink-0 text-[#9e6826]"
                    />
                    <div>
                      <div>Global Headquarters</div>
                      <div>New York, NY</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="relative z-10 grad-top-border py-6">
            <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
              Copyright © 2024 Moda Week International - All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
