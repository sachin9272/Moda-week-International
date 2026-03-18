import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowRight, Play, Instagram, Facebook, Heart, MessageCircle, Share2, Search, Menu, X } from "lucide-react";
import CtaSection from "../../components/CtaSection";
// Using the same top image as PastEvents for consistency or a placeholder
import news1 from "../../assets/news1.jpg";
import news2 from "../../assets/news2.jpg";
import news3 from "../../assets/news3.jpg";
import news4 from "../../assets/news4.jpg";
import { baseURL } from "../../config/api";

// Mock Data (Video/Instagram still using assets)
const trendingTopics = ["PARIS FASHION WEEK", "MILAN STREET STYLE", "NEW GUCCI COLLECTION", "SUSTAINABLE LUXURY", "MET GALA PREVIEW"];

const CATEGORIES = ["ALL POSTS", "COSMETICS", "EDUCATION", "FASHION", "FINE ART", "PEFORMANCES", "PAST EVENTS", "TRAVEL"];




const initialInstagramPosts = [
    { id: 1, link: "https://www.instagram.com/p/DS63Br1jo8_/", image: news1, likes: "10.2k" },
    { id: 2, link: "https://www.instagram.com/p/DS6s6kyjtas/", image: news2, likes: "8.9k" },
    { id: 3, link: "https://www.instagram.com/p/DS6sMuSDgWx/", image: news3, likes: "15.1k" },
    { id: 4, link: "https://www.instagram.com/p/DS6rnloDv8f/", image: news4, likes: "12.4k" }
];

export default function NewsRoom() {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [followerCount, setFollowerCount] = useState("23.5k");
    const [instagramPosts, setInstagramPosts] = useState(initialInstagramPosts);
    const [videoPlaylist, setVideoPlaylist] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("ALL POSTS");

    // Dynamic Video State
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get(`${baseURL}/api/landing-videos?type=newsroom`);
                if (data && data.length > 0) {
                    const formatted = data.map(v => ({
                        id: v._id,
                        videoId: extractYoutubeId(v.videoUrl),
                        title: v.title,
                        time: "JUST IN"
                    }));
                    setVideoPlaylist(formatted);
                    setCurrentVideo(formatted[0]);
                }
            } catch (error) {
                console.error("Failed to fetch newsroom videos", error);
            }
        };
        fetchVideos();
    }, []);

    const extractYoutubeId = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Dynamic News State
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch News Function
    const fetchNews = async (currentPage, category, search, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const params = {
                page: currentPage,
                limit: 6,
                category: category === "ALL POSTS" ? "" : category,
                search
            };

            const { data } = await axios.get(`${baseURL}/api/news/live`, { params });

            if (data.status === 'success') {
                if (currentPage === 1) {
                    setNewsItems(data.data);
                } else {
                    setNewsItems(prev => [...prev, ...data.data]);
                }

                // Determine if there are more items
                const totalPages = data.pagination?.pages || 1;
                setHasMore(currentPage < totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial Load & Filter Change
    useEffect(() => {
        setPage(1); // Reset page
        fetchNews(1, selectedCategory, searchQuery);
    }, [selectedCategory, searchQuery]);

    // Load More Handler
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNews(nextPage, selectedCategory, searchQuery, true);
    };

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                // Adjust URL based on your environment variable or proxy setup
                const response = await axios.get(`${baseURL}/api/instagram/followers`);
                if (response.data) {
                    if (response.data.followers) setFollowerCount(response.data.followers);
                    if (response.data.posts && response.data.posts.length > 0) {
                        setInstagramPosts(response.data.posts);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch instagram followers", error);
            }
        };

        fetchFollowers();
    }, []);

    // Derived State
    const mainFeatured = newsItems.length > 0 ? newsItems[0] : null;
    const subFeatured = newsItems.length > 2 ? newsItems.slice(1, 3) : [];

    // Displayed Items (Directly from state now)
    const displayedItems = newsItems;

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-[#C7913E] selection:text-white">
            <Navbar />

            {/* Hero / Global Events Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white text-black h-auto pb-8">
                <div className="max-w-7xl mx-auto px-4 pt-12 pb-4">
                    {/* Header */}
                    <div className="text-center mb-4 max-w-9xl mx-auto mt-15">
                        <h1 className="relative inline-block md:text-[52px] font-bold text-4xl tracking-widest mb-6 bg-linear-to-br from-[#3C2306] via-[#734F1C] to-[#C7913E] bg-clip-text text-transparent !font-playfair">
                            FASHION NEWS
                            <span className="absolute left-1/2 -bottom-4 w-1/3 h-0.5 -translate-x-1/2 bg-linear-to-b from-[#3C2306] to-[#C7913E]"></span>
                        </h1>
 
                        <p className="text-black max-w-3xl mx-auto leading-relaxed mb-4 !font-montserrat">
                            The Official News Source. Curated updates from the world of high fashion, luxury lifestyle, and cultural shifts.
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">

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

                    {currentVideo && (
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
                    )}
                </section>

                {/* Latest News - Minimalist List & Grid */}
                <section className="mb-24">
                    {/* Categories Bar */}
                    <div className="bg-white py-4 w-full overflow-x-auto border-b border-gray-100 mb-12">
                        <nav className="flex flex-nowrap md:flex-wrap justify-center gap-8 md:gap-16 text-xs font-bold tracking-[0.15em] uppercase min-w-max px-8">
                            {CATEGORIES.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setSelectedCategory(item)}
                                    className={`transition-all duration-300 relative group flex-shrink-0 ${selectedCategory === item ? "text-[#C7913E]" : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    {item}
                                    {selectedCategory === item && (
                                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#C7913E]"></span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Section Header */}
                        <div className="lg:col-span-3">
                            <h2 className="font-serif text-4xl font-normal leading-tight mb-6">
                                {selectedCategory === "ALL POSTS" ? "Latest Stories" : `${selectedCategory} Stories`}
                            </h2>
                            <div className="w-12 h-0.5 bg-black mb-6"></div>

                            {/* Search Input */}
                            <div className="relative mb-8 group">
                                <input
                                    type="text"
                                    placeholder="SEARCH STORIES..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-b border-black/20 py-3 pr-8 text-xs font-bold tracking-[0.2em] uppercase focus:border-[#C7913E] focus:outline-none transition-all duration-300 placeholder:text-gray-400 text-black"
                                />
                                <Search size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C7913E] transition-colors" />
                            </div>

                            {selectedCategory === "ALL POSTS" && (
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    Curated updates from the world of high fashion, luxury lifestyle, and cultural shifts.
                                </p>
                            )}
                            <button className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#C7913E] hover:border-[#C7913E] transition-colors">
                                View Archive
                            </button>

                            {/* Submit Editorial Button */}
                            <button
                                onClick={() => navigate('/news-room/submit')}
                                className="mt-6 block w-full bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity"
                            >
                                Submit Your Editorial
                            </button>
                        </div>

                        {/* List */}
                        <div className="lg:col-span-9">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                                {loading ? (
                                    <div className="col-span-2 py-20 text-center text-gray-500">Loading news...</div>
                                ) : displayedItems.length > 0 ? (
                                    displayedItems.map((item, idx) => (
                                        <div
                                            key={item._id}
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/news-room/${item.slug || item._id}`)}
                                        >
                                            <div className="overflow-hidden mb-6 aspect-[16/10] bg-gray-50 border border-gray-100">
                                                <img
                                                    src={item.image?.url}
                                                    alt={item.title}
                                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 contrast-[1.05]"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 mb-3 border-t border-gray-200 pt-3">
                                                <span className="text-[9px] font-bold text-[#C7913E] uppercase tracking-widest">
                                                    {item.category}
                                                </span>
                                                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                                                    {new Date(item.date || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="font-serif text-2xl font-medium leading-snug mb-3 group-hover:text-[#C7913E] transition-colors">
                                                {item.title}
                                            </h3>
                                            {item.description && (
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-12 text-center text-gray-500">
                                        No stories found in {selectedCategory}.
                                    </div>
                                )}
                            </div>

                            {/* Load More Button */}
                            {!loading && hasMore && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-[#C7913E] transition-colors duration-300 uppercase disabled:opacity-50"
                                    >
                                        {loadingMore ? "Loading..." : "Load More"}
                                    </button>
                                </div>
                            )}
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
                            {instagramPosts.slice(0, 4).map((post) => (
                                <a 
                                    key={post.id} 
                                    href={post.link || "https://www.instagram.com/modaweekinternationalofficial/"} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="aspect-square relative group overflow-hidden block"
                                >
                                    <img src={post.image} alt="IG" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-1">
                                        <Instagram className="text-white" />
                                        {post.likes && post.likes !== "N/A" && (
                                            <span className="text-white text-xs font-bold">{post.likes}</span>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white p-4 shadow-lg border border-gray-100 flex items-center gap-3">
                            <div className="text-right border-r border-gray-100 pr-3 mr-1">
                                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Socials</div>
                                <div className="font-serif text-lg">MODA WEEK</div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href="https://www.instagram.com/modaweekinternationalofficial/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full hover:bg-[#C7913E] transition-colors"
                                >
                                    <Instagram size={18} />
                                </a>
                                <a
                                    href="https://www.facebook.com/modaweekinternational"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-[#1877F2] text-white flex items-center justify-center rounded-full hover:opacity-90 transition-opacity"
                                >
                                    <Facebook size={18} />
                                </a>
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
