// src/pages/EditNews.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Fashion', 'Lifestyle', 'Business', 'Technology', 'Entertainment'];

  // Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/news/get/${id}`);
        const article = res.data.data;

        // Critical: Set formData AND preview in one go
        setFormData({
          title: article.title || '',
          content: article.content || '',
          category: article.category || '', // This will now stick!
          image: null,
        });

        // Set preview URL directly from server
        setPreview(article.image ? article.image : null);

      } catch (err) {
        setError('Failed to load article. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

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
      alert('Please fill all required fields.');
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    if (formData.image) data.append('image', formData.image);

    try {
      await axios.post(`/api/news/update/${id}`, data);
      alert('Article updated successfully!');
      navigate('/dashboard/news');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium text-lg">{error}</p>
          <button onClick={() => navigate('/dashboard/news')} className="mt-4 text-indigo-600 hover:underline">
            ← Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">

          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-700 hover:text-slate-900 group"
          >
            <div className="p-2.5 bg-white rounded-full shadow-lg border border-slate-200 group-hover:shadow-xl">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium text-sm hidden sm:inline">Back</span>
          </button>

          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-8 py-6 pt-24 text-white">
            <h2 className="text-3xl font-bold">Edit Article</h2>
            <p className="text-blue-100 mt-2">Refine your story with precision</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  modules={quillModules}
                  className="bg-white"
                />
              </div>
            </div>

            <div>
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
                  <p className="text-sm text-slate-600">Change image</p>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {preview && (
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-56 object-cover rounded-xl shadow-lg"
                    />
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
            </div>

            <div className="flex gap-4 pt-8">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Update Article'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .ql-editor { min-height: 300px; padding: 1.5rem; }
      `}</style>
    </div>
  );
};

export default EditNews;
