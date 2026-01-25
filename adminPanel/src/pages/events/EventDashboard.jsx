import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, TrendingUp, ArrowRight, Loader } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../config/api';

const EventCard = ({ title, description, icon: Icon, gradient, path, count, lastMonthCount }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg border border-[#2a2a2a] hover:border-[#C7913E]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20`}>
                    <Icon size={26} className="text-white" />
                </div>
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] px-5 py-2 rounded-xl">
                    <span className="text-2xl font-bold text-white">{count}</span>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C7913E] transition-colors">{title}</h3>
            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">{description}</p>
            <div className="flex items-center justify-between pt-5 border-t border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#C7913E]" />
                    <span className="text-sm font-bold text-[#C7913E]">+{lastMonthCount}</span>
                    <span className="text-xs text-neutral-600">past 30 days</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center group-hover:bg-[#C7913E] group-hover:text-white text-neutral-600 transition-all">
                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/admin/stats`);
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader className="w-10 h-10 text-[#C7913E] animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Events Portal</h1>
                <p className="text-neutral-500 mt-1">Manage event lifecycles, global scheduling and historical archives</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                <EventCard
                    title="Past Events"
                    description="Access historical records, archived footage and past event details for the global fashion week."
                    icon={History}
                    gradient="bg-gradient-to-br from-[#1a1a1a] to-[#3a3a3a]"
                    path="/events/past"
                    count={stats.pastEvents}
                    lastMonthCount={stats.pastEventsLastMonth}
                />
                <EventCard
                    title="Upcoming Events"
                    description="Coordinate current scheduling, manage ticketing and oversee the main event dashboard for active shows."
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-[#8C5D25] to-[#C7913E]"
                    path="/events/upcoming"
                    count={stats.upcomingEvents}
                    lastMonthCount={stats.upcomingEventsLastMonth}
                />
            </div>
        </div>
    );
};

export default EventDashboard;
