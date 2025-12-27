import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Buyers = () => {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchBuyers = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/buyers`);
            if (res.data.success) {
                setBuyers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching buyers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this buyer?")) {
            try {
                await axios.delete(`${baseURL}/api/admin/buyers/${id}`);
                setBuyers(buyers.filter(b => b._id !== id));
            } catch (error) {
                alert("Failed to delete buyer");
            }
        }
    };

    const filteredBuyers = buyers.filter(buyer =>
        buyer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const headers = ["Company Name", "Contact Name", "Email", "Phone", "Country", "Business Type", "Product Interests", "Additional Info", "Date"];
        const csvData = filteredBuyers.map(buyer => [
            buyer.companyName,
            buyer.contactName,
            buyer.email,
            buyer.phoneNumber,
            buyer.country,
            buyer.businessType,
            buyer.productInterests,
            `"${buyer.additionalInfo?.replace(/"/g, '""') || ''}"`, // Handle quotes in text
            new Date(buyer.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "buyers_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { header: 'Company Name', key: 'companyName' },
        { header: 'Contact Name', key: 'contactName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Country', key: 'country' },
        { header: 'Business Type', key: 'businessType' },
        { header: 'Product Interests', key: 'productInterests' },
        { header: 'Additional Info', key: 'additionalInfo' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Buyers Management</h1>
                    <p className="text-slate-500">Manage registered buyer applications</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search buyers..."
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
                title="All Buyers"
                columns={columns}
                data={filteredBuyers}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Buyers;
