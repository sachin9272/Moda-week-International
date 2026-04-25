import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { baseURL } from "../../config/api";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

export default function FeatureModelMember() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/api/fashion-designers/${id}`);
                const participantData = response.data;

                if (participantData?.category !== "Feature Model") {
                    throw new Error("Participant is not a feature model.");
                }

                setParticipant(participantData);
            } catch (err) {
                console.error("Error fetching feature model:", err);
                setError("Feature model not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipant();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-gray-500 font-medium tracking-widest uppercase">Loading feature model details...</div>
            </div>
        );
    }

    if (error || !participant) {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 gap-6">
                <div className="text-red-500 font-medium tracking-widest uppercase">{error || "Feature model not found"}</div>
                <button
                    onClick={() => navigate("/participants")}
                    className="border border-[#c58f3b] text-[#c58f3b] px-8 py-3 text-sm tracking-widest hover:bg-[#c58f3b] hover:text-white transition-colors duration-300 uppercase font-medium"
                >
                    Back to Participants
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen w-full font-sans overflow-x-hidden">
            <Navbar />

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-28 pb-12 md:pt-36 md:pb-20 relative">
                <div className="mb-4 md:mb-8">
                    <button
                        onClick={() => navigate("/participants")}
                        className="inline-block border border-[#C7913E] text-[#C7913E] px-6 py-2.5 text-xs tracking-[0.2em] hover:bg-[#C7913E] hover:text-white transition-all uppercase font-medium md:px-10"
                    >
                        BACK
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-20 relative">
                    <div className="hidden lg:block absolute left-[-40px] bottom-[10%] w-[1.5px] h-[35%] bg-[#C7913E]"></div>
                    <div className="hidden lg:block absolute right-[-40px] top-0 bottom-[15%] w-[1.5px] bg-[#C7913E]"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="w-full lg:w-[40%] flex shrink-0 items-center"
                    >
                        <img
                            src={optimizeCloudinaryImage(participant.image?.url || participant.image, { width: 900, height: 1200, crop: "fill" })}
                            alt={participant.name}
                            className="w-full h-auto object-cover shadow-sm"
                            decoding="async"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                        className="w-full lg:w-[60%] flex flex-col justify-center pt-0 pb-6 md:pb-12"
                    >
                        <div className="mb-5 md:mb-7">
                            <h1 className="text-3xl md:text-4xl lg:text-[50px] font-serif text-[#C7913E] mb-2 leading-[1.08] uppercase tracking-[0.01em]">
                                {participant.name}
                            </h1>
                            <p className="text-[13px] md:text-[14.5px] text-gray-400 font-light italic leading-[1.45] uppercase tracking-[0.14em]">
                                "{participant.category || "Feature Model"}"
                            </p>
                        </div>

                        <div className="max-w-[720px] pt-0 text-left text-[14px] leading-[1.6] tracking-[0.01em] text-[#555] md:text-[14.5px] md:leading-[1.7]">
                            {participant.description ? (
                                participant.description.split("\n").map((paragraph, idx) => (
                                    paragraph.trim() ? <p key={idx} className="mb-2.5 md:mb-2">{paragraph}</p> : null
                                ))
                            ) : (
                                <p>No detailed description available.</p>
                            )}
                        </div>

                        <div className="mt-10 flex flex-wrap gap-4 md:mt-12 md:gap-6">
                            {participant.instagram && (
                                <a href={participant.instagram} target="_blank" rel="noopener noreferrer" className="text-[#C7913E] hover:text-black transition-colors font-medium text-xs uppercase tracking-[0.15em] underline underline-offset-[6px]">
                                    Instagram
                                </a>
                            )}
                            {participant.website && (
                                <a href={participant.website} target="_blank" rel="noopener noreferrer" className="text-[#C7913E] hover:text-black transition-colors font-medium text-xs uppercase tracking-[0.15em] underline underline-offset-[6px]">
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
