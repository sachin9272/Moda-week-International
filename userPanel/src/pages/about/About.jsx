
import addon1 from '../../assets/addon1.jpg';
import addon2 from '../../assets/addon2.jpg';
import addon3 from '../../assets/addon3.jpg';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../../config/api"; // Assuming baseURL is defined here, if not I'll use hardcoded or relative
import AboutUs1 from "../../assets/aboutus1.png";
import Founder from "../../assets/founder.png";
import Founder2 from "../../assets/founder2.jpg";
import CtaSection from "../../components/CtaSection";
import Card from "./Card";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Download } from "lucide-react";

export default function ModaWeekSite() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Find baseURL if not imported. Usually in src/config/api.js.
        // If import above fails, I'll need to fix it.
        // Assuming baseURL maps to backend URL.
        const response = await axios.get(`${baseURL}/api/about-us`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-[#C7913E]">
        <div className="w-12 h-12 border-4 border-[#C7913E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback to static if data is missing (or just render what we have)
  const hero = data?.hero || {};
  const main = data?.mainSection || {};
  const foundation = data?.foundationSection || {};
  const philosophy = data?.philosophySection || {};
  const global = data?.globalPlatformSection || {};

  return (
    <div className="min-h-screen text-black">
      <Navbar />
      {/* Hero Section */}
      <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-transparent min-h-[400px] flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-[44px] font-bold mb-2 tracking-wide uppercase grad-text-up leading-tight">
          {hero.title || "WHAT IS MODA WEEK INTERNATIONAL"}
        </h1>
        <span className="w-[50%] h-[2px] bg-gradient-to-r from-transparent via-[#C7913E] to-transparent mb-10"></span>

        <p className="max-w-2xl mx-auto text-base md:text-md">
          {hero.subtitle || "INTERNATIONAL FASHION SHOW PRODUCTION ORGANIZATION WITH THE PURPOSE OF CONVEYING GLAMOROUS EVENTS, EDUCATION & COMMUNITY SUPPORT."}
        </p>
      </header>

      {/* Moda Week International Section */}
      <section className="px-4 sm:px-6 md:px-10 pb-10 pt-4 bg-white text-gray-900">
        <div className="max-w-9xl w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 grad-text">
            {main.title || "MODA WEEK INTERNATIONAL"}
          </h2>
          <div className="whitespace-pre-line mb-4 leading-relaxed text-base md:text-lg">
            {main.content || "Moda Week International (MWINTL) is a prestigious philanthropic fashion show production..."}
          </div>
        </div>
        <div className="mt-6 relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] flex items-center justify-center overflow-hidden">
          <img
            src={main.image?.url || AboutUs1}
            alt="About Us"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Centered Portfolio CTA */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            <p className="font-playfair text-white text-xs sm:text-sm tracking-[0.22em] uppercase font-medium mb-3 sm:mb-4 drop-shadow-md">
              DOWNLOAD OUR OFFICIAL PORTFOLIO
            </p>

            <a
              href={main.portfolioUrl || "/MWINTL-BOOKLET.pdf"}
              download="MWINTL-BOOKLET.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#664b27] via-[#7d643b] to-[#664b27] border-[1.5px] border-[#a58657] hover:border-[#c9a670] text-[#fffff7] font-playfair font-semibold text-sm sm:text-base tracking-[0.06em] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>DOWNLOAD PORTFOLIO (PDF)</span>
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#fff7e0] shrink-0" strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </section>

      {/* Foundation Section */}
      <section className="py-10 px-4 sm:px-6 bg-[radial-gradient(circle_at_top_left,#C7913E_10%,#C7913E_10%,white_80%)]">
        <div className="max-w-9xl">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12">
            <div className="w-full flex justify-center h-full items-center">
              <img
                src={foundation.image?.url || Founder}
                alt="Founder"
                className="shadow-lg w-full max-w-[280px] sm:max-w-sm object-cover"
              />
            </div>

            <div className="text-gray-800">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 grad-text">
                {foundation.title || "FOUNDATION"}
              </h2>
              <p className="text-sm md:text-sm mb-3 leading-relaxed font-semibold">
                {foundation.subtitle}
              </p>
              <div className="text-sm md:text-sm mb-1 leading-relaxed whitespace-pre-line">
                {foundation.content}
              </div>
              <p className="text-sm md:text-sm italic mt-4">{foundation.quote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white md:px-6">
        <div className="w-full p-6 md:p-10 bg-[radial-gradient(circle_at_bottom_right,#C7913E_10%,#C7913E_10%,white_80%)]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 grad-text">
            {philosophy.title || "OUR PHILOSOPHY"}
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            {/* Left Text */}
            <div className="text-gray-800 md:text-sm leading-relaxed space-y-1 flex-1 whitespace-pre-line">
              {philosophy.content}
            </div>

            {/* Right Image */}
            <div className="flex justify-center flex-1">
              <img
                src={philosophy.image?.url || Founder2}
                alt="Philosophy"
                className="w-full max-w-full md:w-[500px] md:h-[500px] h-auto object-cover object-top shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Global Platform Section */}
      <section className="md:py-16 py-10 md:px-10 bg-white">
        <div className="w-full bg-[#f4f4f4] mx-auto px-4 sm:px-6 md:px-10 py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[45px] font-bold text-center mb-6 text-gray-900 uppercase leading-tight">
            {global.title || "A GLOBAL PLATFORM FOR VISIONARIES, CULTURE & INNOVATION"}
          </h2>
          <p className="text-center text-lg text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed whitespace-pre-line">
            {global.description}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {global.cards && global.cards.length > 0 ? (
              global.cards.map((item, index) => (
                <Card
                  key={index}
                  title={item.title}
                  image={item.image?.url || (typeof item.image === 'string' ? item.image : "") || [addon1, addon2, addon3][index] || ""}
                  description={item.description}
                />
              ))
            ) : (
              // Fallback hardcoded if no cards from API (optional, can remove)
              <div className="col-span-3 text-center text-gray-500">No cards available.</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="!text-white">
        <CtaSection />
      </div>
      <Footer />
    </div>
  );
}
