import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PhilanthropySlideshow from '../components/PhilanthropySlideshow';
import { baseURL } from '../config/api';
import { optimizeCloudinaryImage } from '../utils/cloudinary';
import { Users, Calendar, Globe, Heart, ArrowRight } from 'lucide-react';

import CommunityImg from '../assets/Events-1.jpg';
import GlobalImg from '../assets/Events-3.jpg';

export default function ImpactPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = location.pathname === '/philanthropy' ? 'philanthropy' : 'donation';

    const [philanthropyData, setPhilanthropyData] = useState(null);
    const [donationData, setDonationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [frequency, setFrequency] = useState('One time');
    const [amount, setAmount] = useState(100);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [philanthropyRes, donationRes] = await Promise.all([
                    axios.get(`${baseURL}/api/philanthropy`),
                    axios.get(`${baseURL}/api/donation-page`)
                ]);
                setPhilanthropyData(philanthropyRes.data);
                setDonationData(donationRes.data);
            } catch (error) {
                console.error('Error fetching impact page data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDonate = async () => {
        if (!amount || amount <= 0) {
            alert('Please enter a valid donation amount.');
            return;
        }

        setProcessing(true);
        try {
            const response = await axios.post(`${baseURL}/api/payment/create-donation-checkout-session`, {
                amount,
                frequency,
                comment
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                alert('Something went wrong. Please try again.');
                setProcessing(false);
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Failed to initiate payment. Please try again.');
            setProcessing(false);
        }
    };

    const getSection = (id) => philanthropyData?.sections?.find((section) => section.id === id) || {};

    const communitySection = getSection('community');
    const eventsSection = getSection('events');
    const digitalSection = getSection('digital');
    const hero = donationData?.hero || {};
    const mainContent = donationData?.mainContent || {};
    const contactInfo = donationData?.contactInfo || {};

    const tabButtonClass = (tab) =>
        `px-6 py-3 rounded-md text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab
            ? 'bg-[#8C5D25] text-white shadow-md'
            : 'text-gray-500 hover:text-[#8C5D25]'
        }`;

    const donationAmountLabel = useMemo(() => Number(amount) || 0, [amount]);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center text-black">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#C7913E] selection:text-white">
            <Navbar />

            <div className="bg-gradient-to-b from-[#C7913E] to-white text-black min-h-[400px] h-auto flex flex-col items-center justify-center text-center px-4 pt-32 pb-10">
                <h1 className="text-4xl md:text-[52px] font-bold mb-6 tracking-wide uppercase grad-text-up font-playfair">
                    {hero.title || 'MAKING A DIFFERENCE TOGETHER'}
                </h1>
                <span className="w-[50%] md:w-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#C7913E] to-transparent mb-8"></span>

                <p className="max-w-3xl mx-auto text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-montserrat">
                    {hero.description || 'Your support makes a difference and create a positive impact in our global and local communities.'}
                </p>
                {hero.subtitle && <p className="mt-4 text-md text-gray-600 font-medium">{hero.subtitle}</p>}
            </div>

            <div className="flex justify-center mb-10 px-4 pt-6">
                <div className="inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
                    <button onClick={() => navigate('/donation')} className={tabButtonClass('donation')}>
                        Donation
                    </button>
                    <button onClick={() => navigate('/philanthropy')} className={tabButtonClass('philanthropy')}>
                        Philanthropy
                    </button>
                </div>
            </div>

            {activeTab === 'donation' && (
                <>
                    <div className="py-12 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start">
                            <div className="space-y-6 lg:col-span-4 relative z-10 lg:pr-12">
                                <div className="text-gray-600 space-y-4 text-justify font-inter whitespace-pre-wrap">
                                    {mainContent.introText || (
                                        <>
                                            <p>
                                                Moda Week International (MWINTL) is a philanthropic platform that merges glamour with purpose. As a fashion show production organization, MWINTL is committed to creating impactful events that promote not only high fashion but also educational advancement and community empowerment.
                                            </p>
                                            <p>
                                                MWINTL is proudly defined by its dual mission: to showcase world-class fashion while fostering a culture of giving, learning, and social responsibility. Through each initiative, we promote artistic brilliance while uplifting lives.
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-2 mt-8">
                                    <h3 className="text-xl font-bold text-gray-800 uppercase font-playfair">
                                        {mainContent.powerOfGivingTitle || 'The Power of Giving Back'}
                                    </h3>
                                    <p className="text-gray-600 text-justify font-inter whitespace-pre-wrap">
                                        {mainContent.powerOfGivingText || 'Every contribution serves a greater purpose, opening doors for emerging talent, supporting marginalized communities, and igniting hope through education and creative opportunities.'}
                                    </p>
                                </div>

                                <div className="pt-8 font-medium text-gray-800 font-inter">
                                    <strong>DONATIONS:</strong> Kindly notify our team at:{' '}
                                    <a href={`mailto:${contactInfo.email || 'info@modaweekinternational.com'}`} className="font-bold hover:text-[#C7913E] transition-colors">
                                        {contactInfo.email || 'info@modaweekinternational.com'}
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-8 lg:col-span-5 relative z-10 lg:-mr-8">
                                <div className="mb-6">
                                    <label className="block text-gray-500 text-sm mb-2 font-light">Frequency</label>
                                    <div className="flex gap-2">
                                        {['One time', 'Weekly', 'Monthly'].map((freq) => (
                                            <button
                                                key={freq}
                                                onClick={() => setFrequency(freq)}
                                                className={`flex-1 py-2 px-4 border transition-colors duration-200 ${frequency === freq
                                                    ? 'bg-[#C7913E] text-white border-[#C7913E]'
                                                    : 'bg-white text-[#C7913E] border-[#C7913E] hover:bg-[#C7913E]/10'
                                                }`}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-500 text-sm mb-2 font-light">Amount</label>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <button
                                            onClick={() => {
                                                setAmount(100);
                                                setIsCustomAmount(false);
                                            }}
                                            className={`py-3 px-4 border transition-colors duration-200 ${(!isCustomAmount && amount === 100)
                                                ? 'bg-[#C7913E] text-white border-[#C7913E]'
                                                : 'bg-white text-[#C7913E] border-[#C7913E] hover:bg-[#C7913E]/10'
                                            }`}
                                        >
                                            $100
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAmount('');
                                                setIsCustomAmount(true);
                                            }}
                                            className={`py-3 px-4 border transition-colors duration-200 ${isCustomAmount
                                                ? 'bg-[#C7913E] text-white border-[#C7913E]'
                                                : 'bg-white text-[#C7913E] border-[#C7913E] hover:bg-[#C7913E]/10'
                                            }`}
                                        >
                                            Other
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => {
                                                setAmount(e.target.value);
                                                setIsCustomAmount(true);
                                            }}
                                            className="w-full border border-gray-300 p-3 pl-8 focus:outline-none focus:border-[#C7913E] transition-colors"
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-500 text-sm mb-2 font-light">Comment (optional)</label>
                                    <textarea
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full border border-gray-300 p-3 focus:outline-none focus:border-[#C7913E] transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleDonate}
                                    disabled={processing}
                                    className={`w-full bg-[#C7913E] text-white font-medium py-3 hover:bg-[#a67832] transition-colors uppercase ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Processing...' : `Donate $${donationAmountLabel}`}
                                </button>
                            </div>

                            <div className="hidden lg:block lg:col-span-3 h-[570px] w-full relative z-0 lg:ml-8">
                                <img
                                    src={donationData?.slideshowImages?.[0]?.url}
                                    alt="Donation Cause"
                                    className="w-full h-full object-cover shadow-sm rounded-r-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pb-20">
                        <PhilanthropySlideshow images={donationData?.slideshowImages} />
                    </div>
                </>
            )}

            {activeTab === 'philanthropy' && philanthropyData && (
                <>
                    <div className="pb-20">
                        <div className="container mx-auto px-6 max-w-9xl">
                            <div className="max-w-7xl mx-auto mb-32 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-neutral-50 to-transparent -z-10 blur-3xl opacity-50" />

                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-12">
                                    <div className="text-center max-w-4xl mx-auto">
                                        <p className="text-2xl md:text-3xl font-[Playfair_Display] leading-relaxed text-gray-900 whitespace-pre-wrap">
                                            {philanthropyData.introduction?.leadText}
                                        </p>
                                        <div className="h-1 w-20 bg-[#C7913E]/30 mx-auto mt-8" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 text-lg font-light text-gray-600 leading-looose text-justify">
                                        <div className="space-y-6 whitespace-pre-wrap">
                                            {philanthropyData.introduction?.column1}
                                        </div>
                                        <div className="flex items-center">
                                            <div className="relative pl-8 border-l-2 border-[#C7913E]/20 whitespace-pre-wrap">
                                                {philanthropyData.introduction?.column2}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-neutral-50 rounded-full">
                                            <Users size={28} className="text-[#C7913E]" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold">{communitySection.title || 'Community Engagement'}</h3>
                                    </div>
                                    <div className="text-lg text-gray-600 leading-loose font-light space-y-4 whitespace-pre-wrap">
                                        {communitySection.description}
                                    </div>
                                    <div className="pt-4">
                                        <span className="inline-block border-b border-[#C7913E] text-[#C7913E] uppercase tracking-widest text-sm pb-1">{communitySection.tagline || 'Inclusive Spaces'}</span>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                                    <div className="absolute -inset-4 bg-neutral-50 -z-10 rounded-xl transform rotate-2"></div>
                                    <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                                        <img
                                            src={optimizeCloudinaryImage(communitySection.image?.url || CommunityImg, { width: 1000, height: 750, crop: 'fill' })}
                                            alt={communitySection.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative order-2 lg:order-1">
                                    <div className="absolute -inset-4 bg-neutral-50 -z-10 rounded-xl transform -rotate-2"></div>
                                    <div className="aspect-video overflow-hidden rounded-lg shadow-2xl relative group">
                                        {eventsSection.video?.url ? (
                                            <video src={eventsSection.video.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" autoPlay muted loop playsInline />
                                        ) : (
                                            <img
                                                src={optimizeCloudinaryImage(eventsSection.image?.url || CommunityImg, { width: 1000, height: 560, crop: 'fill' })}
                                                alt={eventsSection.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6 order-1 lg:order-2">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-neutral-50 rounded-full">
                                            <Calendar size={28} className="text-[#C7913E]" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold">{eventsSection.title || 'Community-Based Events'}</h3>
                                    </div>
                                    <div className="text-lg text-gray-600 leading-loose font-light space-y-4 whitespace-pre-wrap">
                                        {eventsSection.description}
                                    </div>
                                    <div className="pt-4">
                                        <span className="inline-block border-b border-[#C7913E] text-[#C7913E] uppercase tracking-widest text-sm pb-1">{eventsSection.tagline || 'Cultural Experience'}</span>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-neutral-50 rounded-full">
                                            <Globe size={28} className="text-[#C7913E]" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold">{digitalSection.title || 'Digital Visibility & Outreach'}</h3>
                                    </div>
                                    <div className="text-lg text-gray-600 leading-loose font-light space-y-4 whitespace-pre-wrap">
                                        {digitalSection.description}
                                    </div>
                                    <div className="flex items-center gap-2 text-[#C7913E] font-medium pt-2">
                                        <ArrowRight size={20} />
                                        <span className="tracking-wide">{digitalSection.tagline || 'Global Opportunity'}</span>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                                    <div className="absolute -inset-4 bg-neutral-50 -z-10 rounded-xl transform rotate-1"></div>
                                    <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                                        <img
                                            src={optimizeCloudinaryImage(digitalSection.image?.url || GlobalImg, { width: 1000, height: 750, crop: 'fill' })}
                                            alt={digitalSection.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#0f0f0f] text-white p-12 md:p-20 rounded-2xl relative overflow-hidden shadow-2xl text-center">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                                    <Heart size={400} strokeWidth={0.5} />
                                </div>

                                <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                                    <h2 className="text-4xl md:text-5xl font-[Playfair_Display] font-bold grad-text leading-tight">
                                        {philanthropyData.philosophy?.title || 'Our Philanthropic Philosophy'}
                                    </h2>

                                    <div className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light italic space-y-6 whitespace-pre-wrap">
                                        {philanthropyData.philosophy?.text}
                                    </div>

                                    <div className="pt-10 border-t border-white/10 inline-block px-10">
                                        <p className="font-[Playfair_Display] text-3xl italic text-[#C7913E] mb-2">
                                            {philanthropyData.philosophy?.authorName || 'Esmeralda Harwood'}
                                        </p>
                                        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 font-bold">
                                            {philanthropyData.philosophy?.authorTitle || 'CEO'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="pb-20">
                        <PhilanthropySlideshow images={philanthropyData.slideshowImages} />
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}
