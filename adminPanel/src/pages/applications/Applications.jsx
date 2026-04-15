import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Palette, Briefcase, Wrench, TrendingUp, ArrowRight, Loader, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../config/api';

const ApplicationCard = ({ title, description, icon: Icon, gradient, path, count, lastMonthCount }) => {
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

const Applications = () => {
    const [stats, setStats] = useState({
        buyers: 0,
        designers: 0,
        sponsors: 0,
        services: 0,
        rsvps: 0,
        buyersLastMonth: 0,
        designersLastMonth: 0,
        sponsorsLastMonth: 0,
        servicesLastMonth: 0,
        rsvpsLastMonth: 0
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
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Application Management</h1>
                <p className="text-neutral-500 mt-1">Select a category to manage community and partner applications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                <ApplicationCard
                    title="Buyer Applications"
                    description="Review and manage wholesale buyers, retailers, and boutique owners from around the globe."
                    icon={Users}
                    gradient="bg-gradient-to-br from-[#8C5D25] to-[#C7913E]"
                    path="/applications/buyers"
                    count={stats.buyers}
                    lastMonthCount={stats.buyersLastMonth}
                />
                <ApplicationCard
                    title="Designer Applications"
                    description="Curate collection submissions, review brand portfolios and evaluate designer invitations."
                    icon={Palette}
                    gradient="bg-gradient-to-br from-[#1a1a1a] to-[#3a3a3a]"
                    path="/applications/designers"
                    count={stats.designers}
                    lastMonthCount={stats.designersLastMonth}
                />
                <ApplicationCard
                    title="Sponsor Applications"
                    description="Manage corporate partnerships, brand activations and event sponsorship inquiries."
                    icon={Briefcase}
                    gradient="bg-gradient-to-br from-[#8C5D25] to-[#C7913E]"
                    path="/applications/sponsors"
                    count={stats.sponsors}
                    lastMonthCount={stats.sponsorsLastMonth}
                />
                <ApplicationCard
                    title="Service Inquiries"
                    description="Handle logistics, production support, and general service requests for the event week."
                    icon={Wrench}
                    gradient="bg-gradient-to-br from-[#1a1a1a] to-[#3a3a3a]"
                    path="/applications/services"
                    count={stats.services}
                    lastMonthCount={stats.servicesLastMonth}
                />
                <ApplicationCard
                    title="RSVP Applications"
                    description="Review confidential VIP RSVP submissions and private access interest forms."
                    icon={ShieldCheck}
                    gradient="bg-gradient-to-br from-[#8C5D25] to-[#C7913E]"
                    path="/applications/rsvps"
                    count={stats.rsvps}
                    lastMonthCount={stats.rsvpsLastMonth}
                />
            </div>
        </div>
    );
};

export default Applications;
