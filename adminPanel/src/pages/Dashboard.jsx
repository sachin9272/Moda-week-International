import React, { useEffect, useState } from 'react';
import { Users, Palette, Briefcase, Wrench, Newspaper } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../config/api';

const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{count}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        buyers: 0,
        designers: 0,
        sponsors: 0,
        services: 0,
        news: 0
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
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Buyers"
                    count={stats.buyers}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Designers Applied"
                    count={stats.designers}
                    icon={Palette}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Sponsors"
                    count={stats.sponsors}
                    icon={Briefcase}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Service Inquiries"
                    count={stats.services}
                    icon={Wrench}
                    color="bg-amber-500"
                />
                <StatCard
                    title="News Articles"
                    count={stats.news}
                    icon={Newspaper}
                    color="bg-indigo-500"
                />
            </div>
        </div>
    );
};

export default Dashboard;
