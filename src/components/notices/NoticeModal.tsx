"use client";

import React, { useEffect } from "react";
import {
  X,
  Calendar,
  Building2,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react";

export interface NoticeItem {
  id: string;
  title: string;
  category: "Fieldwork" | "Exam" | "Rural Camp" | "General" | string;
  date: string;
  description?: string;
  body?: string;
  attachmentUrl?: string;
  fileUrl?: string;
}

interface NoticeModalProps {
  notice: NoticeItem | null;
  onClose: () => void;
}

export function formatNoticeDate(rawDate?: string): string {
  if (!rawDate) return "Official Notice";
  try {
    const parts = rawDate.split("-");
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
    }
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    // fallback
  }
  return rawDate;
}

export function getNoticeCategoryBadge(category: string) {
  switch (category) {
    case "Fieldwork":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100";
    case "Exam":
    case "Examination":
      return "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-100";
    case "Rural Camp":
      return "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-100";
    case "General":
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function NoticeModal({ notice, onClose }: NoticeModalProps) {
  useEffect(() => {
    if (!notice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [notice, onClose]);

  if (!notice) return null;

  const attachment = notice.attachmentUrl || notice.fileUrl;
  const contentText = notice.body || notice.description || "No full description provided for this circular.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notice modal"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Metadata Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${getNoticeCategoryBadge(
                notice.category
              )}`}
            >
              {notice.category}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              <span>{formatNoticeDate(notice.date)}</span>
            </div>
          </div>

          {/* Department Issuing Authority */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-900 bg-teal-50/80 px-2.5 py-1 rounded-md border border-teal-200">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Department of Social Work, SXC Maram</span>
          </div>

          {/* Title */}
          <h2
            id="notice-modal-title"
            className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight pt-1"
          >
            {notice.title}
          </h2>
        </div>

        {/* Circular Body Text */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Circular Content</span>
          </div>
          <div className="whitespace-pre-wrap text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {contentText}
          </div>
        </div>

        {/* Attachment Download Action (if exists) */}
        {attachment && (
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-teal-950 font-medium">
              <FileText className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <div className="font-bold">Official Document Attached</div>
                <div className="text-[11px] text-teal-700">PDF circular / schedule document</div>
              </div>
            </div>

            <a
              href={attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition shadow-xs hover:shadow-md shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Attached Circular / Document (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
}
