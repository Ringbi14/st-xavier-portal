"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  Bell,
  Calendar,
  Search,
  Tag,
  ChevronRight,
  ArrowLeft,
  Building2,
  FileText,
  Filter,
} from "lucide-react";
import NoticeModal, {
  NoticeItem,
  formatNoticeDate,
  getNoticeCategoryBadge,
} from "@/components/notices/NoticeModal";

const CATEGORIES = ["All", "Fieldwork", "Exam", "Rural Camp", "General"] as const;

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchNotices() {
      try {
        setLoading(true);
        const colRef = collection(db, "notices");
        let docsData: NoticeItem[] = [];

        // Safe query attempt: Try ordered query by publishedAt descending, then date
        try {
          const q = query(colRef, orderBy("publishedAt", "desc"), limit(40));
          const snap = await getDocs(q);
          if (!snap.empty) {
            docsData = snap.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || "Untitled Notice",
                category: data.category || "General",
                body: data.body || data.description || "",
                fileUrl: data.fileUrl || data.attachmentUrl || "",
                publishedAt: data.publishedAt || data.date || "",
                author: data.author || "Department of Social Work, SXC Maram",
              };
            });
          }
        } catch (queryErr) {
          console.warn("Ordered query fell back to base query:", queryErr);
          // Fallback to base collection getDocs
          const fallbackSnap = await getDocs(query(colRef, limit(40)));
          if (!fallbackSnap.empty) {
            docsData = fallbackSnap.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || "Untitled Notice",
                category: data.category || "General",
                body: data.body || data.description || "",
                fileUrl: data.fileUrl || data.attachmentUrl || "",
                publishedAt: data.publishedAt || data.date || "",
                author: data.author || "Department of Social Work, SXC Maram",
              };
            });
          }
        }

        // Strictly sort in memory descending by publishedAt / date
        docsData.sort((a, b) => {
          const rawA = a.publishedAt || a.date;
          const rawB = b.publishedAt || b.date;
          const timeA = rawA ? new Date(rawA?.seconds ? rawA.seconds * 1000 : rawA).getTime() : 0;
          const timeB = rawB ? new Date(rawB?.seconds ? rawB.seconds * 1000 : rawB).getTime() : 0;
          return timeB - timeA;
        });

        if (isMounted) {
          setNotices(docsData);
        }
      } catch (err) {
        console.warn("Failed to fetch notices:", err);
        if (isMounted) {
          setNotices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchNotices();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === "All" ||
      notice.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.body?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Bell className="w-3.5 h-3.5 text-teal-700" />
            <span>Department Bulletins & Circulars</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Official Notices & Announcements
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Stay updated with practicum schedules, examination timelines, rural camp instructions, and administrative circulars issued by the Department of Social Work.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Controls: Category Filter Tabs & Keyword Search */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Showing {filteredNotices.length} {filteredNotices.length === 1 ? "notice" : "notices"}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative pt-2 border-t border-slate-100">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circular headline, keywords or dates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>

        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-1/4 bg-slate-100 rounded-md"></div>
              </div>
            ))}
          </div>
        )}

        {/* Headline-First Notice Cards List */}
        {!loading && (
          <div className="space-y-3">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setActiveNotice(notice)}
                className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-2 flex-1">
                  
                  {/* Category Pill Badge & Date */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getNoticeCategoryBadge(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span>{formatNoticeDate(notice.publishedAt || notice.date)}</span>
                    </div>
                  </div>

                  {/* Bold Headline */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition leading-snug">
                    {notice.title}
                  </h3>

                  {/* Optional short preview */}
                  {notice.body && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {notice.body}
                    </p>
                  )}
                </div>

                {/* Subtle Read Indicator */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 group-hover:text-teal-900 group-hover:translate-x-0.5 transition-all shrink-0 self-end sm:self-center">
                  <span>Read Circular</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {notices.length === 0
                ? "No active notices published at this time."
                : "No circulars currently posted under this category"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {notices.length === 0
                ? "Official department announcements and academic circulars will be displayed here when released."
                : "There are no announcements matching your selected category or search keyword."}
            </p>
            {notices.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Reset Filters & View All
              </button>
            )}
          </div>
        )}

      </div>

      {/* Notice Detail Modal */}
      <NoticeModal
        notice={activeNotice}
        onClose={() => setActiveNotice(null)}
      />

    </div>
  );
}