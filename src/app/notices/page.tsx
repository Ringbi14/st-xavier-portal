"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  Bell, 
  Calendar, 
  Search, 
  FileText, 
  Download, 
  Tag, 
  AlertCircle,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  date: string;
  category?: string;
  description: string;
  content?: string;
  attachmentUrl?: string;
  isImportant?: boolean;
}

const DEFAULT_NOTICES: Notice[] = [
  {
    id: "not-1",
    title: "Submission of Concurrent Fieldwork Process Recordings",
    date: "2026-03-02",
    category: "Fieldwork",
    description: "All BSW students must submit their weekly casework and group work process recordings to assigned faculty supervisors by Friday.",
    isImportant: true,
  },
  {
    id: "not-2",
    title: "Rural Educational Camp Schedule & Orientation",
    date: "2026-02-20",
    category: "Important",
    description: "Detailed orientation briefing regarding the upcoming 7-day rural educational immersion camp in Senapati district.",
    isImportant: true,
  },
  {
    id: "not-3",
    title: "Internal Assessment Routine — Department of Social Work",
    date: "2026-02-15",
    category: "Examination",
    description: "The timetable for mid-semester internal assessments covering Social Casework and Social Group Work methodologies.",
  },
  {
    id: "not-4",
    title: "Guest Lecture on Tribal Rights and Grassroots Social Action",
    date: "2026-02-10",
    category: "General",
    description: "Special academic lecture session by regional civil society practitioners in the department seminar hall.",
  },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "notices"), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Notice[];
          setNotices(loaded);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn("Firestore notices subscription error:", err);
    }
  }, []);

  const categories = ["All", "Fieldwork", "Important", "Examination", "General"];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      notice.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Important" && notice.isImportant);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <Bell className="w-3.5 h-3.5" />
            <span>Academic Bulletins & Notifications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Department Circulars & Notices
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Official announcements, examination schedules, fieldwork guidelines, and urgent departmental notifications for students and faculty.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Controls */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-2xl bg-white border transition shadow-xs space-y-3 ${
                notice.isImportant
                  ? "border-amber-300 ring-1 ring-amber-200/60"
                  : "border-slate-200 hover:border-teal-300"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.isImportant && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <AlertCircle className="w-3 h-3" />
                      <span>Urgent</span>
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                    {notice.category || "Notice"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{notice.date}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {notice.description}
                </p>
                {notice.content && (
                  <p className="text-xs text-slate-500 mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 whitespace-pre-line leading-relaxed">
                    {notice.content}
                  </p>
                )}
              </div>

              {notice.attachmentUrl && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={notice.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    <span>Download Attachment</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No notices found</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching categories or clearing your search term.</p>
          </div>
        )}

      </div>
    </div>
  );
}