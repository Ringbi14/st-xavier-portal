"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, Filter, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: "Fieldwork" | "Rural Camp" | "Seminars" | "Workshops";
  date: string;
  caption: string;
  imageUrl?: string;
}

const SAMPLE_ALBUM: GalleryItem[] = [
  {
    id: "1",
    title: "Rural Exposure Camp",
    category: "Rural Camp",
    date: "April 2026",
    caption: "Community assessment, village mapping, and participatory group sessions conducted during the annual rural camp.",
  },
  {
    id: "2",
    title: "Fieldwork Agency Placement",
    category: "Fieldwork",
    date: "Semester Fieldwork",
    caption: "Concurrent field immersion at local NGOs and social welfare institutions in Senapati district.",
  },
  {
    id: "3",
    title: "Interactive Methodologies Seminar",
    category: "Seminars",
    date: "Academic Session",
    caption: "Department seminar exploring social casework interventions and community organizing techniques.",
  },
  {
    id: "4",
    title: "Participatory Appraisal Workshop",
    category: "Workshops",
    date: "Skill Lab",
    caption: "Hands-on tools training: Transect walks, resource mapping, and seasonal calendar analysis.",
  },
];

const CATEGORIES = ["All", "Fieldwork", "Rural Camp", "Seminars", "Workshops"] as const;

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "All"
    ? SAMPLE_ALBUM
    : SAMPLE_ALBUM.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Moments & Field Practice
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Department Gallery
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Documenting fieldwork immersions, rural exposure camps, academic seminars, and community interventions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all overflow-hidden flex flex-col"
            >
              {/* Photo Frame Placeholder */}
              <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center text-slate-600 group-hover:text-amber-400/80 transition-colors border-b border-slate-800/80 relative">
                <ImageIcon className="w-10 h-10" />
                <span className="text-[11px] text-slate-500 mt-2 font-mono">[PHOTO PLACEHOLDER]</span>
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              {/* Card Meta */}
              <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 block pt-3 border-t border-slate-800/60">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Modal Preview */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 max-w-xl w-full rounded-2xl p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center text-slate-600 border border-slate-800">
                <ImageIcon className="w-12 h-12 text-slate-700" />
                <span className="text-xs text-slate-500 mt-2">[ADD PHOTO FOR {activeItem.title.toUpperCase()}]</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {activeItem.category}
                  </span>
                  <span className="text-xs text-slate-500">{activeItem.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{activeItem.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  {activeItem.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}