import React, { useContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

const ROUTE_SECTION_MAP = [
    { prefix: '/events', section: 'events', label: 'Events Management' },
    { prefix: '/tickets', section: 'tickets', label: 'Tickets' },
    { prefix: '/scanner-operators', section: 'scanner_operators', label: 'Scanner Operators' },
    { prefix: '/applications', section: 'applications', label: 'Applications' },
    { prefix: '/news', section: 'news', label: 'News Management' },
    { prefix: '/landing-videos', section: 'landing_videos', label: 'Landing Videos' },
    { prefix: '/fashion-designers', section: 'fashion_designers', label: 'Participants & Designers' },
    { prefix: '/production-team', section: 'production_team', label: 'Production Team' },
    { prefix: '/press-media', section: 'press_media', label: 'Press & Media' },
    { prefix: '/partners', section: 'partners', label: 'Partners & Logos' },
    { prefix: '/impact-content', section: 'philanthropy_donation', label: 'Philanthropy & Donation' },
    { prefix: '/philanthropy', section: 'philanthropy_donation', label: 'Philanthropy' },
    { prefix: '/donation-content', section: 'philanthropy_donation', label: 'Donation Content' },
    { prefix: '/about-us-content', section: 'about_us', label: 'About Us' },
    { prefix: '/landing-page-content', section: 'landing_page', label: 'Landing Page Content' },
    { prefix: '/rsvp-content', section: 'rsvp_page', label: 'RSVP Content' },
    { prefix: '/service-content', section: 'services_content', label: 'Services Content' },
    { prefix: '/upcoming-event-content', section: 'upcoming_event_hero', label: 'Upcoming Event Hero' },
    { prefix: '/past-event-content', section: 'past_event_hero', label: 'Past Event Hero' },
    { prefix: '/participants-content', section: 'participants_hero', label: 'Participants Hero' },
    { prefix: '/legal-pages', section: 'legal_pages', label: 'Legal Pages' },
];

function getSectionForPath(pathname) {
    if (pathname === '/' || pathname === '') {
        return { section: 'dashboard', label: 'Dashboard' };
    }
    const match = ROUTE_SECTION_MAP.find(r => pathname === r.prefix || pathname.startsWith(r.prefix + '/'));
    return match || null;
}

const AccessDeniedView = ({ sectionLabel, onBack, onLogout }) => (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
            <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-neutral-400 max-w-md text-sm mb-2">
            You do not have administrative clearance to access the <span className="text-white font-semibold">{sectionLabel}</span> module.
        </p>
        <p className="text-neutral-500 text-xs max-w-md mb-6">
            Permissions are managed centrally from the Esmeralda Master Admin Panel. If you require access, please contact your Super Administrator.
        </p>
        <div className="flex items-center gap-3">
            <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] text-sm text-neutral-300 font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
                <ArrowLeft size={16} />
                <span>Go Back</span>
            </button>
            <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
                <LogOut size={16} />
                <span>Log Out</span>
            </button>
        </div>
    </div>
);

const ProtectedRoute = ({ children, requiredSection }) => {
    const { user, role, loading, loadingPermissions, hasPermission, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    if (loading || loadingPermissions) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#C7913E] border-t-transparent animate-spin" />
                <span className="text-xs text-neutral-400">Verifying administrative security clearance...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Super Admin has full clearance
    if (role === 'Super Admin') {
        return children;
    }

    // Check section permission
    const currentSectionInfo = requiredSection 
        ? { section: requiredSection, label: requiredSection } 
        : getSectionForPath(location.pathname);

    if (currentSectionInfo && !hasPermission(currentSectionInfo.section, 'view')) {
        return (
            <AccessDeniedView 
                sectionLabel={currentSectionInfo.label}
                onBack={() => navigate(-1)}
                onLogout={() => {
                    logout();
                    navigate('/login');
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;
