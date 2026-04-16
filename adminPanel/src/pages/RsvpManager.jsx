import React, { useEffect, useState } from "react";
import axios from "axios";
import { Image as ImageIcon, Loader, Save, Trash2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { baseURL } from "../config/api";
import { compressImageIfNeeded } from "../utils/imageCompression";

const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const imageCards = [
  {
    key: "galaImage",
    title: "Private VIP Gala Dinner",
    description: "This image appears on the first RSVP experience card.",
  },
  {
    key: "seatingImage",
    title: "Exclusive VIP Fashion Show Seating",
    description: "This image appears on the second RSVP experience card.",
  },
];

export default function RsvpManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState({
    galaImage: null,
    seatingImage: null,
  });
  const [newImages, setNewImages] = useState({
    galaImage: null,
    seatingImage: null,
  });
  const [removeImages, setRemoveImages] = useState({
    galaImage: false,
    seatingImage: false,
  });

  useEffect(() => {
    fetchRsvpContent();
  }, []);

  const fetchRsvpContent = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/rsvp-page`);
      setImages({
        galaImage: response.data.galaImage?.url ? response.data.galaImage : null,
        seatingImage: response.data.seatingImage?.url ? response.data.seatingImage : null,
      });
      setNewImages({
        galaImage: null,
        seatingImage: null,
      });
      setRemoveImages({
        galaImage: false,
        seatingImage: false,
      });
    } catch (error) {
      console.error("Error fetching RSVP page data:", error);
      toast.error("Failed to load RSVP page content");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (key, file) => {
    if (file && !validImageTypes.includes(file.type)) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (!file) {
      setNewImages((prev) => ({ ...prev, [key]: null }));
      return;
    }

    const optimizedFile = await compressImageIfNeeded(file);
    setNewImages((prev) => ({ ...prev, [key]: optimizedFile }));
    setRemoveImages((prev) => ({ ...prev, [key]: false }));
  };

  const handleDeleteImage = (key) => {
    setNewImages((prev) => ({ ...prev, [key]: null }));
    setRemoveImages((prev) => ({ ...prev, [key]: true }));
    setImages((prev) => ({ ...prev, [key]: null }));
  };

  const handleClearReplacement = (key) => {
    setNewImages((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const dataToSend = new FormData();
    dataToSend.append("removeGalaImage", String(removeImages.galaImage));
    dataToSend.append("removeSeatingImage", String(removeImages.seatingImage));

    if (newImages.galaImage) {
      dataToSend.append("galaImage", newImages.galaImage);
    }
    if (newImages.seatingImage) {
      dataToSend.append("seatingImage", newImages.seatingImage);
    }

    try {
      await axios.put(`${baseURL}/api/rsvp-page`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("RSVP page images updated successfully");
      fetchRsvpContent();
    } catch (error) {
      console.error("Error updating RSVP page:", error);
      toast.error("Failed to update RSVP page");
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = (key) => {
    const newImage = newImages[key];
    const currentImage = images[key];

    if (newImage) {
      return (
        <div className="relative overflow-hidden rounded-xl border-2 border-[#C7913E] bg-[#0f0f0f]">
          <img
            src={URL.createObjectURL(newImage)}
            alt={`${key} preview`}
            className="h-64 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => handleClearReplacement(key)}
            className="absolute right-3 top-3 rounded-full bg-black/80 p-2 text-white transition-colors hover:bg-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }

    if (currentImage?.url) {
      return (
        <div className="overflow-hidden rounded-xl border border-[#333] bg-[#0f0f0f]">
          <img
            src={currentImage.url}
            alt={`${key} current`}
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
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-[#C7913E] to-[#E9B161] bg-clip-text text-3xl font-bold text-transparent">
            RSVP Page Manager
          </h1>
          <p className="mt-2 text-gray-400">
            Update the two private-experience images shown on the user RSVP page.
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

      <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-2">
        {imageCards.map((card) => (
          <div key={card.key} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#C7913E]">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-400">{card.description}</p>
            </div>

            <div className="space-y-5">
              {renderPreview(card.key)}

              {(images[card.key]?.url || newImages[card.key]) && (
                <button
                  type="button"
                  onClick={() => handleDeleteImage(card.key)}
                  className="inline-flex items-center gap-2 rounded border border-red-500 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Delete Existing Image
                </button>
              )}

              <div className="relative cursor-pointer rounded-xl border-2 border-dashed border-[#2a2a2a] p-4 text-center transition-colors hover:border-[#C7913E]/50 hover:bg-[#C7913E]/5">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => handleImageChange(card.key, e.target.files?.[0] || null)}
                />
                <div className="py-4 text-[#C7913E]">
                  <Upload className="mx-auto mb-2" size={28} />
                  <span className="text-sm">
                    {newImages[card.key] || images[card.key]?.url ? "Click to replace image" : "Click to upload image"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}
