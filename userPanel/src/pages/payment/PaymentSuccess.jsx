import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { baseURL } from '../../config/api';
import QRCode from 'qrcode';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Confirming your payment...');
    const [tickets, setTickets] = useState([]);
    const hasCalledRef = useRef(false);

    useEffect(() => {
        const confirmPayment = async () => {
            if (!sessionId || hasCalledRef.current) return;
            hasCalledRef.current = true;

            try {
                const response = await axios.post(`${baseURL}/api/payment/confirm-payment`, { session_id: sessionId });
                setStatus('success');
                setMessage('Thank you for your purchase. A confirmation email has been sent to you.');

                if (response.data.tickets) {
                    setTickets(response.data.tickets);
                }

            } catch (error) {
                console.error("Payment confirmation error:", error);

                if (error.response?.data?.tickets) {
                    setTickets(error.response.data.tickets);
                    setStatus('success');
                    setMessage('Order already confirmed.');
                } else if (error.response?.data?.message?.includes("fulfilled") || error.response?.status === 400) {
                    setStatus('success');
                    setMessage('Payment successful. Order was already processed.');
                } else {
                    setStatus('error');
                    setMessage('Issue confirming order details. Please contact support.');
                }
            }
        };

        if (sessionId) confirmPayment();
        else {
            setStatus('error');
            setMessage('Invalid session ID.');
        }
    }, [sessionId]);

    const [qrCodes, setQrCodes] = useState({});

    useEffect(() => {
        const generateQRs = async () => {
            const codes = {};
            for (const ticket of tickets) {
                try {
                    codes[ticket._id] = await QRCode.toDataURL(ticket._id.toString());
                } catch (e) {
                    console.error("QR Gen Error", e);
                }
            }
            setQrCodes(codes);
        };
        if (tickets.length > 0) generateQRs();
    }, [tickets]);

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 max-w-4xl w-full flex flex-col justify-center items-center">

                    {status === 'processing' && (
                        <div className="py-20">
                            <Loader2 className="w-20 h-20 text-amber-500 mx-auto mb-6 animate-spin" />
                            <h1 className="text-2xl font-bold mb-4 font-serif text-white">Processing Ticket...</h1>
                            <p className="text-gray-400">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="w-full">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h1 className="text-4xl font-bold mb-4 font-serif text-amber-500">Payment Successful!</h1>
                            <p className="text-gray-300 mb-8 max-w-md mx-auto">{message}</p>

                            {tickets.length > 0 && (
                                <div className="mb-10 w-full animate-fade-in-up">
                                    <h2 className="text-2xl font-serif text-white mb-6 border-b border-gray-800 pb-4">Your Tickets</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {tickets.map((ticket) => (
                                            <div key={ticket._id} className="bg-white text-black rounded-lg overflow-hidden flex flex-row shadow-lg">
                                                <div className="p-6 flex-1 text-left flex flex-col justify-center">
                                                    <h3 className="text-xl font-bold text-amber-600 mb-1">{ticket.ticketName}</h3>
                                                    <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Ticket ID: {ticket._id.toString().substring(0, 8)}...</p>
                                                    <div className="text-sm font-medium">
                                                        <p>Paid: ${ticket.price}</p>
                                                        <p>Quantity: {ticket.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-100 p-4 flex items-center justify-center border-l border-dashed border-gray-300 relative">
                                                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#111] rounded-full"></div>
                                                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#111] rounded-full"></div>

                                                    {qrCodes[ticket._id] ? (
                                                        <img src={qrCodes[ticket._id]} alt="QR" className="w-24 h-24 object-contain mix-blend-multiply" />
                                                    ) : (
                                                        <div className="w-24 h-24 bg-gray-200 animate-pulse"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-6 italic">
                                        * Please save these tickets or check your email folder.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                                <Link to="/events" className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">
                                    Browse More Events
                                </Link>
                                <Link to="/" className="flex-1 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="py-10 max-w-md mx-auto">
                            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold mb-4 font-serif text-white">Confirmation Issue</h1>
                            <p className="text-gray-300 mb-8">{message}</p>
                            <Link to="/" className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors">
                                Back to Home
                            </Link>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
