import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Loader, Scale } from 'lucide-react';
import { baseURL } from '../config/api';

const PAGES = [
    { id: 'code-of-conduct', label: 'Code of Conduct' },
    { id: 'data-protection', label: 'Data Protection (GDPR)' },
    { id: 'media-release-policy', label: 'Media Release Policy' },
    { id: 'privacy-policy', label: 'Privacy Policy' },
    { id: 'terms-conditions', label: 'Terms & Conditions' }
];

const LegalPagesManager = () => {
    const [selectedPage, setSelectedPage] = useState(PAGES[0].id);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPage(selectedPage);
    }, [selectedPage]);

    const fetchPage = async (type) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseURL}/api/legal-pages/${type}`);
            const data = await response.json();
            setTitle(data.title || PAGES.find(p => p.id === type).label);
            setContent(data.content || '');
        } catch (error) {
            console.error('Error fetching page:', error);
            // alert('Error fetching page content');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${baseURL}/api/legal-pages/${selectedPage}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                alert('Page updated successfully!');
            } else {
                alert('Failed to update page.');
            }
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Error saving page.');
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-800">Legal Pages Management</h1>
                <p className="text-slate-500">Manage content for legal and policy documents.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar / Page Selector */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {PAGES.map(page => (
                        <button
                            key={page.id}
                            onClick={() => setSelectedPage(page.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${selectedPage === page.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                                }`}
                        >
                            <Scale size={18} />
                            <span className="font-medium text-sm">{page.label}</span>
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="animate-spin text-slate-400" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div className="bg-slate-50 rounded-lg">
                                <label className="block text-sm font-medium text-slate-700 mb-1 px-1">Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    className="h-96 mb-12 bg-white rounded-lg"
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LegalPagesManager;
