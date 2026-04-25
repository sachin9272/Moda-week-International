import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DonationManager from './DonationManager';
import PhilanthropyManager from './PhilanthropyManager';

export default function ImpactContentManager() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const activeTab = location.pathname === '/donation-content'
        ? 'donation'
        : location.pathname === '/philanthropy'
            ? 'philanthropy'
            : (searchParams.get('tab') === 'philanthropy' ? 'philanthropy' : 'donation');

    const tabClass = (tab) =>
        `px-6 py-3 rounded-md text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab
            ? 'bg-[#8C5D25] text-white shadow-md'
            : 'text-gray-500 hover:text-[#8C5D25]'
        }`;

    return (
        <div className="min-h-screen">
            <div className="flex justify-center mb-8 px-4 pt-6">
                <div className="inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
                    <button onClick={() => navigate('/impact-content?tab=donation')} className={tabClass('donation')}>
                        Donation
                    </button>
                    <button onClick={() => navigate('/impact-content?tab=philanthropy')} className={tabClass('philanthropy')}>
                        Philanthropy
                    </button>
                </div>
            </div>

            {activeTab === 'donation' ? <DonationManager /> : <PhilanthropyManager />}
        </div>
    );
}
