import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { baseURL } from '../../config/api';
import { 
    QrCode, LogOut, User, Info, CheckCircle, XCircle, 
    Loader, RefreshCw, AlertTriangle, FlameKindling, ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

const ScannerDashboard = () => {
    const navigate = useNavigate();
    const qrCodeInstance = useRef(null);
    
    const [user, setUser] = useState({ name: 'Operator', email: '' });
    const [isScannerReady, setIsScannerReady] = useState(false);
    const [scannerError, setScannerError] = useState(null);
    const [scanCount, setScanCount] = useState(0);
    
    const [scanningStatus, setScanningStatus] = useState('active'); // 'active', 'processing', 'result'
    const [scanResult, setScanResult] = useState(null); // { success, message, ticket }
    const [scanHistory, setScanHistory] = useState([]);

    // Get user state
    useEffect(() => {
        const userStr = localStorage.getItem('scannerUser');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error(e);
            }
        }
        
        // Try to preload Web Audio context to ensure beep triggers smoothly
        const resumeAudio = () => {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                const ctx = new AudioContextClass();
                if (ctx.state === 'suspended') ctx.resume();
            }
            document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('click', resumeAudio);
    }, []);

    // Premium Beep logic via Web Audio API (no assets required)
    const playBeep = (type = 'success') => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            
            const audioCtx = new AudioContextClass();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            if (type === 'success') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.15);
            } else {
                oscillator.type = 'square'; // harshes sound for warning/error
                oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.25);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.3);
            }
        } catch (e) {
            console.warn("AudioContext beep suppressed by browser settings", e);
        }
    };

    // Init Scanner
    useEffect(() => {
        if (scanningStatus !== 'active') return;

        const startScanning = async () => {
            try {
                // Ensure clean slate
                if (qrCodeInstance.current) {
                    try {
                        await qrCodeInstance.current.stop();
                    } catch(e){}
                }

                const html5QrCode = new Html5Qrcode("scanner-viewfinder");
                qrCodeInstance.current = html5QrCode;

                // Default Config
                const qrCodeConfig = { 
                    fps: 10, 
                    qrbox: (width, height) => {
                        // Dynamic square size responsive to viewport
                        const size = Math.min(width, height) * 0.65;
                        return { width: size, height: size };
                    },
                    aspectRatio: 1.0
                };

                // Start rear camera
                await html5QrCode.start(
                    { facingMode: "environment" },
                    qrCodeConfig,
                    onScanSuccess
                );
                
                setIsScannerReady(true);
                setScannerError(null);
            } catch (err) {
                console.error("Error starting scanner:", err);
                setScannerError("Camera permission denied or camera not found.");
                setIsScannerReady(false);
            }
        };

        // Give DOM time to render viewfinder wrapper
        const timer = setTimeout(startScanning, 300);
        return () => {
            clearTimeout(timer);
            stopScanner();
        };
    }, [scanningStatus]);

    const stopScanner = async () => {
        if (qrCodeInstance.current && qrCodeInstance.current.isScanning) {
            try {
                await qrCodeInstance.current.stop();
            } catch (err) {
                console.error("Failed to stop scanner gracefully", err);
            }
        }
    };

    const onScanSuccess = async (decodedText) => {
        // Block further scans instantly
        setScanningStatus('processing');
        await stopScanner();
        
        // Process the QR (should be Mongoose ObjectId representing Ticket Sale ID)
        let ticketId = decodedText.trim();
        
        // If URL scanned instead, extract path segment
        if (ticketId.startsWith('http')) {
            try {
                const url = new URL(ticketId);
                const paths = url.pathname.split('/').filter(Boolean);
                ticketId = paths[paths.length - 1] || ticketId;
            } catch(e){}
        }

        // Send Scan Request to Backend API
        try {
            const token = localStorage.getItem('scannerToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.post(`${baseURL}/api/tickets/scan/${ticketId}`, {}, config);
            
            if (response.data.success) {
                playBeep('success');
                const resultData = {
                    success: true,
                    message: "Ticket verified successfully!",
                    ticket: response.data.ticket
                };
                setScanResult(resultData);
                setScanCount(prev => prev + 1);
                
                // Prepend history log
                setScanHistory(prev => [
                    { id: Date.now(), name: response.data.ticket.buyerName, status: 'valid', time: new Date().toLocaleTimeString() },
                    ...prev.slice(0, 9)
                ]);
            }
        } catch (error) {
            playBeep('error');
            console.error("Scanning api failed:", error);
            
            const errMsg = error.response?.data?.message || "Unknown ticket ID scanned.";
            const resultData = {
                success: false,
                message: errMsg,
                ticket: error.response?.data?.ticket || null
            };
            
            setScanResult(resultData);
            setScanHistory(prev => [
                { id: Date.now(), name: resultData.ticket?.buyerName || "Invalid / Unknown", status: 'invalid', time: new Date().toLocaleTimeString() },
                ...prev.slice(0, 9)
            ]);
        } finally {
            setScanningStatus('result');
        }
    };

    const handleScanNext = () => {
        setScanResult(null);
        setScanningStatus('active');
    };

    const handleLogout = async () => {
        await stopScanner();
        localStorage.removeItem('scannerToken');
        localStorage.removeItem('scannerUser');
        toast.success("Logged out successfully.");
        navigate('/scanner/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden select-none font-sans">
            {/* Navigation Topbar */}
            <header className="flex items-center justify-between px-5 py-4 bg-[#0a0a0a] border-b border-[#222] z-10 relative shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#8C5D25] to-[#C7913E] rounded-lg flex items-center justify-center text-white shadow-md shadow-[#C7913E]/10">
                        <QrCode size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold font-serif uppercase tracking-widest leading-tight text-[#C7913E]">
                            MODA WEEK
                        </h2>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Online Staff</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 border border-[#333] rounded-xl hover:bg-red-950/20 text-neutral-400 hover:text-red-400 active:scale-95 transition-all"
                >
                    <LogOut size={16} />
                    <span className="text-xs font-bold tracking-wider uppercase">Exit</span>
                </button>
            </header>

            {/* Live Dashboard Overview Widget */}
            <div className="bg-[#111] flex divide-x divide-[#222] border-b border-[#222]">
                <div className="flex-1 py-3 px-5 flex flex-col justify-center">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-0.5">Active Operator</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User size={13} className="text-[#C7913E]" />
                        {user.name}
                    </span>
                </div>
                <div className="flex-1 py-3 px-5 flex flex-col justify-center text-right">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-0.5">Scanned Today</span>
                    <span className="text-xs font-extrabold text-[#C7913E] flex items-center justify-end gap-1.5">
                        <FlameKindling size={13} />
                        {scanCount}
                    </span>
                </div>
            </div>

            {/* Main Body Wrapper */}
            <main className="flex-1 relative flex flex-col overflow-y-auto bg-[#070707]">
                
                {/* 1. SCANNING VIEW PORT CONTAINER */}
                {scanningStatus === 'active' && (
                    <div className="flex-1 flex flex-col relative p-4">
                        <div className="flex-1 flex flex-col justify-center items-center">
                            
                            {scannerError ? (
                                <div className="text-center p-6 bg-red-950/20 border border-red-900/50 rounded-2xl max-w-xs mb-4">
                                    <AlertTriangle className="text-red-500 mx-auto mb-3" size={36} />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-1">Camera Access Failed</h3>
                                    <p className="text-xs text-neutral-400 leading-relaxed">{scannerError}</p>
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-red-600 rounded-xl font-bold text-xs uppercase"
                                    >
                                        <RefreshCw size={14} /> Retry Access
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* High-tech Scanner Wrapper */}
                                    <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden border-2 border-[#333] shadow-2xl bg-black">
                                        <div id="scanner-viewfinder" className="w-full h-full object-cover scale-x-[-1] sm:scale-x-1"></div>
                                        
                                        {/* HUD Frame Layout overlay */}
                                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
                                            <div className="flex justify-between">
                                                <div className="w-8 h-8 border-t-4 border-l-4 border-[#C7913E] rounded-tl-lg"></div>
                                                <div className="w-8 h-8 border-t-4 border-r-4 border-[#C7913E] rounded-tr-lg"></div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="w-8 h-8 border-b-4 border-l-4 border-[#C7913E] rounded-bl-lg"></div>
                                                <div className="w-8 h-8 border-b-4 border-r-4 border-[#C7913E] rounded-br-lg"></div>
                                            </div>
                                        </div>

                                        {/* Animated Laser Scan Beam */}
                                        {isScannerReady && (
                                            <div className="absolute left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#C7913E] to-transparent shadow-[0_0_8px_#C7913E] animate-laser pointer-events-none z-10"></div>
                                        )}

                                        {!isScannerReady && (
                                            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/80 z-20 gap-3">
                                                <Loader className="animate-spin text-[#C7913E]" size={30} />
                                                <span className="text-xs tracking-wider uppercase text-neutral-500 font-bold">Initializing...</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-6 text-center animate-pulse px-6">
                                        <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase flex items-center justify-center gap-2">
                                            Align QR Code Within Frame
                                        </span>
                                        <p className="text-[10px] text-neutral-600 mt-1.5 leading-relaxed">
                                            Scanner automatically detects and verifies. Holds static upon capture.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. PROCESSING / NETWORK LOADING STATE */}
                {scanningStatus === 'processing' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-[#222] border-t-[#C7913E] animate-spin"></div>
                            <QrCode size={32} className="text-[#C7913E] animate-pulse" />
                        </div>
                        <h3 className="text-lg font-extrabold tracking-widest uppercase font-serif text-white animate-pulse">Verifying Ticket...</h3>
                        <p className="text-neutral-500 text-xs mt-2">Checking purchase status & scanning records in realtime.</p>
                    </div>
                )}

                {/* 3. RESULT RENDER CONTAINER (VALID OR REJECTED) */}
                {scanningStatus === 'result' && scanResult && (
                    <div className="flex-1 flex flex-col p-6 animate-fadeInUp">
                        <div className="flex-1 flex flex-col justify-center items-center w-full">
                            
                            <div className={`w-full max-w-md rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border ${
                                scanResult.success 
                                    ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-50' 
                                    : 'bg-red-950/20 border-red-900/50 text-red-50'
                            }`}>
                                
                                {scanResult.success ? (
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30 mb-5 shadow-lg shadow-emerald-500/10">
                                        <CheckCircle size={44} className="text-emerald-400 animate-scaleIn" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/30 mb-5 shadow-lg shadow-red-500/10">
                                        <XCircle size={44} className="text-red-400 animate-scaleIn" />
                                    </div>
                                )}

                                <h2 className={`text-2xl font-extrabold uppercase tracking-widest font-serif ${scanResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {scanResult.success ? 'Valid Entry' : 'Access Denied'}
                                </h2>
                                <p className="text-neutral-400 text-xs font-semibold tracking-wide mt-1 leading-relaxed max-w-[250px]">
                                    {scanResult.message}
                                </p>

                                {/* Ticket Data Card Breakdown */}
                                <div className="w-full mt-6 bg-black/40 rounded-2xl p-5 text-left border border-white/5 space-y-3.5">
                                    <div>
                                        <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Attendee/Buyer</div>
                                        <div className="text-sm font-extrabold text-white truncate mt-0.5">
                                            {scanResult.ticket?.buyerName || 'Unknown / N/A'}
                                        </div>
                                    </div>

                                    {scanResult.ticket?.eventName && (
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Event Schedule</div>
                                            <div className="text-xs font-semibold text-neutral-300 mt-0.5 truncate">
                                                {scanResult.ticket.eventName}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Ticket Type</div>
                                        <div className="text-xs mt-0.5 flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md font-extrabold uppercase text-[10px] tracking-wider border ${
                                                scanResult.success 
                                                    ? 'bg-[#C7913E]/20 border-[#C7913E]/40 text-[#C7913E]' 
                                                    : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                                            }`}>
                                                {scanResult.ticket?.ticketName || 'Invalid SKU'}
                                            </span>
                                        </div>
                                    </div>

                                    {scanResult.ticket?.scannedAt && !scanResult.success && (
                                        <div className="pt-2 border-t border-white/5 text-red-400 text-[11px] leading-normal">
                                            ⚠️ <strong>Scanned At:</strong> {new Date(scanResult.ticket.scannedAt).toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleScanNext}
                                    className="w-full mt-8 py-4 rounded-xl font-extrabold tracking-widest uppercase text-sm active:scale-95 shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer
                                    bg-gradient-to-r from-[#8C5D25] to-[#C7913E] hover:from-[#7A5020] hover:to-[#B38135] text-white"
                                >
                                    Tap to Scan Next
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. RECENT LOGS HISTORY DRAWER CONTAINER (at the bottom) */}
                {scanHistory.length > 0 && scanningStatus === 'active' && (
                    <div className="mt-auto bg-[#0b0b0b] border-t border-[#181818] py-4 px-5">
                        <h4 className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold flex items-center gap-1.5 mb-3">
                            <Info size={11} /> Session Scan Log
                        </h4>
                        <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar">
                            {scanHistory.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-[#111] rounded-xl p-2.5 px-3 border border-[#1d1d1d] text-[11px]">
                                    <div className="flex items-center gap-2 truncate flex-1 mr-2">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                        <span className="font-bold text-neutral-300 truncate">{item.name}</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-600 flex-shrink-0 font-semibold">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* High-Tech Laser & Keyframe UI animations via inline style hack for Vite/TW injection */}
            <style>{`
                @keyframes laserScan {
                    0% { top: 12%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 88%; opacity: 0; }
                }
                .animate-laser {
                    animation: laserScan 2s infinite ease-in-out;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.6); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ScannerDashboard;
