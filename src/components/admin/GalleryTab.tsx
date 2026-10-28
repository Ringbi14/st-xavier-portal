"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Camera,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
} from "lucide-react";
import CloudinaryUploadField from "./CloudinaryUploadField";

function AdminShowcaseImage({ imageUrl, title }: { imageUrl?: string; title: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanUrl = imageUrl?.trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  if (cleanUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cleanUrl}
        alt={title}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 select-none">
      <Camera className="w-6 h-6 text-slate-300 mb-1" />
      <span className="text-[10px] font-semibold text-slate-400">
        {cleanUrl ? "Image Unavailable" : "No Photo"}
      </span>
    </div>
  );
}

export default function GalleryTab() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rural Camp");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Rural Camp");
    setAcademicYear("2025-2026");
    setLocation("");
    setSummary("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setCategory(item.category || "Rural Camp");
    setAcademicYear(item.academicYear || item.year || "2025-2026");
    setLocation(item.location || "");
    setSummary(item.impactSummary || item.description || "");
    setImageUrl(item.imageUrl || item.photoUrl || item.publicUrl || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !summary.trim()) {
      alert("Please provide the initiative title, summary, and cover image URL.");
      return;
    }
    setIsSubmitting(true);

    try {
      let cleanUrl = imageUrl.trim();
      if (cleanUrl.startsWith("http://")) {
        cleanUrl = cleanUrl.replace("http://", "https://");
      }

      const payload = {
        title: title.trim(),
        category,
        academicYear: academicYear.trim(),
        year: academicYear.trim(),
        location: location.trim() || "Senapati District, Manipur",
        impactSummary: summary.trim(),
        description: summary.trim(),
        imageUrl: cleanUrl,
        photoUrl: cleanUrl,
      };

      if (editingId) {
        await updateDoc(doc(db, "gallery", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "gallery"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Showcase save failed:", err);
      alert("Failed to save showcase highlight. Please check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this showcase entry?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
    } catch (err: any) {
      console.error("Showcase delete failed:", err);
      alert(`Failed to delete showcase entry: ${err?.message || err}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Fieldwork & Camp Showcase Highlights ({items.length})
          </h2>
          <p className="text-xs text-slate-500">
            Showcase rural camps, PRA surveys, and agency immersion photos on /gallery and the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Showcase Highlight</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <Camera className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No showcase entries added yet</h3>
          <p className="text-xs text-slate-500">Click &quot;Add Showcase Highlight&quot; to publish rural camp albums and community outreach photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <AdminShowcaseImage imageUrl={item.imageUrl || item.photoUrl} title={item.title} />
                  <span className="absolute top-2 left-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                    <span>{item.location || "Senapati District"}</span>
                    <span>•</span>
                    <span className="font-mono">{item.academicYear || item.year}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.impactSummary || item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                  title="Edit Entry"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Showcase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? "Edit Showcase Highlight" : "Add Fieldwork / Camp Highlight"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Initiative Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Rural Educational Camp: PRA Assessment"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  >
                    <option value="Rural Camp">Rural Camp</option>
                    <option value="Community Awareness">Community Awareness</option>
                    <option value="Agency Visit">Agency Visit</option>
                    <option value="Department Event">Department Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Village / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Maram Khunou / Senapati District"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <CloudinaryUploadField
                label="Cover Photo / Image URL"
                required={true}
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="https://res.cloudinary.com/... or paste image URL"
                folder="st_xavier_gallery"
              />

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Summary / Fieldwork Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description of community activities, assessments, or outcomes..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Save Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { GalleryTab as ShowcaseTab };
