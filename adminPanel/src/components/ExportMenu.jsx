import React, { useEffect, useRef, useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

// "Export" button that opens a dropdown of sheet options (e.g. one per request type)
// instead of downloading a fixed file immediately.
const ExportMenu = ({ options, onSelect, label = 'Export' }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="px-4 py-2 bg-[#C7913E] hover:bg-[#B38135] text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#C7913E]/20"
            >
                <Download size={18} />
                <span className="hidden sm:inline">{label}</span>
                <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl z-30 py-2 max-h-80 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => {
                                setOpen(false);
                                onSelect(option.key);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-[#C7913E]/10 hover:text-[#C7913E] transition-colors"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
