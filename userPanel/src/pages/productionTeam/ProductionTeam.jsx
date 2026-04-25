import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { baseURL } from "../../config/api";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

const getMemberImage = (member, options = { width: 900, height: 1200, crop: "fill" }) =>
    optimizeCloudinaryImage(member?.image?.url || member?.image || "https://via.placeholder.com/900x1200?text=No+Image", options);

const getMemberCardDescription = (member) =>
    member?.cardDescription?.trim() || "";

export default function ProductionTeam() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const heroContent = {
        title: "MEET THE PRODUCTION TEAM",
        description: "The visionary professionals behind the scenes of Moda Week International. From creative direction to technical execution, our production team brings extraordinary concepts to life with precision and passion."
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/production-team?limit=1000`);
                const membersData = response.data.members || [];
                setMembers(Array.isArray(membersData) ? membersData : []);
            } catch (fetchError) {
                console.error("Error fetching production team:", fetchError);
                setError(fetchError.message || "Failed to load production team.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const featuredMember = members[0] || null;
    const secondaryMembers = members.slice(1);

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center px-4 py-12 md:px-6 md:py-0">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 items-start px-4 md:px-16">
                    <div className="flex flex-col gap-2 text-center md:text-left mt-8 md:mt-0">
                        <h2 className="text-2xl sm:text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase">
                            {heroContent.title}
                        </h2>
                    </div>
                    <div className="self-start md:mt-0">
                        <p className="text-sm md:text-lg text-black leading-relaxed text-center md:text-justify whitespace-pre-line">
                            {heroContent.description}
                        </p>
                    </div>
                </div>
            </div>

            <section className="w-full bg-[#ffffff] pb-20 pt-6 md:pt-8">
                <div className="w-full px-0">
                    {loading ? (
                        <div className="py-24 text-center text-[#7a4c10]">Loading production team...</div>
                    ) : error ? (
                        <div className="py-24 text-center text-red-500">Error: {error}</div>
                    ) : members.length === 0 ? (
                        <div className="py-24 text-center text-[#7a4c10]">No team members found.</div>
                    ) : (
                        <div className="space-y-8 md:space-y-10">
                            {featuredMember && (
                                <article className="overflow-hidden border-y border-[#e8d9bf] bg-[linear-gradient(180deg,#a06a18_0%,#6f430e_48%,#2a1405_100%)] px-4 py-8 shadow-[0_18px_40px_rgba(67,34,7,0.16)] md:px-8 md:py-12">
                                    <div className="grid items-start gap-8 md:min-h-[520px] md:grid-cols-[minmax(330px,420px)_1fr] md:gap-12">
                                        <div className="flex flex-col items-center md:items-start pl-0 md:pl-12">
                                            <div className="inline-block max-w-full text-center md:text-left">
                                                <h2 className="inline-block break-words border-b border-[#efe2bf] px-0 pb-3 font-playfair text-2xl uppercase leading-tight tracking-[0.01em] text-white md:whitespace-nowrap md:text-[2.9rem] md:pb-4">
                                                    {featuredMember.name}
                                                </h2>
                                            </div>

                                            <div className="mt-6 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] overflow-hidden bg-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
                                                <img
                                                    src={getMemberImage(featuredMember)}
                                                    alt={featuredMember.name}
                                                    className="h-[300px] sm:h-[360px] w-full object-cover object-top md:h-[430px]"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>

                                            <div className="mt-5 flex flex-col items-center gap-4 text-center w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px]">
                                                <p className="w-full text-sm uppercase tracking-[0.08em] text-[#f3e0b5] md:text-[1.05rem]">
                                                    {featuredMember.role || "Production Team"}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/production-team/${featuredMember._id}`)}
                                                    className="w-full sm:w-auto border border-white px-8 py-3 text-sm tracking-[0.1em] text-white transition hover:bg-white hover:text-[#2a1405] uppercase"
                                                >
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex min-h-full flex-col justify-center pt-2 md:pt-16 md:pl-10">
                                            <div className="md:px-2 min-h-0 md:min-h-[12rem] flex items-center justify-center md:justify-start">
                                                {getMemberCardDescription(featuredMember) && (
                                                    <p className="text-center md:text-left font-playfair text-lg sm:text-xl uppercase leading-relaxed tracking-[0.03em] text-[#d7a74c] md:text-[2.95rem] md:leading-[1.45]">
                                                        {getMemberCardDescription(featuredMember)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-8 h-px w-2/3 mx-auto md:mx-0 md:w-full bg-[#d7a74c] md:mt-10 md:max-w-[88%]" />

                                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm uppercase tracking-[0.16em] text-[#f4d49a]">
                                                {featuredMember.instagram && (
                                                    <a
                                                        href={featuredMember.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="transition hover:text-white border-b border-transparent hover:border-white"
                                                    >
                                                        Instagram
                                                    </a>
                                                )}
                                                {featuredMember.website && (
                                                    <a
                                                        href={featuredMember.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="transition hover:text-white border-b border-transparent hover:border-white"
                                                    >
                                                        Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )}

                            {secondaryMembers.length > 0 && (
                                <section className="px-4 md:px-8">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                        {secondaryMembers.map((member) => (
                                            <article
                                                key={member._id}
                                                className="flex h-full flex-col overflow-hidden border border-[#e8d9bf]/40 shadow-[0_15px_35px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-2 group"
                                            >
                                                <div className="relative h-[300px] sm:h-[340px] overflow-hidden bg-[#1a0f05] md:h-[400px]">
                                                    <img
                                                        src={getMemberImage(member, { width: 720, height: 900, crop: "fill" })}
                                                        alt={member.name}
                                                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                    {/* Dark gradient for text readability */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                                    
                                                    {/* Name and Role Overlay */}
                                                    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center gap-1.5 p-5 text-center">
                                                        <h3 className="font-playfair text-xl sm:text-2xl uppercase leading-tight text-white tracking-wider">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#d7a74c] font-semibold">
                                                            {member.role || "Production Team"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 flex-col px-8 py-6 text-center bg-[#3d2109]">
                                                    {/* Decorative separator line */}
                                                    <div className="h-[1px] w-24 mx-auto bg-[#d7a74c]/40 mb-2" />

                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/production-team/${member._id}`)}
                                                        className="mt-auto border border-white/60 px-8 py-3 text-[11px] sm:text-xs tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-[#3d2109] hover:border-white uppercase font-bold"
                                                    >
                                                        Learn More
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
