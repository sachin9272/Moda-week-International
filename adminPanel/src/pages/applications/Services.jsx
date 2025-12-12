import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/ui/Table';
import { baseURL } from '../../config/api';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        { header: 'Full Name', key: 'fullName' },
        { header: 'Service Type', key: 'serviceType' }, // Assuming serviceType exists
        { header: 'Email', key: 'email' },
        { header: 'Country', key: 'country' },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Service Inquiries</h1>
                <p className="text-slate-500">Track and manage service requests</p>
            </div>
            <Table
                title="Inquiries List"
                columns={columns}
                data={services}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Services;
