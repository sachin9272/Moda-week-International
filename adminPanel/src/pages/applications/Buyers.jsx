import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Buyers = () => {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        { header: 'Company Name', key: 'companyName' },
        { header: 'Contact Name', key: 'contactName' },
        { header: 'Email', key: 'email' },
        { header: 'Country', key: 'country' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Buyers Management</h1>
                <p className="text-slate-500">Manage registered buyer applications</p>
            </div>
            <Table
                title="All Buyers"
                columns={columns}
                data={buyers}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Buyers;
