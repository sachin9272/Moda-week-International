import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Loader, Plus, Image } from 'lucide-react';
import { baseURL } from '../config/api';

const PartnerManager = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newName, setNewName] = useState('');
    const [newLogo, setNewLogo] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [deleting, setDeleting] = useState(false);

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
        if (!newLogo) return;

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
                document.getElementById('logoInput').value = '';
            }
        } catch (error) {
            console.error('Error adding partner:', error);
        } finally {
            setUploading(false);
        }
    };

    const openDeleteConfirm = (partner) => {
        setDeleteConfirm({ show: true, id: partner._id, name: partner.name });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, id: null, name: '' });
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);

        try {
            const response = await fetch(`${baseURL}/api/partners/${deleteConfirm.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPartners(partners.filter(p => p._id !== deleteConfirm.id));
                closeDeleteConfirm();
            }
        } catch (error) {
            console.error('Error deleting partner:', error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-[#C7913E]" size={40} />
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Promotional Partners</h1>
                <p className="text-neutral-500">Manage partner logos displayed in the footer</p>
            </div>

            {/* Add New Partner */}
            <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-[#2a2a2a] mb-8 max-w-4xl">
                <h2 className="text-lg font-semibold text-white mb-4">Add New Partner</h2>
                <form onSubmit={handleAddPartner} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Partner Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Brand Name"
                            className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Logo Image</label>
                        <input
                            id="logoInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-neutral-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#C7913E]/20 file:text-[#C7913E]
                                hover:file:bg-[#C7913E]/30 file:cursor-pointer"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading || !newLogo}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7913E]/20"
                    >
                        {uploading ? <Loader className="animate-spin" size={20} /> : <Plus size={20} />}
                        Add
                    </button>
                </form>
            </div>

            {/* Partners List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {partners.map(partner => (
                    <div key={partner._id} className="bg-[#1a1a1a] p-4 rounded-xl shadow-lg border border-[#2a2a2a] relative group hover:border-[#3a3a3a] transition-all">
                        <div className="h-32 flex items-center justify-center bg-[#0f0f0f] rounded-lg mb-3 p-4 border border-[#2a2a2a]">
                            <img
                                src={partner.image?.url}
                                alt={partner.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-white">{partner.name}</span>
                            <button
                                onClick={() => openDeleteConfirm(partner)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {partners.length === 0 && (
                    <div className="col-span-full bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4">
                            <Image size={28} className="text-neutral-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No partners yet</h3>
                        <p className="text-neutral-500">Add your first partner to get started.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDeleteConfirm}>
                    <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Partner?</h3>
                            <p className="text-neutral-400 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-white font-medium text-center truncate px-4 mb-6">
                                "{deleteConfirm.name}"
                            </p>
                            <p className="text-xs text-neutral-500 text-center mb-6">
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader size={18} className="animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerManager;
