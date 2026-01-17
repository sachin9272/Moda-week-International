import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config/api';
import { Wallet, Ticket, Calendar, DollarSign, TrendingUp, User, ArrowLeft } from 'lucide-react';
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

    if (loading) return <div className="p-6 text-center">Loading Analytics...</div>;
    if (!analytics) return <div className="p-6 text-center">Data not available</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to="/events/upcoming" className="flex items-center text-slate-500 hover:text-slate-700 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Upcoming Events
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{analytics.eventName}</h1>
                        <div className="flex items-center text-slate-500 mt-2">
                            <Calendar size={16} className="mr-2" />
                            <span>{analytics.eventDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full mr-4">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-800">${analytics.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full mr-4">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Tickets Sold</p>
                        <h3 className="text-2xl font-bold text-slate-800">{analytics.totalTicketsSold}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full mr-4">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Avg. Order Value</p>
                        <h3 className="text-2xl font-bold text-slate-800">
                            ${analytics.totalTicketsSold > 0 ? (analytics.totalRevenue / analytics.totalTicketsSold).toFixed(2) : 0}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales by Type Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Sales by Ticket Type</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.salesByTicketType}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="revenue" name="Revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ticket Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Ticket Volume Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.salesByTicketType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {analytics.salesByTicketType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Sales by ticket type Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Sales by ticket type</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                <th className="py-4 px-4 font-normal">Ticket Type</th>
                                <th className="py-4 px-4 font-normal text-right">Sold</th>
                                <th className="py-4 px-4 font-normal text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.salesByTicketType.map((type, idx) => (
                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                                    <td className="py-4 px-4 text-slate-600 font-medium">{type.name}</td>
                                    <td className="py-4 px-4 text-slate-600 text-right font-medium">
                                        {type.count}/{type.limit}
                                    </td>
                                    <td className="py-4 px-4 text-slate-600 text-right font-medium">
                                        ${type.price.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                    <Link to={`/events/upcoming/transactions/${id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="py-4 px-4 font-semibold text-slate-600">Buyer</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Ticket Type</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Qty</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Amount</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Date</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.recentTransactions.map((tx, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-slate-800">{tx.buyerName}</p>
                                            <p className="text-xs text-slate-500">{tx.buyerEmail}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-600">{tx.ticketName}</td>
                                    <td className="py-4 px-4 text-slate-600">{tx.quantity}</td>
                                    <td className="py-4 px-4 font-medium text-slate-800">${tx.totalAmount}</td>
                                    <td className="py-4 px-4 text-slate-500">{new Date(tx.purchaseDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-4">
                                        <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wide">
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
