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
        <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-black text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out border-r border-[#2a2a2a]`}>
            {/* Logo Section */}
            <div className={`p-6 border-b border-[#2a2a2a] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5D25] to-[#C7913E] flex items-center justify-center shadow-lg shadow-[#C7913E]/20">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Moda Admin</h1>
                            <p className="text-xs text-neutral-500">Control Panel</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5D25] to-[#C7913E] flex items-center justify-center shadow-lg shadow-[#C7913E]/20">
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
                                ? 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white shadow-lg shadow-[#C7913E]/20'
                                : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'
                            }
                            ${collapsed ? 'justify-center px-3' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={20} className="flex-shrink-0" />
                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-3 py-2 bg-[#1a1a1a] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-[#2a2a2a]">
                                {item.label}
                                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45 border-l border-b border-[#2a2a2a]"></div>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="mx-3 mb-2 p-2 rounded-lg text-neutral-400 hover:bg-[#1a1a1a] hover:text-[#C7913E] transition-colors flex items-center justify-center"
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Logout Section */}
            <div className="p-3 border-t border-[#2a2a2a]">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 w-full text-neutral-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center px-3' : ''}`}
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
