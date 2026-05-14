import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config/api';
import { Lock, Mail, Eye, EyeOff, Loader, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const ScannerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // If already authenticated, redirect
    useEffect(() => {
        const token = localStorage.getItem('scannerToken');
        if (token) {
            navigate('/scanner/scan', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${baseURL}/api/scanner/login`, { email, password });
            
            if (res.data.success) {
                toast.success(`Welcome back, ${res.data.user.name}!`);
                localStorage.setItem('scannerToken', res.data.token);
                localStorage.setItem('scannerUser', JSON.stringify(res.data.user));
                navigate('/scanner/scan', { replace: true });
            }
        } catch (error) {
            console.error('Login failed:', error);
            const msg = error.response?.data?.message || 'Invalid email or password.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center px-6 py-12 select-none">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Branding */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#8C5D25] to-[#C7913E] rounded-2xl flex items-center justify-center shadow-xl shadow-[#C7913E]/20 border border-[#C7913E]/30 mb-4 animate-fadeIn">
                        <QrCode size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-widest uppercase font-serif text-white">
                        MODA WEEK
                    </h1>
                    <p className="text-[#C7913E] text-sm font-semibold tracking-[0.25em] uppercase mt-1">
                        Ticket Scanner Tool
                    </p>
                    <p className="text-neutral-500 text-xs mt-3 max-w-[280px]">
                        Log in using your assigned operator credentials to begin scanning tickets.
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-[#141414] p-8 rounded-3xl shadow-2xl border border-[#222] animate-fadeInUp">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-xs uppercase font-bold tracking-wider text-neutral-400 mb-2">
                                Operator Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs uppercase font-bold tracking-wider text-neutral-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-12 py-3.5 bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-4 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] hover:from-[#7A5020] hover:to-[#B38135] text-white text-sm font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-[#C7913E]/20 transition-all transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Access Scanner'
                            )}
                        </button>
                    </form>
                </div>

                {/* Help Info Footer */}
                <div className="text-center text-neutral-600 text-xs mt-8">
                    <p>Access restricted to authorized event staff only.</p>
                    <p className="mt-1">Please contact administration if you've lost credentials.</p>
                </div>
            </div>
        </div>
    );
};

export default ScannerLogin;
