import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import CtaSection from '../components/CtaSection';
import addon1 from '../assets/addon1.jpg';
import addon2 from '../assets/addon2.jpg';
import addon3 from '../assets/addon3.jpg';
import promote from "../assets/promote.jpg";

const MembershipProgram = () => {
    const addOns = [
        { image: addon1, text: "Feature interview in MWINTL's press section" },
        { image: addon2, text: "Backstage access badge for selected contributors" },
        { image: addon3, text: "Livestream support or event replay upload" }
    ];
    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Header Section */}
            <header className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-[#C7913E] to-transparent md:h-[500px]">
                <div className='max-w-3xl mx-auto'>
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4 text-[#8C5D25]">
                        Philanthropy with Purpose | Fashion with Global Reach
                    </h2>
                    <p className="text-lg md:text-xl font-medium italic text-gray-600 mb-8">
                        A place where philanthropy is welcome by subscription only. Fashion with Purpose. Impact by Design.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-16 max-w-4xl mx-auto">
                        Welcome to the official membership of MODA WEEK INTERNATIONAL, a platform where global fashion, philanthropy, and purpose align. We offer two exclusive membership pathways for individuals, businesses, and institutions seeking meaningful global impact or elevated international visibility.
                    </p>
                </div>
            </header>

            {/* Philanthropy Section */}
            <section className="py-6 px-6 md:px-10 bg-white">
                <div className="max-w-5xl mx-auto text-center">


                    <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FDF3E6] border border-[#E8C595] p-10 md:p-14 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8C5D25] via-[#D49E47] to-[#8C5D25]"></div>

                        <h3 className="text-2xl md:text-3xl font-playfair font-bold uppercase tracking-widest mb-2 text-[#8C5D25]">
                            Philanthropy & Diplomatic Membership
                        </h3>
                        <p className="text-[#D49E47] text-sm md:text-base uppercase tracking-widest font-semibold mb-8">
                            Become a Patron of Transformation
                        </p>

                        <p className="text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
                            This exclusive membership is designed for those who wish to contribute to global change through high-impact fashion initiatives, educational empowerment, and humanitarian investment. As a member, you join a distinguished circle supporting MWINTL’s mission across continents.
                        </p>

                        <div className="bg-white/60 p-8 md:p-10 mb-10 max-w-2xl mx-auto border border-[#E8C595]/30">
                            <h4 className="text-[#8C5D25] font-bold uppercase tracking-wide mb-6">We Welcome</h4>
                            <ul className="text-left space-y-3 text-gray-700 inline-block mx-auto">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D49E47] rounded-full"></div>
                                    <span>Diplomats & Ambassadors</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D49E47] rounded-full"></div>
                                    <span>Philanthropists & Cultural Leaders</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D49E47] rounded-full"></div>
                                    <span>Institutions of legacy and global reach</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D49E47] rounded-full"></div>
                                    <span>High-net-worth individuals committed to legacy-building</span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-gray-600 text-sm space-y-4">
                            <p className="font-medium">This membership program is available by private request only.</p>
                            <p>
                                Upon inquiry, a personalized catalog detailing all benefits, privileges, and philanthropic pathways will be provided, along with your official partnership contract.
                            </p>
                            <div className="mt-8">
                                <span className="block text-gray-500 text-xs uppercase tracking-widest mb-2">Send your request to</span>
                                <a href="mailto: info@modaweekinternational.com" className="text-[#8C5D25] font-bold text-lg hover:underline">
                                    info@modaweekinternational.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-4 px-10 bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#FDBD5C]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0.5">
                    {/* Basic Plan */}
                    <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#FDBD5C] p-8 rounded-none border border-transparent hover:shadow-xl transition-shadow relative text-center">
                        <div className="mb-2 flex justify-center sticky top-0">
                            <Star className="text-[#BB8639]" size={32} />
                        </div>
                        <h3 className="text-2xl !font-playfair font-bold uppercase tracking-widest mb-1">BASIC</h3>
                        <div className="w-24 h-[1px] bg-[#D09D30] mx-auto mb-4"></div>
                        <p className="text-[14px] text-[#D09D30] mb-4">Essential Visibility for Event Recognition</p>
                        <div className="text-8xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#FFB548] to-[#FD975D] mb-6">$150</div>
                        <div className="w-full h-[1.5px] bg-[#D09D30]/30 mx-auto mb-8"></div>
                        <p className="text-xs text-[#3C3C3C] mb-8 px-4">Ideal for emerging brands and regional events seeking increased visibility and direct audience engagement.</p>

                        <div className="text-left text-sm space-y-3 mb-8">
                            <p className="text-[#BB5C39] mb-6">Includes:</p>
                            <ul className="space-y-2 px-10">
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Event date placement on the MWINTL calendar</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Standard event listing and basic details (location, description, contact)</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Inclusion in the Global Fashion Events Directory</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Searchable visibility within our platform</span></li>
                            </ul>
                        </div>
                        <button className="w-full bg-[#D49E47] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#b88636] transition-colors">Join Now</button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-gradient-to-b from-[#FDAC5C] from-40% to-white p-8 py-20 rounded-none shadow-2xl relative text-center transform md:-translate-y-4">
                        <div className="mb-2 flex justify-center">
                            <Star className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold !font-playfair uppercase tracking-widest mb-1 text-black">PREMIUM</h3>
                        <div className="w-24 h-[1px] bg-white mx-auto mb-4"></div>
                        <p className="text-[10px] uppercase tracking-wide text-white mb-4">Elevated Exposure and Promotional Asset</p>
                        <div className="text-8xl font-semibold text-white mb-6">$300</div>
                        <div className="w-full h-[1.5px] bg-white/50 mx-auto mb-8"></div>
                        <p className="text-xs text-[#3C3C3C] mb-8 px-4">Ideal for emerging brands and regional events seeking increased visibility and direct audience engagement.</p>

                        <div className="text-left text-sm space-y-3 mb-8 text-black">
                            <p className="text-[#BB5C39] mb-6">Includes everything in Basic, plus:</p>
                            <ul className="space-y-2 px-10">
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Featured positioning on the MWINTL events feed</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Visual photo gallery inclusion</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>RSVP / booking links for attendees</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Enhanced search visibility</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Optional press release inclusion (upon request)</span></li>
                            </ul>
                        </div>
                        <button className="w-full bg-[#D49E47] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#b88636] transition-colors shadow-lg">Join Now</button>
                    </div>

                    {/* Elite Plan */}
                    <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#FDBD5C] p-8 rounded-none border border-transparent hover:shadow-xl transition-shadow relative text-center">
                        <div className="absolute top-0 right-0 bg-[#E8A33A] text-white text-[10px] font-bold px-3 py-1 uppercase">Yearly Plan</div>
                        <div className="mb-2 flex justify-center sticky top-0">
                            <Star className="text-[#BB8639]" size={32} />
                        </div>
                        <h3 className="text-2xl !font-playfair font-bold uppercase tracking-widest mb-1">Elite</h3>
                        <div className="w-24 h-[1px] bg-[#D09D30] mx-auto mb-4"></div>
                        <p className="text-[14px] text-[#D09D30] mb-4">Strategic Year-Round Promotion & Recognition</p>
                        <div className="text-8xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#FFB548] to-[#FD975D] mb-6">$1,500</div>
                        <div className="w-[70%] h-[1.5px] bg-[#FFB548]/30 mx-auto mb-8"></div>
                        <p className="text-xs text-[#3C3C3C] mb-8 px-4">For fashion production companies, designer collectives, and promotional agencies seeking long-term visibility and multiple campaigns.</p>

                        <div className="text-left text-sm space-y-3 mb-8">
                            <p className="text-[#BB5C39] mb-6">Includes everything in Premium, plus:</p>
                            <ul className="space-y-2 px-10">
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>12 months of platform visibility</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Priority featured placement across calendar and directory</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Up to 5 event listings per year</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Rotating promotional banners</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Quarterly spotlight features (newsletter / digital outreach)</span></li>
                                <li className="flex items-start gap-2"><Check size={16} className="text-[#AE2E0A] mt-1 shrink-0" /> <span>Dedicated partnership support and content guidance</span></li>
                            </ul>
                        </div>
                        <button className="w-full bg-[#D49E47] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#b88636] transition-colors">Join Now</button>
                    </div>
                </div>

            </section>

            {/* Features Section */}
            <section className="py-2 px-10 mt-4">
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



            <section className="max-w-5xl h-[330px] mx-auto relative bg-black text-white overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img src={promote} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-l from-[#AE2E0A9E] to-black/70" />
                </div>

                <div className="relative z-20 max-w-4xl mx-auto text-center px-4 w-full ">
                    <h2 className="text-3xl md:text-[40px] font-bold mb-5 tracking-wide">READY TO PROMOTE YOUR EVENT?</h2>

                    <div className="max-w-xl mx-auto bg-black/40 backdrop-blur-sm py-2 px-6 mb-6 flex items-center justify-between gap-4">
                        <span className="text-gray-300 whitespace-nowrap">Send your request to:</span>
                        <span className="text-[#C7913E] font-medium">info@modaweekinternational.com</span>
                    </div>

                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto tracking-wide">
                        Our team will review your submission and provide next steps for publication.
                    </p>

                    <Link to="/service?tab=buyer">
                        <button className="grad-bg text-white px-4 py-3 tracking-widest hover:bg-[#966b32] transition-colors uppercase">
                            Apply Now →
                        </button>
                    </Link>
                </div>
            </section>


            {/* Promo Section */}


            {/* Add-ons Section */}
            <section className="py-10 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">Optional Add-On Services (Available to Premium & Annual Members)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-2">
                        {addOns.map((addon, index) => (
                            <div key={index} className="space-y-4 group">
                                <div className="h-48 overflow-hidden bg-gray-200">
                                    <img src={addon.image} alt="Add-on Service" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <p className="text-center">{addon.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Orange Section */}
            {/* <section className="py-16 px-10 md:px-26 bg-[#FCD8B3]">
                <div className="max-w-7xl mx-auto text-center ">
                    <p className="text-sm font-bold uppercase mb-10">Optional Add-On Services (Available to Premium & Annual Members)</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-28 gap-10">
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#F47920] p-4 shrink-0">
                                <Star fill="white" className="text-white" size={24} />
                            </div>
                            <p>Feature interview in MWINTL's press section</p>
                        </div>
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#F47920] p-4 shrink-0">
                                <Star fill="white" className="text-white" size={24} />
                            </div>
                            <p>Feature interview in MWINTL's press section</p>
                        </div>
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#F47920] p-4 shrink-0">
                                <Star fill="white" className="text-white" size={24} />
                            </div>
                            <p>Feature interview in MWINTL's press section</p>
                        </div>
                    </div>
                </div>
            </section> */}
            <div className="py-8 md:py-10 text-white">
                <CtaSection />
            </div>
            <Footer />
        </div>
    );
};

export default MembershipProgram;
