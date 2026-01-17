import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, History } from 'lucide-react';

const EventDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Events Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
                <Link
                    to="/events/past"
                    className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col items-center text-center gap-4"
                >
                    <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <History size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Past Events</h2>
                        <p className="text-slate-500">Manage archived and completed events history</p>
                    </div>
                </Link>

                <Link
                    to="/events/upcoming"
                    className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col items-center text-center gap-4"
                >
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Calendar size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Upcoming Events</h2>
                        <p className="text-slate-500">Manage scheduled and active global events</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default EventDashboard;
