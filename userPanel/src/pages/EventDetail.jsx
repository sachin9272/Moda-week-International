import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { Square } from 'lucide-react';

import el1 from "../assets/el1.png";
import el2 from "../assets/el2.png";
import el3 from "../assets/el3.png";
import el4 from "../assets/el4.png";
import el5 from "../assets/el5.png";
import el6 from "../assets/el6.png";

import mr1 from "../assets/mr1.png";
import mr2 from "../assets/mr2.png";
import mr3 from "../assets/mr3.png";
import mr4 from "../assets/mr4.png";
import mr5 from "../assets/mr5.png";
import mr6 from "../assets/mr6.png";

import wa1 from "../assets/wa1.png";
import wa2 from "../assets/wa2.png";
import wa3 from "../assets/wa3.png";
import wa4 from "../assets/wa4.png";
import wa5 from "../assets/wa5.png";
import wa6 from "../assets/wa6.png";

import ch1 from "../assets/ch1.png";
import ch2 from "../assets/ch2.png";
import ch3 from "../assets/ch3.png";
import ch4 from "../assets/ch4.png";
import ch5 from "../assets/ch5.png";
import ch6 from "../assets/ch6.png";

import qu1 from "../assets/qu1.png";
import qu2 from "../assets/qu2.png";
import qu3 from "../assets/qu3.png";

import fo1 from "../assets/fo1.png";
import fo2 from "../assets/fo2.png";
import fo3 from "../assets/fo3.png";
import fo4 from "../assets/fo4.png";
import fo5 from "../assets/fo5.png";
import fo6 from "../assets/fo6.png";
import eventVideo from "../assets/eventVideo.mp4";

import ec1 from "../assets/ec1.png";
import ec2 from "../assets/ec2.png";
import ec3 from "../assets/ec3.png";

import emg1 from "../assets/emg1.png";

export default function EventDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city") || "SYRACUSE";
    const eventName = queryParams.get("event") || "FASHION WEEKEND";
    const date = "October 11th, 2013"; // Mock date for now

    // Mock data for the collections
    const collections = [
        {
            title: "ELMADAWY",
            subtitle: "Fashion Designer",
            images: [el1, el2, el3, el4, el5, el6]
        },
        {
            title: "MR SHOP",
            subtitle: "COLLECTION",
            images: [mr1, mr2, mr3, mr4, mr5, mr6]
        },
        {
            title: "WALID ATALLAH",
            subtitle: "FASHION DESIGNER",
            images: [wa1, wa2, wa3, wa4, wa5, wa6]
        },
        {
            title: "CHLOE SCHNELL",
            subtitle: "STUDENT DESIGNER",
            images: [ch1, ch2, ch3, ch4, ch5, ch6]
        },
        {
            title: "QUEESHA",
            subtitle: "STUDENT DESIGNER",
            images: [qu1, qu2, qu3]
        },
        {
            title: "FOLIE",
            subtitle: "STUDENT DESIGNER",
            images: [fo1, fo2, fo3, fo4, fo5, fo6]
        },
        {
            title: "EVENT COVERING",
            subtitle: "",
            images: [ec1, ec2, ec3]
        }
    ];

    return (
        <div className="bg-white min-h-screen text-black font-sans">
            <Navbar />

            <div className=""> {/* Offset for fixed Navbar */}
                {/* Split Hero Section */}
                <div className="flex flex-col md:flex-row h-[100vh] min-h-[400px]">
                    {/* Left Side - Gold */}
                    <div className="w-full md:w-1/2 bg-gradient-to-b from-[#8C5D25] to-[#C7913E] flex flex-col justify-center items-center p-8">
                        <div className="text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest leading-tight flex flex-col">
                                <span>{city}</span>
                                {(eventName.replace(city, "").trim() || "FASHION WEEKEND").split(" ").map((word, i) => (
                                    <span key={i}>{word}</span>
                                ))}
                            </h1>
                            <p className="text-white/80 mt-2 text-lg">{date}</p>
                        </div>
                    </div>

                    {/* Right Side - Video */}
                    <div className="w-full md:w-1/2 h-full">
                        <video
                            src={eventVideo}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>
            </div>

            <div className="mt-10">
                {/* Collections */}
                {collections.map((collection, idx) => (
                    <div key={idx} className="mb-16">
                        <div className="container mx-auto px-4">
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="font-bold text-2xl uppercase grad-text">
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
                                            alt={`Model ${imgIdx}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#F7F7F7] py-10">
                <div className="container mx-auto px-18">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Left Side - Image */}
                        <div className="w-full md:w-1/3">
                            <img src={emg1} alt="Syracuse Fashion Weekend" className="w-full h-[574px] object-cover h-auto shadow-lg" />
                        </div>

                        {/* Right Side - Content */}
                        <div className="w-full md:w-2/3 text-[16px] md:text-base text-gray-800">
                            <h3 className="font-bold uppercase text-lg mb-2">SYRACUSE FASHION WEEKEND</h3>
                            <p className="">
                                What an incredible journey we've had during the 2nd Annual Fashion Show at Syracuse
                                Fashion Weekend, SPRING/SUMMER 13/14! Each of you brought your A-game, and the
                                result? Absolutely FABULOUS!
                            </p>
                            <p className="">
                                On October 11th, we came together to revel in the vibrant fusion of art, culture, and
                                couture, creating unforgettable moments right here in Central New York for the very first
                                Syracuse Fashion Weekend.
                            </p>
                            <p className="">
                                The overwhelming success of the event fills us with immense joy and pride. Moda Week
                                International, we want to extend our deepest gratitude to you for your hard work and
                                invaluable contributions that played a pivotal role in making this inaugural event a
                                resounding triumph.
                            </p>
                            <p className="">
                                As we bid farewell to an unforgettable Syracuse Fashion Weekend, we are already
                                bubbling with excitement for the future. Your collective efforts have laid a strong
                                foundation, and we can't wait to turn next year's SFW into an even more spectacular
                                success. We hope this journey was as enjoyable for you as it was for us, and we eagerly
                                anticipate the chance to collaborate with you again in the coming year.
                            </p>
                            <p className="">
                                Thank you for being an integral part of the success story that is Syracuse Fashion
                                Weekend.
                                <br />
                                With gratitude and positivity,
                            </p>

                            <div className="mt-2">
                                <p className="font-bold">-Esmeralda Harwood,</p>
                                <p>Founder, Owner & CEO</p>
                                <p>Moda Week International</p>
                                <a href="https://www.modaweekinternational.com/syracusefashionweekend2013" className="underline hover:text-blue-600 break-all">
                                    https://www.modaweekinternational.com/syracusefashionweekend2013
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
