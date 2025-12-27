import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchSponsors = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/sponsors`);
            if (res.data.success) {
                setSponsors(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching sponsors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this sponsor?")) {
            try {
                await axios.delete(`${baseURL}/api/admin/sponsors/${id}`);
                setSponsors(sponsors.filter(s => s._id !== id));
            } catch (error) {
                alert("Failed to delete sponsor");
            }
        }
    };

    const filteredSponsors = sponsors.filter(sponsor =>
        sponsor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const headers = ["Company Name", "Contact Name", "Email", "Phone", "Country", "Industry", "Interests", "Additional Info", "Date"];
        const csvData = filteredSponsors.map(s => [
            s.companyName,
            s.contactName,
            s.email,
            s.phoneNumber,
            s.country,
            s.industry,
            Array.isArray(s.sponsorshipInterests) ? s.sponsorshipInterests.join("; ") : s.sponsorshipInterests,
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
        link.setAttribute("download", "sponsors_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { header: 'Company Name', key: 'companyName' },
        { header: 'Contact Person', key: 'contactName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Country', key: 'country' },
        { header: 'Industry', key: 'industry' },
        { header: 'Interests', render: (item) => Array.isArray(item.sponsorshipInterests) ? item.sponsorshipInterests.join(", ") : item.sponsorshipInterests },
        { header: 'Additional Info', key: 'additionalInfo' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sponsors Management</h1>
                    <p className="text-slate-500">Manage potential sponsors</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search sponsors..."
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
                title="All Sponsors"
                columns={columns}
                data={filteredSponsors}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Sponsors;
