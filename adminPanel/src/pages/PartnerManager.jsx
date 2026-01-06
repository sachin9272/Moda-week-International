import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Loader, Plus } from 'lucide-react';
import { baseURL } from '../config/api';

const PartnerManager = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newName, setNewName] = useState('');
    const [newLogo, setNewLogo] = useState(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await fetch(`${baseURL}/api/partners`);
            const data = await response.json();
            setPartners(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching partners:', error);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewLogo(e.target.files[0]);
        }
    };

    const handleAddPartner = async (e) => {
        e.preventDefault();
        if (!newLogo) return alert("Please select a logo");

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('name', newName);
            formData.append('image', newLogo);

            const response = await fetch(`${baseURL}/api/partners`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const newPartner = await response.json();
                setPartners([newPartner, ...partners]);
                setNewName('');
                setNewLogo(null);
                // Reset file input
                document.getElementById('logoInput').value = '';
                alert('Partner added successfully!');
            } else {
                alert('Failed to add partner.');
            }
        } catch (error) {
            console.error('Error adding partner:', error);
            alert('Error adding partner.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this partner?")) return;

        try {
            const response = await fetch(`${baseURL}/api/partners/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPartners(partners.filter(p => p._id !== id));
            } else {
                alert('Failed to delete partner.');
            }
        } catch (error) {
            console.error('Error deleting partner:', error);
            alert('Error deleting partner.');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader className="animate-spin" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Promotional Partners</h1>
                <p className="text-slate-500">Manage partner logos displayed in the footer</p>
            </div>

            {/* Add New Partner */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8 max-w-4xl">
                <h2 className="text-lg font-semibold mb-4">Add New Partner</h2>
                <form onSubmit={handleAddPartner} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Brand Name"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Logo Image</label>
                        <input
                            id="logoInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`flex items-center gap-2 px-6 py-2 bg-[#C7913E] text-white rounded-lg hover:bg-[#b08036] transition-colors ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? <Loader className="animate-spin" size={20} /> : <Plus size={20} />}
                        Add
                    </button>
                </form>
            </div>

            {/* Partners List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {partners.map(partner => (
                    <div key={partner._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative group">
                        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg mb-3 p-4">
                            <img
                                src={partner.image?.url}
                                alt={partner.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">{partner.name}</span>
                            <button
                                onClick={() => handleDelete(partner._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {partners.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-400">
                        No partners added yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerManager;
