import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Save, Type, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { baseURL } from "../config/api";
import { compressImageIfNeeded } from "../utils/imageCompression";

const defaultSection = {
    title: "",
    content: "",
    image: null,
};

const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const LandingPageManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        modaIntroSection: defaultSection,
    });
    const [newImage, setNewImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/landing-page`);
            setFormData({
                modaIntroSection: {
                    title: response.data.modaIntroSection?.title ?? "",
                    content: response.data.modaIntroSection?.content ?? "",
                    image: response.data.modaIntroSection?.image?.url ? response.data.modaIntroSection.image : null,
                },
            });
            setRemoveImage(false);
            setNewImage(null);
        } catch (error) {
            console.error("Error fetching landing page data:", error);
            toast.error("Failed to load landing page content");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            modaIntroSection: {
                ...prev.modaIntroSection,
                [field]: value,
            },
        }));
    };

    const handleImageChange = async (file) => {
        if (file && !validImageTypes.includes(file.type)) {
            toast.error("Please upload a valid image file");
            return;
        }

        setNewImage(file || null);
        if (file) {
            const optimizedFile = await compressImageIfNeeded(file);
            setNewImage(optimizedFile);
            setRemoveImage(false);
        }
    };

    const clearTextContent = () => {
        setFormData((prev) => ({
            ...prev,
            modaIntroSection: {
                ...prev.modaIntroSection,
                title: "",
                content: "",
            },
        }));
    };

    const markImageForRemoval = () => {
        setNewImage(null);
        setRemoveImage(true);
        setFormData((prev) => ({
            ...prev,
            modaIntroSection: {
                ...prev.modaIntroSection,
                image: null,
            },
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);

        const dataToSend = new FormData();
        dataToSend.append(
            "data",
            JSON.stringify({
                modaIntroSection: {
                    title: formData.modaIntroSection.title,
                    content: formData.modaIntroSection.content,
                    removeImage,
                },
            })
        );

        if (newImage) {
            dataToSend.append("modaIntroImage", newImage);
        }

        try {
            await axios.put(`${baseURL}/api/landing-page`, dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Landing page content updated successfully");
            fetchData();
        } catch (error) {
            console.error("Error updating landing page content:", error);
            toast.error("Failed to update landing page content");
        } finally {
            setSaving(false);
        }
    };

    const renderImagePreview = () => {
        if (newImage) {
            return (
                <div className="relative overflow-hidden rounded-xl border-2 border-[#C7913E] bg-[#0f0f0f]">
                    <img
                        src={URL.createObjectURL(newImage)}
                        alt="New landing section preview"
                        className="h-64 w-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => setNewImage(null)}
                        className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            );
        }

        if (formData.modaIntroSection.image?.url) {
            return (
                <div className="overflow-hidden rounded-xl border border-[#333] bg-[#0f0f0f]">
                    <img
                        src={formData.modaIntroSection.image.url}
                        alt="Current landing section"
                        className="h-64 w-full object-cover"
                    />
                </div>
            );
        }

        return (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#444] bg-[#0f0f0f] text-neutral-500">
                <ImageIcon size={32} className="mb-3 opacity-60" />
                <p>No image uploaded</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C7913E] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111] p-8 pb-32 text-white">
            <Toaster position="top-right" />

            <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="bg-gradient-to-r from-[#C7913E] to-[#E9B161] bg-clip-text text-3xl font-bold text-transparent">
                        Landing Page Manager
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Manage the MODA WEEK INTERNATIONAL content block on the user landing page.
                    </p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 rounded bg-[#C7913E] px-6 py-3 font-medium text-black transition-colors hover:bg-[#b07d2f] disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="rounded-lg border border-[#333] bg-[#1a1a1a] p-6">
                    <div className="mb-6 flex items-center gap-3 border-b border-[#333] pb-3">
                        <Type size={20} className="text-[#C7913E]" />
                        <h2 className="text-xl font-bold text-[#C7913E]">MODA Intro Section</h2>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-400">Heading</label>
                                <input
                                    type="text"
                                    value={formData.modaIntroSection.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    className="w-full rounded border border-[#444] bg-[#222] p-3 text-white focus:border-[#C7913E] focus:outline-none"
                                    placeholder="Enter section heading"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-400">Description</label>
                                <textarea
                                    rows={8}
                                    value={formData.modaIntroSection.content}
                                    onChange={(e) => handleChange("content", e.target.value)}
                                    className="w-full rounded border border-[#444] bg-[#222] p-3 text-white focus:border-[#C7913E] focus:outline-none"
                                    placeholder="Enter the section description"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={clearTextContent}
                                    className="rounded border border-red-500 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                                >
                                    Clear Text
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-3 block text-sm font-medium text-gray-400">Left Image</label>
                                {renderImagePreview()}
                            </div>

                            <div className="relative cursor-pointer rounded-xl border-2 border-dashed border-[#2a2a2a] p-4 text-center transition-colors hover:border-[#C7913E]/50 hover:bg-[#C7913E]/5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                                />
                                <div className="py-4 text-[#C7913E]">
                                    <Upload className="mx-auto mb-2" size={28} />
                                    <span className="text-sm">
                                        {newImage || formData.modaIntroSection.image?.url ? "Click to replace image" : "Click to upload image"}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={markImageForRemoval}
                                disabled={!newImage && !formData.modaIntroSection.image?.url}
                                className="flex items-center gap-2 rounded border border-red-500 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Trash2 size={16} />
                                Delete Image
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LandingPageManager;
