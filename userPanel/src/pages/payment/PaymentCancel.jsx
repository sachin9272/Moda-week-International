
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 max-w-md w-full">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4 font-serif text-white">Payment Cancelled</h1>
                    <p className="text-gray-300 mb-8">
                        Your payment was cancelled. No charges were made.
                        You can try again whenever you are ready.
                    </p>

                    <div className="flex flex-col gap-4">
                        <Link to="/events" className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors">
                            Return to Events
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

export default PaymentCancel;
