import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Users, Calendar, Globe, Heart, ArrowRight, Play } from "lucide-react";

// Import Assets
import CommunityImg from "../../assets/Events-1.jpg";
import GlobalImg from "../../assets/Events-3.jpg";
import PurposeVideo from "../../assets/video1.mp4";

// Import Slideshow
import PhilanthropySlideshow from "../../components/PhilanthropySlideshow";

const Philanthropy = () => {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#C7913E] selection:text-white">
            <Navbar />

            <div className="pb-20"> {/* Removed pb-20 to allow full width/height slideshow at bottom */}
                {/* Header Section */}
                <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-transparent h-[400px] flex flex-col items-center justify-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl md:text-6xl !font-[Playfair_Display] font-bold mb-6 tracking-widest grad-text-up uppercase">
                            PHILANTHROPY
                        </h1>
                        <div className="h-[1px] w-24 bg-[#C7913E] mx-auto mb-8" />
                        <p className="text-lg md:text-xl font-light tracking-[0.25em] text-[#8C5D25] uppercase max-w-4xl mx-auto flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center">
                            <span className="font-medium">Back to the Community</span>
                            <span className="hidden md:inline text-[#C7913E]">•</span>
                            <span>Fashion With Purpose</span>
                        </p>
                    </motion.div>
                </header>

                <div className="container mx-auto px-6 max-w-9xl">

                    {/* Introduction Block */}
                    {/* Introduction Block */}
                    <div className="max-w-7xl mx-auto mb-32 relative">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-neutral-50 to-transparent -z-10 blur-3xl opacity-50" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            {/* Main Lead Statement */}
                            <div className="text-center max-w-4xl mx-auto">
                                <p className="text-2xl md:text-3xl font-[Playfair_Display] leading-relaxed text-gray-900">
                                    At <span className="text-[#C7913E] italic">Moda Week International (MWINTL)</span>, philanthropy is an essential pillar of
                                    our mission and a responsibility we consciously uphold across every
                                    region where we operate.
                                </p>
                                <div className="h-1 w-20 bg-[#C7913E]/30 mx-auto mt-8" />
                            </div>

                            {/* Editorial 2-Column Text Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 text-lg font-light text-gray-600 leading-looose text-justify">
                                <div className="space-y-6">
                                    <p>
                                        <span className="float-left text-5xl font-[Playfair_Display] text-[#C7913E] mr-3 mt-[-6px] leading-[0.8]">W</span>
                                        e believe that fashion is more than an industry, it is a cultural, educational, and social force capable of generating opportunity, restoring dignity, and fostering long-term community development. For this reason, MWINTL is structured not only as an international fashion production platform, but as a vehicle for social impact and community empowerment.
                                    </p>
                                    <p>
                                        Our philanthropic approach is rooted in <strong className="font-medium text-gray-800">action, access, and inclusion</strong>. MWINTL invests in human potential, providing platforms, visibility, education, and participation to communities, youth, and creatives who are often underrepresented within the global fashion ecosystem.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="relative pl-8 border-l-2 border-[#C7913E]/20">
                                        <p>
                                            Every MWINTL event is designed with a <strong className="font-medium text-gray-800">“back to the community”</strong> framework, ensuring that our presence contributes meaningfully beyond the runway. We work in collaboration with local leaders, institutions, creatives, and youth organizations to integrate cultural respect, educational exposure, and economic opportunity into our productions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Section 1: Community Engagement (Text Left, Image Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-neutral-50 rounded-full">
                                    <Users size={28} className="text-[#C7913E]" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold">Community Engagement</h3>
                            </div>
                            <div className="text-lg text-gray-600 leading-loose font-light space-y-4">
                                <p>
                                    MWINTL actively engages with local communities by creating inclusive
                                    spaces where culture, creativity, and collaboration intersect. We
                                    prioritize respectful partnerships that honor local identity,
                                    traditions, and voices, ensuring communities are participants, not
                                    spectators in the process.
                                </p>
                                <p>
                                    Through workshops, collaborations, and community dialogue, we aim to strengthen creative ecosystems and encourage sustainable growth from within.
                                </p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-block border-b border-[#C7913E] text-[#C7913E] uppercase tracking-widest text-sm pb-1">Inclusive Spaces</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-neutral-50 -z-10 rounded-xl transform rotate-2"></div>
                            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                                <img src={CommunityImg} alt="Community Engagement" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Section 2: Fashion Events (Video Left, Text Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="absolute -inset-4 bg-neutral-50 -z-10 rounded-xl transform -rotate-2"></div>
                            <div className="aspect-video overflow-hidden rounded-lg shadow-2xl relative group">
                                <video
                                    src={PurposeVideo}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                    autoPlay muted loop playsInline
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 order-1 lg:order-2"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-neutral-50 rounded-full">
                                    <Calendar size={28} className="text-[#C7913E]" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold">Community-Based Events</h3>
                            </div>
                            <div className="text-lg text-gray-600 leading-loose font-light space-y-4">
                                <p>
                                    Our fashion events are intentionally structured as
                                    community-inclusive platforms. We integrate local designers,
                                    artisans, performers, students, and emerging talent into our
                                    programming, transforming fashion shows into educational and cultural experiences.
                                </p>
                                <p>
                                    These events foster pride, cultural continuity, and creative confidence, while opening doors to international exposure and professional development.
                                </p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-block border-b border-[#C7913E] text-[#C7913E] uppercase tracking-widest text-sm pb-1">Cultural Experience</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Section 3: Digital Visibility (Text Left, Image Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-neutral-50 rounded-full">
                                    <Globe size={28} className="text-[#C7913E]" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold">Digital Visibility & Outreach</h3>
                            </div>
                            <div className="text-lg text-gray-600 leading-loose font-light space-y-4">
                                <p>
                                    MWINTL extends its philanthropic impact through digital platforms
                                    that amplify community voices on a global scale. By offering
                                    international visibility, media exposure, and online storytelling,
                                    we help emerging creatives and community initiatives reach audiences
                                    beyond geographic and economic limitations.
                                </p>
                                <p>
                                    Digital visibility becomes a bridge, connecting local talent to global opportunity.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[#C7913E] font-medium pt-2">
                                <ArrowRight size={20} />
                                <span className="tracking-wide">Global Opportunity</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-neutral-50 -z-10 rounded-xl transform rotate-1"></div>
                            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                                <img src={GlobalImg} alt="Global Outreach" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Philosophy Section - Dark Theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0f0f0f] text-white p-12 md:p-20 rounded-2xl relative overflow-hidden shadow-2xl text-center"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                            <Heart size={400} strokeWidth={0.5} />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                            <h2 className="text-4xl md:text-5xl font-[Playfair_Display] font-bold grad-text leading-tight">
                                Our Philanthropic Philosophy
                            </h2>

                            <div className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light italic space-y-6">
                                <p>
                                    "Philanthropy at MWINTL is defined by purpose, responsibility, and
                                    service to humanity. We believe that contributing time, expertise,
                                    platforms, and leadership is as powerful as financial giving—and
                                    often more transformative.
                                </p>
                                <p>
                                    Our commitment is to create lasting impact, empower future generations, and ensure that fashion serves as a tool for education, inclusion, and positive change."
                                </p>
                            </div>

                            <div className="pt-10 border-t border-white/10 inline-block px-10">
                                <p className="font-[Playfair_Display] text-3xl italic text-[#C7913E] mb-2">
                                    Esmeralda Harwood
                                </p>
                                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 font-bold">
                                    CEO / Philanthropist & MWINTL Committee Team
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Slideshow Section */}
            <div className="pb-20">
                <PhilanthropySlideshow />
            </div>

            <Footer />
        </div >
    );
};

export default Philanthropy;
