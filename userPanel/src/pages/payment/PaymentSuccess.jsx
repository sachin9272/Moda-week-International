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

const normalizePdfText = (value, chunkSize = 18) =>
    String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(new RegExp(`(\\S{${chunkSize}})(?=\\S)`, 'g'), '$1 ');

const formatTicketIdentifier = (value) => {
    const ticketId = normalizePdfText(value, 16);
    if (!ticketId) return 'Ticket ID unavailable';

    if (ticketId.length <= 28) return ticketId;

    return ticketId.match(/.{1,28}/g)?.join(' ') || ticketId;
};

const fitWrappedText = (pdf, text, options = {}) => {
    const {
        width,
        maxHeight = Number.POSITIVE_INFINITY,
        maxFontSize = 12,
        minFontSize = 9,
        lineHeightFactor = 1.4,
        maxLines = Number.POSITIVE_INFINITY,
    } = options;

    const safeText = normalizePdfText(text);

    for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(safeText || ' ', width);
        const limitedLines = lines.slice(0, maxLines);
        const lineHeight = fontSize * lineHeightFactor;
        const totalHeight = limitedLines.length * lineHeight;

        if (totalHeight <= maxHeight && lines.length <= maxLines) {
            return { lines: limitedLines, fontSize, lineHeight };
        }
    }

    pdf.setFontSize(minFontSize);
    const fallbackLines = pdf.splitTextToSize(safeText || ' ', width).slice(0, maxLines);
    return {
        lines: fallbackLines,
        fontSize: minFontSize,
        lineHeight: minFontSize * lineHeightFactor,
    };
};

const drawTextBlock = (pdf, lines, x, y, options = {}) => {
    const {
        font = 'helvetica',
        fontStyle = 'normal',
        fontSize = 12,
        color = [17, 24, 39],
        lineHeight = fontSize * 1.45,
        align = 'left',
    } = options;

    const normalizedLines = Array.isArray(lines) ? lines : [lines];

    pdf.setFont(font, fontStyle);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...color);
    pdf.text(normalizedLines, x, y, { align, lineHeightFactor: lineHeight / fontSize });

    return y + (normalizedLines.length * lineHeight);
};

const drawLabelValue = (pdf, { x, y, width, label, value, accentColor = [199, 145, 62] }) => {
    const safeValue = normalizePdfText(value || 'Not available');
    const labelBottom = drawTextBlock(pdf, label.toUpperCase(), x, y, {
        fontStyle: 'bold',
        fontSize: 9,
        color: accentColor,
        lineHeight: 12,
    });
    const fittedValue = fitWrappedText(pdf, safeValue, {
        width,
        maxHeight: 48,
        maxFontSize: 12,
        minFontSize: 10,
        lineHeightFactor: 1.33,
        maxLines: 3,
    });
    const valueBottom = drawTextBlock(pdf, fittedValue.lines, x, labelBottom + 6, {
        fontSize: fittedValue.fontSize,
        color: [55, 65, 81],
        lineHeight: fittedValue.lineHeight,
    });

    return valueBottom;
};

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
            const pageMargin = 34;
            const cardX = pageMargin;
            const cardY = pageMargin;
            const cardWidth = pageWidth - (pageMargin * 2);
            const cardHeight = pageHeight - (pageMargin * 2);
            const headerHeight = 156;
            const contentX = cardX + 22;
            const contentY = cardY + headerHeight - 18;
            const contentWidth = cardWidth - 44;
            const qrPanelWidth = 156;
            const contentGap = 22;
            const infoWidth = contentWidth - qrPanelWidth - contentGap;
            const footerY = cardY + cardHeight - 36;
            const accent = [199, 145, 62];
            const ivory = [243, 238, 228];
            const charcoal = [10, 10, 10];

            const safeEventTitle = eventDetails?.title || 'Moda Week Event';
            const safeEventDate = formatDate(eventDetails?.date || eventDetails?.eventDate);
            const safeEventLocation = eventDetails?.location || 'Venue to be announced';

            for (let index = 0; index < tickets.length; index += 1) {
                const ticket = tickets[index];
                const qrDataUrl = qrCodes[ticket._id] || await QRCode.toDataURL(ticket._id.toString());

                if (index > 0) {
                    pdf.addPage();
                }

                pdf.setFillColor(...ivory);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');

                pdf.setFillColor(...charcoal);
                pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 28, 28, 'F');

                pdf.setDrawColor(64, 64, 64);
                pdf.roundedRect(cardX + 16, cardY + 16, cardWidth - 32, cardHeight - 32, 22, 22, 'S');

                pdf.setDrawColor(...accent);
                pdf.setLineWidth(2.5);
                pdf.line(cardX + 22, cardY + 94, cardX + 128, cardY + 94);

                drawTextBlock(pdf, 'MODA WEEK INTERNATIONAL', cardX + 22, cardY + 52, {
                    fontStyle: 'bold',
                    fontSize: 25,
                    color: accent,
                    lineHeight: 28,
                });
                drawTextBlock(pdf, 'Ticket confirmation', cardX + 22, cardY + 78, {
                    fontStyle: 'bold',
                    fontSize: 11,
                    color: [255, 255, 255],
                    lineHeight: 14,
                });
                drawTextBlock(pdf, `Order ${String(index + 1).padStart(2, '0')} of ${String(tickets.length).padStart(2, '0')}`, cardX + 22, cardY + 114, {
                    fontSize: 10,
                    color: [209, 213, 219],
                    lineHeight: 13,
                });

                pdf.setFillColor(255, 255, 255);
                pdf.roundedRect(contentX - 2, contentY, contentWidth + 4, cardHeight - headerHeight - 26, 24, 24, 'F');

                const qrPanelX = contentX + infoWidth + contentGap;
                const qrPanelY = contentY + 26;
                const qrPanelInnerSize = qrPanelWidth - 32;
                const qrImageSize = 92;
                const qrImageX = qrPanelX + ((qrPanelWidth - qrImageSize) / 2);
                const qrImageY = qrPanelY + 48;

                pdf.setFillColor(248, 244, 236);
                pdf.roundedRect(qrPanelX, qrPanelY, qrPanelWidth, 208, 20, 20, 'F');
                pdf.setDrawColor(232, 222, 204);
                pdf.setLineWidth(1);
                pdf.roundedRect(qrPanelX, qrPanelY, qrPanelWidth, 208, 20, 20, 'S');

                drawTextBlock(pdf, 'ENTRY PASS', qrPanelX + (qrPanelWidth / 2), qrPanelY + 28, {
                    fontStyle: 'bold',
                    fontSize: 10,
                    color: accent,
                    align: 'center',
                    lineHeight: 12,
                });

                pdf.setFillColor(255, 255, 255);
                pdf.roundedRect(qrPanelX + 16, qrPanelY + 38, qrPanelInnerSize, qrPanelInnerSize, 16, 16, 'F');
                pdf.addImage(qrDataUrl, 'PNG', qrImageX, qrImageY, qrImageSize, qrImageSize);

                drawTextBlock(pdf, 'Scan this code at venue entry', qrPanelX + (qrPanelWidth / 2), qrPanelY + 164, {
                    fontSize: 10,
                    color: [75, 85, 99],
                    align: 'center',
                    lineHeight: 13,
                });
                drawTextBlock(pdf, `Qty ${ticket.quantity || 0}`, qrPanelX + (qrPanelWidth / 2), qrPanelY + 184, {
                    fontStyle: 'bold',
                    fontSize: 11,
                    color: [17, 24, 39],
                    align: 'center',
                    lineHeight: 14,
                });

                let cursorY = contentY + 34;
                const titleBlock = fitWrappedText(pdf, safeEventTitle, {
                    width: infoWidth - 12,
                    maxHeight: 86,
                    maxFontSize: 23,
                    minFontSize: 16,
                    lineHeightFactor: 1.18,
                    maxLines: 4,
                });
                cursorY = drawTextBlock(pdf, titleBlock.lines, contentX + 12, cursorY, {
                    fontStyle: 'bold',
                    fontSize: titleBlock.fontSize,
                    color: [17, 24, 39],
                    lineHeight: titleBlock.lineHeight,
                });

                const ticketNameBlock = fitWrappedText(pdf, ticket.ticketName || 'Ticket', {
                    width: infoWidth - 12,
                    maxHeight: 48,
                    maxFontSize: 15,
                    minFontSize: 11,
                    lineHeightFactor: 1.25,
                    maxLines: 3,
                });
                cursorY = drawTextBlock(pdf, ticketNameBlock.lines, contentX + 12, cursorY + 8, {
                    fontStyle: 'bold',
                    fontSize: ticketNameBlock.fontSize,
                    color: accent,
                    lineHeight: ticketNameBlock.lineHeight,
                });

                cursorY += 8;
                pdf.setDrawColor(229, 231, 235);
                pdf.setLineWidth(1);
                pdf.line(contentX + 12, cursorY, contentX + infoWidth, cursorY);
                cursorY += 20;

                cursorY = drawLabelValue(pdf, {
                    x: contentX + 12,
                    y: cursorY,
                    width: infoWidth - 12,
                    label: 'Date',
                    value: safeEventDate,
                    accentColor: accent,
                });
                cursorY += 12;

                cursorY = drawLabelValue(pdf, {
                    x: contentX + 12,
                    y: cursorY,
                    width: infoWidth - 12,
                    label: 'Location',
                    value: safeEventLocation,
                    accentColor: accent,
                });
                cursorY += 12;

                cursorY = drawLabelValue(pdf, {
                    x: contentX + 12,
                    y: cursorY,
                    width: infoWidth - 12,
                    label: 'Ticket ID',
                    value: formatTicketIdentifier(ticket._id),
                    accentColor: accent,
                });
                cursorY += 22;

                drawTextBlock(pdf, 'Purchase details', contentX + 12, cursorY, {
                    fontStyle: 'bold',
                    fontSize: 11,
                    color: [107, 114, 128],
                    lineHeight: 14,
                });
                cursorY += 18;

                const statY = cursorY;
                const statGap = 12;
                const statWidth = (contentWidth - statGap * 2) / 3;
                const statHeight = 74;
                const statItems = [
                    { label: 'Paid', value: formatCurrency(ticket.price || 0) },
                    { label: 'Quantity', value: String(ticket.quantity || 0) },
                    { label: 'Line total', value: formatCurrency((Number(ticket.price) || 0) * (Number(ticket.quantity) || 0)) },
                ];

                statItems.forEach((item, statIndex) => {
                    const statX = contentX + (statIndex * (statWidth + statGap));
                    pdf.setFillColor(248, 244, 236);
                    pdf.roundedRect(statX, statY, statWidth, statHeight, 16, 16, 'F');
                    drawTextBlock(pdf, item.label.toUpperCase(), statX + 14, statY + 20, {
                        fontStyle: 'bold',
                        fontSize: 9,
                        color: [107, 114, 128],
                        lineHeight: 11,
                    });
                    const statValueBlock = fitWrappedText(pdf, item.value, {
                        width: statWidth - 28,
                        maxHeight: 28,
                        maxFontSize: 13,
                        minFontSize: 10,
                        lineHeightFactor: 1.15,
                        maxLines: 2,
                    });
                    drawTextBlock(pdf, statValueBlock.lines, statX + 14, statY + 44, {
                        fontStyle: 'bold',
                        fontSize: statValueBlock.fontSize,
                        color: [17, 24, 39],
                        lineHeight: statValueBlock.lineHeight,
                    });
                });

                cursorY = statY + statHeight + 22;

                const noteBoxY = Math.max(cursorY, qrPanelY + 208 + 18);
                const noteBoxHeight = Math.max(84, footerY - noteBoxY - 24);
                pdf.setFillColor(255, 249, 235);
                pdf.setDrawColor(245, 158, 11);
                pdf.roundedRect(contentX, noteBoxY, contentWidth, noteBoxHeight, 16, 16, 'FD');

                drawTextBlock(pdf, 'Important', contentX + 18, noteBoxY + 24, {
                    fontStyle: 'bold',
                    fontSize: 12,
                    color: [146, 64, 14],
                    lineHeight: 14,
                });
                const noteTextBlock = fitWrappedText(
                    pdf,
                    'Present this PDF or your confirmation email at the entrance. Keep the QR code visible for quick verification during check-in.',
                    {
                        width: contentWidth - 36,
                        maxHeight: Math.max(26, noteBoxHeight - 52),
                        maxFontSize: 11,
                        minFontSize: 9,
                        lineHeightFactor: 1.3,
                        maxLines: 4,
                    }
                );
                drawTextBlock(
                    pdf,
                    noteTextBlock.lines,
                    contentX + 18,
                    noteBoxY + 46,
                    {
                        fontSize: noteTextBlock.fontSize,
                        color: [120, 53, 15],
                        lineHeight: noteTextBlock.lineHeight,
                    }
                );

                drawTextBlock(pdf, 'Moda Week International', cardX + 22, footerY, {
                    fontSize: 10,
                    color: [156, 163, 175],
                    lineHeight: 12,
                });
                const footerMeta = fitWrappedText(pdf, `Generated from confirmation ${sessionId || 'manual'}`, {
                    width: 180,
                    maxHeight: 24,
                    maxFontSize: 10,
                    minFontSize: 8,
                    lineHeightFactor: 1.2,
                    maxLines: 2,
                });
                drawTextBlock(pdf, footerMeta.lines, cardX + cardWidth - 22, footerY, {
                    fontSize: footerMeta.fontSize,
                    color: [156, 163, 175],
                    align: 'right',
                    lineHeight: footerMeta.lineHeight,
                });
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
