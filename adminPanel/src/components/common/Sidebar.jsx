import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Newspaper,
    LogOut,
    FolderOpen,
    Video,
    Calendar,
    Image,
    Scale,
    Briefcase,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/events', icon: Calendar, label: 'Events' },
        { path: '/applications', icon: FolderOpen, label: 'Applications' },
        { path: '/news', icon: Newspaper, label: 'News' },
        { path: '/landing-videos', icon: Video, label: 'Landing Videos' },
        { path: '/fashion-designers', icon: Users, label: 'Participants' },
        { path: '/partners', icon: Image, label: 'Partners' },
        { path: '/service-content', icon: Briefcase, label: 'Services' },
        { path: '/legal-pages', icon: Scale, label: 'Legal Pages' },
    ];

    return (
        <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out`}>
            {/* Logo Section */}
            <div className={`p-6 border-b border-slate-700/50 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Moda Admin</h1>
                            <p className="text-xs text-slate-400">Control Panel</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                            ${isActive
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                            }
                            ${collapsed ? 'justify-center px-3' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={20} className="flex-shrink-0" />
                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                {item.label}
                                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="mx-3 mb-2 p-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center justify-center"
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Logout Section */}
            <div className="p-3 border-t border-slate-700/50">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center px-3' : ''}`}
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    {!collapsed && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
