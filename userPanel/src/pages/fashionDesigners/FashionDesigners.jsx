import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search } from "lucide-react";

// Placeholder images - using available assets where possible or placeholders
// Placeholder images - using available assets where possible or placeholders

// Using a mix of imported and placeholder images for the grid
import axios from "axios";
import { baseURL } from "../../config/api";

export default function FashionDesigners() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDesigners = async () => {
            try {
                console.log("Fetching designers from:", `${baseURL}/api/fashion-designers`);
                const response = await axios.get(`${baseURL}/api/fashion-designers`);
                console.log("Designers data fetched:", response.data);
                setDesigners(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching designers:", error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchDesigners();
    }, []);

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
                        {["All", "Country", "Event"].map((filter) => (
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
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading designers...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
                        {designers.map((designer, idx) => (
                            <div
                                key={idx}
                                className="group relative h-[300px] md:h-[400px] overflow-hidden cursor-pointer"
                            >
                                <img
                                    src={designer.image?.url || designer.image}
                                    alt={designer.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                {/* Overlay Gradient */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-end bg-black/60 backdrop-blur-xs h-16 transition-all duration-300">
                                    <h3 className="text-white text-sm font-bold tracking-widest uppercase text-center">
                                        {designer.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                <div className="flex justify-center mt-12">
                    <button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors">
                        LOAD MORE
                    </button>
                </div>
            </div>
            <Footer />
        </div >
    );
}
