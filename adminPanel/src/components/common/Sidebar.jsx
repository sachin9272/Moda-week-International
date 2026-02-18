import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
    ChevronRight,
    Heart,
    Layers,
    ChevronDown,
    ChevronUp,
    Info
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Track expanded menus
    const [expandedMenus, setExpandedMenus] = useState({
        pages: true // Default open to show changes
    });

    const toggleMenu = (key) => {
        setExpandedMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        if (collapsed) setCollapsed(false); // Auto-expand sidebar if opening a menu
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/events', icon: Calendar, label: 'Events' },
        { path: '/applications', icon: FolderOpen, label: 'Applications' },
        { path: '/news', icon: Newspaper, label: 'News' },
        // Grouped Pages
        {
            key: 'pages',
            label: 'Pages',
            icon: Layers,
            children: [
                { path: '/philanthropy', icon: Heart, label: 'Philanthropy' },
                { path: '/donation-content', icon: Heart, label: 'Donation' },
                { path: '/about-us-content', icon: Info, label: 'About Us' },
                { path: '/service-content', icon: Briefcase, label: 'Services' },
                { path: '/upcoming-event-content', icon: Calendar, label: 'Upcoming Event' },
                { path: '/past-event-content', icon: Calendar, label: 'Past Event' },
                { path: '/participants-content', icon: Calendar, label: 'Participants' },
                { path: '/legal-pages', icon: Scale, label: 'Legal Pages' },
            ]
        },
        { path: '/landing-videos', icon: Video, label: 'Landing Videos' },
        { path: '/fashion-designers', icon: Users, label: 'Participants' },
        { path: '/partners', icon: Image, label: 'Partners / Logos' },
    ];

    const renderNavItem = (item) => {
        // Handle Nested Items
        if (item.children) {
            const isExpanded = expandedMenus[item.key];
            const isActive = item.children.some(child => location.pathname === child.path);

            return (
                <div key={item.key} className="mb-1">
                    <button
                        onClick={() => toggleMenu(item.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                        ${isActive ? 'text-white' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}
                        ${collapsed ? 'justify-center px-3' : 'justify-between'}
                        `}
                        title={collapsed ? item.label : undefined}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-[#C7913E]' : ''}`} />
                            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                        </div>
                        {!collapsed && (
                            <div className="text-neutral-500">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        )}

                        {/* Collapsed Tooltip */}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-3 py-2 bg-[#1a1a1a] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-[#2a2a2a]">
                                {item.label}
                                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45 border-l border-b border-[#2a2a2a]"></div>
                            </div>
                        )}
                    </button>

                    {/* Submenu */}
                    {(!collapsed && isExpanded) && (
                        <div className="mt-1 ml-4 pl-4 border-l border-[#2a2a2a] space-y-1">
                            {item.children.map(child => (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm
                                        ${isActive
                                            ? 'text-[#C7913E] bg-[#C7913E]/10 font-medium'
                                            : 'text-neutral-500 hover:text-white hover:bg-[#1a1a1a]'
                                        }`
                                    }
                                >
                                    <child.icon size={16} />
                                    <span>{child.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Handle Single Items
        return (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative mb-1
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
        );
    };

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
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
                {navItems.map(renderNavItem)}
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
