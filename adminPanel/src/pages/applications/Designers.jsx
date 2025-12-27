import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Designers = () => {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchDesigners = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/designers`);
            if (res.data.success) {
                setDesigners(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching designers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigners();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this designer application?")) {
            try {
                await axios.delete(`${baseURL}/api/admin/designers/${id}`);
                setDesigners(designers.filter(d => d._id !== id));
            } catch (error) {
                alert("Failed to delete designer");
            }
        }
    };

    const filteredDesigners = designers.filter(designer =>
        designer.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designer.designerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const headers = ["Brand Name", "Designer Name", "Email", "Phone", "Country", "Category", "Experience", "Website", "Portfolio", "Description", "Date"];
        const csvData = filteredDesigners.map(d => [
            d.brandName,
            d.designerName,
            d.email,
            d.phoneNumber,
            d.country,
            d.designCategory,
            d.yearsOfExperience,
            d.website,
            d.portfolioLink,
            `"${d.brandDescription?.replace(/"/g, '""') || ''}"`,
            new Date(d.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "designers_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { header: 'Brand Name', key: 'brandName' },
        { header: 'Designer Name', key: 'designerName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Category', key: 'designCategory' },
        { header: 'Experience', key: 'yearsOfExperience' },
        { header: 'Website', key: 'website' },
        { header: 'Description', key: 'brandDescription' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Designers Management</h1>
                    <p className="text-slate-500">Review and manage designer applications</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search designers..."
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
                title="All Designers"
                columns={columns}
                data={filteredDesigners}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Designers;
