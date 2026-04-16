import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, Send, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., API call)
        console.log("Form submitted:", formData);
        alert("Thank you for contacting us. We will get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-[#C7913E] selection:text-white">
            <Navbar />

            {/* Hero Section */}
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white text-black h-auto pb-6 md:pb-12 pt-12 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 relative z-10">
                    <div className="text-center mb-8 md:mb-12 max-w-4xl mx-auto">
                        <h1 className="relative inline-block md:text-[64px] font-bold text-5xl tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#3C2306] via-[#734F1C] to-[#C7913E] !font-playfair">
                            CONTACT US
                            <span className="absolute left-1/2 -bottom-4 w-24 h-1 -translate-x-1/2 bg-[#C7913E]"></span>
                        </h1>
                        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-6 !font-montserrat">
                            We are here to assist you. Reach out for inquiries, partnerships, or press related questions.
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Contact Information */}
                    <div className="space-y-12 order-2 lg:order-1">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-8 text-black">Get in Touch</h2>
                            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                                Whether you’re a designer looking to showcase your collection, a brand seeking partnership, or a fashion enthusiast with a query, our team is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Combined Contact Details */}
                            <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-[#C7913E]/50 transition-all duration-300 group shadow-lg shadow-gray-100">
                                <div className="space-y-8">
                                    {/* Email */}
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#C7913E] transition-all duration-300">
                                            <Mail size={20} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-serif text-xl font-medium mb-2 text-black">Email Us</h3>
                                            <a href="mailto:info@modaweekinternational.com" className="text-gray-600 text-base break-all hover:text-[#C7913E] transition-colors block">
                                                info@modaweekinternational.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-gray-100"></div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#C7913E] transition-all duration-300">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl font-medium mb-2 text-black">Call Us</h3>
                                            <p className="text-gray-600 text-base leading-relaxed">
                                                +1 (680) 2145633<br />
                                                <span className="text-sm text-gray-500 mt-1 block">Mon - Fri, 9am - 6pm EST</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-[#C7913E]/50 transition-all duration-300 group shadow-lg shadow-gray-100">
                                <h3 className="font-serif text-xl font-medium mb-6 text-black flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-[#C7913E]"></span>
                                    Follow Us
                                </h3>
                                <div className="flex gap-4 flex-wrap">
                                    <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/modaweekinternationalofficial/" />
                                    <SocialIcon icon={<Facebook size={20} />} href="https://www.facebook.com/modaweekinternational" />
                                    <SocialIcon icon={<Linkedin size={20} />} href="https://www.linkedin.com/company/moda-week-international/" />
                                    <SocialIcon icon={<Youtube size={20} />} href="https://www.youtube.com/@modaweekinternational" />
                                    <SocialIcon icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                        </svg>
                                    } href="https://www.tiktok.com/@modaweekinternational " />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white text-black p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl border border-gray-100 relative group order-1 lg:order-2">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7913E]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#C7913E]/20 transition-all duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C7913E]/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                        <h2 className="font-serif text-3xl font-normal mb-8 relative z-10 text-center md:text-left text-black">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group/input">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#C7913E] ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border-b border-gray-200 p-4 rounded-t-lg focus:border-[#C7913E] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 text-black"
                                        placeholder="JOHN DOE"
                                    />
                                </div>
                                <div className="space-y-2 group/input">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#C7913E] ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border-b border-gray-200 p-4 rounded-t-lg focus:border-[#C7913E] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 text-black"
                                        placeholder="JOHN@EXAMPLE.COM"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#C7913E] ml-1">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-b border-gray-200 p-4 rounded-t-lg focus:border-[#C7913E] focus:bg-white focus:outline-none transition-all text-black appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-400">SELECT A SUBJECT</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    {/* <option value="Press & Media">Press & Media</option> */}
                                    <option value="Partnership">Partnership Opportunities</option>
                                    <option value="Designer Application">Designer Application</option>
                                    <option value="Support">Support</option>
                                </select>
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#C7913E] ml-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full bg-gray-50 border-b border-gray-200 p-4 rounded-t-lg focus:border-[#C7913E] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 resize-none text-black"
                                    placeholder="TYPE YOUR MESSAGE HERE..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-[#C7913E] hover:shadow-lg transition-all flex items-center justify-center gap-3 rounded-xl mt-4 transform hover:-translate-y-1 duration-300"
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const SocialIcon = ({ icon, href }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#C7913E] hover:border-[#C7913E] transition-all duration-300 shadow-sm"
        >
            {icon}
        </a>
    )
}

export default Contact;
