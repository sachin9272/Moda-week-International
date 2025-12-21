import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { baseURL as API_BASE_URL } from "../../config/api";

export default function EventPreview() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (id) {
                    const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
                    setEvent(response.data);
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-black">Loading event details...</div>;
    }

    if (!event) {
        return <div className="text-center py-20 text-black">Event not found.</div>;
    }

    return (
        <div className="bg-white min-h-screen text-black font-sans relative">
            <Link to="/events" className="fixed top-4 left-4 z-50 bg-black/50 hover:bg-black text-white px-4 py-2 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2">
                &larr; Back to Events
            </Link>
            <div className=""> {/* No Navbar offset needed if no navbar */}
                {/* Split Hero Section */}
                <div className="flex flex-col md:flex-row h-[100vh] min-h-[400px]">
                    {/* Left Side - Gold */}
                    <div className="w-full md:w-1/2 bg-gradient-to-b from-[#8C5D25] to-[#C7913E] flex flex-col justify-center items-center p-8">
                        <div className="text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest leading-tight flex flex-col">
                                <span>{event.city}</span>
                                {(event.eventName.replace(event.city, "").trim() || "").split(" ").map((word, i) => (
                                    <span key={i}>{word}</span>
                                ))}
                            </h1>
                            <p className="text-white/80 mt-2 text-lg">{event.date}</p>
                        </div>
                    </div>

                    {/* Right Side - Video */}
                    <div className="w-full md:w-1/2 h-full">
                        {event.headerVideo ? (
                            <video
                                src={event.headerVideo}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white">
                                No video available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                {/* Collections */}
                {event.collections && event.collections.map((collection, idx) => (
                    <div key={idx} className="mb-16">
                        <div className="container mx-auto px-4">
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="font-bold text-2xl uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#8C5D25] to-[#C7913E]">
                                    {collection.title}
                                </h2>
                                <span className="text-[#595959] uppercase text-2xl">{collection.subtitle}</span>
                            </div>
                        </div>

                        {/* Full Width Border */}
                        <div className="h-[0.3px] bg-gray-900 w-full mb-6"></div>

                        <div className="container mx-auto px-4">
                            {/* Image Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {collection.images.map((img, imgIdx) => (
                                    <div key={imgIdx} className={`overflow-hidden group ${collection.title === "EVENT COVERING" ? "h-[367px]" : "aspect-[2/3]"}`}>
                                        <img
                                            src={img}
                                            alt={`Collection ${idx} Image ${imgIdx}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section (Recap) */}
            {event.bottomSection && (
                <div className="bg-[#F7F7F7] py-10">
                    <div className="container mx-auto px-18">
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            {/* Left Side - Image */}
                            <div className="w-full md:w-1/3">
                                {event.bottomSection.image && <img src={event.bottomSection.image} alt={event.bottomSection.title} className="w-full h-auto shadow-lg object-cover" />}
                            </div>

                            {/* Right Side - Content */}
                            <div className="w-full md:w-2/3 text-[16px] md:text-base text-gray-800">
                                {event.bottomSection.title && <h3 className="font-bold uppercase text-lg mb-2">{event.bottomSection.title}</h3>}
                                <p className="whitespace-pre-line">
                                    {event.bottomSection.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
