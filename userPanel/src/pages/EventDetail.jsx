import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { Square } from 'lucide-react'; // Placeholder for logo icon

// Importing some placeholder images (reusing existing assets for now)
import designer1 from "../assets/designer1.jpg";
import designer2 from "../assets/designer2.jpg";
import designer3 from "../assets/designer3.jpg";
import designer4 from "../assets/designer4.png";

import el1 from "../assets/el1.png";
import el2 from "../assets/el2.png";
import el3 from "../assets/el3.png";
import el4 from "../assets/el4.png";
import el5 from "../assets/el5.png";
import el6 from "../assets/el6.png";

import mr1 from "../assets/mr1.png";
import mr2 from "../assets/mr2.png";
import mr3 from "../assets/mr3.png";
import mr4 from "../assets/mr4.png";
import mr5 from "../assets/mr5.png";
import mr6 from "../assets/mr6.png";

import wa1 from "../assets/wa1.png";
import wa2 from "../assets/wa2.png";
import wa3 from "../assets/wa3.png";
import wa4 from "../assets/wa4.png";
import wa5 from "../assets/wa5.png";
import wa6 from "../assets/wa6.png";

import ch1 from "../assets/ch1.png";
import ch2 from "../assets/ch2.png";
import ch3 from "../assets/ch3.png";
import ch4 from "../assets/ch4.png";
import ch5 from "../assets/ch5.png";
import ch6 from "../assets/ch6.png";

import qu1 from "../assets/qu1.png";
import qu2 from "../assets/qu2.png";
import qu3 from "../assets/qu3.png";

import fo1 from "../assets/fo1.png";
import fo2 from "../assets/fo2.png";
import fo3 from "../assets/fo3.png";
import fo4 from "../assets/fo4.png";
import fo5 from "../assets/fo5.png";
import fo6 from "../assets/fo6.png";

export default function EventDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city") || "SYRACUSE";
    const eventName = queryParams.get("event") || "FASHION WEEKEND";
    const date = "October 11th, 2013"; // Mock date for now

    // Mock data for the collections
    const collections = [
        {
            title: "ELMADAWY",
            subtitle: "Fashion Designer",
            images: [el1, el2, el3, el4, el5, el6]
        },
        {
            title: "MR SHOP",
            subtitle: "COLLECTION",
            images: [mr1, mr2, mr3, mr4, mr5, mr6]
        },
        {
            title: "WALID ATALLAH",
            subtitle: "FASHION DESIGNER",
            images: [wa1, wa2, wa3, wa4, wa5, wa6]
        },
        {
            title: "CHLOE SCHNELL",
            subtitle: "STUDENT DESIGNER",
            images: [ch1, ch2, ch3, ch4, ch5, ch6]
        },
        {
            title: "QUEESHA",
            subtitle: "STUDENT DESIGNER",
            images: [qu1, qu2, qu3]
        },
        {
            title: "FOLIE",
            subtitle: "STUDENT DESIGNER",
            images: [fo1, fo2, fo3, fo4, fo5, fo6]
        }
    ];

    return (
        <div className="bg-white min-h-screen text-black font-sans">
            <Navbar />

            <div className="pt-20"> {/* Offset for fixed Navbar */}
                {/* Split Hero Section */}
                <div className="flex flex-col md:flex-row h-[50vh] min-h-[400px]">
                    {/* Left Side - Gold */}
                    <div className="w-full md:w-1/2 bg-[#B8860B] flex flex-col justify-center items-center text-center p-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest leading-tight">
                            {city}<br />
                            {eventName.replace(city, "").trim() || "FASHION WEEKEND"}
                        </h1>
                        <p className="text-white/80 mt-4 text-lg">{date}</p>
                    </div>

                    {/* Right Side - Black */}
                    <div className="w-full md:w-1/2 bg-black flex flex-col justify-center items-center text-center p-8 relative">
                        <div className="border-4 border-gray-400 p-4 mb-6">
                            <Square size={64} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl text-gray-400 tracking-[0.5em] font-light uppercase">
                            ESMERALDS
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                {/* Collections */}
                {collections.map((collection, idx) => (
                    <div key={idx} className="mb-16">
                        <div className="container mx-auto px-4">
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="font-bold text-2xl uppercase grad-text">
                                    {collection.title}
                                </h2>
                                <span className="text-[#595959] uppercase text-2xl">{collection.subtitle}</span>
                            </div>
                        </div>

                        {/* Full Width Border */}
                        <div className="h-[0.3px] bg-gray-900 w-full mb-6"></div>

                        <div className="container mx-auto px-4">
                            {/* Image Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {collection.images.map((img, imgIdx) => (
                                    <div key={imgIdx} className="aspect-[2/3] overflow-hidden group">
                                        <img
                                            src={img}
                                            alt={`Model ${imgIdx}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Optional: Add overlay content if needed */}
                                        <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-black/10 transition-colors"></div>

                                        {/* Logo Overlay Style from image (Bottom corners) */}
                                        <div className="relative -mt-16 ml-4 text-white font-bold text-3xl opacity-80 mix-blend-overlay pointer-events-none">
                                            MODA
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
