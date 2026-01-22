import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, TrendingUp, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../config/api';

const EventCard = ({ title, description, icon: Icon, gradient, textColor, path, count, lastMonthCount }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={26} className="text-white" />
                </div>
                <div className={`px-4 py-2 rounded-xl ${gradient} shadow-lg`}>
                    <span className="text-2xl font-bold text-white">{count}</span>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm mb-4">{description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className={textColor} />
                    <span className={`text-sm font-semibold ${textColor}`}>+{lastMonthCount}</span>
                    <span className="text-xs text-slate-400">last 30 days</span>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
};

const EventDashboard = () => {
    const [stats, setStats] = useState({
        pastEvents: 0,
        pastEventsLastMonth: 0,
        upcomingEvents: 0,
        upcomingEventsLastMonth: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/admin/stats`);
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Events Management</h1>
                <p className="text-slate-500">Select a category to manage events</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <EventCard
                    title="Past Events"
                    description="Manage archived and completed events history."
                    icon={History}
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    textColor="text-orange-500"
                    path="/events/past"
                    count={stats.pastEvents}
                    lastMonthCount={stats.pastEventsLastMonth}
                />
                <EventCard
                    title="Upcoming Events"
                    description="Manage scheduled and active global events."
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                    textColor="text-blue-500"
                    path="/events/upcoming"
                    count={stats.upcomingEvents}
                    lastMonthCount={stats.upcomingEventsLastMonth}
                />
            </div>
        </div>
    );
};

export default EventDashboard;
