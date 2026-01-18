
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config/api';
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const EventTransactions = () => {
    const { id } = useParams(); // Event ID
    const [transactions, setTransactions] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]); // For filters
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 });

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        ticketType: '',
        page: 1,
        limit: 10
    });

    // Fetch initial event details to get ticket types for filter dropdown
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                // We can use the existing analytics endpoint or event detail endpoint
                // Using analytics endpoint as it likely has what we need without too much overhead, or just fetch tickets
                const response = await axios.get(`${baseURL}/api/dashboard/event-analytics/${id}`);
                // Extract unique ticket names for the dropdown
                const types = response.data.salesByTicketType.map(t => t.name);
                setTicketTypes(types);
            } catch (error) {
                console.error("Error fetching ticket types:", error);
            }
        };
        fetchEventDetails();
    }, [id]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: filters.page,
                    limit: filters.limit,
                    ...(filters.search && { search: filters.search }),
                    ...(filters.status && { status: filters.status }),
                    ...(filters.ticketType && { ticketType: filters.ticketType })
                });

                const response = await axios.get(`${baseURL}/api/dashboard/event-transactions/${id}?${queryParams}`);

                setTransactions(response.data.transactions);
                setStats({
                    totalCount: response.data.totalCount,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage
                });
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 500);

        return () => clearTimeout(timer);
    }, [id, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to page 1 on filter change
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= stats.totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to={`/events/upcoming/dashboard/${id}`} className="flex items-center text-slate-500 hover:text-slate-700 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
                <p className="text-slate-500 mt-1">Manage and view all ticket sales for this event.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by buyer name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                        >
                            <option value="">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="refunded">Refunded</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            name="ticketType"
                            value={filters.ticketType}
                            onChange={handleFilterChange}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                        >
                            <option value="">All Ticket Types</option>
                            {ticketTypes.map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/50">
                                <th className="py-4 px-4 font-semibold text-slate-600">Buyer</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Ticket Type</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Qty</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Amount</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Date</th>
                                <th className="py-4 px-4 font-semibold text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-500">Loading transactions...</td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx, idx) => (
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
                                        <td className="py-4 px-4 text-slate-500">{new Date(tx.purchaseDate).toLocaleDateString()} {new Date(tx.purchaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="py-4 px-4">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wide
                                                ${tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    tx.status === 'refunded' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-500">No transactions found matching your filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && transactions.length > 0 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500">
                            Showing {((stats.currentPage - 1) * filters.limit) + 1} to {Math.min(stats.currentPage * filters.limit, stats.totalCount)} of {stats.totalCount} results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(stats.currentPage - 1)}
                                disabled={stats.currentPage === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex items-center px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700">
                                Page {stats.currentPage} of {stats.totalPages}
                            </div>
                            <button
                                onClick={() => handlePageChange(stats.currentPage + 1)}
                                disabled={stats.currentPage === stats.totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventTransactions;
