import React, { useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Get page title from path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.includes('/events')) return 'Events Management';
        if (path.includes('/applications')) return 'Applications';
        if (path.includes('/news')) return 'News Management';
        if (path.includes('/landing-videos')) return 'Landing Videos';
        if (path.includes('/fashion-designers')) return 'Fashion Designers';
        if (path.includes('/partners')) return 'Partners';
        if (path.includes('/service-content')) return 'Service Content';
        if (path.includes('/legal-pages')) return 'Legal Pages';
        return 'Admin Panel';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
            <Sidebar />

            {/* Main Content - adjusts based on sidebar state */}
            <div className="ml-64 transition-all duration-300 peer-checked:ml-20">
                {/* Enhanced Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8 sticky top-0 z-40 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
                            <p className="text-xs text-slate-400">Welcome back, Admin</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full pulse-dot"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-indigo-500/20">
                                    A
                                </div>
                                <span className="font-medium text-sm text-slate-700 hidden sm:block">Admin</span>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fadeIn">
                                    <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                        <User size={16} />
                                        Profile Settings
                                    </button>
                                    <hr className="my-2 border-slate-100" />
                                    <button
                                        onClick={logout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    <div className="animate-fadeIn">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Click outside to close profile menu */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
