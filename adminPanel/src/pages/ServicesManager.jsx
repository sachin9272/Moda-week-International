import React, { useState } from 'react';
import { Layers, LayoutTemplate } from 'lucide-react';
import ServiceHeroManager from './ServiceHeroManager';
import ServiceTypeManagement from './ServiceTypeManagement';

const ServicesManager = () => {
    const [activeTab, setActiveTab] = useState('types');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-white">Service Content Management</h1>
                <p className="text-neutral-500">Manage service types and the hero section of the services page.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[#1a1a1a] rounded-xl w-fit border border-[#2a2a2a]">
                <button
                    onClick={() => setActiveTab('types')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'types'
                        ? 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                >
                    <Layers size={18} />
                    Service Types
                </button>
                <button
                    onClick={() => setActiveTab('hero')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'hero'
                        ? 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                >
                    <LayoutTemplate size={18} />
                    Hero Section
                </button>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                {activeTab === 'types' ? (
                    <ServiceTypeManagement />
                ) : (
                    <ServiceHeroManager />
                )}
            </div>
        </div>
    );
};

export default ServicesManager;
