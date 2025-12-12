import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Palette, Briefcase, Wrench } from 'lucide-react';

const ApplicationCard = ({ title, description, icon: Icon, color, path }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
        >
            <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500">{description}</p>
        </div>
    );
};

const Applications = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Application Management</h1>
                <p className="text-slate-500">Select a category to manage applications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
                <ApplicationCard
                    title="Buyer Applications"
                    description="Manage wholesale buyers and retailer applications."
                    icon={Users}
                    color="bg-blue-500"
                    path="/applications/buyers"
                />
                <ApplicationCard
                    title="Designer Applications"
                    description="Review portfolios and collection submissions."
                    icon={Palette}
                    color="bg-purple-500"
                    path="/applications/designers"
                />
                <ApplicationCard
                    title="Sponsor Applications"
                    description="Track corporate and partner sponsorship inquiries."
                    icon={Briefcase}
                    color="bg-emerald-500"
                    path="/applications/sponsors"
                />
                <ApplicationCard
                    title="Service Inquiries"
                    description="Manage general service and support requests."
                    icon={Wrench}
                    color="bg-amber-500"
                    path="/applications/services"
                />
            </div>
        </div>
    );
};

export default Applications;
