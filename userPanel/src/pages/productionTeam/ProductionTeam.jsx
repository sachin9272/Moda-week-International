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

            <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center px-4 py-10 md:px-6 md:py-0">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start px-4 md:px-16">
                    <div className="flex flex-col gap-2 text-center md:text-left mt-14 md:mt-0">
                        <h2 className="text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase">
                            {heroContent.title}
                        </h2>
                    </div>
                    <div className="self-start md:mt-0">
                        <p className="text-[14px] md:text-[18px] text-black leading-7 text-start md:text-justify whitespace-pre-line">
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
                                <article className="overflow-hidden border-y border-[#e8d9bf] bg-[linear-gradient(180deg,#a06a18_0%,#6f430e_48%,#2a1405_100%)] px-4 py-6 shadow-[0_18px_40px_rgba(67,34,7,0.16)] md:px-8 md:py-8">
                                    <div className="grid items-start gap-8 md:min-h-[520px] md:grid-cols-[minmax(360px,420px)_1fr] md:gap-8">
                                        <div className="pl-0 md:pl-12">
                                            <div className="inline-block max-w-full">
                                                <h2 className="inline-block break-words border-b border-[#efe2bf] px-0 pb-4 font-playfair text-[1.9rem] uppercase leading-tight tracking-[0.01em] text-white md:whitespace-nowrap md:text-[2.9rem]">
                                                    {featuredMember.name}
                                                </h2>
                                            </div>

                                            <div className="mt-4 w-full max-w-full overflow-hidden bg-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.25)] sm:max-w-[320px] md:max-w-[340px]">
                                                <img
                                                    src={getMemberImage(featuredMember)}
                                                    alt={featuredMember.name}
                                                    className="h-[360px] w-full object-cover object-top md:h-[430px]"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>

                                            <div className="mt-4 flex flex-col items-center gap-3 text-center sm:max-w-[320px] md:max-w-[340px]">
                                                <p className="w-full text-justify text-sm uppercase tracking-[0.08em] text-[#f3e0b5] md:text-center md:text-[1.05rem]">
                                                    {featuredMember.role || "Production Team"}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/production-team/${featuredMember._id}`)}
                                                    className="border border-white px-6 py-3 text-sm tracking-[0.08em] text-white transition hover:bg-white hover:text-[#2a1405]"
                                                >
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex min-h-full flex-col justify-center pt-4 md:pt-16 md:pl-10">
                                            <div className="md:px-2 min-h-[2rem] md:min-h-[12rem] flex items-center">
                                                {getMemberCardDescription(featuredMember) && (
                                                    <p className="text-justify font-playfair text-[1.45rem] uppercase leading-[1.45] tracking-[0.03em] text-[#d7a74c] md:text-center md:text-[2.95rem] md:leading-[1.45]">
                                                        {getMemberCardDescription(featuredMember)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-8 h-px w-full bg-[#d7a74c] md:mx-auto md:mt-10 md:max-w-[88%]" />

                                            <div className="mt-5 flex flex-wrap gap-4 text-sm uppercase tracking-[0.16em] text-[#f4d49a] md:justify-center md:gap-6">
                                                {featuredMember.instagram && (
                                                    <a
                                                        href={featuredMember.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="transition hover:text-white"
                                                    >
                                                        Instagram
                                                    </a>
                                                )}
                                                {featuredMember.website && (
                                                    <a
                                                        href={featuredMember.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="transition hover:text-white"
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
                                                className="flex h-full flex-col overflow-hidden border border-[#e8d9bf]/60 bg-[linear-gradient(180deg,#a06a18_0%,#6f430e_48%,#2a1405_100%)] shadow-[0_18px_40px_rgba(67,34,7,0.16)]"
                                            >
                                                <div className="group relative h-[300px] overflow-hidden bg-white/10 md:h-[400px]">
                                                    <img
                                                        src={getMemberImage(member, { width: 720, height: 900, crop: "fill" })}
                                                        alt={member.name}
                                                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                                                    <div className="absolute bottom-0 left-0 right-0 flex min-h-[5.5rem] flex-col items-center justify-center gap-2 bg-black/60 p-5 text-center backdrop-blur-xs">
                                                        <h3 className="font-playfair text-2xl uppercase leading-tight text-white">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-sm uppercase tracking-[0.12em] text-[#f3e0b5]">
                                                            {member.role || "Production Team"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 flex-col px-5 py-5 text-center">
                                                    <div className="h-px w-full bg-[#d7a74c]" />

                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/production-team/${member._id}`)}
                                                        className="mt-5 border border-white px-5 py-3 text-sm tracking-[0.08em] text-white transition hover:bg-white hover:text-[#2a1405]"
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
