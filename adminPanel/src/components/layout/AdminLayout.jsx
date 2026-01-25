import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { Search, Bell, User, ChevronDown, X, Check } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { baseURL } from '../../config/api';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/notifications`);
            if (res.data.status === 'success') {
                setNotifications(res.data.data);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch notifications on mount and every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read
            await axios.patch(`${baseURL}/api/notifications/${notification._id}/read`);

            // Update local state
            setNotifications(prev =>
                prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Close dropdown
            setShowNotifications(false);

            // Navigate to the link
            if (notification.link) {
                navigate(notification.link);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const handleMarkAllRead = async () => {
        try {
            await axios.patch(`${baseURL}/api/notifications/mark-all-read`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Get page title from path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.includes('/events')) return 'Events Management';
        if (path.includes('/applications')) return 'Applications';
        if (path.includes('/news')) return 'News Management';
        if (path.includes('/landing-videos')) return 'Landing Videos';
        if (path.includes('/fashion-designers')) return 'Participants';
        if (path.includes('/partners')) return 'Partners';
        if (path.includes('/service-content')) return 'Service Content';
        if (path.includes('/legal-pages')) return 'Legal Pages';
        return 'Admin Panel';
    };

    // Format time ago
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
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
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <Bell size={20} className="text-slate-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fadeIn z-50">
                                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                                            >
                                                <Check size={14} />
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-slate-400 text-sm">
                                                No notifications yet
                                            </div>
                                        ) : (
                                            notifications.slice(0, 10).map((notification) => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-indigo-50/50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? 'bg-indigo-500' : 'bg-slate-300'
                                                            }`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {timeAgo(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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

            {/* Click outside to close menus */}
            {(showProfileMenu || showNotifications) && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => {
                        setShowProfileMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}
        </div>
    );
};

export default AdminLayout;

