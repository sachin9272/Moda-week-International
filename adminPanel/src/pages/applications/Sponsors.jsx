import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        { header: 'Company Name', key: 'companyName' },
        { header: 'Contact Person', key: 'contactName' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phoneNumber' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Sponsors Management</h1>
                <p className="text-slate-500">Manage potential sponsors</p>
            </div>
            <Table
                title="All Sponsors"
                columns={columns}
                data={sponsors}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Sponsors;
