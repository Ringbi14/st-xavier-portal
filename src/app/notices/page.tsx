"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { 
  Bell, 
  Calendar, 
  AlertCircle, 
  ExternalLink, 
  Search, 
  FileText 
} from "lucide-react";

interface NoticeItem {
  id: string;
  title: string;
  category: "Academic" | "Fieldwork" | "Examinations" | "Urgent";
  description: string;
  attachmentUrl?: string;
  isImportant?: boolean;
  date: string;
}

const FALLBACK_NOTICES: NoticeItem[] = [
  {
    id: "notice-1",
    title: "Concurrent Fieldwork Placement Allocation – Semester Schedule",
    category: "Fieldwork",
    description: "Students are instructed to report to their designated agency supervisors starting next Tuesday. Agency logbooks must be signed weekly.",
    date: "2026-09-01",
    isImportant: true,
  },
  {
    id: "notice-2",
    title: "Submission of Casework & Social Group Work Process Records",
    category: "Academic",
    description: "All first-year BSW scholars must submit their initial two verbatim process reports to their faculty supervisors by Friday.",
    date: "2026-08-28",
  },
  {
    id: "notice-3",
    title: "Rural Educational Camp – Advance Planning & Committee Meeting",
    category: "Fieldwork",
    description: "Briefing for student conveners regarding logistical preparation, village community surveys, and cultural night planning.",
    date: "2026-08-20",
  }
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>(FALLBACK_NOTICES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Fieldwork", "Academic", "Examinations", "Urgent"];

  useEffect(() => {
    try {
      const q = query(collection(db, "notices"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetched: NoticeItem[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<NoticeItem, "id">),
          }));
          // Sort newest dates first
          fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNotices(fetched);
        } else {
          setNotices(FALLBACK_NOTICES);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Using fallback notices:", err);
      setNotices(FALLBACK_NOTICES);
    }
  }, []);

  const filteredNotices = notices.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Announcements</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Notice Board & Circulars
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Official circulars, field practicum announcements, examination notifications, and departmental memos.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Notices Cards List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-3xl bg-slate-900/60 border transition hover:border-slate-700 ${
                notice.isImportant ? "border-amber-500/40 bg-amber-500/[0.02]" : "border-slate-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    {notice.category}
                  </span>
                  {notice.isImportant && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3" />
                      Priority Notice
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{notice.date}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{notice.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">{notice.description}</p>

              {notice.attachmentUrl && (
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download / View Official Circular PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-400">
              No notices match your current filters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}