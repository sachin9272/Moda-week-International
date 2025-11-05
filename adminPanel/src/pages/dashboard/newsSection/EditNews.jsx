import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditNews = ({ existingNews, onSave }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: existingNews?.title || "",
    content: existingNews?.content || "",
    category: existingNews?.category || "",
    image: existingNews?.image || null,
  });

  const [preview, setPreview] = useState(existingNews?.image || null);
  const [loading, setLoading] = useState(false);

  const categories = ["Politics", "Technology", "Health", "Sports", "Entertainment"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Example: Upload to backend or Cloudinary
      // const formDataToSend = new FormData();
      // Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
      // await axios.post("/api/news/update", formDataToSend);

      const updatedNews = {
        id: existingNews?.id || Date.now(),
        ...formData,
        date: new Date().toISOString().split("T")[0],
      };

      onSave?.(updatedNews);
      alert("News article saved successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="rounded-lg shadow-xl max-w-2xl w-full bg-white overflow-y-auto mx-auto my-6">
      <div className="sticky top-0 border-b border-gray-200 p-6 flex justify-between items-center bg-white">
        <h2 className="text-2xl font-semibold text-gray-900">
          {existingNews ? "Edit Article" : "Add New Article"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter news title"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Enter news content"
            className={`${inputStyle} h-32`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={inputStyle}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className={inputStyle}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-40 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
        >
          {loading ? "Saving..." : existingNews ? "Save Changes" : "Add Article"}
        </button>
      </form>
    </div>
  );
};

export default EditNews;
