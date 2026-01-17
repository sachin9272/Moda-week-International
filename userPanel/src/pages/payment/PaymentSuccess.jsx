
import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 max-w-md w-full">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4 font-serif text-amber-500">Payment Successful!</h1>
                    <p className="text-gray-300 mb-8">
                        Thank you for your purchase. A confirmation email has been sent to you.
                        Your tickets are confirmed.
                    </p>
                    {/* {sessionId && <p className="text-xs text-gray-600 mb-6">Session ID: {sessionId}</p>} */}

                    <div className="flex flex-col gap-4">
                        <Link to="/events" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">
                            Browse More Events
                        </Link>
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
