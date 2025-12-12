import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Designers = () => {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        { header: 'Brand Name', key: 'brandName' },
        { header: 'Designer Name', key: 'designerName' },
        { header: 'Email', key: 'email' },
        { header: 'Category', key: 'collectionType' }, // Assuming collectionType exists or similar
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Designers Management</h1>
                <p className="text-slate-500">Review and manage designer applications</p>
            </div>
            <Table
                title="All Designers"
                columns={columns}
                data={designers}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Designers;
