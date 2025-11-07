// src/pages/AddNews.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const AddNews = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    // image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Politics", "Technology", "Health", "Sports", "Entertainment"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("date", new Date().toISOString().split("T")[0]);
    // if (formData.image) data.append("image", formData.image);
    console.log("Dat--->", data);
    try {
      await axios.post("/api/admin/news/create", data);

      alert("Article published successfully!");
      navigate("/dashboard/news");
    } catch (error) {
      console.error("Error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to publish";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-700 hover:text-slate-900 group"
          >
            <div className="p-2.5 bg-white rounded-full shadow-lg border border-slate-200 group-hover:shadow-xl">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium text-sm hidden sm:inline">Back</span>
          </button>

          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-8 py-6 pt-24 text-white">
            <h2 className="text-3xl font-bold">Create New Article</h2>
            <p className="text-blue-100 mt-2">Share your voice with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                placeholder="Enter a captivating headline..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Start writing your masterpiece..."
                  className="bg-white"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>

            {/* Image Upload */}
            {/* <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Featured Image
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-10 hover:border-indigo-400 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center"
                >
                  <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-slate-600">Click to upload</p>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {preview && (
                  <div className="relative group">
                    <img src={preview} alt="Preview" className="w-full h-56 object-cover rounded-xl shadow-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div> */}

            {/* Buttons */}
            <div className="flex gap-4 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-70 transition-all duration-200"
              >
                {loading ? "Publishing..." : "Publish Article"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNews;