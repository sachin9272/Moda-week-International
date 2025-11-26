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
export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  const partners = [
    { name: "DJ FLASH", color: "text-red-500" },
    { name: "EXPEDITIONS GEORGE OF THE JUNGLE", color: "text-green-600" },
    { name: "METEOR", color: "text-gray-800" },
    { name: "AMAZONAS", color: "text-teal-600" },
    { name: "Innovation MEDIA New York", color: "text-gray-800" },
    // { name: "FASHION CHANNEL", color: "text-gray-800" },
  ];

  return (
    <footer className="relative bg-black text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-30" />

      <div className="relative z-10">
        {/* Partner Logos Section */}
        <div className="border-gray-800 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {partners.map((partner, index) => (
                <div key={index} className="bg-white px-6 py-4 rounded">
                  <span className={`font-bold text-lg ${partner.color}`}>
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-black py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">STAY UPDATED</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest news, event
              announcements, and exclusive content
            </p>
            <div className="flex justify-center gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button
                onClick={handleSubscribe}
                className="px-8 py-3 text-white font-semibold rounded transition-colors grad-bg"
                // style={{
                //   background: "linear-gradient(to right, #8C5D25, #C7913E)",
                // }}
                // style={{background: }}
                // style={{ backgroundImage: "var(--brand-grad)" }}
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
          <div className="absolute inset-0 bg-linear-to-b from-black/98 via-black/90 to-black/90"></div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* --- Your sections remain same --- */}
              {/* About Section */}
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-amber-600 mb-2">
                    MODA
                  </h3>
                  <p className="text-sm text-gray-400">WEEK INTERNATIONAL</p>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  MWINTL We specialize in international fashion show productions
                  that unite exceptional talent from around the world. Through
                  our global network, we connect strategic partnerships across
                  the business industries.
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
                    <Mail
                      size={20}
                      className="mt-1 shrink-0 text-[#9e6826]"
                    />
                    <span>info@modaweekinternational.com</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <Phone size={20} className="mt-1 shrink-0 text-[#9e6826]" />
                    <span>+1 (680) 2145633</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <MapPin size={20} className="mt-1 shrink-0 text-[#9e6826]" />
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
