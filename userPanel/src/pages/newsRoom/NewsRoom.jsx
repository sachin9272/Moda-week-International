import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowRight, Play, Instagram, Heart, MessageCircle, Share2, Search, Menu, X } from "lucide-react";
import CtaSection from "../../components/CtaSection";
// Using the same top image as PastEvents for consistency or a placeholder
import news1 from "../../assets/news1.jpg";
import news2 from "../../assets/news2.jpg";
import news3 from "../../assets/news3.jpg";
import news4 from "../../assets/news4.jpg";

// Mock Data
const trendingTopics = ["PARIS FASHION WEEK", "MILAN STREET STYLE", "NEW GUCCI COLLECTION", "SUSTAINABLE LUXURY", "MET GALA PREVIEW"];

const mainFeatured = {
    id: 1,
    category: "FASHION WEEK",
    date: "NOVEMBER 28, 2025",
    title: "Spring/Summer 2025: A Vision of Timeless Elegance",
    description: "Explore our latest collection featuring refined silhouettes and innovative design elements that define contemporary luxury. Join us as we unveil the future of fashion.",
    image: news1,
    author: "BY SARAH JENKINS"
};

const subFeatured = [
    {
        id: 2,
        category: "BACKSTAGE",
        date: "NOVEMBER 25, 2025",
        title: "The Art of Craftsmanship: A Behind-the-Scenes Look",
        image: news2
    },
    {
        id: 3,
        category: "DESIGN",
        date: "NOVEMBER 20, 2025",
        title: "Sketching the Future: The Creative Process from Concept",
        image: news3
    }
];

const latestNews = [
    {
        id: 4,
        category: "EDITORIAL",
        date: "NOVEMBER 15, 2025",
        title: "Capturing the Moment: Photoshoot Showcase",
        description: "Behind the lens of our latest editorial photoshoot showcasing the collection in motion.",
        image: news4
    },
    {
        id: 5,
        category: "TRENDS",
        date: "NOVEMBER 10, 2025",
        title: "Color Palettes of the Season: Earth Tones Return",
        description: "An in-depth analysis of the shifting color trends in the global fashion scene.",
        image: news2 // Reusing image for mock
    },
    {
        id: 6,
        category: "INDUSTRY",
        date: "NOVEMBER 05, 2025",
        title: "The Business of Fashion: Market Shifts in 2026",
        description: "How digital transformation is reshaping the luxury retail landscape.",
        image: news3 // Reusing image for mock
    },
    {
        id: 7,
        category: "PEOPLE",
        date: "NOVEMBER 01, 2025",
        title: "Interview: The Rising Star of London Fashion",
        description: "A candid conversation with the designer everyone is talking about.",
        image: news1 // Reusing image for mock
    }
];

const videoPlaylist = [
    { id: 1, videoId: "j35XjyXPEN0", title: "GUCCI SPRING SUMMER 2025", time: "JUST IN", image: news1 }, // User Video 1
    { id: 2, videoId: "NgVwGZanIeE", title: "CHANEL FALL-WINTER 2025/26", time: "PARIS", image: news2 }, // User Video 2
    { id: 3, videoId: "xudDlJXglHs", title: "DIOR HOMME SUMMER 26", time: "HIGHLIGHTS", image: news3 }, // User Video 3
    { id: 4, videoId: "j35XjyXPEN0", title: "DIOR FALL WINTER 2025", time: "RUNWAY", image: news4 }, // User Video 4 (Repeated as per request)
];


const initialInstagramPosts = [
    { id: 1, link: "https://www.instagram.com/p/DS63Br1jo8_/", image: news1, likes: "10.2k" },
    { id: 2, link: "https://www.instagram.com/p/DS6s6kyjtas/", image: news2, likes: "8.9k" },
    { id: 3, link: "https://www.instagram.com/p/DS6sMuSDgWx/", image: news3, likes: "15.1k" },
    { id: 4, link: "https://www.instagram.com/p/DS6rnloDv8f/", image: news4, likes: "12.4k" }
];

export default function NewsRoom() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [followerCount, setFollowerCount] = useState("23.5k");
    const [instagramPosts, setInstagramPosts] = useState(initialInstagramPosts);
    const [currentVideo, setCurrentVideo] = useState(videoPlaylist[0]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                // Adjust URL based on your environment variable or proxy setup
                const response = await axios.get('http://localhost:5000/api/instagram/followers');
                if (response.data) {
                    if (response.data.followers) setFollowerCount(response.data.followers);
                    if (response.data.posts && response.data.posts.length > 0) setInstagramPosts(response.data.posts);
                }
            } catch (error) {
                console.error("Failed to fetch instagram followers", error);
            }
        };

        fetchFollowers();
    }, []);

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-[#C7913E] selection:text-white">
            <Navbar />

            {/* Header Section */}
            <header className="pt-24 pb-12 px-4 border-b border-black/10">
                <div className="max-w-[1400px] mx-auto text-center">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-[#C7913E]">The Official News Source</span>
                        <h1 className="font-serif text-6xl md:text-8xl font-normal tracking-tight bg-gradient-to-b from-black to-gray-800 bg-clip-text text-transparent">
                            MODA WEEK
                        </h1>
                        <div className="w-24 h-1 bg-[#C7913E] mt-6 mb-8"></div>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-8 md:gap-16 text-xs font-bold tracking-[0.15em] uppercase text-gray-500">
                        {["Runway", "Backstage", "Designers", "Trends", "Sustainable", "Business"].map((item) => (
                            <a key={item} href="#" className="hover:text-black transition-all duration-300 relative group">
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C7913E] transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">

                {/* Hero / Featured Section - Asymmetric Magazine Layout */}
                <section className="mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:h-[600px]">
                        {/* Main Hero */}
                        <div className="lg:col-span-8 h-[500px] lg:h-full relative group cursor-pointer overflow-hidden">
                            <img
                                src={mainFeatured.image}
                                alt={mainFeatured.title}
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-[#C7913E] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                                        {mainFeatured.category}
                                    </span>
                                    <span className="text-[10px] font-medium tracking-widest uppercase border-l border-white/30 pl-3">
                                        {mainFeatured.date}
                                    </span>
                                </div>
                                <h2 className="font-serif text-4xl md:text-6xl font-medium leading-none mb-6 group-hover:text-[#F0D1A8] transition-colors">
                                    {mainFeatured.title}
                                </h2>
                                <p className="text-gray-200 text-sm md:text-base mb-6 font-light max-w-xl line-clamp-2">
                                    {mainFeatured.description}
                                </p>
                                <div className="text-[10px] font-bold tracking-widest uppercase text-white/70">
                                    {mainFeatured.author}
                                </div>
                            </div>
                        </div>

                        {/* Side Articles */}
                        <div className="lg:col-span-4 flex flex-col gap-1 h-full">
                            {subFeatured.map((item) => (
                                <div key={item.id} className="relative flex-1 group cursor-pointer overflow-hidden min-h-[250px]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                        <span className="text-[#C7913E] text-[9px] font-bold uppercase tracking-widest mb-3">
                                            {item.category}
                                        </span>
                                        <h3 className="font-serif text-2xl lg:text-3xl font-medium leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-[#C7913E]">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Ticker / Breaking */}
                <div className="border-y border-black py-4 mb-24 overflow-hidden">
                    <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                        {trendingTopics.map((topic, i) => (
                            <div key={i} className="flex items-center gap-8">
                                <span className="text-sm font-bold tracking-widest uppercase">{topic}</span>
                                <span className="text-[#C7913E] text-xs">●</span>
                            </div>
                        ))}
                        {trendingTopics.map((topic, i) => (
                            <div key={`dup-${i}`} className="flex items-center gap-8">
                                <span className="text-sm font-bold tracking-widest uppercase">{topic}</span>
                                <span className="text-[#C7913E] text-xs">●</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Latest News - Minimalist List & Grid */}
                <section className="mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Section Header */}
                        <div className="lg:col-span-3">
                            <h2 className="font-serif text-4xl font-normal leading-tight mb-6">
                                Latest <br /> Stories
                            </h2>
                            <div className="w-12 h-0.5 bg-black mb-6"></div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Curated updates from the world of high fashion, luxury lifestyle, and cultural shifts.
                            </p>
                            <button className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#C7913E] hover:border-[#C7913E] transition-colors">
                                View Archive
                            </button>
                        </div>

                        {/* List */}
                        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                            {latestNews.map((item, idx) => (
                                <div key={item.id} className="group cursor-pointer">
                                    <div className="overflow-hidden mb-6 aspect-[16/10]">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 contrast-[1.05]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 mb-3 border-t border-gray-200 pt-3">
                                        <span className="text-[9px] font-bold text-[#C7913E] uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                                            {item.date}
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-2xl font-medium leading-snug mb-3 group-hover:text-[#C7913E] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cinematic Live Section */}
                <section className="mb-24 bg-[#050505] text-white p-1 md:p-8 lg:p-12 -mx-4 md:-mx-8 lg:rounded-sm">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-white/20 pb-6 px-4">
                        <div>
                            <span className="text-[#C7913E] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Moda TV</span>
                            <h2 className="font-serif text-4xl md:text-5xl font-normal">Runway & Shows</h2>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-widest hover:text-[#C7913E] transition-colors mt-4 md:mt-0">
                            Full Schedule <ArrowRight size={14} className="inline ml-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Video Player */}
                        <div className="lg:col-span-2 relative aspect-video group overflow-hidden border border-white/10 bg-black">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                                title={currentVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Playlist */}
                        <div className="flex flex-col gap-0 border border-white/10 h-full">
                            <div className="p-4 bg-white/5 border-b border-white/10">
                                <h4 className="font-bold text-xs uppercase tracking-widest text-[#C7913E]">Up Next</h4>
                            </div>
                            <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[400px]">
                                {videoPlaylist.map((video, idx) => (
                                    <div
                                        key={video.id}
                                        onClick={() => setCurrentVideo(video)}
                                        className={`p-4 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 group ${currentVideo.id === video.id ? 'bg-white/10' : ''}`}
                                    >
                                        <div className="w-28 h-16 bg-gray-800 shrink-0 relative overflow-hidden">
                                            <img src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play size={12} className="fill-white text-white" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{video.time}</span>
                                            <h5 className="font-serif text-sm font-medium leading-tight group-hover:text-[#C7913E] transition-colors line-clamp-2">{video.title}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter / Instagram Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-50 p-8 md:p-16 border border-gray-100">
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-[#C7913E]">Stay Connected</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-normal mb-6">Join the Inner Circle</h2>
                        <p className="text-gray-500 mb-8 max-w-md text-sm leading-relaxed">
                            Subscribe to our newsletter for exclusive access to backstage passes, designer interviews, and weekly trend reports.
                        </p>
                        <div className="flex gap-0 border-b border-black pb-2 max-w-sm">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                className="bg-transparent border-none outline-none w-full text-xs font-bold tracking-widest uppercase placeholder:text-gray-400"
                            />
                            <button className="text-xs font-bold uppercase hover:text-[#C7913E]">Subscribe</button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-2">
                            {initialInstagramPosts.slice(0, 4).map((post) => (
                                <div key={post.id} className="aspect-square relative group overflow-hidden">
                                    <img src={post.image} alt="IG" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Instagram className="text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white p-4 shadow-lg border border-gray-100 flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Follow Us</div>
                                <div className="font-serif text-lg">@modaweek</div>
                            </div>
                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
                                <Instagram size={18} />
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <div className="text-white">
                <CtaSection />
            </div>
            <Footer />
        </div>
    );
}

function SocialLink({ icon, label }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#C7913E] hover:border-[#C7913E] transition-all duration-300 group">
            {React.cloneElement(icon, { size: 16, className: "group-hover:scale-110 transition-transform" })}
        </a>
    )
}
