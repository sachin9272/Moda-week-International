import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Palette, Briefcase, Wrench, TrendingUp, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../config/api';

const ApplicationCard = ({ title, description, icon: Icon, bgColor, gradient, textColor, path, count, lastMonthCount }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl ${gradient || bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={26} className="text-white" />
                </div>
                <div className={`px-4 py-2 rounded-xl ${gradient || bgColor} shadow-lg`}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <ApplicationCard
                    title="Buyer Applications"
                    description="Manage wholesale buyers and retailer applications."
                    icon={Users}
                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                    textColor="text-blue-500"
                    path="/applications/buyers"
                    count={stats.buyers}
                    lastMonthCount={stats.buyersLastMonth}
                />
                <ApplicationCard
                    title="Designer Applications"
                    description="Review portfolios and collection submissions."
                    icon={Palette}
                    gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                    textColor="text-purple-500"
                    path="/applications/designers"
                    count={stats.designers}
                    lastMonthCount={stats.designersLastMonth}
                />
                <ApplicationCard
                    title="Sponsor Applications"
                    description="Track corporate and partner sponsorship inquiries."
                    icon={Briefcase}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                    textColor="text-emerald-500"
                    path="/applications/sponsors"
                    count={stats.sponsors}
                    lastMonthCount={stats.sponsorsLastMonth}
                />
                <ApplicationCard
                    title="Service Inquiries"
                    description="Manage general service and support requests."
                    icon={Wrench}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
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

