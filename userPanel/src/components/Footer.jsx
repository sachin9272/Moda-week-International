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
        <div className="border-gray-800 py-8">
          <div className="marquee-wrapper py-8">
            <div className="marquee-track">
              {/* Original list */}
              {[...Array(6)].map((_, loopIndex) => (
                partners.map((brand, i) => (
                  <img
                    key={`${loopIndex}-${brand._id || i}`}
                    src={brand.image?.url}
                    alt={brand.name}
                    className="h-20 object-contain -mx-1" // Reduced horizontal margin to mx-2
                  />
                ))
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-black pb-15">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">STAY UPDATED</h2>

            <p className="text-md mb-4 max-w-2xl mx-auto">
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
          <div className="relative z-10 container mx-auto px-5 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-2 mt-8">
              {/* --- Your sections remain same --- */}
              {/* About Section */}
              <div className="">
                <div className="mb-6">
                  <img src={logo} alt="" />
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
                    href="https://www.youtube.com/@modaweekinternationalofficial"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Youtube size={18} className="text-[#9e6826]" />
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className="">
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
              <div className="">
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
                      to="/press-media"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Press & Media
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Career */}
              <div className="md:-ml-10">
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
              <div className="md:-ml-18">
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
                      Data Protection (GDPR <br /> Compliance)
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
              <div id="get-in-touch" className="md:-ml-18">
                <h3 className="text-xl font-bold mb-6">CONTACT INQUIRY</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-400">
                    <Mail size={20} className="mt-1 shrink-0 text-[#9e6826]" />
                    <span>info@modaweekinternational.com</span>
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
