"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Image as ImageIcon, Loader2, Calendar } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  uploadedAt?: any;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GalleryItem[];
        setImages(data);
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const categories = ["All", "Fieldwork", "Workshops", "Cultural", "Campus"];

  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Visual Highlights
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Department Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Memories, community field immersions, and academic events from the Department of Social Work at St. Xavier College.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            Loading gallery photos...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No photos found</p>
            <p className="text-xs text-slate-500 mt-1">Photos will appear once published by the department.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 transition-all hover:border-amber-500/50"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {img.category}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}