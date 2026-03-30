import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../config/api";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ProductionTeamMember() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/api/production-team/${slug}`);
                setMember(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching member:", err);
                setError("Member not found or failed to load.");
                setLoading(false);
            }
        };
        fetchMember();
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-gray-500 font-medium tracking-widest uppercase">Loading member details...</div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 gap-6">
                <div className="text-red-500 font-medium tracking-widest uppercase">{error || "Member not found"}</div>
                <button 
                    onClick={() => navigate('/production-team')}
                    className="border border-[#c58f3b] text-[#c58f3b] px-8 py-3 text-sm tracking-widest hover:bg-[#c58f3b] hover:text-white transition-colors duration-300 uppercase font-medium"
                >
                    Back to Team
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen w-full font-sans overflow-x-hidden">
            <Navbar />

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-28 pb-12 md:pt-36 md:pb-20 relative">
                
                {/* BACK Button */}
                <div className="mb-8 md:mb-16">
                    <button 
                        onClick={() => navigate('/production-team')}
                        className="inline-block border border-[#C7913E] text-[#C7913E] px-6 py-2.5 text-xs tracking-[0.2em] hover:bg-[#C7913E] hover:text-white transition-all uppercase font-medium md:px-10"
                    >
                        BACK
                    </button>
                </div>

                {/* Header Section (Above Image & Content aligned to right column) */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col lg:flex-row gap-8 lg:gap-20 relative"
                >
                    {/* Empty placeholder to match image width */}
                    <div className="hidden lg:block w-[40%] flex-shrink-0"></div>
                    
                    {/* Header Details */}
                    <div className="w-full lg:w-[60%] flex flex-col mb-2 md:mb-4">
                        <h1 className="text-3xl md:text-4xl lg:text-[50px] font-serif text-[#C7913E] mb-2 leading-tight uppercase">
                            {member.name}
                        </h1>
                        <p className="text-[13px] md:text-[14.5px] text-gray-400 font-light italic leading-relaxed uppercase tracking-widest">
                            "{member.role || 'Production Team'}"
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 relative">
                    
                    {/* Left Decorative Line (positioned to the left of image) */}
                    <div className="hidden lg:block absolute left-[-40px] bottom-[10%] w-[1.5px] h-[35%] bg-[#C7913E]"></div>
                    
                    {/* Right Decorative Line (positioned to the right of text) */}
                    <div className="hidden lg:block absolute right-[-40px] top-0 bottom-[15%] w-[1.5px] bg-[#C7913E]"></div>

                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="w-full lg:w-[40%] flex-shrink-0"
                    >
                        <img
                            src={optimizeCloudinaryImage(member.image?.url || member.image, { width: 900, height: 1200, crop: "fill" })}
                            alt={member.name}
                            className="w-full h-auto object-cover shadow-sm"
                            decoding="async"
                        />
                    </motion.div>

                    {/* Details Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                        className="w-full lg:w-[60%] flex flex-col pt-0 pb-6 md:pb-12"
                    >
                        <div className="pt-0 text-left text-[14px] leading-7 text-[#555] md:text-[14.5px] md:text-justify">
                            {member.description ? (
                                member.description.split('\n').map((paragraph, idx) => (
                                    paragraph.trim() ? <p key={idx} className="mb-3 md:mb-1.5">{paragraph}</p> : null
                                ))
                            ) : (
                                <p>No detailed description available.</p>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="mt-10 flex flex-wrap gap-4 md:mt-12 md:gap-6">
                            {member.instagram && (
                                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-[#C7913E] hover:text-black transition-colors font-medium text-xs uppercase tracking-[0.15em] underline underline-offset-[6px]">
                                    Instagram
                                </a>
                            )}
                            {member.website && (
                                <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-[#C7913E] hover:text-black transition-colors font-medium text-xs uppercase tracking-[0.15em] underline underline-offset-[6px]">
                                    Website
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
