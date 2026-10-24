"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import {
  Building2,
  ExternalLink,
  BookOpen,
  FileText,
  Briefcase,
  Compass,
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  MapPin,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";
import NoticeModal, {
  NoticeItem,
  formatNoticeDate,
  getNoticeCategoryBadge,
} from "@/components/notices/NoticeModal";

interface HighlightItem {
  id: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  imageUrl?: string;
}

// Fallback notices for instant display & reliability
const FALLBACK_NOTICES: NoticeItem[] = [
  {
    id: "not-fb-1",
    title: "Concurrent Fieldwork Orientation for Semester III & V Practicum",
    category: "Fieldwork",
    date: "2026-10-18",
    description:
      "All students enrolled in BSW Semesters III & V must attend the mandatory concurrent fieldwork orientation scheduled for Friday in the Department Seminar Hall at 10:30 AM.\n\nPlacement rosters, faculty supervisor allocations, and weekly conference schedules will be distributed. Process record templates and field attendance log sheets must be collected from the department office.",
  },
  {
    id: "not-fb-2",
    title: "Annual Rural Educational Camp 2026: Participatory Rural Appraisal Schedule",
    category: "Rural Camp",
    date: "2026-10-12",
    description:
      "The Department of Social Work announces the 10-day Annual Rural Educational Camp to be conducted in selected tribal villages of Senapati District, Manipur.\n\nPreparatory workshops on PRA mapping, focus group methodology, and community cultural awareness rallies commence next Monday. Camp fees and medical consent forms must be submitted to the camp coordinator.",
  },
  {
    id: "not-fb-3",
    title: "End-Semester Practicum Journal Viva Voce & Submission Deadlines",
    category: "Exam",
    date: "2026-10-05",
    description:
      "All BSW students are notified that fieldwork journals, casework process records, and agency supervisor evaluation sheets must be bound and submitted by 4:00 PM on the designated date.\n\nExternal viva-voce examinations will be conducted in the presence of university-appointed examiners. Late submissions will result in credit deductions.",
  },
];

// Fallback fieldwork & camp highlights
const FALLBACK_HIGHLIGHTS: HighlightItem[] = [
  {
    id: "hl-fb-1",
    title: "Annual Rural Educational Camp: PRA Assessment",
    category: "Rural Camp",
    location: "Senapati District Villages",
    year: "2025-2026",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hl-fb-2",
    title: "Community Awareness & Health Literacy Campaign",
    category: "Community Awareness",
    location: "Maram Khunou",
    year: "2025-2026",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hl-fb-3",
    title: "District Child Protection Unit & Healthcare Placement",
    category: "Agency Visit",
    location: "Senapati District Hospital",
    year: "2025-2026",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hl-fb-4",
    title: "Participatory Resource Mapping & Village Focus Group",
    category: "Rural Camp",
    location: "Karong Community Center",
    year: "2025-2026",
    imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800",
  },
];

export default function HomePage() {
  const [notices, setNotices] = useState<NoticeItem[]>(FALLBACK_NOTICES);
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [highlights, setHighlights] = useState<HighlightItem[]>(FALLBACK_HIGHLIGHTS);

  useEffect(() => {
    // Fetch 3 most recent bulletins from 'notices'
    const fetchNotices = async () => {
      try {
        const colRef = collection(db, "notices");
        let docsData: NoticeItem[] = [];

        try {
          const qNotices = query(colRef, orderBy("date", "desc"), limit(3));
          const snap = await getDocs(qNotices);
          if (!snap.empty) {
            docsData = snap.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || "Untitled Circular",
                category: data.category || "General",
                date: data.date || "",
                description: data.description || data.shortDesc || "",
                body: data.body || data.description || "",
                attachmentUrl: data.attachmentUrl || data.fileUrl || "",
              };
            });
          }
        } catch (queryErr) {
          console.warn("Ordered notice query fell back to base query:", queryErr);
          const fallbackSnap = await getDocs(query(colRef, limit(6)));
          if (!fallbackSnap.empty) {
            docsData = fallbackSnap.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || "Untitled Circular",
                category: data.category || "General",
                date: data.date || "",
                description: data.description || data.shortDesc || "",
                body: data.body || data.description || "",
                attachmentUrl: data.attachmentUrl || data.fileUrl || "",
              };
            });
          }
        }

        if (docsData.length > 0) {
          docsData.sort((a, b) => {
            const timeA = a.date ? new Date(a.date).getTime() : 0;
            const timeB = b.date ? new Date(b.date).getTime() : 0;
            return timeB - timeA;
          });
          setNotices(docsData.slice(0, 3));
        }
      } catch (err) {
        console.warn("Using fallback notices:", err);
      }
    };

    // Fetch 4 curated items from 'gallery'
    const fetchHighlights = async () => {
      try {
        const qGallery = query(collection(db, "gallery"), limit(4));
        const snap = await getDocs(qGallery);
        if (!snap.empty) {
          const items: HighlightItem[] = snap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || "Fieldwork Activity",
              category: data.category || "Fieldwork",
              location: data.location || "Senapati District",
              year: data.year || "2025-2026",
              imageUrl: data.imageUrl || FALLBACK_HIGHLIGHTS[0].imageUrl,
            };
          });
          setHighlights(items);
        }
      } catch (err) {
        console.warn("Using fallback gallery highlights:", err);
      }
    };

    fetchNotices();
    fetchHighlights();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* ========================================================= */}
      {/* SECTION 1: HERO BANNER                                   */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-16 sm:pb-20 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Official College Link Banner */}
          <a
            href="https://www.stxaviercollegespt.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold tracking-wide hover:bg-teal-100 transition shadow-xs mb-8 group"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-700 group-hover:scale-105 transition-transform" />
            <span>St. Xavier College, Maram Khunou | Senapati District, Manipur</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition" />
          </a>

          {/* Department Emblem */}
          <div className="relative w-36 h-36 rounded-3xl bg-white p-3 border-2 border-slate-200 shadow-sm flex items-center justify-center mb-6 hover:shadow-md transition">
            <Image
              src="/dept-logo.png"
              alt="Department Emblem"
              width={130}
              height={130}
              className="object-contain"
              priority
            />
          </div>

          {/* Title & Tagline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl">
            Department of <br />
            <span className="text-teal-800">Social Work</span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-teal-800 uppercase tracking-widest mt-3">
            St. Xavier College, Maram Khunou | Senapati District, Manipur
          </p>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-4 leading-relaxed font-normal">
            Empowering communities through reflective social work education, field immersion, and grassroots social action.
          </p>

          {/* Two Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold transition shadow-xs hover:shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore BSW Programme</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-sm font-semibold transition shadow-xs hover:border-slate-400"
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Student Resource Desk</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: LATEST DEPARTMENT BULLETINS (Curated Strip of 3) */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-teal-700" />
              <span>Department Bulletins</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Latest Circulars & Notices
            </h2>
          </div>

          <Link
            href="/notices"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition hover:underline"
          >
            <span>View All Circulars & Announcements</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Notice Cards Grid (Click to open Detail Modal directly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${getNoticeCategoryBadge(
                      notice.category
                    )}`}
                  >
                    {notice.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 text-teal-700" />
                    <span>{formatNoticeDate(notice.date)}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition leading-snug line-clamp-3">
                  {notice.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-teal-700">
                <span>Read Circular</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/notices"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:underline"
          >
            <span>View All Circulars & Announcements →</span>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: THREE ACADEMIC PILLARS GRID                    */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-teal-700" />
            <span>Academic Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            The Foundation of Social Work Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Grounded in rigorous academic frameworks, extensive agency partnerships, and direct rural immersion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <Link
            href="/programmes"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition">
                  NEP BSW Curriculum
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Foundational social work methods, field practicum, and credit-based progression under NEP.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:translate-x-0.5 transition-transform">
              <span>Explore Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Pillar 2 */}
          <Link
            href="/agencies"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition">
                  Concurrent Fieldwork & Agencies
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Two days weekly agency immersion, hospital postings, and NGO partnerships.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:translate-x-0.5 transition-transform">
              <span>View Partner Agencies</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Pillar 3 */}
          <Link
            href="/gallery"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition">
                  Rural Educational Camp & Outreach
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  10-day community living camp, rural PRA assessment, and social awareness campaigns.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:translate-x-0.5 transition-transform">
              <span>Explore Rural Camp</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: RECENT FIELDWORK & CAMP HIGHLIGHTS STRIP       */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-teal-700" />
              <span>Field Immersion</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Recent Fieldwork & Camp Highlights
            </h2>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition hover:underline"
          >
            <span>Explore Full Fieldwork Gallery</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Curated 4-Card Photo Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-400 transition flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.imageUrl || FALLBACK_HIGHLIGHTS[0].imageUrl!}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white border border-white/20">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                      <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>

                {item.year && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono font-medium text-slate-400">
                    Batch: {item.year}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Full Gallery CTA Button */}
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-teal-900 border border-teal-200 text-xs sm:text-sm font-bold transition shadow-xs hover:border-teal-400"
          >
            <Camera className="w-4 h-4 text-teal-700" />
            <span>Explore Full Fieldwork Gallery →</span>
          </Link>
        </div>
      </section>

      {/* Notice Detail Modal Sync */}
      <NoticeModal
        notice={activeNotice}
        onClose={() => setActiveNotice(null)}
      />

    </div>
  );
}