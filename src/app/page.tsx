"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
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
  Tent,
  Users,
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

function HomeHighlightImage({ imageUrl, title }: { imageUrl?: string; title: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanUrl = imageUrl?.trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  if (cleanUrl && !hasError) {
    const optimized = optimizeCloudinaryUrl(cleanUrl, 800);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={optimized}
        alt={title}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-teal-950 to-slate-900 flex flex-col items-center justify-center p-3 text-center select-none">
      <Camera className="w-6 h-6 text-teal-400 mb-1" />
      <span className="text-[10px] font-bold text-teal-200">Fieldwork Archive</span>
    </div>
  );
}

export default function HomePage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);

  useEffect(() => {
    // Fetch 3 most recent bulletins from 'notices'
    const fetchNotices = async () => {
      try {
        const colRef = collection(db, "notices");
        let docsData: NoticeItem[] = [];

        try {
          const qNotices = query(colRef, orderBy("publishedAt", "desc"), limit(3));
          const snap = await getDocs(qNotices);
          if (!snap.empty) {
            docsData = snap.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || "Untitled Circular",
                category: data.category || "General",
                body: data.body || data.description || "",
                fileUrl: data.fileUrl || data.attachmentUrl || "",
                publishedAt: data.publishedAt || data.date || "",
                author: data.author || "Department of Social Work, SXC Maram",
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
                body: data.body || data.description || "",
                fileUrl: data.fileUrl || data.attachmentUrl || "",
                publishedAt: data.publishedAt || data.date || "",
                author: data.author || "Department of Social Work, SXC Maram",
              };
            });
          }
        }

        if (docsData.length > 0) {
          docsData.sort((a, b) => {
            const rawA = a.publishedAt || a.date;
            const rawB = b.publishedAt || b.date;
            const timeA = rawA ? new Date(rawA?.seconds ? rawA.seconds * 1000 : rawA).getTime() : 0;
            const timeB = rawB ? new Date(rawB?.seconds ? rawB.seconds * 1000 : rawB).getTime() : 0;
            return timeB - timeA;
          });
          setNotices(docsData.slice(0, 3));
        } else {
          setNotices([]);
        }
      } catch (err) {
        console.warn("Failed to fetch notices:", err);
        setNotices([]);
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
              location: (data.location || "").trim(),
              year: (data.year || "").trim(),
              imageUrl: (data.photoUrl || data.imageUrl || data.publicUrl || "").trim(),
            };
          });
          setHighlights(items);
        } else {
          setHighlights([]);
        }
      } catch (err) {
        console.warn("Failed to fetch gallery highlights:", err);
        setHighlights([]);
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
      <section className="relative pt-10 pb-16 sm:pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Official College Link Banner */}
          <a
            href="https://stxaviercollegespt.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f2042] border border-[#1e3a8a] text-amber-300 text-xs font-semibold tracking-wide hover:bg-[#1e3a8a] hover:text-white transition shadow-sm mb-6 group"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>St. Xavier College, Maram Khunou | Affiliated to Manipur University</span>
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition" />
          </a>

          {/* Department Emblem */}
          <div className="relative w-36 h-36 rounded-3xl bg-white p-3 border-2 border-slate-200 shadow-md flex items-center justify-center mb-5 hover:shadow-lg hover:border-amber-400 transition">
            <Image
              src="/dept-logo.png"
              alt="Department Emblem"
              width={130}
              height={130}
              className="object-contain"
              priority
            />
          </div>

          {/* College Official Motto Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold tracking-wider uppercase mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>College Motto: &quot;Education for Service&quot;</span>
          </div>

          {/* Title & Tagline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0f2042] tracking-tight leading-[1.12] max-w-4xl">
            Department of <br />
            <span className="text-[#1e3a8a]">Social Work</span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-[#0f2042]/80 uppercase tracking-widest mt-3">
            St. Xavier College, Maram Khunou, Senapati District, Manipur
          </p>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-4 leading-relaxed font-normal">
            Preparing ethical, reflective, and community-grounded social work professionals through systematic concurrent fieldwork, tribal empowerment, and grassroots rural camps.
          </p>

          {/* Two Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0f2042] hover:bg-[#1e3a8a] text-white text-sm font-bold transition shadow-sm hover:shadow-md"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore BSW Programme</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0f2042] border border-slate-300 text-sm font-semibold transition shadow-xs hover:border-[#0f2042]"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Academic Resources & Desk</span>
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
        {notices.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              No active notices published at this time.
            </p>
          </div>
        ) : (
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
                      <span>{formatNoticeDate(notice.publishedAt || notice.date)}</span>
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
        )}

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
      {/* SECTION 3: 4-STAGE FIELDWORK PRACTICUM FRAMEWORK          */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2042] text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Praxis & Field Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f2042] mt-1 tracking-tight">
            4-Stage Fieldwork Practicum Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            The core pedagogical hallmark of St. Xavier&apos;s BSW education — systematically progressing from observational exposure in Manipur&apos;s hill districts to autonomous clinical and community practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Stage 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0f2042] border border-slate-200 font-mono">
                  STAGE 01
                </span>
                <span className="text-[10px] font-bold text-amber-600">Year 1</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0f2042]/5 border border-[#0f2042]/15 flex items-center justify-center text-[#0f2042] group-hover:bg-[#0f2042] group-hover:text-amber-300 transition">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0f2042] transition leading-snug">
                  Orientation & Observational Visits
                </h3>
                <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                  Senapati & Kangpokpi districts
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Structured observational visits to grassroots NGOs, tribal community institutions, Sub-Divisional health centers, and district welfare agencies.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
              Foundational field immersion
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0f2042] border border-slate-200 font-mono">
                  STAGE 02
                </span>
                <span className="text-[10px] font-bold text-amber-600">Years 2 & 3</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0f2042]/5 border border-[#0f2042]/15 flex items-center justify-center text-[#0f2042] group-hover:bg-[#0f2042] group-hover:text-amber-300 transition">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0f2042] transition leading-snug">
                  Concurrent Fieldwork (CFW) & Supervision
                </h3>
                <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                  Conferences (IC & GC)
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Two continuous days weekly agency placement coupled with mandatory weekly Individual Conferences (IC) and Group Conferences (GC) with faculty supervisors.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
              Casework & Groupwork Praxis
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-6 rounded-2xl bg-white border-2 border-amber-300/80 hover:border-amber-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs relative bg-gradient-to-b from-amber-50/20 to-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono">
                  ANNUAL
                </span>
                <span className="text-[10px] font-bold text-amber-800">Department Flagship</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:bg-[#0f2042] group-hover:text-amber-300 transition">
                <Tent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0f2042] transition leading-snug">
                  10-Day Rural Educational Living Camp
                </h3>
                <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                  PRA & Village Immersion
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Immersive rural village living conducting Participatory Rural Appraisals (PRA), community needs assessments, socio-economic surveys, and street conscientization.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-100 text-[10px] text-amber-800 font-semibold">
              Live-in community partnership
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0f2042] border border-slate-200 font-mono">
                  STAGE 04
                </span>
                <span className="text-[10px] font-bold text-amber-600">Year 4</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0f2042]/5 border border-[#0f2042]/15 flex items-center justify-center text-[#0f2042] group-hover:bg-[#0f2042] group-hover:text-amber-300 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0f2042] transition leading-snug">
                  Block Field Placement / Agency Internship
                </h3>
                <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                  Pre-Professional Immersion
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Full-time month-long agency placement in premier healthcare, child protection, or regional development organizations, accompanied by research dissertation.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
              Career & Professional Launchpad
            </div>
          </div>

        </div>

        {/* Link to Full Curriculum */}
        <div className="mt-8 text-center">
          <Link
            href="/programmes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2042] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>View Full BSW Credit Structure & Syllabi</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
        {highlights.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-slate-500">
              No fieldwork highlights published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((item) => (
              <Link
                key={item.id}
                href="/gallery"
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-400 transition flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <HomeHighlightImage imageUrl={item.imageUrl} title={item.title} />
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
        )}

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