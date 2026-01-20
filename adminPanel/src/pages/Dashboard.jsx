import React, { useEffect, useState } from 'react';
import { Newspaper, DollarSign, Ticket } from 'lucide-react';
import {
    ComposedChart,
    Line,
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
import axios from 'axios';
import { baseURL } from '../config/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
        news: 0
    });

    const [globalAnalytics, setGlobalAnalytics] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [ticketStats, setTicketStats] = useState([]);

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

        const fetchGlobalAnalytics = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/dashboard/global-analytics`);
                setGlobalAnalytics(res.data);
            } catch (error) {
                console.error("Error fetching global analytics:", error);
            }
        };

        const fetchTopCustomers = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/dashboard/top-customers`);
                setTopCustomers(res.data);
            } catch (error) {
                console.error("Error fetching top customers:", error);
            }
        };

        const fetchRecentTransactions = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/dashboard/recent-transactions`);
                setRecentTransactions(res.data);
            } catch (error) {
                console.error("Error fetching recent transactions:", error);
            }
        };

        const fetchTicketTypeStats = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/dashboard/ticket-type-stats`);
                setTicketStats(res.data);
            } catch (error) {
                console.error("Error fetching ticket type stats:", error);
            }
        };

        fetchStats();
        fetchGlobalAnalytics();
        fetchTopCustomers();
        fetchRecentTransactions();
        fetchTicketTypeStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    count={`$${globalAnalytics.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Tickets Sold"
                    count={globalAnalytics.reduce((acc, curr) => acc + curr.totalTickets, 0).toLocaleString()}
                    icon={Ticket}
                    color="bg-blue-600"
                />
                <StatCard
                    title="News Articles"
                    count={stats.news}
                    icon={Newspaper}
                    color="bg-indigo-500"
                />
            </div>

            {/* Event Analytics Charts */}
            <h2 className="text-xl font-bold text-slate-800 mt-10 mb-6">Upcoming Events Analytics</h2>
            {globalAnalytics.length > 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Event Performance: Revenue vs Ticket Sales</h3>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={globalAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="eventName" scale="band" />
                                <YAxis yAxisId="left" orientation="left" stroke="#0EA5E9" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" label={{ value: 'Tickets Sold', angle: 90, position: 'insideRight' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="totalRevenue" name="Revenue ($)" fill="#0EA5E9" barSize={30} radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="totalTickets" name="Tickets Sold" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500 mb-8">
                    <p>No transaction data available for upcoming events yet.</p>
                </div>
            )}

            {/* Top 5 Revenue Events */}
            {globalAnalytics.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Highest Revenue Events</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-100">
                                    <th className="py-3 font-medium">Rank</th>
                                    <th className="py-3 font-medium">Event Name</th>
                                    <th className="py-3 font-medium">Tickets Sold</th>
                                    <th className="py-3 font-medium text-right">Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {globalAnalytics.slice(0, 5).map((event, index) => (
                                    <tr key={index} className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                                        <td className="py-3 text-slate-600 font-medium">
                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-slate-100 text-slate-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-50 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-800 font-medium">{event.eventName}</td>
                                        <td className="py-3 text-slate-600">{event.totalTickets}</td>
                                        <td className="py-3 text-right font-bold text-emerald-600">
                                            ${event.totalRevenue.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top 5 Most Visited Customers */}
            {topCustomers.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Most Visited Customers</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-100">
                                    <th className="py-3 font-medium">Rank</th>
                                    <th className="py-3 font-medium">Customer Name</th>
                                    <th className="py-3 font-medium">Email</th>
                                    <th className="py-3 font-medium">Tickets Purchased</th>
                                    <th className="py-3 font-medium text-right">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map((customer, index) => (
                                    <tr key={index} className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                                        <td className="py-3 text-slate-600 font-medium">
                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-slate-100 text-slate-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-50 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-800 font-medium">{customer.name}</td>
                                        <td className="py-3 text-slate-500 text-sm">{customer.email}</td>
                                        <td className="py-3 text-slate-600 pl-8">{customer.totalTickets}</td>
                                        <td className="py-3 text-right font-bold text-emerald-600">
                                            ${customer.totalSpent.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* Additional Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Ticket Type Popularity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Ticket Type Popularity</h3>
                    {ticketStats.length > 0 ? (
                        <div className="h-80 w-full flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ticketStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {ticketStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-slate-500">
                            No ticket data available
                        </div>
                    )}
                </div>

                {/* Recent Transactions Feed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Transactions</h3>
                    <div className="overflow-y-auto max-h-80 space-y-4">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx, index) => (
                                <div key={index} className="flex flex-col border-b border-slate-50 last:border-none pb-3 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{tx.buyerName}</p>
                                            <p className="text-xs text-slate-500">{tx.eventName}</p>
                                        </div>
                                        <span className="text-emerald-600 font-bold text-sm">
                                            +${tx.totalAmount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs">
                                        <span className="text-slate-600 font-medium">{tx.ticketName} x{tx.quantity}</span>
                                        <span className="text-slate-400">
                                            {new Date(tx.purchaseDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 py-10">
                                No recent transactions found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
