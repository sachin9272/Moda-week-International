import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config/api';
import { Wallet, Ticket, Calendar, DollarSign, TrendingUp, User, ArrowLeft, ChevronRight, Loader } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const EventAnalyticsDashboard = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/dashboard/event-analytics/${id}`);
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader className="w-10 h-10 text-[#C7913E] animate-spin" />
        </div>
    );
    if (!analytics) return (
        <div className="bg-[#1a1a1a] p-12 rounded-2xl border border-[#2a2a2a] text-center text-neutral-500">
            <p>Event analytics data not available.</p>
        </div>
    );

    const COLORS = ['#C7913E', '#8C5D25', '#D4A558', '#A67C3D', '#E6C88A'];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <Link to="/events/upcoming" className="flex items-center text-neutral-500 hover:text-[#C7913E] mb-6 transition-colors group w-fit">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Upcoming Events
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white uppercase tracking-tight">{analytics.eventName}</h1>
                        <div className="flex items-center text-neutral-500 mt-3 font-medium">
                            <Calendar size={18} className="mr-2 text-[#C7913E]" />
                            <span>{analytics.eventDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] flex items-center transition-all hover:border-[#C7913E]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C7913E]/10 to-transparent rounded-bl-[100px]"></div>
                    <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-500 rounded-2xl mr-5 border border-green-500/20">
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-[#C7913E] transition-colors">${analytics.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] flex items-center transition-all hover:border-[#C7913E]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C7913E]/10 to-transparent rounded-bl-[100px]"></div>
                    <div className="p-4 bg-gradient-to-br from-[#8C5D25] to-[#C7913E] text-white rounded-2xl mr-5 shadow-lg shadow-[#C7913E]/20">
                        <Ticket size={28} />
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Tickets Sold</p>
                        <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-[#C7913E] transition-colors">{analytics.totalTicketsSold}</h3>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] flex items-center transition-all hover:border-[#C7913E]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C7913E]/10 to-transparent rounded-bl-[100px]"></div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 text-purple-400 rounded-2xl mr-5 border border-purple-500/20">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Avg. Order Value</p>
                        <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-[#C7913E] transition-colors">
                            ${analytics.totalTicketsSold > 0 ? (analytics.totalRevenue / analytics.totalTicketsSold).toFixed(2) : 0}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales by Type Chart */}
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-[#2a2a2a]">
                    <h3 className="text-xl font-bold text-white mb-8 border-b border-[#2a2a2a] pb-4 uppercase tracking-tight">Sales by Ticket Type</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.salesByTicketType}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                                <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={{ stroke: '#2a2a2a' }} />
                                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={{ stroke: '#2a2a2a' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f0f0f', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                                    cursor={{ fill: 'rgba(199, 145, 62, 0.05)' }}
                                />
                                <Bar dataKey="revenue" name="Revenue" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                                <defs>
                                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C7913E" />
                                        <stop offset="100%" stopColor="#8C5D25" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ticket Distribution Pie Chart */}
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-[#2a2a2a]">
                    <h3 className="text-xl font-bold text-white mb-8 border-b border-[#2a2a2a] pb-4 uppercase tracking-tight">Volume distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.salesByTicketType}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {analytics.salesByTicketType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f0f0f', color: '#fff' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#2a2a2a] overflow-hidden mb-8">
                <div className="p-6 border-b border-[#2a2a2a] bg-[#0f0f0f]/50">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Ticket Inventory Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f0f0f]">
                            <tr className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="py-4 px-6">Ticket Class</th>
                                <th className="py-4 px-6 text-right">Inventory Sold</th>
                                <th className="py-4 px-6 text-right">Unit Price</th>
                                <th className="py-4 px-6 text-right">Total Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {analytics.salesByTicketType.map((type, idx) => (
                                <tr key={idx} className="hover:bg-[#C7913E]/5 transition-colors group">
                                    <td className="py-5 px-6 font-bold text-white group-hover:text-[#C7913E] transition-colors">{type.name}</td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-white font-medium">{type.count} / {type.limit}</span>
                                            <div className="w-24 h-1 bg-[#2a2a2a] rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#C7913E]"
                                                    style={{ width: `${Math.min(100, (type.count / type.limit) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-neutral-400 text-right font-medium">
                                        ${type.price.toFixed(2)}
                                    </td>
                                    <td className="py-5 px-6 text-[#C7913E] text-right font-bold">
                                        ${type.revenue.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#2a2a2a] overflow-hidden">
                <div className="p-6 border-b border-[#2a2a2a] bg-[#0f0f0f]/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Recent Purchases</h3>
                    <Link to={`/events/upcoming/transactions/${id}`} className="text-[#C7913E] hover:text-white text-sm font-bold flex items-center gap-2 group">
                        View All History <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f0f0f]">
                            <tr className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="py-4 px-6">Customer Details</th>
                                <th className="py-4 px-6">Purchased Type</th>
                                <th className="py-4 px-6 text-center">Qty</th>
                                <th className="py-4 px-6 text-right">Total Paid</th>
                                <th className="py-4 px-6 text-right">Transaction Date</th>
                                <th className="py-4 px-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {analytics.recentTransactions.map((tx, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#252525] flex items-center justify-center text-[#C7913E] font-bold text-xs border border-[#3a3a3a]">
                                                {tx.buyerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{tx.buyerName}</p>
                                                <p className="text-[11px] text-neutral-500 font-medium">{tx.buyerEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-neutral-300 font-medium text-sm">{tx.ticketName}</td>
                                    <td className="py-4 px-6 text-neutral-400 text-center font-bold">{tx.quantity}</td>
                                    <td className="py-4 px-6 font-bold text-[#C7913E] text-right">${tx.totalAmount}</td>
                                    <td className="py-4 px-6 text-neutral-500 text-right text-xs font-medium">{new Date(tx.purchaseDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="bg-green-500/10 text-green-500 py-1 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventAnalyticsDashboard;
