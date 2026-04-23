import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../config/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PhilanthropySlideshow from '../../components/PhilanthropySlideshow';

const normalizeTextSpacing = (text = '') =>
    String(text)
        .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .trim();

const escapeHtml = (text = '') =>
    String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const toRichTextHtml = (text = '') =>
    normalizeTextSpacing(text)
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join('');

const Donation = () => {
    const [frequency, setFrequency] = useState('One time');
    const [amount, setAmount] = useState(100);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [comment, setComment] = useState('');

    const handleAmountClick = (val) => {
        setAmount(val);
        setIsCustomAmount(false);
    };

    const handleCustomAmountClick = () => {
        setAmount('');
        setIsCustomAmount(true);
    };
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const handleDonate = async () => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid donation amount.");
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
                alert("Something went wrong. Please try again.");
                setProcessing(false);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to initiate payment. Please try again.");
            setProcessing(false);
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/donation-page`);
                setPageContent(response.data);
            } catch (error) {
                console.error("Error fetching donation page content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black">Loading...</div>;

    const { hero, mainContent, contactInfo } = pageContent || {};

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white text-black min-h-[400px] h-auto flex flex-col items-center justify-center text-center px-4 pt-32 pb-10">
                <h1 className="text-4xl md:text-[52px] font-bold mb-6 tracking-wide uppercase grad-text-up font-playfair">
                    {hero?.title || "MAKING A DIFFERENCE TOGETHER"}
                </h1>
                <span className="w-[50%] md:w-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#C7913E] to-transparent mb-8"></span>

                <p className="max-w-3xl mx-auto text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-montserrat">
                    {hero?.description || "Your support makes a difference and create a positive impact in our global and local communities."}
                </p>
                {hero?.subtitle && <p className="mt-4 text-md text-gray-600 font-medium">{hero.subtitle}</p>}
            </div>

            {/* Main Content */}
            <div className="py-12 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start">

                    {/* Left Column: Text Content */}
                    <div className="space-y-6 lg:col-span-4 relative z-10 lg:pr-12">
                        <div
                            className="!text-base rich-text-content text-black leading-relaxed text-lg font-light"
                            style={{ textAlign: 'left', wordSpacing: 'normal', letterSpacing: 'normal' }}
                            dangerouslySetInnerHTML={{
                                __html: mainContent?.introText
                                    ? toRichTextHtml(mainContent.introText)
                                    : toRichTextHtml(`Moda Week International (MWINTL) is a philanthropic platform that merges glamour with purpose. As a fashion show production organization, MWINTL is committed to creating impactful events that promote not only high fashion but also educational advancement and community empowerment.

MWINTL is proudly defined by its dual mission: to showcase world-class fashion while fostering a culture of giving, learning, and social responsibility. Through each initiative, we promote artistic brilliance while uplifting lives.`)
                            }}
                        />

                        <div className="space-y-2 mt-8">
                            <h3 className="text-xl font-bold text-gray-800 uppercase font-playfair">
                                {mainContent?.powerOfGivingTitle || "The Power of Giving Back"}
                            </h3>
                            <div
                                className="!text-base rich-text-content text-black leading-relaxed text-lg font-light"
                                style={{ textAlign: 'left', wordSpacing: 'normal', letterSpacing: 'normal' }}
                                dangerouslySetInnerHTML={{
                                    __html: toRichTextHtml(
                                        mainContent?.powerOfGivingText ||
                                        "Every contribution serves a greater purpose, opening doors for emerging talent, supporting marginalized communities, and igniting hope through education and creative opportunities."
                                    )
                                }}
                            />
                        </div>

                        <div className="pt-8 font-medium text-gray-800 font-inter">
                            <strong>DONATIONS:</strong> Kindly notify our team at: <a href={`mailto:${contactInfo?.email || 'info@modaweekinternational.com'}`} className="font-bold hover:text-[#C7913E] transition-colors">{contactInfo?.email || 'info@modaweekinternational.com'}</a>
                        </div>
                    </div>

                    {/* Middle Column: Donation Form */}
                    <div className="bg-white p-6 md:p-8 lg:col-span-5 relative z-10 lg:-mr-8">
                        {/* Frequency */}
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

                        {/* Amount */}
                        <div className="mb-6">
                            <label className="block text-gray-500 text-sm mb-2 font-light">Amount</label>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <button
                                    onClick={() => handleAmountClick(100)}
                                    className={`py-3 px-4 border transition-colors duration-200 ${(!isCustomAmount && amount === 100)
                                        ? 'bg-[#C7913E] text-white border-[#C7913E]'
                                        : 'bg-white text-[#C7913E] border-[#C7913E] hover:bg-[#C7913E]/10'
                                        }`}
                                >
                                    $100
                                </button>
                                <button
                                    onClick={handleCustomAmountClick}
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

                        {/* Comment */}
                        <div className="mb-6">
                            <label className="block text-gray-500 text-sm mb-2 font-light">Comment (optional)</label>
                            <textarea
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-[#C7913E] transition-colors resize-none"
                            ></textarea>
                            <div className="text-right text-xs text-gray-300 mt-1">0/100</div>
                        </div>

                        {/* Donate Button */}
                        <button
                            onClick={handleDonate}
                            disabled={processing}
                            className={`w-full bg-[#C7913E] text-white font-medium py-3 hover:bg-[#a67832] transition-colors uppercase ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Processing...' : `Donate $${amount || 0}`}
                        </button>
                    </div>

                    {/* Right Column: Image */}
                    <div className="hidden lg:block lg:col-span-3 h-[570px] w-full relative z-0 lg:ml-8">
                        <img
                            src={pageContent?.slideshowImages?.[0]?.url}
                            alt="Donation Cause"
                            className="w-full h-full object-cover shadow-sm rounded-r-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Slideshow Section */}
            <div className="pb-20">
                <PhilanthropySlideshow images={pageContent?.slideshowImages} />
            </div>

            <Footer />
        </div>
    );
};

export default Donation;
