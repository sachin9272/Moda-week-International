import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { baseURL } from '../../config/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [message, setMessage] = useState('Confirming your payment...');
    const hasCalledRef = useRef(false);

    useEffect(() => {
        const confirmPayment = async () => {
            if (!sessionId || hasCalledRef.current) return;
            hasCalledRef.current = true; // Prevent double calling in React 18 strict mode

            try {
                // Call the backend to confirm (fallback if webhook failed)
                await axios.post(`${baseURL}/api/payment/confirm-payment`, { session_id: sessionId });
                setStatus('success');
                setMessage('Thank you for your purchase. A confirmation email has been sent to you.');
            } catch (error) {
                console.error("Payment confirmation error:", error);

                // If it's already fulfilled (400 or 200 with message), we consider it success for the user
                if (error.response?.data?.message?.includes("already fulfilled")) {
                    setStatus('success');
                    setMessage('Thank you for your purchase. A confirmation email has been sent to you.');
                } else if (error.response?.status === 400 && error.response?.data?.message === "Order already fulfilled") {
                    setStatus('success');
                    setMessage('Thank you for your purchase. A confirmation email has been sent to you.');
                } else {
                    setStatus('error');
                    setMessage('We received your payment, but there was an issue confirming the order details. Please contact support.');
                }
            }
        };

        if (sessionId) {
            confirmPayment();
        } else {
            setStatus('error');
            setMessage('Invalid session ID.');
        }
    }, [sessionId]);

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 max-w-md w-full min-h-[400px] flex flex-col justify-center items-center">

                    {status === 'processing' && (
                        <>
                            <Loader2 className="w-20 h-20 text-amber-500 mx-auto mb-6 animate-spin" />
                            <h1 className="text-2xl font-bold mb-4 font-serif text-white">Processing...</h1>
                            <p className="text-gray-400">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold mb-4 font-serif text-amber-500">Payment Successful!</h1>
                            <p className="text-gray-300 mb-8">
                                {message}
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                Your tickets are confirmed.
                            </p>
                            <div className="flex flex-col gap-4 w-full">
                                <Link to="/events" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">
                                    Browse More Events
                                </Link>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Back to Home
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold mb-4 font-serif text-white">Confirmation Issue</h1>
                            <p className="text-gray-300 mb-8">
                                {message}
                            </p>
                            <div className="flex flex-col gap-4 w-full">
                                <Link to="/" className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors">
                                    Back to Home
                                </Link>
                            </div>
                        </>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
