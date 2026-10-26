"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ShowcaseItem, ShowcaseCategory } from "@/lib/types";
import { 
  Camera, 
  MapPin, 
  Calendar, 
  X, 
  Maximize2, 
  Sparkles, 
  Compass, 
  ChevronRight,
  Filter
} from "lucide-react";
import Link from "next/link";

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: "All Highlights", value: "All" },
  { label: "Rural Camps", value: "Rural Camp" },
  { label: "Community Outreach", value: "Community Awareness" },
  { label: "Agency Visits", value: "Agency Visit" },
  { label: "Department Events", value: "Department Event" },
];

function ShowcaseCardImage({ imageUrl, title }: { imageUrl?: string; title: string }) {
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
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="w-12 h-12 rounded-2xl bg-teal-800/30 border border-teal-600/40 flex items-center justify-center text-teal-400 mb-2 shadow-inner">
        <Camera className="w-6 h-6" />
      </div>
      <span className="text-[11px] font-bold text-teal-200/80 tracking-wide">
        Practicum Fieldwork Photo
      </span>
      <span className="text-[9px] text-slate-400 mt-0.5">
        BSW Department Archive
      </span>
    </div>
  );
}

function ShowcaseModalImage({ imageUrl, title }: { imageUrl?: string; title: string }) {
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
        className="max-h-[60vh] w-auto max-w-full object-contain"
      />
    );
  }

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-2 select-none">
      <Camera className="w-12 h-12 text-teal-600/70" />
      <span className="text-xs font-semibold text-slate-300">Fieldwork documentation photograph</span>
      <span className="text-[10px] text-slate-500">Image is pending archive upload or link verification</span>
    </div>
  );
}

export default function ShowcaseSection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeModal, setActiveModal] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    async function fetchShowcase() {
      try {
        setLoading(true);
        let docsSnap;
        try {
          const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
          docsSnap = await getDocs(q);
        } catch {
          // Fallback if index on createdAt is building or not available
          docsSnap = await getDocs(collection(db, "gallery"));
        }

        const data: ShowcaseItem[] = [];
        docsSnap.forEach((doc) => {
          const d = doc.data();
          data.push({
            id: doc.id,
            title: d.title || d.galleryData?.title || "Fieldwork Highlight",
            category: (d.category || d.galleryData?.category || "Rural Camp") as ShowcaseCategory,
            academicYear: d.academicYear || d.galleryData?.year || d.year || "2025-2026",
            location: d.location || d.galleryData?.location || "Senapati District, Manipur",
            impactSummary: d.impactSummary || d.galleryData?.description || d.description || "",
            imageUrl: (d.photoUrl || d.imageUrl || d.galleryData?.photoUrl || d.galleryData?.imageUrl || d.galleryData?.publicUrl || d.publicUrl || "").trim(),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          });
        });

        // In-memory sort fallback if createdAt exists
        data.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setItems(data);
      } catch (err) {
        console.error("Failed to load showcase highlights:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchShowcase();
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.category === selectedFilter;
  });

  // Category Badge Helper
  const getCategoryBadge = (category: ShowcaseCategory | string) => {
    switch (category) {
      case "Rural Camp":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "Community Awareness":
        return {
          bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
          dot: "bg-indigo-500",
        };
      case "Agency Visit":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
        };
      case "Department Event":
      default:
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          dot: "bg-blue-500",
        };
    }
  };

  return (
    <section id="showcase-gallery" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Fieldwork Immersion & Social Action</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Rural Camp & Fieldwork Showcase
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Photographic archives, village immersion records, and grassroots community impact projects led by BSW student social workers in Manipur.
          </p>
        </div>

        {!isStandalonePage && (
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition self-start md:self-auto shrink-0 shadow-xs"
          >
            <span>Open Dedicated Gallery</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      <div className="mt-8">
        {loading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 animate-pulse shadow-xs">
                <div className="aspect-16/10 bg-slate-200 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded-md w-24" />
                  <div className="h-5 bg-slate-200 rounded-md w-full" />
                  <div className="h-3 bg-slate-200 rounded-md w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          // Graceful Empty State
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 mx-auto mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No camp or event highlights posted yet
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              New photographic documentation of rural camps, PRA exercises, and agency visits will appear here once published from the department desk.
            </p>
            {selectedFilter !== "All" && (
              <button
                onClick={() => setSelectedFilter("All")}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                Clear Category Filter
              </button>
            )}
          </div>
        ) : (
          // Card Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const badgeStyle = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveModal(item)}
                  className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover photo with zoom effect */}
                    <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                      <ShowcaseCardImage imageUrl={item.imageUrl} title={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      {/* Hover Fullscreen Badge */}
                      <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-700 opacity-0 group-hover:opacity-100 transition shadow-xs">
                        <Maximize2 className="w-4 h-4" />
                      </div>

                      {/* Floating Category Pill on Image */}
                      <div className="absolute bottom-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-xs backdrop-blur-xs ${badgeStyle.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-teal-700" />
                          Batch {item.academicYear}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      {item.impactSummary && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.impactSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="truncate text-[11px] font-medium text-slate-600">{item.location}</span>
                    </div>
                    <span className="text-teal-800 font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* High-Resolution Modal / Preview */}
      {activeModal && (
        <div 
          onClick={() => setActiveModal(null)} 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
          >
            {/* Modal Image Area */}
            <div className="relative aspect-16/10 w-full bg-slate-950 overflow-hidden flex items-center justify-center p-2">
              <ShowcaseModalImage 
                imageUrl={activeModal.imageUrl} 
                title={activeModal.title} 
              />
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition shadow-lg"
                title="Close Preview (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details Area */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${getCategoryBadge(activeModal.category).bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getCategoryBadge(activeModal.category).dot}`} />
                  {activeModal.category}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-lg font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {activeModal.academicYear}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  {activeModal.location}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeModal.title}
                </h3>
              </div>

              {activeModal.impactSummary && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Impact & Activity Summary
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeModal.impactSummary}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <a
                  href={activeModal.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Open full-size image in new tab
                </a>

                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
