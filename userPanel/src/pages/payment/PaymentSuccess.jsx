import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AlertCircle, CalendarDays, CheckCircle, Download, Loader2, MapPin, Receipt, Ticket } from 'lucide-react';
import { baseURL } from '../../config/api';
import { optimizeCloudinaryImage } from '../../utils/cloudinary';

const getImageUrl = (value) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && typeof value.url === 'string') return value.url;
    return '';
};

const formatDate = (value) => {
    if (!value) return 'Date to be announced';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Date to be announced';
    return parsed.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatCurrency = (amount, currency = 'USD') => {
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(numericAmount);
};

const toFilenameSafe = (value = 'ticket') =>
    String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'ticket';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Confirming your payment...');
    const [tickets, setTickets] = useState([]);
    const [eventDetails, setEventDetails] = useState(null);
    const [qrCodes, setQrCodes] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);
    const hasCalledRef = useRef(false);

    useEffect(() => {
        const confirmPayment = async () => {
            if (!sessionId || hasCalledRef.current) return;
            hasCalledRef.current = true;

            try {
                const response = await axios.post(`${baseURL}/api/payment/confirm-payment`, { session_id: sessionId });
                setStatus('success');
                setMessage('Thank you for your purchase. A confirmation email has been sent to you.');
                setTickets(Array.isArray(response.data.tickets) ? response.data.tickets : []);
                setEventDetails(response.data.event || null);
            } catch (error) {
                console.error('Payment confirmation error:', error);

                if (error.response?.data?.tickets) {
                    setTickets(error.response.data.tickets);
                    setEventDetails(error.response.data.event || null);
                    setStatus('success');
                    setMessage('Order already confirmed.');
                } else if (error.response?.data?.message?.includes('fulfilled') || error.response?.status === 400) {
                    setStatus('success');
                    setEventDetails(error.response?.data?.event || null);
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

    useEffect(() => {
        const generateQRs = async () => {
            const codes = {};
            for (const ticket of tickets) {
                try {
                    codes[ticket._id] = await QRCode.toDataURL(ticket._id.toString());
                } catch (error) {
                    console.error('QR generation error:', error);
                }
            }
            setQrCodes(codes);
        };

        if (tickets.length > 0) generateQRs();
    }, [tickets]);

    const totalPaid = tickets.reduce((sum, ticket) => sum + ((Number(ticket.price) || 0) * (Number(ticket.quantity) || 0)), 0);
    const coverImageUrl = getImageUrl(eventDetails?.coverImage);

    const downloadTicketsPdf = async () => {
        if (!tickets.length || isDownloading) return;

        setIsDownloading(true);

        try {
            const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let index = 0; index < tickets.length; index += 1) {
                const ticket = tickets[index];
                const qrDataUrl = qrCodes[ticket._id] || await QRCode.toDataURL(ticket._id.toString());

                if (index > 0) {
                    pdf.addPage();
                }

                pdf.setFillColor(245, 241, 233);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');

                pdf.setFillColor(12, 12, 12);
                pdf.roundedRect(36, 36, pageWidth - 72, 130, 20, 20, 'F');

                pdf.setTextColor(199, 145, 62);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(28);
                pdf.text('MODA WEEK', 56, 85);

                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(12);
                pdf.text('TICKET CONFIRMATION', 56, 112);

                pdf.setDrawColor(217, 119, 6);
                pdf.setLineWidth(1.2);
                pdf.line(56, 126, 178, 126);

                pdf.setFillColor(255, 255, 255);
                pdf.roundedRect(36, 188, pageWidth - 72, pageHeight - 240, 22, 22, 'F');

                pdf.setTextColor(17, 24, 39);
                pdf.setFontSize(24);
                pdf.text(eventDetails?.title || 'Moda Week Event', 56, 235, {
                    maxWidth: pageWidth - 240,
                });

                pdf.setFontSize(18);
                pdf.setTextColor(217, 119, 6);
                pdf.text(ticket.ticketName || 'Ticket', 56, 270);

                pdf.setFontSize(12);
                pdf.setTextColor(75, 85, 99);
                pdf.text(`Date: ${formatDate(eventDetails?.date)}`, 56, 300);
                pdf.text(`Location: ${eventDetails?.location || 'Venue to be announced'}`, 56, 320, {
                    maxWidth: pageWidth - 220,
                });
                pdf.text(`Ticket ID: ${ticket._id}`, 56, 340, {
                    maxWidth: pageWidth - 220,
                });

                pdf.setDrawColor(229, 231, 235);
                pdf.line(56, 366, pageWidth - 56, 366);

                pdf.setFontSize(11);
                pdf.setTextColor(107, 114, 128);
                pdf.text('PURCHASE DETAILS', 56, 396);

                pdf.setFontSize(16);
                pdf.setTextColor(17, 24, 39);
                pdf.text(`Paid: ${formatCurrency(ticket.price || 0)}`, 56, 425);
                pdf.text(`Quantity: ${ticket.quantity || 0}`, 56, 450);
                pdf.text(`Line Total: ${formatCurrency((Number(ticket.price) || 0) * (Number(ticket.quantity) || 0))}`, 56, 475);

                pdf.setFillColor(249, 250, 251);
                pdf.roundedRect(pageWidth - 186, 232, 130, 130, 18, 18, 'F');
                pdf.addImage(qrDataUrl, 'PNG', pageWidth - 171, 247, 100, 100);

                pdf.setFontSize(11);
                pdf.setTextColor(107, 114, 128);
                pdf.text('Scan at venue entry', pageWidth - 175, 382);

                pdf.setFillColor(255, 251, 235);
                pdf.setDrawColor(252, 211, 77);
                pdf.roundedRect(56, 520, pageWidth - 112, 86, 14, 14, 'FD');
                pdf.setFontSize(12);
                pdf.setTextColor(146, 64, 14);
                pdf.text('Important', 74, 548);
                pdf.setTextColor(120, 53, 15);
                pdf.text(
                    pdf.splitTextToSize(
                        'Present this PDF or the QR code from your confirmation screen/email at the venue entrance for fast check-in.',
                        pageWidth - 150
                    ),
                    74,
                    570
                );

                pdf.setTextColor(156, 163, 175);
                pdf.setFontSize(10);
                pdf.text('Moda Week International', 56, pageHeight - 54);
                pdf.text(`Generated from confirmation ${sessionId || 'manual'}`, pageWidth - 206, pageHeight - 54);
            }

            pdf.save(`${toFilenameSafe(eventDetails?.title || 'moda-week')}-tickets.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="relative overflow-hidden pt-24">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(199,145,62,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />

                <div className="relative mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
                        {status === 'processing' && (
                            <div className="px-6 py-20 text-center sm:px-10">
                                <Loader2 className="mx-auto mb-6 h-16 w-16 animate-spin text-amber-500 sm:h-20 sm:w-20" />
                                <h1 className="mb-4 font-serif text-3xl text-white sm:text-4xl">Preparing your confirmation</h1>
                                <p className="mx-auto max-w-xl text-sm leading-7 text-gray-400 sm:text-base">{message}</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                                <section className="border-b border-white/10 bg-black/30 px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r">
                                    <div className="mb-8 flex items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                                            <CheckCircle className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Ticket Confirmation</p>
                                            <h1 className="font-serif text-3xl text-white sm:text-4xl">Payment successful</h1>
                                            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">{message}</p>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-[24px] border border-amber-500/20 bg-[#111111]">
                                        {coverImageUrl && (
                                            <div className="h-52 w-full overflow-hidden sm:h-64">
                                                <img
                                                    src={optimizeCloudinaryImage(coverImageUrl, { width: 1600, height: 900, crop: 'fill' })}
                                                    alt={eventDetails?.title || 'Event cover'}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-5 px-5 py-6 sm:px-7">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Event</p>
                                                <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                                                    {eventDetails?.title || 'Your Moda Week Event'}
                                                </h2>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                                    <div className="mb-2 flex items-center gap-2 text-amber-500">
                                                        <CalendarDays className="h-4 w-4" />
                                                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">Date</span>
                                                    </div>
                                                    <p className="text-sm leading-6 text-gray-200">{formatDate(eventDetails?.date)}</p>
                                                </div>

                                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                                    <div className="mb-2 flex items-center gap-2 text-amber-500">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">Location</span>
                                                    </div>
                                                    <p className="text-sm leading-6 text-gray-200">{eventDetails?.location || 'Venue to be announced'}</p>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                                <div className="mb-2 flex items-center gap-2 text-amber-400">
                                                    <Receipt className="h-4 w-4" />
                                                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Purchase Summary</span>
                                                </div>
                                                <div className="flex items-end justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-300">{tickets.length} ticket type{tickets.length === 1 ? '' : 's'} confirmed</p>
                                                        <p className="mt-1 text-3xl font-semibold text-white">{formatCurrency(totalPaid)}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={downloadTicketsPdf}
                                                        disabled={!tickets.length || isDownloading}
                                                        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                                        Download PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="px-6 py-8 sm:px-10">
                                    <div className="mb-6 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Your Tickets</p>
                                            <h2 className="mt-2 font-serif text-2xl text-white">Ready for entry</h2>
                                        </div>
                                        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gray-300 sm:block">
                                            Save as PDF anytime
                                        </div>
                                    </div>

                                    {tickets.length > 0 ? (
                                        <div className="space-y-4">
                                            {tickets.map((ticket) => (
                                                <article
                                                    key={ticket._id}
                                                    className="overflow-hidden rounded-[24px] border border-white/10 bg-white text-black shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                                                >
                                                    <div className="grid sm:grid-cols-[1fr_148px]">
                                                        <div className="p-5 sm:p-6">
                                                            <div className="mb-4 flex items-center gap-3">
                                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                                                    <Ticket className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-amber-600">{ticket.ticketName}</h3>
                                                                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                                                        Ticket ID: {ticket._id.toString().slice(0, 8)}...
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
                                                                <div className="rounded-2xl bg-[#f7f7f7] p-3">
                                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Paid</p>
                                                                    <p className="mt-1 text-base font-semibold text-gray-900">{formatCurrency(ticket.price || 0)}</p>
                                                                </div>
                                                                <div className="rounded-2xl bg-[#f7f7f7] p-3">
                                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Quantity</p>
                                                                    <p className="mt-1 text-base font-semibold text-gray-900">{ticket.quantity || 0}</p>
                                                                </div>
                                                                <div className="rounded-2xl bg-[#f7f7f7] p-3">
                                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Line Total</p>
                                                                    <p className="mt-1 text-base font-semibold text-gray-900">
                                                                        {formatCurrency((Number(ticket.price) || 0) * (Number(ticket.quantity) || 0))}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="relative flex items-center justify-center border-t border-dashed border-gray-300 bg-[#f9f9f9] p-5 sm:border-l sm:border-t-0">
                                                            <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d0d0d] sm:left-0 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2" />
                                                            <div className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#0d0d0d] sm:bottom-auto sm:left-0 sm:top-auto sm:-translate-x-1/2 sm:translate-y-1/2" />
                                                            {qrCodes[ticket._id] ? (
                                                                <img src={qrCodes[ticket._id]} alt="QR" className="h-28 w-28 object-contain mix-blend-multiply" />
                                                            ) : (
                                                                <div className="h-28 w-28 animate-pulse rounded-2xl bg-gray-200" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}

                                            <p className="px-1 text-sm leading-6 text-gray-400">
                                                Present the QR code at entry, or use the PDF download to keep an offline copy on your phone.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-left">
                                            <p className="text-sm leading-7 text-gray-300">
                                                Your payment is confirmed, but ticket details are still syncing. Please check your email shortly or refresh this page in a moment.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            to="/events"
                                            className="inline-flex flex-1 items-center justify-center rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500"
                                        >
                                            Browse More Events
                                        </Link>
                                        <Link
                                            to="/"
                                            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-white/30 hover:text-white"
                                        >
                                            Back to Home
                                        </Link>
                                    </div>
                                </section>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="px-6 py-16 text-center sm:px-10">
                                <AlertCircle className="mx-auto mb-6 h-16 w-16 text-red-500 sm:h-20 sm:w-20" />
                                <h1 className="mb-4 font-serif text-3xl text-white sm:text-4xl">Confirmation issue</h1>
                                <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">{message}</p>
                                <Link
                                    to="/"
                                    className="inline-flex min-w-44 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentSuccess;
