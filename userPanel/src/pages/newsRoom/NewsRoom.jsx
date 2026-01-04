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
    { id: 1, title: "RALPH LAUREN FALL/WINTER 2025", time: "LIVE NOW", image: news1 },
    { id: 2, title: "CHANEL CRUISE COLLECTION", time: "2 HOURS AGO", image: news2 },
    { id: 3, title: "SCHIAPARELLI HAUTE COUTURE", time: "YESTERDAY", image: news3 },
    { id: 4, title: "DIOR MEN'S SUMMER 26", time: "2 DAYS AGO", image: news4 },
];


const initialInstagramPosts = [
    { id: 1, image: "https://instagram.flko10-2.fna.fbcdn.net/v/t51.2885-15/609407642_17950730367063223_1758858417182216267_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.flko10-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QHl5-pxn3s0mhO1eLxtv6-5KFDVzzEL5pLhqmLK5Rsx7FTSsnnm1-lye4OYp7b2s-zmNIQgPcjiqAHxjJ_2mHV3&_nc_ohc=M54s7jVfAskQ7kNvwHNHlpV&_nc_gid=yOfT4z8HXf2c_jzmNRhwCA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfqCynF_6P7TPgBUA-9hhaZ1DWD54GiUzYJLCDHk3mf_KQ&oe=69602416&_nc_sid=8b3546", likes: "10.2k" },
    { id: 2, image: "https://instagram.flko10-2.fna.fbcdn.net/v/t51.2885-15/608420700_17950729476063223_8479624885926723316_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08_tt6&_nc_ht=instagram.flko10-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QHl5-pxn3s0mhO1eLxtv6-5KFDVzzEL5pLhqmLK5Rsx7FTSsnnm1-lye4OYp7b2s-zmNIQgPcjiqAHxjJ_2mHV3&_nc_ohc=ksc_qsmoDrQQ7kNvwFJHvay&_nc_gid=yOfT4z8HXf2c_jzmNRhwCA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Afr2niWoo3zM2jM4HkvAN8lO6gnl5YVCMpU8sRh3tWoTkg&oe=69602B28&_nc_sid=8b3546", likes: "8.9k" },
    { id: 3, image: "https://instagram.flko10-2.fna.fbcdn.net/v/t51.2885-15/606992474_17950728543063223_2000369146087062572_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.flko10-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QHl5-pxn3s0mhO1eLxtv6-5KFDVzzEL5pLhqmLK5Rsx7FTSsnnm1-lye4OYp7b2s-zmNIQgPcjiqAHxjJ_2mHV3&_nc_ohc=PWY3kskxvewQ7kNvwEjg5Tf&_nc_gid=yOfT4z8HXf2c_jzmNRhwCA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfpFbdZt4uPyGgU6lIQ6L38jV9xPUte9DKZKxus3r-6Q7A&oe=69602070&_nc_sid=8b3546", likes: "15.1k" },
    { id: 4, image: "https://instagram.flko10-2.fna.fbcdn.net/v/t51.2885-15/607495987_17950724397063223_5497683692284423029_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.flko10-2.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QHl5-pxn3s0mhO1eLxtv6-5KFDVzzEL5pLhqmLK5Rsx7FTSsnnm1-lye4OYp7b2s-zmNIQgPcjiqAHxjJ_2mHV3&_nc_ohc=Nl6kJ9Cv6j8Q7kNvwHKAQED&_nc_gid=yOfT4z8HXf2c_jzmNRhwCA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfoFdhy1BPITO6N98McpGwCPN2s4szM_fWGw0Pb03h5Ofg&oe=6960276C&_nc_sid=8b3546", likes: "12.4k" }
];

export default function NewsRoom() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [followerCount, setFollowerCount] = useState("23.5k");
    const [instagramPosts, setInstagramPosts] = useState(initialInstagramPosts);

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
        <div className="bg-white text-black min-h-screen font-sans">
            <Navbar />

            {/* Ticker Section */}
            <div className="bg-black text-white text-[10px] md:text-xs py-2 overflow-hidden whitespace-nowrap tracking-widest uppercase border-b border-gray-100 mt-20 md:mt-0">
                <div className="inline-flex gap-8 animate-marquee">
                    <span className="font-bold text-[#C7913E]">TRENDING NOW:</span>
                    {trendingTopics.map((topic, i) => (
                        <span key={i} className="opacity-80 hover:opacity-100 cursor-pointer">{topic} •</span>
                    ))}
                    {/* Duplicate for seamless scroll effect (simplified) */}
                    <span className="font-bold text-[#C7913E] ml-8">TRENDING NOW:</span>
                    {trendingTopics.map((topic, i) => (
                        <span key={`dup-${i}`} className="opacity-80 hover:opacity-100 cursor-pointer">{topic} •</span>
                    ))}
                </div>
            </div>

            {/* Custom Header */}
            <header className="py-8 md:py-12 px-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-4">
                        MODA WEEK <span className="text-[#C7913E]">NEWS</span>
                    </h1>
                    <div className="flex justify-center gap-6 md:gap-12 text-xs md:text-sm font-bold tracking-widest uppercase text-gray-500 mt-6">
                        {["Fashion", "Beauty", "Culture", "Runway", "Shopping", "Video"].map((item) => (
                            <a key={item} href="#" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-1">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">

                {/* Featured Section (Magazine Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 mb-20">
                    {/* Main Hero Article */}
                    <div className="lg:col-span-8 relative group cursor-pointer overflow-hidden">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <img
                                src={mainFeatured.image}
                                alt={mainFeatured.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-2xl">
                                <span className="bg-[#C7913E] text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-3 inline-block">
                                    {mainFeatured.category}
                                </span>
                                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:underline decoration-1 underline-offset-4">
                                    {mainFeatured.title}
                                </h2>
                                <p className="text-gray-200 text-sm md:text-base hidden md:block mb-4 line-clamp-2">
                                    {mainFeatured.description}
                                </p>
                                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                                    {mainFeatured.author} • {mainFeatured.date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Featured Articles */}
                    <div className="lg:col-span-4 flex flex-col gap-1">
                        {subFeatured.map((item) => (
                            <div key={item.id} className="relative group cursor-pointer overflow-hidden h-full">
                                <div className="relative aspect-[3/2] lg:aspect-auto lg:h-full w-full overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <span className="text-[#C7913E] text-[10px] font-bold uppercase tracking-widest mb-2 block">
                                            {item.category}
                                        </span>
                                        <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight group-hover:underline decoration-1 underline-offset-4">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live / Front Row Section */}
                <div className="mb-20">
                    <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
                        <h2 className="font-serif text-4xl md:text-6xl font-bold text-black">
                            Live / Front Row
                        </h2>
                        <button className="text-xs font-bold uppercase tracking-widest hover:text-[#C7913E] transition-colors flex items-center gap-2">
                            View All Shows <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-200">
                        {/* Main Video Player */}
                        <div className="lg:col-span-2 bg-black relative aspect-video flex items-center justify-center group overflow-hidden cursor-pointer">
                            <img
                                src={news1}
                                alt="Live Show"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                            />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                    <Play size={32} className="fill-white text-white ml-2" />
                                </div>
                                <span className="mt-4 text-red-500 font-bold tracking-widest uppercase text-xs animate-pulse bg-white/10 px-3 py-1 rounded-full">
                                    ● Live Broadcast
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="text-white font-serif text-3xl font-bold">GUCCI FALL WINTER 2026</h3>
                                <p className="text-gray-400 text-sm mt-1">Live from Milan Fashion Week</p>
                            </div>
                        </div>

                        {/* Playlist Sidebar */}
                        <div className="bg-[#111] text-white p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-6 border-b border-gray-800 pb-2">
                                Up Next & Highlights
                            </h3>
                            <div className="flex flex-col gap-6">
                                {videoPlaylist.map((video) => (
                                    <div key={video.id} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                                        <div className="w-24 h-16 bg-gray-800 shrink-0 overflow-hidden relative">
                                            <img src={video.image} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Play size={12} className="fill-white text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#C7913E] tracking-widest font-bold mb-1">{video.time}</p>
                                            <h4 className="font-serif font-bold text-lg leading-none group-hover:text-gray-300 transition-colors">
                                                {video.title}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest News Grid */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-black flex-grow"></div>
                        <h2 className="font-serif text-3xl font-bold uppercase tracking-wider">The Latest</h2>
                        <div className="h-px bg-black flex-grow"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {latestNews.map((item) => (
                            <div key={item.id} className="group cursor-pointer flex flex-col h-full">
                                <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="flex flex-col grow">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        {item.date}
                                    </div>
                                    <h3 className="font-serif text-xl font-bold leading-tight mb-2 group-hover:text-[#C7913E] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
                                        {item.description}
                                    </p>
                                    <span className="mt-auto text-[10px] font-bold uppercase tracking-widest underline decoration-gray-300 underline-offset-4 group-hover:decoration-black transition-all">
                                        Read More
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instagram Section */}
                <div className="bg-gray-50 border-t border-b border-gray-200 py-16 px-4 md:px-0 mb-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
                                Follow @FashionWeekOnline on Instagram for exclusive content
                            </h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-serif text-xl font-bold">
                                        MW
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold">@modaweekinternationalofficial</div>
                                        <div className="text-xs text-gray-500">{followerCount} Followers</div>
                                    </div>
                                </div>
                                <button className="bg-white text-black border border-black px-8 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                                    <Instagram size={16} /> Follow
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                            {instagramPosts.map((post) => (
                                <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-200">
                                    <img
                                        src={post.image}
                                        alt="Insta Post"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="text-white flex flex-col items-center gap-2">
                                            <Heart className="fill-white" size={24} />
                                            <span className="font-bold text-sm">{post.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8 gap-4">
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all">
                                <Share2 size={16} />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all">
                                <Instagram size={16} />
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            <CtaSection />
            <Footer />
        </div>
    );
}
