import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembershipProgram = () => {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Header Section */}
            <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-transparent h-[400px]">
                <h1 className="text-3xl md:text-[44px] font-bold uppercase tracking-wider mb-0 grad-text-up">
                    Fashion Event Promotion Membership
                </h1>
                <p className="text-sm md:text-lg font-medium tracking-wide mb-4">
                    Showcase Your Fashion Event to a Global Audience
                </p>
                <div className="max-w-8xl mx-auto space-y-4 text-sm md:text-[18px]">
                    <p>A place where philanthropy is welcome by subscription only. Fashion with Purpose. Impact by Design.</p>
                    <p>This digital membership is ideal for independent producers, boutique brands and emerging creators seeking international exposure through MWINTL's curated platform.</p>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-2 px-10">
                <div className="md:px-10 px-4 py-10 md:h-[325px] mx-auto text-center mb-8 mt-8 md:mt-0 bg-gradient-to-b from-[#FAFAFA] to-[#E0E0E0] flex flex-col justify-center">
                    <h2 className="text-2xl md:text-[40px] font-bold mb-8">Choose this plan if you are looking to:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4 p-4">
                            <div className="bg-[#F37623] p-3 text-white">
                                <Star fill="white" size={24} />
                            </div>
                            <p className="text-left">Present your fashion show to a global audience</p>
                        </div>
                        <div className="flex items-start gap-4 p-4">
                            <div className="bg-[#F37623] p-3 text-white">
                                <Star fill="white" size={24} />
                            </div>
                            <p className="text-left">Introduce your brand or event to the international market</p>
                        </div>
                        <div className="flex items-start gap-4 p-4">
                            <div className="bg-[#F37623] p-3 text-white">
                                <Star fill="white" size={24} />
                            </div>
                            <p className="text-left">Increase ticket sales, visibility, and collaboration opportunities</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-4 px-10 bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#FDBD5C]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#FDBD5C] p-8 rounded-none border border-transparent hover:shadow-xl transition-shadow relative text-center">
                        <div className="mb-2 flex justify-center sticky top-0">
                            <Star className="text-[#BB8639]" size={32} />
                        </div>
                        <h3 className="text-2xl !font-playfair font-bold uppercase tracking-widest mb-1">BASIC</h3>
                        <p className="text-[14px] text-[#D09D30] mb-4">Essential Visibility for Event Recognition</p>
                        <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#FFB548] to-[#FD975D] mb-6">$150</div>
                        <p className="text-xs text-gray-500 mb-8 px-4">Ideal for emerging brands and regional events seeking increased visibility and direct audience engagement.</p>

                        <div className="text-left text-sm space-y-3 mb-8">
                            <p className="text-[#F47920] text-xs font-bold uppercase mb-2">Includes:</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Event date placement on the MWINTL calendar</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Standard event listing and basic details (location, description, contact)</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Inclusion in the Global Fashion Events Directory</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Searchable visibility within our platform</span></li>
                            </ul>
                        </div>
                        <button className="w-full bg-[#D49E47] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#b88636] transition-colors">Join Now</button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-[#FCAE53] text-white p-8 rounded-none shadow-2xl relative text-center transform md:-translate-y-4">
                        <div className="mb-6 flex justify-center">
                            <Star className="text-white" size={32} fill="white" />
                        </div>
                        <h3 className="text-xl font-serif font-bold uppercase tracking-widest mb-1 text-black">PREMIUM</h3>
                        <p className="text-[10px] uppercase tracking-wide text-white mb-4">Elevated Exposure and Promotional Boost</p>
                        <div className="text-6xl font-bold text-white mb-6">$300</div>
                        <p className="text-xs text-white/90 mb-8 px-4">Ideal for emerging brands and regional events seeking increased visibility and direct audience engagement.</p>

                        <div className="text-left text-sm space-y-3 mb-8 text-black">
                            <p className="text-[#8B2208] text-xs font-bold uppercase mb-2">Includes everything in Basic, plus:</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2"><Check size={16} className="text-white mt-1 shrink-0" /> <span>Featured positioning on the MWINTL events feed</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-white mt-1 shrink-0" /> <span>Visual photo gallery inclusion</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-white mt-1 shrink-0" /> <span>RSVP / booking links for attendees</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-white mt-1 shrink-0" /> <span>Enhanced search visibility</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-white mt-1 shrink-0" /> <span>Optional press release inclusion (upon request)</span></li>
                            </ul>
                        </div>
                        <button className="w-full bg-[#C6903D] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#a5752e] transition-colors border-2 border-white/30">Join Now</button>
                    </div>

                    {/* Elite Plan */}
                    <div className="bg-[#FFF8E7] p-8 rounded-none border border-transparent hover:shadow-xl transition-shadow relative text-center">
                        <div className="absolute top-0 right-0 bg-[#E8A33A] text-white text-[10px] font-bold px-3 py-1 uppercase">Yearly Plan</div>
                        <div className="mb-6 flex justify-center">
                            <Star className="text-[#C7913E]" size={32} />
                        </div>
                        <h3 className="text-xl font-serif font-bold uppercase tracking-widest mb-1">Elite</h3>
                        <p className="text-[10px] uppercase tracking-wide text-[#C7913E] mb-4">Strategic Year-Round Promotion & Recognition</p>
                        <div className="text-6xl font-bold text-[#FAA853] mb-6">$1,500</div>
                        <p className="text-xs text-gray-500 mb-8 px-4">For fashion production companies, designer collectives, and promotional agencies seeking long-term visibility and multiple campaigns.</p>

                        <div className="text-left text-sm space-y-3 mb-8">
                            <p className="text-[#F47920] text-xs font-bold uppercase mb-2">Includes everything in Premium, plus:</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>12 months of platform visibility</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Priority featured placement across calendar and directory</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Up to 5 event listings per year</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Rotating promotional banners</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Quarterly spotlight features (newsletter / digital outreach)</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#F47920] mt-1 shrink-0" /> <span>Dedicated partnership support and content guidance</span></li>
                            </ul>
                        </div>
                        <button className="w-full bg-[#D49E47] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#b88636] transition-colors">Join Now</button>
                    </div>
                </div>
                <section className="py-20 relative bg-black text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    {/* Placeholder for background image - using a dark gradient for now */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-[#2a1a05] to-black z-0"></div>

                    <div className="relative z-20 max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">READY TO PROMOTE YOUR EVENT?</h2>
                        <p className="text-gray-300 text-sm mb-8">Send your request to: <span className="text-[#C7913E]">membership@modaweekinternational.com</span></p>
                        <p className="text-xs text-gray-400 mb-8 max-w-lg mx-auto">Our team will review your submission and provide next steps for publication.</p>
                        <button className="bg-[#B88746] text-white px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-[#966b32] transition-colors">Apply Now →</button>
                    </div>
                </section>
            </section>

            {/* Promo Section */}


            {/* Add-ons Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-bold text-center mb-12 uppercase tracking-wide">Optional Add-On Services (Available to Premium & Annual Members)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4 group">
                            <div className="h-48 overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1576670868725-7b561b3693fb?auto=format&fit=crop&q=80" alt="Press Section" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <p className="text-xs text-center font-medium">Feature interview in MWINTL's press section</p>
                        </div>
                        <div className="space-y-4 group">
                            <div className="h-48 overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1520052203542-d3095f1b6cf0?auto=format&fit=crop&q=80" alt="Backstage" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <p className="text-xs text-center font-medium">Backstage access badge for selected contributors</p>
                        </div>
                        <div className="space-y-4 group">
                            <div className="h-48 overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80" alt="Livestream" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <p className="text-xs text-center font-medium">Livestream support or event replay upload</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Orange Section */}
            <section className="py-16 px-4 bg-[#FCD8B3]">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm font-bold uppercase mb-12 text-[#5A3E1E]">Optional Add-On Services (Available to Premium & Annual Members)</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#F47920] p-4 shrink-0">
                                <Star fill="white" className="text-white" size={24} />
                            </div>
                            <p className="text-xs font-medium text-[#5A3E1E]">Feature interview in MWINTL's press section</p>
                        </div>
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#F47920] p-4 shrink-0">
                                <Star fill="white" className="text-white" size={24} />
                            </div>
                            <p className="text-xs font-medium text-[#5A3E1E]">Feature interview in MWINTL's press section</p>
                        </div>
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#F47920] p-4 shrink-0">
                                <Star fill="white" className="text-white" size={24} />
                            </div>
                            <p className="text-xs font-medium text-[#5A3E1E]">Feature interview in MWINTL's press section</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default MembershipProgram;
