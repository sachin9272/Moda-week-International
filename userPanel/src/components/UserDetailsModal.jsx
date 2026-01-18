import React, { useState } from "react";
import { X, User, Mail, MapPin, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserDetailsModal({ isOpen, onClose, onSubmit, totalPrice, ticketSummary }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <h2 className="text-xl font-bold font-serif text-white">Checkout Details</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-amber-900/10 border-b border-amber-900/20 p-4">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-amber-500 font-medium">Total Amount</span>
                                <span className="text-xl font-bold text-amber-500">${totalPrice}</span>
                            </div>
                            <div className="text-xs text-gray-400 space-y-1">
                                {ticketSummary && ticketSummary.map((item, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5 pl-1">Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full bg-black/50 border ${errors.name ? 'border-red-500' : 'border-gray-800 group-focus-within:border-amber-500'} rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-gray-600`}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5 pl-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-gray-800 group-focus-within:border-amber-500'} rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-gray-600`}
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5 pl-1">Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            className={`w-full bg-black/50 border ${errors.address ? 'border-red-500' : 'border-gray-800 group-focus-within:border-amber-500'} rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-gray-600 resize-none`}
                                            placeholder="Enter your billing address"
                                        />
                                    </div>
                                    {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                <span>Proceed to Payment</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
