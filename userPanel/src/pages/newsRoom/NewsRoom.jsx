import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowRight } from "lucide-react";
import CtaSection from "../../components/CtaSection";
// Using the same top image as PastEvents for consistency or a placeholder
//import petop from "../../assets/petop.jpg";
import news1 from "../../assets/news1.jpg";
import news2 from "../../assets/news2.jpg";
import news3 from "../../assets/news3.jpg";
import news4 from "../../assets/news4.jpg";

const newsData = [
    {
        id: 1,
        date: "November 28, 2025",
        title: "Spring/Summer 2025: A Vision of Timeless Elegance",
        description: "Explore our latest collection featuring refined silhouettes and innovative design elements that define contemporary luxury. Join us as we unveil the future of fashion.",
        image: news1
    },
    {
        id: 2,
        date: "November 25, 2025",
        title: "The Art of Craftsmanship: A Behind-the-Scenes Look",
        description: "Step inside our studio where master artisans bring exceptional designs to life through meticulous attention to detail. Witness the dedication and skill that goes into every piece.",
        image: news2
    },
    {
        id: 3,
        date: "November 20, 2025",
        title: "Sketching the Future: The Creative Process from Concept",
        description: "Discover how our designers transform initial sketches into stunning garments that push the boundaries of style. A journey from imagination to reality.",
        image: news3
    },
    {
        id: 4,
        date: "November 15, 2025",
        title: "Capturing the Moment: Photoshoot Showcase",
        description: "Behind the lens of our latest editorial photoshoot showcasing the collection in motion. See the energy and emotion captured in every frame.",
        image: news4
    },
];

export default function NewsRoom() {
    return (
        <div className="text-white min-h-screen font-sans">
            <Navbar />
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white text-black py-0 px-4 h-[300px]">
                <div className="max-w-4xl mx-auto text-center pt-20">
                    <p className="text-2xl tracking-wide mb-4 font-medium uppercase">
                        NEWSROOM & EVENTS
                    </p>
                    <h1 className="text-4xl tracking-wide md:text-[44px] font-bold mb-8 bg-linear-to-r from-[#3C2306] to-[#C7913E] bg-clip-text text-transparent font-playfair">
                        NEWS UPDATES
                    </h1>
                    <p className="text-black max-w-2xl mx-auto leading-relaxed text-[18px]">
                        Stay updated with the latest news from Moda Week International and explore our archive of past fashion events from around the world.
                    </p>
                </div>
            </div>
            {/* News Grid Section */}
            <div className="w-full py-20 pt-15 overflow-hidden text-black">
                <div className="max-w-7xl mx-auto px-4 mb-12">
                    <h2 className="text-4xl md:text-5xl font-semibold uppercase">NEWS ROOM</h2>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="ml-4 flex overflow-x-auto gap-4 px-4 md:px-[calc((100vw-80rem)/2)] pb-8 hide-scrollbar snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {newsData.map((item) => (
                        <div
                            key={item.id}
                            className="min-w-[85vw] md:min-w-[calc((100vw-4rem)/3.5)] lg:min-w-[calc((80rem-2rem)/3.5)] snap-start group cursor-pointer flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-[4/5] h-[378px] mb-6 bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col grow">
                                <p className="text-[#A1A1A1] text-[14px] mb-3 tracking-wider">
                                    {item.date}
                                </p>
                                <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-[#C7913E] transition-colors text-[#171717]">
                                    {item.title}
                                </h3>
                                <p className="text-[#737373] text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* Padding div to ensure the last item isn't flush against the edge if needed, or just let padding-right handle it */}
                    <div className="min-w-[4rem] md:min-w-[1px]"></div>
                </div>
            </div>

            <CtaSection />

            <Footer />
        </div>
    );
}
