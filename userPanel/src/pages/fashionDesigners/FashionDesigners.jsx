import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search } from "lucide-react";

// Placeholder images - using available assets where possible or placeholders
import designer1 from "../../assets/designer1.jpg";
import designer2 from "../../assets/designer2.jpg";
import designer3 from "../../assets/designer3.jpg";
import designer4 from "../../assets/designer4.png";
import designers from "../../assets/designers.mp4"

// Using a mix of imported and placeholder images for the grid
const designersData = [
    { name: "ASMEA CHARIZ", image: designer1 },
    { name: "ANA PAULA", image: designer2 },
    { name: "ANA MILENA", image: designer3 },
    { name: "AMR ELBANNA", image: designer4 },
    { name: "ADRIAN ALICEA", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80" },
    { name: "ALEX JIMENEZ", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" },
    { name: "ANDRES AQUINO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80" },
    { name: "ELMADAWY", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80" },
    { name: "ESTUARDO & MEDA CO", image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800&q=80" },
    { name: "GULZANA", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" },
];

export default function FashionDesigners() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center py-10 md:py-0 px-6">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-16">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase">
                            MEET THE VISIONARY <br /> FASHION DESIGNERS
                        </h2>
                    </div>
                    <div>
                        <p className="text-[14px] md:text-[18px] text-black leading-7 text-justify mt-10">
                        Members of Moda Week International’s platform, our fashion designers play a vital role for the future of the fashion industry. Their contributions extend beyond showcasing their talents and business acumen. Their commitment is entrusted with the responsibility and influencing the strategic direction that will define the industry.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Filter Buttons */}
                    <div className="md:w-[15%] w-0"></div>
                    <div className="flex flex-wrap gap-3">
                        {["All", "Year", "Country", "Event"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 md:px-6 rounded-full text-sm font-medium border transition-colors ${activeFilter === filter
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-4 pr-10 py-1.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-[#C7913E]"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Designers Grid */}
            <div className="container mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
                    {designersData.map((designer, idx) => (
                        <div
                            key={idx}
                            className="group relative h-[300px] md:h-[400px] overflow-hidden cursor-pointer"
                        >
                            <img
                                src={designer.image}
                                alt={designer.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Name */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-end bg-black/60 backdrop-blur-xs h-16 transition-all duration-300">
                                <h3 className="text-white text-sm font-bold tracking-widest uppercase text-center">
                                    {designer.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-12">
                    <button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors">
                        LOAD MORE
                    </button>
                </div>
            </div>

            <div className="w-full h-auto overflow-hidden mb-10">
                <video
                    src={designers}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                />
            </div>

            <Footer />
        </div>
    );
}
