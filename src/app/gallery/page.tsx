"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  authorName?: string;
  status?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadGallery() {
      try {
        const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs
          .map((d) => ({ id: d.id, ...d.data() })) as GalleryItem[];
        
        // Show only items that are explicitly approved or don't have status (legacy uploads)
        const visiblePhotos = data.filter((item) => !item.status || item.status === "approved");
        setItems(visiblePhotos);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = ["All", "Fieldwork", "Workshops", "Cultural", "Campus"];

  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Photo Archive
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Department Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Capturing academic milestones, fieldwork documentation, and campus community life.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-xs text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            Loading departmental images...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No photos found in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col hover:border-amber-500/40 transition-all duration-300 shadow-lg"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-1 bg-slate-900 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-sm text-white line-clamp-1">{item.title}</h3>
                  </div>
                  {item.authorName && (
                    <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                      Photo: {item.authorName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}