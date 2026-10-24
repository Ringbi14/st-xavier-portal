"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { NoticeDocument } from "@/lib/types";
import {
  Bell,
  Calendar,
  ExternalLink,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";
import NoticeModal, { NoticeItem } from "@/components/notices/NoticeModal";

export default function NoticeBoard() {
  const [notices, setNotices] = useState<NoticeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadNotices() {
      try {
        setLoading(true);
        const noticesRef = collection(db, "notices");
        let docsData: NoticeDocument[] = [];

        // Safe query attempt: Try ordered query by date descending
        try {
          const q = query(noticesRef, orderBy("date", "desc"), limit(6));
          const snap = await getDocs(q);
          if (!snap.empty) {
            docsData = snap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as NoticeDocument[];
          }
        } catch (queryErr) {
          console.warn("Ordered notices query fell back to base query:", queryErr);
          // Fallback to plain collection fetch
          const fallbackSnap = await getDocs(query(noticesRef, limit(10)));
          if (!fallbackSnap.empty) {
            docsData = fallbackSnap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as NoticeDocument[];
          }
        }

        // Always sort in memory by date (descending) so order is guaranteed
        docsData.sort((a, b) => {
          const timeA = a.date ? new Date(a.date).getTime() : 0;
          const timeB = b.date ? new Date(b.date).getTime() : 0;
          return timeB - timeA;
        });

        if (isMounted) {
          setNotices(docsData);
        }
      } catch (err) {
        console.error("Failed to load notices:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNotices();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryBadge = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case "fieldwork":
        return {
          label: "Fieldwork",
          className: "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100",
        };
      case "exam":
      case "examinations":
        return {
          label: "Exam",
          className: "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-100",
        };
      case "rural camp":
        return {
          label: "Rural Camp",
          className: "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-100",
        };
      case "general":
      default:
        return {
          label: cat || "General",
          className: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5 text-teal-700" />
            <span>Academic Bulletin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official Notice Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Important announcements, practicum deadlines, examination timetables, and circulars for social work students and faculty.
          </p>
        </div>

        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 hover:underline shrink-0 self-start sm:self-auto py-1"
        >
          <span>View All Circulars</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
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
                <div className="h-5 w-20 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-full bg-slate-100 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="h-6 w-28 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && notices.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            No announcements posted at this time
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            All current academic sessions and fieldwork assignments are proceeding per normal schedule. New circulars will be published here.
          </p>
        </div>
      )}

      {/* Notice Cards Grid */}
      {!loading && notices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notices.map((notice) => {
            const badge = getCategoryBadge(notice.category);
            return (
              <div
                key={notice.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition duration-200 shadow-xs flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  {/* Category Badge & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(notice.date)}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-800 transition leading-snug">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                      {notice.description || notice.body}
                    </p>
                  </div>
                </div>

                {/* Footer Attachment Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {notice.attachmentUrl ? (
                    <a
                      href={notice.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-200 text-xs font-bold transition shadow-xs group/btn"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-700 group-hover/btn:text-white transition" />
                      <span>View Circular</span>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 transition" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                      <FileText className="w-3 h-3 opacity-60" />
                      <span>Department Notice</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveNotice(notice)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-teal-700 transition cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice Detail Modal */}
      <NoticeModal
        notice={activeNotice}
        onClose={() => setActiveNotice(null)}
      />
    </section>
  );
}
