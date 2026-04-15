import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { baseURL } from "../config/api";
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, User } from "lucide-react";

// Use the generated avatar image 
const AVATAR_URL = "/fashion_concierge_avatar.png"; // We'll assume the path is correct or we'll copy it later

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, isOpen, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message.trim();
        setMessage("");
        
        const newHistory = [
            ...chatHistory,
            { role: "user", parts: [{ text: userMessage }] }
        ];
        setChatHistory(newHistory);
        setIsLoading(true);

        try {
            const response = await axios.post(`${baseURL}/api/chat`, {
                message: userMessage,
                history: chatHistory
            });

            setChatHistory(response.data.history);
        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory([
                ...newHistory,
                { role: "model", parts: [{ text: "I'm currently attending a show at the moment. Please try again in just a bit!" }] }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-[96px] right-6 z-[9999] font-inter">
            {/* Pulsating Brand Toggle Button */}
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="relative w-[58px] h-[58px] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer border-none overflow-hidden group focus:outline-none"
                style={{ background: 'linear-gradient(135deg, #8C5D25 0%, #C7913E 100%)' }}
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="text-white w-7 h-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="flex items-center justify-center"
                        >
                            <Sparkles className="text-white w-7 h-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {!isOpen && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-white rounded-full pointer-events-none"
                    />
                )}
            </motion.button>

            {/* Premium Chat Container */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute bottom-[62px] right-0 w-[340px] h-[500px] max-h-[70vh] bg-white/85 backdrop-blur-2xl border border-white/40 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Elegant Header */}
                        <div className="relative px-5 py-2 bg-linear-to-br from-[#111827] to-[#1f2937] text-white">
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-[14px] overflow-hidden border border-white/20 bg-gray-800">
                                    <Bot className="w-full h-full p-2.5 text-amber-500" />
                                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="m-0 text-base font-playfair font-bold tracking-wide italic">Moda Bot</h3>
                                    {/* <div className="flex items-center gap-1.5 opacity-80 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-medium tracking-widest uppercase">Online & Ready</span>
                                    </div> */}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4">
                                <motion.div 
                                    animate={{ rotate: 360 }} 
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="opacity-10"
                                >
                                    <Sparkles size={100} />
                                </motion.div>
                            </div>
                        </div>
                        
                        {/* Interactive Message History */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar">
                            {chatHistory.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/60 border border-white/20 p-5 rounded-3xl text-center shadow-sm"
                                >
                                    <p className="text-[13px] text-gray-700 font-medium leading-relaxed italic">
                                        "Welcome to Moda Week International. I am Moda Bot. How may I assist your fashion journey today?"
                                    </p>
                                </motion.div>
                            )}
                            
                            {chatHistory.map((item, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className={`flex w-full ${item.role === 'user' ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`relative max-w-[80%] p-2 px-5 rounded-[22px] text-[13px] leading-relaxed shadow-sm transition-all ${
                                        item.role === 'user' 
                                        ? "bg-linear-to-br from-[#8C5D25] to-[#C7913E] text-white rounded-br-none" 
                                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                    }`}>
                                        {item.parts[0].text}
                                        <div className={`absolute bottom-[-18px] text-[9px] uppercase tracking-widest text-gray-400 font-bold ${item.role === 'user' ? "right-0" : "left-0"}`}>
                                            {item.role === 'user' ? 'You' : 'Moda Bot'}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="self-start flex gap-2"
                                >
                                    <div className="bg-white p-4 px-5 rounded-[22px] rounded-bl-none shadow-sm border border-gray-100">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                    className="w-2 h-2 rounded-full bg-amber-500"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Premium Input Console */}
                        <div className="p-2 pt-1 bg-transparent">
                            <form 
                                className="group flex items-center gap-3 bg-white border border-gray-200 p-2 pl-4 rounded-3xl shadow-xs focus-within:shadow-md focus-within:border-amber-400/50 transition-all" 
                                onSubmit={handleSendMessage}
                            >
                                <input
                                    type="text"
                                    placeholder="Type your inquiry..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent py-2.5 text-[13px] font-medium text-gray-800 outline-none placeholder:text-gray-400 placeholder:italic"
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit" 
                                    disabled={isLoading || !message.trim()}
                                    className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gray-900 text-white disabled:bg-gray-100 disabled:text-gray-300 transition-colors shadow-lg"
                                >
                                    <Send size={18} strokeWidth={2.5} />
                                </motion.button>
                            </form>
                            {/* <p className="text-[9px] text-center text-gray-400 mt-4 font-bold uppercase tracking-[0.2em] pointer-events-none">
                                Powered by Moda Intelligence
                            </p> */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
