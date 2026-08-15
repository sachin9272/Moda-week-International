import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../config/api";
import { Save, Loader, Type, Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const DonationManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('content');

    // Form Data State
    const [formData, setFormData] = useState({
        hero: {
            title: "",
            subtitle: "",
            description: ""
        },
        mainContent: {
            introText: "",
            powerOfGivingTitle: "",
            powerOfGivingText: ""
        },
        contactInfo: {
            email: ""
        },
        slideshowImages: []
    });

    // Image Upload State
    const [slideshowFiles, setSlideshowFiles] = useState([]);
    const [removedSlideshowImages, setRemovedSlideshowImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/donation-page`);
            if (response.data) {
                setFormData({
                    hero: {
                        title: response.data.hero?.title || "",
                        subtitle: response.data.hero?.subtitle || "",
                        description: response.data.hero?.description || ""
                    },
                    mainContent: {
                        introText: response.data.mainContent?.introText || "",
                        powerOfGivingTitle: response.data.mainContent?.powerOfGivingTitle || "",
                        powerOfGivingText: response.data.mainContent?.powerOfGivingText || ""
                    },
                    contactInfo: {
                        email: response.data.contactInfo?.email || ""
                    },
                    slideshowImages: response.data.slideshowImages || []
                });
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching donation page data:", error);
            toast.error("Failed to load data");
            setLoading(false);
        }
    };

    const handleChange = (section, field, value) => {
        if (section === "contactInfo") {
            setFormData(prev => ({
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSlideshowUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = formData.slideshowImages.length + slideshowFiles.length;
        const remainingSlots = Math.max(0, 10 - totalImages);

        if (remainingSlots === 0) {
            toast.error("Maximum 10 slideshow images allowed.");
            return;
        }

        if (files.length > remainingSlots) {
            toast.error(`Only ${remainingSlots} more slideshow image(s) can be added.`);
        }

        setSlideshowFiles(prev => [...prev, ...files.slice(0, remainingSlots)]);
    };

    const removeSlideshowImage = (index, isExisting) => {
        if (isExisting) {
            const imgToRemove = formData.slideshowImages[index];
            setRemovedSlideshowImages(prev => [...prev, imgToRemove.publicId]);
            const newImages = formData.slideshowImages.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, slideshowImages: newImages }));
        } else {
            setSlideshowFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const dataToSend = new FormData();

        // Append JSON data
        dataToSend.append('data', JSON.stringify({
            hero: formData.hero,
            mainContent: formData.mainContent,
            contactInfo: formData.contactInfo,
            removeSlideshowImages: removedSlideshowImages
        }));

        // Append Files
        slideshowFiles.forEach(file => {
            dataToSend.append('slideshowImages', file);
        });

        try {
            await axios.put(`${baseURL}/api/donation-page`, dataToSend);
            toast.success("Donation page updated successfully!");
            setSlideshowFiles([]);
            setRemovedSlideshowImages([]);
            fetchData();
        } catch (error) {
            console.error("Error updating donation page:", error);
            toast.error("Failed to update page");
        } finally {
            setSaving(false);
        }
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
                        Donation Page Manager
                    </h1>
                    <p className="text-gray-400 mt-2">Manage content and images for the Donation page</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#C7913E] text-black px-6 py-3 rounded hover:bg-[#b07d2f] transition-colors font-medium disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-10 border-b border-[#333]">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors ${activeTab === 'content'
                        ? 'bg-[#1a1a1a] text-[#C7913E] border-t border-x border-[#333]'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
                        }`}
                >
                    <Type size={18} />
                    <span className="font-medium">Text Content</span>
                </button>
                <button
                    onClick={() => setActiveTab('slideshow')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors ${activeTab === 'slideshow'
                        ? 'bg-[#1a1a1a] text-[#C7913E] border-t border-x border-[#333]'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
                        }`}
                >
                    <ImageIcon size={18} />
                    <span className="font-medium">Slideshow Images</span>
                </button>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/* TEXT CONTENT TAB */}
                {activeTab === 'content' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Hero Section */}
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                            <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2">Hero Section</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.hero.title}
                                        onChange={(e) => handleChange("hero", "title", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.hero.subtitle}
                                        onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.hero.description}
                                        onChange={(e) => handleChange("hero", "description", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Main Content Section */}
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                            <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2">Main Content</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Introduction Text</label>
                                    <textarea
                                        rows={6}
                                        value={formData.mainContent.introText}
                                        onChange={(e) => handleChange("mainContent", "introText", e.target.value)}
                                        className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                        placeholder="Enter the main introduction text..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Section Title</label>
                                        <input
                                            type="text"
                                            value={formData.mainContent.powerOfGivingTitle}
                                            onChange={(e) => handleChange("mainContent", "powerOfGivingTitle", e.target.value)}
                                            className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Section Text</label>
                                        <textarea
                                            rows={4}
                                            value={formData.mainContent.powerOfGivingText}
                                            onChange={(e) => handleChange("mainContent", "powerOfGivingText", e.target.value)}
                                            className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                            placeholder="Enter the text for this section..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Section */}
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                            <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2">Contact Information</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={formData.contactInfo.email}
                                    onChange={(e) => handleChange("contactInfo", "email", e.target.value)}
                                    className="w-full bg-[#222] border border-[#444] rounded p-3 text-white focus:outline-none focus:border-[#C7913E]"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* SLIDESHOW TAB */}
                {activeTab === 'slideshow' && (
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333] animate-fade-in">
                        <h2 className="text-xl font-bold text-[#C7913E] mb-6 border-b border-[#333] pb-2">Slideshow Images</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                            {/* New Uploads */}
                            {slideshowFiles.map((file, idx) => (
                                <div key={`new-${idx}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg border-2 border-[#C7913E]">
                                    <img src={URL.createObjectURL(file)} alt="New upload" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeSlideshowImage(idx, false)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-[#C7913E] text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">New Upload</div>
                                </div>
                            ))}

                            {/* Existing Images */}
                            {formData.slideshowImages.map((img, idx) => (
                                <div key={idx} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-[#333] bg-[#0f0f0f]">
                                    <img src={img.url} alt="Existing" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeSlideshowImage(idx, true)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label className="border-2 border-dashed border-[#333] bg-[#0f0f0f] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C7913E] hover:bg-[#1a1a1a] transition-all aspect-[3/4] group">
                                <div className="bg-[#1a1a1a] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                                    <Upload className="text-[#C7913E]" size={24} />
                                </div>
                                <span className="text-sm font-bold text-white group-hover:text-[#C7913E] transition-colors">Add Images</span>
                                <span className="text-xs text-neutral-500 mt-1">Select multiple</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleSlideshowUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
};

export default DonationManager;
