"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  Camera, 
  Tag, 
  MapPin, 
  Calendar, 
  X, 
  Maximize2, 
  FolderArchive 
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  imageUrl: string;
  description?: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Participatory Rural Appraisal (PRA) Village Mapping",
    category: "Rural Camp",
    location: "Senapati District, Manipur",
    year: "2026",
    imageUrl: "/dept-logo.png",
    description: "BSW student practitioners executing social and resource resource mapping alongside rural community youth collectives.",
  },
  {
    id: "gal-2",
    title: "Supervised Concurrent Fieldwork Agency Placement",
    category: "Agency Visits",
    location: "Maram Khunou",
    year: "2026",
    imageUrl: "/dept-logo.png",
    description: "Concurrent fieldwork observational placement evaluating grassroots child welfare and community education setups.",
  },
  {
    id: "gal-3",
    title: "Health and Hygiene Awareness Outreach Session",
    category: "Community Action",
    location: "Senapati",
    year: "2025",
    imageUrl: "/dept-logo.png",
    description: "Conducting community group work sessions on public sanitation, maternal health, and adolescent well-being.",
  },
  {
    id: "gal-4",
    title: "Department Social Work Day & Academic Seminar",
    category: "Seminars",
    location: "St. Xavier College Campus",
    year: "2025",
    imageUrl: "/dept-logo.png",
    description: "Annual academic gathering presenting student field research findings and panel discussions with visiting practitioners.",
  },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "gallery"), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as GalleryItem[];
          setItems(loaded);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn("Firestore gallery subscription error:", err);
    }
  }, []);

  const categories = ["All", "Rural Camp", "Agency Visits", "Community Action", "Seminars"];

  const filteredItems = items.filter((item) => {
    return selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Fieldwork Photographic Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fieldwork & Action Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Visual archive documenting rural educational camps, community appraisals, street theatre, agency visits, and departmental milestones in Senapati, Manipur.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Category Filters */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Activity:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-slate-700 opacity-0 group-hover:opacity-100 transition shadow-xs">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <span className="text-teal-700 font-bold group-hover:underline">View</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No photos found in this category</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting &quot;All&quot; to view complete documentation.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div 
          onClick={() => setActiveModalItem(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="relative aspect-16/10 w-full bg-slate-100">
              <Image
                src={activeModalItem.imageUrl}
                alt={activeModalItem.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  {activeModalItem.category}
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {activeModalItem.year}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900">{activeModalItem.title}</h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{activeModalItem.location}</span>
              </div>

              {activeModalItem.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {activeModalItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}