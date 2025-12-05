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
import brand1 from "../assets/brand1.png";
import brand2 from "../assets/brand2.png";
import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";
import brand5 from "../assets/brand5.png";
import brand6 from "../assets/brand6.png";
import logo from "../assets/glodenlogo.png";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  const partners = [
    { img: brand1, name: "Brand 1" },
    { img: brand2, name: "Brand 2" },
    { img: brand3, name: "Brand 3" },
    { img: brand4, name: "Brand 4" },
    { img: brand5, name: "Brand 5" },
    { img: brand6, name: "Brand 6" },
  ];

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
              {partners.map((brand, i) => (
                <img
                  key={i}
                  src={brand.img}
                  alt={brand.name}
                  className="h-20 object-contain"
                />
              ))}

              {/* Duplicate list */}
              {partners.map((brand, i) => (
                <img
                  key={`dup-${i}`}
                  src={brand.img}
                  alt={brand.name}
                  className="h-20 object-contain"
                />
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
          <div className="relative z-10 container mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-8">
              {/* --- Your sections remain same --- */}
              {/* About Section */}
              <div>
                <div className="mb-6">
                  <img src={logo} alt="" />
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  MWINTL. We specialize in international fashion show
                  productions that unite exceptional talent from around the
                  world. Through our global network, we connect strategic
                  partnerships across the business industries.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Instagram size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Facebook size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Linkedin size={18} className="text-[#9e6826]" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-amber-600 hover:text-amber-600 transition-colors"
                  >
                    <Youtube size={18} className="text-[#9e6826]" />
                  </a>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-xl font-bold mb-6">SERVICES</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Buy Tickets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Consulting
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Event Productions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Fashion Calendar
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Marketing Exposure
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-6">QUICK LINKS</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      About MWINTL
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Designer
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Apply as Sponsor
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Newsroom
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      Past Events
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold mb-6">CONTACT</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
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
                <button className="mt-6 w-full px-6 py-3 grad-text grad-border hover:text-white font-semibold rounded transition-colors">
                  CONTACT INQUIRY
                </button>
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
