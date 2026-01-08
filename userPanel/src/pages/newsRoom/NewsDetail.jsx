import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CtaSection from "../../components/CtaSection";
import { ArrowLeft, Clock, Calendar, User, Share2, Printer } from 'lucide-react';
import { allNewsItems } from '../../data/newsData';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        const item = allNewsItems.find(n => n.id === parseInt(id));
        if (item) {
            setNewsItem(item);
            window.scrollTo(0, 0);
        } else {
            // Handle not found - maybe redirect or show error
            // setNewsItem(null); 
        }
    }, [id]);

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
                                {newsItem.date}
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
                    <div className="aspect-[16/9] w-full overflow-hidden mb-12 bg-gray-100">
                        <img
                            src={newsItem.image}
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none font-light text-gray-700 leading-relaxed mb-16">
                        <p className="text-xl md:text-2xl font-serif text-black leading-relaxed mb-8 first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:leading-none py-2">
                            {newsItem.description}
                        </p>

                        {/* Placeholder generic content to simulate a full article length since our mock data was short */}
                        <p>
                            In the ever-evolving world of fashion, the intersection of tradition and modernity creates the most compelling narratives. This season, we observed a distinct shift towards introspection, with designers pulling from personal archives and historical references to craft collections that feel both familiar and radically new.
                        </p>
                        <p>
                            The craftsmanship on display was nothing short of extraordinary. From hand-woven textiles that took weeks to complete to 3D-printed accessories that defy the laws of physics, the dedication to artistry was palpable. It serves as a reminder that true luxury is not just about the final product, but about the time, effort, and soul poured into its creation.
                        </p>
                        <blockquote className="border-l-4 border-[#C7913E] pl-6 py-2 my-8 italic font-serif text-2xl text-black">
                            "Fashion is not just about what you wear, it's about how you live and the stories you choose to tell."
                        </blockquote>
                        <p>
                            As we look ahead to the coming months, these trends are expected to trickle down from the runway to the streets, influencing not just what we wear, but how we interact with the world around us. Sustainability continues to be a driving force, with more brands than ever committing to eco-friendly practices and transparent supply chains.
                        </p>
                        <p>
                            Stay tuned for more in-depth coverage as we continue to explore the nuances of this season's most impactful moments. The future of fashion is bright, inclusive, and endlessly inspiring.
                        </p>
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
