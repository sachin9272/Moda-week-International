import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../config/api";
import { Save, Loader, Type, Image as ImageIcon, Upload, Trash2, Plus, Info, Globe, Heart, BookOpen } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const ManageAboutUs = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('main'); // main, foundation, philosophy, global

    // Form Data State
    const [formData, setFormData] = useState({
        hero: { title: "", subtitle: "" },
        mainSection: { title: "", content: "", image: null },
        foundationSection: { title: "", subtitle: "", content: "", quote: "", image: null },
        philosophySection: { title: "", content: "", image: null },
        globalPlatformSection: { title: "", description: "", cards: [] }
    });

    // Image Upload State (New Files)
    const [newImages, setNewImages] = useState({
        mainSection: null,
        foundationSection: null,
        philosophySection: null,
        globalPlatformCards: {} // Keyed by card index
    });

    // Valid Image Formats
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/about-us`);
            if (response.data) {
                setFormData({
                    hero: {
                        title: response.data.hero?.title || "",
                        subtitle: response.data.hero?.subtitle || ""
                    },
                    mainSection: {
                        title: response.data.mainSection?.title || "",
                        content: response.data.mainSection?.content || "",
                        image: response.data.mainSection?.image || null
                    },
                    foundationSection: {
                        title: response.data.foundationSection?.title || "",
                        subtitle: response.data.foundationSection?.subtitle || "",
                        content: response.data.foundationSection?.content || "",
                        quote: response.data.foundationSection?.quote || "",
                        image: response.data.foundationSection?.image || null
                    },
                    philosophySection: {
                        title: response.data.philosophySection?.title || "",
                        content: response.data.philosophySection?.content || "",
                        image: response.data.philosophySection?.image || null
                    },
                    globalPlatformSection: {
                        title: response.data.globalPlatformSection?.title || "",
                        description: response.data.globalPlatformSection?.description || "",
                        cards: response.data.globalPlatformSection?.cards || []
                    }
                });
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching About Us page data:", error);
            toast.error("Failed to load data");
            setLoading(false);
        }
    };

    const handleTextChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleGlobalPlatformChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            globalPlatformSection: {
                ...prev.globalPlatformSection,
                [field]: value
            }
        }));
    };

    const handleCardChange = (index, field, value) => {
        const newCards = [...formData.globalPlatformSection.cards];
        newCards[index] = { ...newCards[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            globalPlatformSection: {
                ...prev.globalPlatformSection,
                cards: newCards
            }
        }));
    };

    const addCard = () => {
        setFormData(prev => ({
            ...prev,
            globalPlatformSection: {
                ...prev.globalPlatformSection,
                cards: [...prev.globalPlatformSection.cards, { title: "", description: "", image: null }]
            }
        }));
    };

    const removeCard = (index) => {
        const newCards = formData.globalPlatformSection.cards.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            globalPlatformSection: {
                ...prev.globalPlatformSection,
                cards: newCards
            }
        }));

        // Clean up new image state for this card
        const newCardImages = { ...newImages.globalPlatformCards };
        delete newCardImages[index];
        // Re-index remaining images is tricky, so we might need a better ID system.
        // But since we just save and refresh, simple re-indexing or clearing is okayish for now.
        // Actually, deleting from middle creates index mismatch for subsequent new images.
        // Ideally, we'd use robust ID. For now, let's just clear new images for cards on remove or warn user.
        // Simplest: Just clear the specific index. Resaving fixes IDs.
        // But shifted indices in `newCards` won't match keys in `newCardImages`.
        // Fix: Rebuild `newCardImages` or block removal of card with *unsaved* image? 
        // Let's just reset card images state to be safe or accept minor bug for MVP.
        // Better approach: When removing index `i`, move `i+1` to `i`, etc.
        const updatedCardImages = {};
        Object.keys(newImages.globalPlatformCards).forEach(key => {
            const numKey = parseInt(key);
            if (numKey < index) updatedCardImages[numKey] = newImages.globalPlatformCards[numKey];
            if (numKey > index) updatedCardImages[numKey - 1] = newImages.globalPlatformCards[numKey];
        });
        setNewImages(prev => ({ ...prev, globalPlatformCards: updatedCardImages }));
    };

    const handleImageChange = (section, file, cardIndex = null) => {
        if (file && !validImageTypes.includes(file.type)) {
            toast.error("Please upload a valid image (JPEG, PNG, WebP)");
            return;
        }

        if (section === 'globalPlatformCard') {
            setNewImages(prev => ({
                ...prev,
                globalPlatformCards: {
                    ...prev.globalPlatformCards,
                    [cardIndex]: file
                }
            }));
        } else {
            setNewImages(prev => ({
                ...prev,
                [section]: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const dataToSend = new FormData();

        // Append JSON data
        dataToSend.append('data', JSON.stringify({
            hero: formData.hero,
            mainSection: { ...formData.mainSection, image: formData.mainSection?.image?.url ? formData.mainSection.image : undefined },
            foundationSection: { ...formData.foundationSection, image: formData.foundationSection?.image?.url ? formData.foundationSection.image : undefined },
            philosophySection: { ...formData.philosophySection, image: formData.philosophySection?.image?.url ? formData.philosophySection.image : undefined },
            globalPlatformSection: {
                ...formData.globalPlatformSection,
                cards: formData.globalPlatformSection.cards.map(c => ({
                    ...c,
                    image: c.image?.url ? c.image : undefined
                }))
            }
        }));

        // Append New Files
        if (newImages.mainSection) dataToSend.append('mainSectionImage', newImages.mainSection);
        if (newImages.foundationSection) dataToSend.append('foundationSectionImage', newImages.foundationSection);
        if (newImages.philosophySection) dataToSend.append('philosophySectionImage', newImages.philosophySection);

        Object.keys(newImages.globalPlatformCards).forEach(key => {
            if (newImages.globalPlatformCards[key]) {
                dataToSend.append(`globalPlatformCardImage_${key}`, newImages.globalPlatformCards[key]);
            }
        });

        try {
            await axios.put(`${baseURL}/api/about-us`, dataToSend);
            toast.success("About Us page updated successfully!");
            setNewImages({ mainSection: null, foundationSection: null, philosophySection: null, globalPlatformCards: {} });
            fetchData();
        } catch (error) {
            console.error("Error updating About Us page:", error);
            toast.error("Failed to update page");
        } finally {
            setSaving(false);
        }
    };

    // Helper to render image preview
    const renderImagePreview = (currentImage, newFile, onRemoveNew) => {
        if (newFile) {
            return (
                <div className="relative group rounded-xl overflow-hidden shadow-lg border-2 border-[#C7913E] aspect-video w-full max-w-sm">
                    <img src={URL.createObjectURL(newFile)} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={onRemoveNew}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            );
        }
        const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.url;
        if (imageUrl) {
            return (
                <div className="relative group rounded-xl overflow-hidden shadow-lg border border-[#333] aspect-video w-full max-w-sm bg-[#0f0f0f]">
                    <img src={imageUrl} alt="Current" className="w-full h-full object-cover" />
                </div>
            );
        }
        return (
            <div className="bg-[#1a1a1a] rounded-xl border border-dashed border-[#444] aspect-video w-full max-w-sm flex flex-col items-center justify-center text-neutral-500">
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="text-sm">No image uploaded</span>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh] text-white">
            <div className="w-10 h-10 border-4 border-[#C7913E] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-8 bg-[#111] min-h-screen text-white pb-32">
            <Toaster position="top-right" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair bg-gradient-to-r from-[#C7913E] to-[#E9B161] bg-clip-text text-transparent">
                        Manage About Us
                    </h1>
                    <p className="text-gray-400 mt-2">Update content for the About Us page</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#C7913E] text-black px-6 py-3 rounded-xl hover:bg-[#b07d2f] transition-colors font-medium disabled:opacity-50 shadow-lg shadow-[#C7913E]/20"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-[#333]">
                {[
                    { id: 'main', label: 'Main Info', icon: Info },
                    { id: 'foundation', label: 'Foundation', icon: Heart },
                    { id: 'philosophy', label: 'Philosophy', icon: BookOpen },
                    { id: 'global', label: 'Global Platform', icon: Globe }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors ${activeTab === tab.id
                            ? 'bg-[#1a1a1a] text-[#C7913E] border-t border-x border-[#333]'
                            : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">

                {/* HERO & MAIN SECTION */}
                {activeTab === 'main' && (
                    <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                            <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2 flex items-center gap-2"><Type size={20} /> Hero Section</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={formData.hero.title}
                                        onChange={(e) => handleTextChange("hero", "title", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.hero.subtitle}
                                        onChange={(e) => handleTextChange("hero", "subtitle", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Main Content Section */}
                        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                            <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2 flex items-center gap-2"><Info size={20} /> Main Introduction</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Section Title</label>
                                        <input
                                            type="text"
                                            value={formData.mainSection.title}
                                            onChange={(e) => handleTextChange("mainSection", "title", e.target.value)}
                                            className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                        <textarea
                                            rows={8}
                                            value={formData.mainSection.content}
                                            onChange={(e) => handleTextChange("mainSection", "content", e.target.value)}
                                            className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-400">Section Image</label>
                                    {renderImagePreview(formData.mainSection.image, newImages.mainSection, () => setNewImages(prev => ({ ...prev, mainSection: null })))}
                                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg cursor-pointer transition-colors">
                                        <Upload size={18} />
                                        <span>Upload Image</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange('mainSection', e.target.files[0])} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FOUNDATION SECTION */}
                {activeTab === 'foundation' && (
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                        <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2 flex items-center gap-2"><Heart size={20} /> Foundation Section</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.foundationSection.title}
                                        onChange={(e) => handleTextChange("foundationSection", "title", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.foundationSection.subtitle}
                                        onChange={(e) => handleTextChange("foundationSection", "subtitle", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                    <textarea
                                        rows={8}
                                        value={formData.foundationSection.content}
                                        onChange={(e) => handleTextChange("foundationSection", "content", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Quote / Footer</label>
                                    <input
                                        type="text"
                                        value={formData.foundationSection.quote}
                                        onChange={(e) => handleTextChange("foundationSection", "quote", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-400">Founder Image</label>
                                {renderImagePreview(formData.foundationSection.image, newImages.foundationSection, () => setNewImages(prev => ({ ...prev, foundationSection: null })))}
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg cursor-pointer transition-colors">
                                    <Upload size={18} />
                                    <span>Upload Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange('foundationSection', e.target.files[0])} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* PHILOSOPHY SECTION */}
                {activeTab === 'philosophy' && (
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                        <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2 flex items-center gap-2"><BookOpen size={20} /> Our Philosophy</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.philosophySection.title}
                                        onChange={(e) => handleTextChange("philosophySection", "title", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                    <textarea
                                        rows={10}
                                        value={formData.philosophySection.content}
                                        onChange={(e) => handleTextChange("philosophySection", "content", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-400">Section Image</label>
                                {renderImagePreview(formData.philosophySection.image, newImages.philosophySection, () => setNewImages(prev => ({ ...prev, philosophySection: null })))}
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg cursor-pointer transition-colors">
                                    <Upload size={18} />
                                    <span>Upload Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange('philosophySection', e.target.files[0])} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* GLOBAL PLATFORM SECTION */}
                {activeTab === 'global' && (
                    <div className="space-y-8">
                        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                            <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2 flex items-center gap-2"><Globe size={20} /> Global Platform Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.globalPlatformSection.title}
                                        onChange={(e) => handleGlobalPlatformChange("title", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.globalPlatformSection.description}
                                        onChange={(e) => handleGlobalPlatformChange("description", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cards Management */}
                        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                            <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-2">
                                <h2 className="text-xl font-bold text-[#C7913E]">Platform Cards</h2>
                                <button
                                    type="button"
                                    onClick={addCard}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#C7913E]/20 text-[#C7913E] rounded-lg hover:bg-[#C7913E]/30 transition-colors text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    Add Card
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {formData.globalPlatformSection.cards.map((card, index) => (
                                    <div key={index} className="bg-[#222] p-4 rounded-xl border border-[#333] relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeCard(index)}
                                            className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove Card"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="space-y-4 mt-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Card Title</label>
                                                <input
                                                    type="text"
                                                    value={card.title}
                                                    onChange={(e) => handleCardChange(index, "title", e.target.value)}
                                                    className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg p-2 text-sm text-white focus:border-[#C7913E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                <textarea
                                                    rows={3}
                                                    value={card.description}
                                                    onChange={(e) => handleCardChange(index, "description", e.target.value)}
                                                    className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg p-2 text-sm text-white focus:border-[#C7913E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-2">Card Image</label>
                                                {renderImagePreview(
                                                    card.image,
                                                    newImages.globalPlatformCards[index],
                                                    () => setNewImages(prev => {
                                                        const update = { ...prev.globalPlatformCards };
                                                        delete update[index];
                                                        return { ...prev, globalPlatformCards: update };
                                                    })
                                                )}
                                                <label className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded-lg cursor-pointer transition-colors text-xs">
                                                    <Upload size={14} />
                                                    <span>Upload</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange('globalPlatformCard', e.target.files[0], index)} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {formData.globalPlatformSection.cards.length === 0 && (
                                <div className="text-center py-12 text-neutral-500">
                                    No cards added yet. Click "Add Card" to start.
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
};

export default ManageAboutUs;
