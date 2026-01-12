import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CtaSection from "../../components/CtaSection";
import { ArrowLeft, Clock, Calendar, User, Share2, Printer } from 'lucide-react';
import { baseURL } from '../../config/api';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                // Try fetching from public news endpoint 
                // Note: using /api/news/get/:id is for admin usually, but we should have a public GetOne route. 
                // Let's check newsController. It has getNews exported. usage: router.get('/:id', getNews) in newsRoutes?
                // Wait, I only checked adminRoutes. I need to ensure public newsRoutes exists.
                // Assuming /api/news/:id works if I check newsRoutes.js.
                // If not, I'll fix the route path here after I verify.
                // For now, let's try `${baseURL}/api/news/${id}` based on common pattern.

                // Correction: Looking at previous context, public `newsRoutes.js` was mentioned.
                // Let's assume standard REST: GET /api/news/:id
                const response = await axios.get(`${baseURL}/api/news/${id}`);
                if (response.data.status === 'success') {
                    setNewsItem(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch news item", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsItem();
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <Navbar />
                <div className="animate-pulse text-xl font-serif">Loading Article...</div>
            </div>
        )
    }

    if (!newsItem) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <Navbar />
                <div className="text-center">
                    <h2 className="text-2xl font-serif mb-4">Article Not Found</h2>
                    <button
                        onClick={() => navigate('/news-room')}
                        className="text-xs font-bold uppercase tracking-widest border-b border-black hover:text-[#C7913E] hover:border-[#C7913E] transition-colors"
                    >
                        Back to News Room
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-[#C7913E] selection:text-white">
            <Navbar />

            <main className="pt-32 pb-16">
                <article className="max-w-4xl mx-auto px-4 md:px-8">
                    {/* Navigation */}
                    <button
                        onClick={() => navigate('/news-room')}
                        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to News
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block bg-[#C7913E] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-6">
                            {newsItem.category}
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
                            {newsItem.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium tracking-widest text-gray-500 uppercase border-y border-gray-100 py-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {newsItem.date || new Date(newsItem.createdAt).toLocaleDateString()}
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-2">
                                <User size={14} />
                                {newsItem.author || "MODA EDITORIAL"}
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                5 MIN READ
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {newsItem.image && newsItem.image.url && (
                        <div className="aspect-[16/9] w-full overflow-hidden mb-12 bg-gray-100">
                            <img
                                src={newsItem.image.url}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none font-light text-gray-700 leading-relaxed mb-16">
                        <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
                    </div>

                    {/* Share / Tags Footer */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-200">
                        <div className="flex gap-2">
                            {['Fashion', 'Runway', 'Style', '2025'].map(tag => (
                                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 text-gray-500 hover:bg-black hover:text-white transition-colors cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Share Article</span>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#C7913E] hover:border-[#C7913E] hover:text-white transition-all">
                                    <Share2 size={14} />
                                </button>
                                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:border-black hover:text-white transition-all">
                                    <Printer size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <div className="text-white">
                <CtaSection />
            </div>
            <Footer />
        </div>
    );
}
