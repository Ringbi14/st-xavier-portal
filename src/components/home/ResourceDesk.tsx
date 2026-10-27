"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { DownloadItem } from "@/lib/types";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  FolderDown,
  Layers,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const PRIMARY_FEATURED_DOWNLOADS: DownloadItem[] = [
  {
    id: "primary-daily-log-sheet",
    title: "BSW Fieldwork Daily Log Sheet (PDF)",
    category: "Fieldwork Forms",
    targetProgram: "BSW",
    note: "Official daily activity log, observation recording matrix, and agency supervisor sign-off sheet for Concurrent Fieldwork (CFW).",
    url: "/downloads/bsw-fieldwork-daily-log-sheet.pdf",
    academicYear: "2025-2026",
  },
  {
    id: "primary-practicum-guidelines",
    title: "Practicum Guidelines & Code of Ethics (PDF)",
    category: "General Guidelines",
    targetProgram: "BSW",
    note: "Mandatory fieldwork regulations, Individual (IC) and Group (GC) conference norms, evaluation rubrics, and Jesuit ethical standards.",
    url: "/downloads/bsw-practicum-guidelines.pdf",
    academicYear: "2025-2026",
  },
];

export default function ResourceDesk() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDownloads() {
      try {
        setLoading(true);
        const refCol = collection(db, "downloads");
        let docsData: DownloadItem[] = [];

        try {
          const q = query(refCol, orderBy("createdAt", "desc"), limit(20));
          const snap = await getDocs(q);
          if (!snap.empty) {
            docsData = snap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as DownloadItem[];
          }
        } catch (err) {
          console.warn("Ordered downloads query fell back to base query:", err);
          const fallbackSnap = await getDocs(query(refCol, limit(25)));
          if (!fallbackSnap.empty) {
            docsData = fallbackSnap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as DownloadItem[];
          }
        }

        // Ensure primary featured downloads are always present
        const mergedData: DownloadItem[] = [...docsData];
        PRIMARY_FEATURED_DOWNLOADS.forEach((primary) => {
          if (!mergedData.some((d) => d.title.toLowerCase().includes(primary.title.toLowerCase().slice(0, 20)))) {
            mergedData.unshift(primary);
          }
        });

        if (isMounted) {
          setItems(mergedData);
        }
      } catch (err) {
        console.error("Failed to load downloads, using primary documents:", err);
        if (isMounted) {
          setItems(PRIMARY_FEATURED_DOWNLOADS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDownloads();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case "Fieldwork Forms":
        return {
          label: "Fieldwork Forms",
          className: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-100",
        };
      case "Syllabus":
        return {
          label: "Syllabus",
          className: "bg-teal-50 text-teal-800 border-teal-200 ring-1 ring-teal-100",
        };
      case "Camp Manuals":
        return {
          label: "Camp Manuals",
          className: "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-100",
        };
      case "General Guidelines":
      default:
        return {
          label: cat || "General",
          className: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  const getProgramBadge = (_prog?: string) => {
    return { label: "BSW", className: "bg-blue-100 text-blue-900 border-blue-200" };
  };

  const categories = ["All", "Fieldwork Forms", "Syllabus", "Camp Manuals", "General Guidelines"];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2042] text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Academic & Fieldwork Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f2042] tracking-tight">
            Student Resource Desk & Fieldwork Downloads
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Official BSW fieldwork daily log templates, practicum ordinances, course syllabi, and rural camp manuals for St. Xavier College social work students.
          </p>
        </div>

        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2042] hover:text-[#1e3a8a] hover:underline shrink-0 self-start sm:self-auto py-1"
        >
          <span>All Curriculum Files</span>
          <ChevronRight className="w-4 h-4 text-amber-600" />
        </Link>
      </div>

      {/* PROMINENT SPOTLIGHT: Primary Fieldwork Downloads */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0f2042] via-[#142a55] to-slate-900 border border-[#1e3a8a] text-white shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRIMARY PRACTICUM DOWNLOADS</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Essential Fieldwork Documentation
            </h3>
          </div>
          <span className="text-[11px] text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto font-medium">
            Mandatory for All BSW Students
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRIMARY_FEATURED_DOWNLOADS.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-amber-400/30 hover:border-amber-400 transition flex flex-col justify-between space-y-4 group shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    OFFICIAL PDF
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition leading-snug">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {doc.note}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-xs group/btn"
                >
                  <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                  <span>Download Official PDF</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-teal-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Badge */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-teal-800" />
            <span className="font-bold text-teal-900">BSW Course Resources</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources by title, template keyword, or batch..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
          />
        </div>
      </div>

      {/* Skeleton Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-slate-200 rounded-md"></div>
                <div className="h-5 w-16 bg-slate-100 rounded-md"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
                <div className="h-3 w-3/5 bg-slate-100 rounded"></div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="h-8 w-full bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fallback Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderDown className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            No documents currently uploaded
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            Official coursework materials, fieldwork recording manuals, and evaluation rubrics will appear here once released by the department.
          </p>
        </div>
      )}

      {/* Document Shelf Grid */}
      {!loading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const catBadge = getCategoryBadge(item.category);
            const progBadge = getProgramBadge(item.targetProgram);
            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition duration-200 shadow-xs flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  {/* Category and Program Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${catBadge.className}`}
                    >
                      {catBadge.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${progBadge.className}`}
                    >
                      {progBadge.label}
                    </span>
                  </div>

                  {/* Document Title & Note */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-800 transition leading-snug">
                      {item.title}
                    </h3>
                    {item.note && (
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed italic">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct High-Contrast Action Button */}
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs group/btn"
                  >
                    <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                    <span>Download File / Open PDF</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100 transition" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
