"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { 
  Camera, 
  Calendar, 
  Tag, 
  X, 
  Search, 
  Users, 
  Layers 
} from "lucide-react";

interface GalleryPhoto {
  id: string;
  title: string;
  category: "Rural Camp" | "Fieldwork" | "Workshops" | "Community";
  caption?: string;
  imageUrl: string;
  date?: string;
}

const FALLBACK_PHOTOS: GalleryPhoto[] = [
  {
    id: "g-1",
    title: "Participatory Rural Appraisal (PRA) Mapping Session",
    category: "Rural Camp",
    caption: "Students facilitating community resource mapping with local village elders during the annual rural practicum.",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    date: "2026-04-22",
  },
  {
    id: "g-2",
    title: "Concurrent Agency Placement & Casework Discussion",
    category: "Fieldwork",
    caption: "BSW scholars reviewing case files and intervention frameworks at grassroots NGO centers.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    date: "2026-03-15",
  },
  {
    id: "g-3",
    title: "Workshop on Child Protection & Social Policy",
    category: "Workshops",
    caption: "Interactive legal awareness session conducted by visiting practitioners for social work undergraduates.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    date: "2026-02-10",
  },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(FALLBACK_PHOTOS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const categories = ["All", "Fieldwork", "Rural Camp", "Workshops", "Community"];

  useEffect(() => {
    try {
      const q = query(collection(db, "gallery"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: GalleryPhoto[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<GalleryPhoto, "id">),
          }));
          setPhotos(list);
        } else {
          setPhotos(FALLBACK_PHOTOS);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Using fallback gallery images:", err);
      setPhotos(FALLBACK_PHOTOS);
    }
  }, []);

  const filteredPhotos = photos.filter((p) => {
    return selectedCategory === "All" || p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Practicum Archive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Fieldwork & Camp Gallery
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Documenting grassroots learning, rural camp interventions, community surveys, and social group work engagements in Manipur.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-amber-500/40 transition duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    {photo.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{photo.date || "Academic Year"}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-400">
            No gallery entries found in this category.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-2 bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase">
                  {activePhoto.category}
                </span>
                {activePhoto.date && (
                  <span className="text-xs text-slate-400">{activePhoto.date}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{activePhoto.title}</h3>
              {activePhoto.caption && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activePhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}