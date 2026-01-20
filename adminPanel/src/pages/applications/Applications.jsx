import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Palette, Briefcase, Wrench, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../config/api';

const ApplicationCard = ({ title, description, icon: Icon, bgColor, textColor, path, count, lastMonthCount }) => {
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

const Applications = () => {
    const [stats, setStats] = useState({
        buyers: 0,
        designers: 0,
        sponsors: 0,
        services: 0,
        buyersLastMonth: 0,
        designersLastMonth: 0,
        sponsorsLastMonth: 0,
        servicesLastMonth: 0
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
                <h1 className="text-2xl font-bold text-slate-800">Application Management</h1>
                <p className="text-slate-500">Select a category to manage applications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
                <ApplicationCard
                    title="Buyer Applications"
                    description="Manage wholesale buyers and retailer applications."
                    icon={Users}
                    bgColor="bg-blue-500"
                    textColor="text-blue-500"
                    path="/applications/buyers"
                    count={stats.buyers}
                    lastMonthCount={stats.buyersLastMonth}
                />
                <ApplicationCard
                    title="Designer Applications"
                    description="Review portfolios and collection submissions."
                    icon={Palette}
                    bgColor="bg-purple-500"
                    textColor="text-purple-500"
                    path="/applications/designers"
                    count={stats.designers}
                    lastMonthCount={stats.designersLastMonth}
                />
                <ApplicationCard
                    title="Sponsor Applications"
                    description="Track corporate and partner sponsorship inquiries."
                    icon={Briefcase}
                    bgColor="bg-emerald-500"
                    textColor="text-emerald-500"
                    path="/applications/sponsors"
                    count={stats.sponsors}
                    lastMonthCount={stats.sponsorsLastMonth}
                />
                <ApplicationCard
                    title="Service Inquiries"
                    description="Manage general service and support requests."
                    icon={Wrench}
                    bgColor="bg-amber-500"
                    textColor="text-amber-500"
                    path="/applications/services"
                    count={stats.services}
                    lastMonthCount={stats.servicesLastMonth}
                />
            </div>
        </div>
    );
};

export default Applications;

