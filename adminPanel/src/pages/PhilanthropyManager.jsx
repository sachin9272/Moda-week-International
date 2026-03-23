import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Upload, X, Save, Plus, Trash2, Layout, Type, Image as ImageIcon, Check } from 'lucide-react';
import { baseURL } from '../config/api';

const PhilanthropyManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // general, sections, slideshow

    const [data, setData] = useState({
        header: { title: '', subtitleLine1: '', subtitleLine2: '' },
        introduction: { leadText: '', column1: '', column2: '' },
        philosophy: { title: '', text: '', authorName: '', authorTitle: '' },
        sections: [],
        slideshowImages: []
    });

    const [slideshowFiles, setSlideshowFiles] = useState([]);
    const [sectionFiles, setSectionFiles] = useState({}); // { 'sectionID_image': File, 'sectionID_video': File }
    const [removedSlideshowImages, setRemovedSlideshowImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/philanthropy`);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load philanthropy data");
            setLoading(false);
        }
    };

    const handleTextChange = (section, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSectionChange = (index, field, value) => {
        const newSections = [...data.sections];
        newSections[index][field] = value;
        setData(prev => ({ ...prev, sections: newSections }));
    };

    const handleDisplayFileChange = (e, sectionId, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const objectUrl = URL.createObjectURL(file);

        // Update local preview state only
        const newSections = data.sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    [type]: { ...s[type], url: objectUrl, isPreview: true } // Mark as preview
                };
            }
            return s;
        });
        setData(prev => ({ ...prev, sections: newSections }));

        // Store file for upload
        setSectionFiles(prev => ({
            ...prev,
            [`section${type === 'image' ? 'Image' : 'Video'}_${sectionId}`]: file
        }));
    };

    const handleSlideshowUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = data.slideshowImages.length + slideshowFiles.length;
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
            const imgToRemove = data.slideshowImages[index];
            setRemovedSlideshowImages(prev => [...prev, imgToRemove.publicId]);
            const newImages = data.slideshowImages.filter((_, i) => i !== index);
            setData(prev => ({ ...prev, slideshowImages: newImages }));
        } else {
            setSlideshowFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();

        // Append main data as JSON string
        const dataToSend = {
            header: data.header,
            introduction: data.introduction,
            philosophy: data.philosophy,
            sections: data.sections,
            removeSlideshowImages: removedSlideshowImages
        };
        formData.append('data', JSON.stringify(dataToSend));

        // Append Section Files
        Object.keys(sectionFiles).forEach(key => {
            formData.append(key, sectionFiles[key]);
        });

        // Append Slideshow Files
        slideshowFiles.forEach(file => {
            formData.append('slideshowImages', file);
        });

        try {
            await axios.post(`${baseURL}/api/philanthropy/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Page updated successfully!");
            setSlideshowFiles([]); // Clear uploaded files list
            setSectionFiles({});
            setRemovedSlideshowImages([]);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error updating:", error);
            toast.error("Failed to update page");
        } finally {
            setSaving(false);
        }
    };

    const InputLabel = ({ children }) => (
        <label className="block text-[#C7913E] text-sm font-medium mb-2 uppercase tracking-wider">{children}</label>
    );

    const StyledInput = ({ ...props }) => (
        <input
            {...props}
            className="w-full bg-[#0f0f0f] text-white rounded-lg p-3 border border-[#2a2a2a] focus:border-[#C7913E] focus:ring-1 focus:ring-[#C7913E] outline-none transition-all placeholder:text-neutral-600"
        />
    );

    const StyledTextArea = ({ ...props }) => (
        <textarea
            {...props}
            className="w-full bg-[#0f0f0f] text-white rounded-lg p-3 border border-[#2a2a2a] focus:border-[#C7913E] focus:ring-1 focus:ring-[#C7913E] outline-none transition-all placeholder:text-neutral-600"
        />
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-[#C7913E] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-8 text-white min-h-screen pb-32">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8C5D25] to-[#C7913E] bg-clip-text text-transparent mb-2">Philanthropy Manager</h1>
                    <p className="text-neutral-400">Manage content for the philanthropy page</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-[#C7913E]/20"
                >
                    {saving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-10 border-b border-[#2a2a2a] overflow-x-auto pb-1">
                {[
                    { id: 'general', label: 'General Content', icon: Type },
                    { id: 'sections', label: 'Impact Sections', icon: Layout },
                    { id: 'slideshow', label: 'Slideshow', icon: ImageIcon },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-t-xl transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[#1a1a1a] text-[#C7913E] border-t border-x border-[#2a2a2a] relative -mb-[1px] border-b-black'
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#1a1a1a]/50'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8C5D25] to-[#C7913E]" />
                        )}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">

                {/* GENERAL CONTENT TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1 h-6 bg-[#C7913E] rounded-full"></span>
                                Header Section
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <InputLabel>Main Title</InputLabel>
                                    <StyledInput
                                        type="text"
                                        value={data.header.title}
                                        onChange={(e) => handleTextChange('header', 'title', e.target.value)}
                                        placeholder="PHILANTHROPY"
                                    />
                                </div>
                                <div>
                                    <InputLabel>Subtitle Line 1</InputLabel>
                                    <StyledInput
                                        type="text"
                                        value={data.header.subtitleLine1}
                                        onChange={(e) => handleTextChange('header', 'subtitleLine1', e.target.value)}
                                        placeholder="Back to the Community"
                                    />
                                </div>
                                <div>
                                    <InputLabel>Subtitle Line 2</InputLabel>
                                    <StyledInput
                                        type="text"
                                        value={data.header.subtitleLine2}
                                        onChange={(e) => handleTextChange('header', 'subtitleLine2', e.target.value)}
                                        placeholder="Fashion With Purpose"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Introduction Section */}
                        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1 h-6 bg-[#C7913E] rounded-full"></span>
                                Introduction
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <InputLabel>Lead Text (Top Center)</InputLabel>
                                    <StyledTextArea
                                        value={data.introduction.leadText}
                                        onChange={(e) => handleTextChange('introduction', 'leadText', e.target.value)}
                                        rows="3"
                                        placeholder="Enter the main lead statement..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <InputLabel>Left Column Text</InputLabel>
                                        <StyledTextArea
                                            value={data.introduction.column1}
                                            onChange={(e) => handleTextChange('introduction', 'column1', e.target.value)}
                                            rows="6"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel>Right Column Text</InputLabel>
                                        <StyledTextArea
                                            value={data.introduction.column2}
                                            onChange={(e) => handleTextChange('introduction', 'column2', e.target.value)}
                                            rows="6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Philosophy Section */}
                        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1 h-6 bg-[#C7913E] rounded-full"></span>
                                Philosophy Quote
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                                <div>
                                    <InputLabel>Section Title</InputLabel>
                                    <StyledInput
                                        type="text"
                                        value={data.philosophy.title}
                                        onChange={(e) => handleTextChange('philosophy', 'title', e.target.value)}
                                        placeholder="Our Philanthropic Philosophy"
                                    />
                                </div>
                                <div>
                                    <InputLabel>Main Quote Text</InputLabel>
                                    <StyledTextArea
                                        value={data.philosophy.text}
                                        onChange={(e) => handleTextChange('philosophy', 'text', e.target.value)}
                                        rows="2"
                                        placeholder="Quote text..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <InputLabel>Author Name</InputLabel>
                                    <StyledInput
                                        type="text"
                                        value={data.philosophy.authorName}
                                        onChange={(e) => handleTextChange('philosophy', 'authorName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel>Author Title</InputLabel>
                                    <StyledInput
                                        type="text"
                                        value={data.philosophy.authorTitle}
                                        onChange={(e) => handleTextChange('philosophy', 'authorTitle', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTIONS TAB */}
                {activeTab === 'sections' && (
                    <div className="space-y-8">
                        {data.sections.map((section, index) => (
                            <div key={section.id} className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
                                <div className="flex justify-between items-center mb-6 border-b border-[#2a2a2a] pb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        <span className="w-1 h-6 bg-[#C7913E] rounded-full"></span>
                                        {section.title || `Section ${index + 1}`}
                                    </h2>
                                    <span className="text-xs bg-[#2a2a2a] px-3 py-1 rounded-full text-[#C7913E] font-mono border border-[#C7913E]/20 uppercase tracking-widest">{section.id}</span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel>Title</InputLabel>
                                            <StyledInput
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel>Description</InputLabel>
                                            <StyledTextArea
                                                value={section.description}
                                                onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                                                rows="8"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel>Small Tagline (Bottom)</InputLabel>
                                            <StyledInput
                                                type="text"
                                                value={section.tagline}
                                                onChange={(e) => handleSectionChange(index, 'tagline', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Image Upload */}
                                        <div>
                                            <InputLabel>Display Image</InputLabel>
                                            <div className="border rounded-xl p-6 text-center transition-all bg-[#0f0f0f] border-[#2a2a2a] hover:border-[#C7913E]/50 group">
                                                {section.image?.url ? (
                                                    <div className="relative mb-4 group-hover:opacity-90 transition-opacity">
                                                        <img src={section.image.url} alt="Preview" className="h-[250px] w-full object-cover rounded-lg shadow-lg" />
                                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white">Current Image</div>
                                                    </div>
                                                ) : (
                                                    <div className="h-[250px] w-full bg-[#1a1a1a] rounded-lg mb-4 flex items-center justify-center text-neutral-600 border border-dashed border-[#333]">
                                                        <span>No image set</span>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleDisplayFileChange(e, section.id, 'image')}
                                                    className="hidden"
                                                    id={`img-${section.id}`}
                                                />
                                                <label htmlFor={`img-${section.id}`} className="cursor-pointer bg-[#2a2a2a] hover:bg-[#333] text-white border border-[#333] px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors">
                                                    <Upload size={14} className="text-[#C7913E]" />
                                                    <span>Change Image</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Video Upload (Only for Events usually) */}
                                        {section.id === 'events' && (
                                            <div>
                                                <InputLabel>Display Video (Replaces Image)</InputLabel>
                                                <div className="border rounded-xl p-6 text-center transition-all bg-[#0f0f0f] border-[#2a2a2a] hover:border-[#C7913E]/50 group">
                                                    {section.video?.url ? (
                                                        <div className="relative mb-4 group-hover:opacity-90 transition-opacity">
                                                            <video src={section.video.url} className="h-[250px] w-full object-cover rounded-lg shadow-lg" controls />
                                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white">Current Video</div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-[250px] w-full bg-[#1a1a1a] rounded-lg mb-4 flex items-center justify-center text-neutral-600 border border-dashed border-[#333]">
                                                            <span>No video set</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        onChange={(e) => handleDisplayFileChange(e, section.id, 'video')}
                                                        className="hidden"
                                                        id={`vid-${section.id}`}
                                                    />
                                                    <label htmlFor={`vid-${section.id}`} className="cursor-pointer bg-[#2a2a2a] hover:bg-[#333] text-white border border-[#333] px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors">
                                                        <Upload size={14} className="text-[#C7913E]" />
                                                        <span>Change Video</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* SLIDESHOW TAB */}
                {activeTab === 'slideshow' && (
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1 h-6 bg-[#C7913E] rounded-full"></span>
                            Slideshow Images
                        </h2>

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
                            {data.slideshowImages.map((img, idx) => (
                                <div key={idx} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-[#2a2a2a] bg-[#0f0f0f]">
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
                            <label className="border-2 border-dashed border-[#2a2a2a] bg-[#0f0f0f] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C7913E] hover:bg-[#1a1a1a] transition-all aspect-[3/4] group">
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

                {/* Bottom Save Button */}
                <div className="flex justify-end pt-8 border-t border-[#2a2a2a]">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#8C5D25] to-[#C7913E] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-[#C7913E]/20"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PhilanthropyManager;
