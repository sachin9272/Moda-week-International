import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/services`);
            if (res.data.success) {
                setServices(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service inquiry?")) {
            try {
                await axios.delete(`${baseURL}/api/admin/services/${id}`);
                setServices(services.filter(s => s._id !== id));
            } catch (error) {
                alert("Failed to delete service");
            }
        }
    };

    const filteredServices = services.filter(service =>
        service.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const headers = ["Full Name", "Email", "Phone", "Country", "Request Participation", "Additional Info", "Date"];
        const csvData = filteredServices.map(s => [
            s.fullName,
            s.email,
            s.phoneNumber,
            s.country,
            Array.isArray(s.requestParticipation) ? s.requestParticipation.join("; ") : s.requestParticipation,
            `"${s.additionalInfo?.replace(/"/g, '""') || ''}"`,
            new Date(s.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "services_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { header: 'Full Name', key: 'fullName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Country', key: 'country' },
        { header: 'Request', render: (item) => Array.isArray(item.requestParticipation) ? item.requestParticipation.join(", ") : item.requestParticipation },
        { header: 'Additional Info', key: 'additionalInfo' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Service Inquiries</h1>
                    <p className="text-slate-500">Track and manage service requests</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                        Export CSV
                    </button>
                </div>
            </div>
            <Table
                title="Inquiries List"
                columns={columns}
                data={filteredServices}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Services;
