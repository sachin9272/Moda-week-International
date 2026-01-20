import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../config/api';

const EventCard = ({ title, description, icon: Icon, bgColor, textColor, path, count, lastMonthCount }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                </div>
                <div className={`px-4 py-2 rounded-xl ${bgColor}`}>
                    <span className="text-2xl font-bold text-white">{count}</span>
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 mb-4">{description}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <TrendingUp size={16} className={textColor} />
                <span className={`text-sm font-semibold ${textColor}`}>+{lastMonthCount}</span>
                <span className="text-sm text-slate-400">in last 30 days</span>
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
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Events Management</h1>
                <p className="text-slate-500">Select a category to manage events</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <EventCard
                    title="Past Events"
                    description="Manage archived and completed events history."
                    icon={History}
                    bgColor="bg-orange-500"
                    textColor="text-orange-500"
                    path="/events/past"
                    count={stats.pastEvents}
                    lastMonthCount={stats.pastEventsLastMonth}
                />
                <EventCard
                    title="Upcoming Events"
                    description="Manage scheduled and active global events."
                    icon={Calendar}
                    bgColor="bg-blue-500"
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

