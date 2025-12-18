import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowRight } from "lucide-react";
import CtaSection from "../../components/CtaSection";
import pe1 from "../../assets/pe1.png";
import pe2 from "../../assets/pe2.png";
import pe3 from "../../assets/pe3.png";
import pe4 from "../../assets/pe4.png";
import pe5 from "../../assets/pe5.png";
import pe6 from "../../assets/pe6.png";


// Placeholder images - using generic fashion/event images from Unsplash
const events = [
    {
        title: "THE PREMIER SYRACUSE FASHION WEEKEND 2012",
        date: "MAY 03, 2012",
        description: "The Premier, Syracuse Fashion Weekend. Your unwavering support, dedication, and passion for fashion have made this event an unforgettable experience. Here's to celebrating the artistry and creativity that the fashion industry.",
        image: pe1,
    },
    {
        title: "SYRACUSE FASHION WEEKEND 2013",
        date: "SEPT 2013",
        description: "Moda Week International is thrilled to announce the much-anticipated second annual Syracuse Fashion Weekend, set to dazzle fashion enthusiasts on Friday, October 11, 2013. Prepare to be captivated by a breathtaking display of style and innovation as we celebrate the ever-evolving world of fashion. Save the date, because this promises to be a night to remember!",
        image: pe2,
    },
    {
        title: "SYRACUSE FASHION WEEKEND 2014",
        date: "SEPT 2014",
        description: "We take this opportunity to thank you for your continues valuable support. Ladies and gentlemen, fashion aficionados, and supporters of style and innovation, It is with immense gratitude and excitement that we announce the arrival of the third annual Syracuse Fashion Weekend, presented by Moda Week International, taking place on Saturday, October 11, 2014. This event is a testament to the passion, creativity, and dedication of countless individuals who have come together to make it a resounding success.",
        image: pe3,
    },
    {
        title: "SYRACUSE FASHION WEEKEND 2016",
        date: "SEPT 2016",
        description: "Moda Week International is proud to present the fourth annual Syracuse Fashion Weekend on Friday, September 23, 2016. We celebrate the ever-evolving world of fashion.",
        image: pe4,
    },
    {
        title: "NEW YORK CITY FASHION SHOW 2017",
        date: "FEB 11, 2017",
        description: "Moda Week International present the New York City Fashion Show Event on Friday, February 10, 2017. Spectacular evening celebrating style, creativity, and the vibrant fashion scene of the Big Apple. It's a date you won't want to miss!",
        image: pe5,
    },
    {
        title: "NEW YORK CITY FASHION SHOW 2018",
        date: "FEB 10, 2018",
        description: "Sensational night! Moda Week International proudly presents the annual New York City Fashion Show Event on Saturday, February 17, 2018, at the iconic Hotel Pennsylvania in the heart of New York City",
        image: pe6,
    },
];

export default function PastEvents() {
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Navbar />
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="h-[300px] bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center text-center px-4">
                <div>
                    <h2 className="text-black text-2xl tracking-wide uppercase mb-2">PAST EVENTS</h2>
                    <h1 className="text-3xl md:text-[44px] font-bold bg-linear-to-r from-[#3C2306] to-[#C7913E] bg-clip-text text-transparent mb-4 uppercase">
                        CLIENTELE
                    </h1>
                    <p className="text-black text-[18px] md:text-base max-w-2xl mx-auto">
                        Celebrating our past and respectful supporters, collaborators and community
                    </p>
                </div>
            </div>

            {/* Events Grid */}
            <div className="bg-white text-black py-6 px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {events.map((event, index) => (
                            <Link to={`/event-details?event=${encodeURIComponent(event.title)}`} key={index} className="group cursor-pointer flex flex-col h-full">
                                {/* Image Container */}
                                <div className="relative overflow-hidden aspect-[3/4] mb-6">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col grow">
                                    <h3 className="text-xl md:text-2xl font-[Inter] font-semibold mb-2 uppercase leading-tight group-hover:text-[#C7913E] transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs tracking-widest uppercase mb-4 font-semibold">
                                        {event.date}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {event.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-[#C7913E] transition-colors duration-300 uppercase">
                            Load More
                        </button>
                    </div>
                </div>
            </div>

            {/* Join Experience Section */}
            <CtaSection />

            <Footer />
        </div>
    );
}
