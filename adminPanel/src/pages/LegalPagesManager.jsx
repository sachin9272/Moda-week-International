import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Loader, Scale, Check } from 'lucide-react';
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
    const [saved, setSaved] = useState(false);

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
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const response = await fetch(`${baseURL}/api/legal-pages/${selectedPage}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Error saving page:', error);
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
                <h1 className="text-2xl font-bold text-white">Legal Pages Management</h1>
                <p className="text-neutral-500">Manage content for legal and policy documents.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar / Page Selector */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {PAGES.map(page => (
                        <button
                            key={page.id}
                            onClick={() => setSelectedPage(page.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${selectedPage === page.id
                                ? 'bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white shadow-lg shadow-[#C7913E]/20'
                                : 'bg-[#1a1a1a] text-neutral-400 hover:bg-[#252525] hover:text-white border border-[#2a2a2a]'
                                }`}
                        >
                            <Scale size={18} />
                            <span className="font-medium text-sm">{page.label}</span>
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-lg p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="animate-spin text-[#C7913E]" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Page Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C7913E] focus:border-[#C7913E] hover:border-[#3a3a3a] transition-all"
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div className="bg-[#0f0f0f] rounded-xl border border-[#2a2a2a] overflow-hidden">
                                <label className="block text-sm font-medium text-neutral-300 mb-1 px-4 pt-4">Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    className="h-96 mb-12 [&_.ql-toolbar]:!bg-[#1a1a1a] [&_.ql-toolbar]:!border-[#2a2a2a] [&_.ql-container]:!border-[#2a2a2a] [&_.ql-editor]:!bg-[#0f0f0f] [&_.ql-editor]:!text-white [&_.ql-picker-label]:!text-neutral-400 [&_.ql-stroke]:!stroke-neutral-400 [&_.ql-fill]:!fill-neutral-400"
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#7A5020] hover:to-[#B38135] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7913E]/20"
                                >
                                    {saving ? (
                                        <Loader className="animate-spin" size={18} />
                                    ) : saved ? (
                                        <Check size={18} />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {saved ? 'Saved!' : 'Save Changes'}
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
