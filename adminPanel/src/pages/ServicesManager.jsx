import React, { useState } from 'react';
import { Layers, LayoutTemplate } from 'lucide-react';
import ServiceHeroManager from './ServiceHeroManager';
import ServiceTypeManagement from './ServiceTypeManagement';

const ServicesManager = () => {
    const [activeTab, setActiveTab] = useState('types');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-800">Service Content Management</h1>
                <p className="text-slate-500">Manage service types and the hero section of the services page.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('types')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'types'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Layers size={18} />
                    Service Types
                </button>
                <button
                    onClick={() => setActiveTab('hero')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'hero'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
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
