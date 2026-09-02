"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  Bell, 
  BookOpen, 
  HeartHandshake, 
  Building2, 
  ShieldCheck, 
  ChevronRight,
  Loader2 
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Notice, DepartmentEvent } from "@/lib/types";

export default function HomePage() {
  const [latestNotices, setLatestNotices] = useState<Notice[]>([]);
  const [latestEvents, setLatestEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const noticesQuery = query(collection(db, "notices"), orderBy("publishedAt", "desc"), limit(2));
        const eventsQuery = query(collection(db, "events"), orderBy("date", "asc"), limit(2));

        const [noticesSnap, eventsSnap] = await Promise.all([
          getDocs(noticesQuery),
          getDocs(eventsQuery)
        ]);

        setLatestNotices(
          noticesSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Notice))
            .filter((n) => n.isPublic)
        );

        setLatestEvents(
          eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DepartmentEvent))
        );
      } catch (err) {
        console.error("Error loading home feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 border-b border-slate-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              St. Xavier College, Maram Khunou
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Department of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Social Work
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Nurturing reflective practitioners, ethical leaders, and community builders equipped with theoretical mastery and transformative fieldwork competencies in Senapati, Manipur.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Explore Department
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all active:scale-95"
              >
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Fieldwork & Practice</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Structured community immersion, agency placements, and rural camps fostering hands-on professional intervention skills.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Academic Curriculum</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Comprehensive training across social casework, group dynamics, community organization, and social research.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Ethics & Values</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Grounded in human rights, social justice, integrity, and sustainable community empowerment in northeastern India.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Data Feed: Notices & Events */}
      <section className="py-12 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Notices Container */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-white">Department Notices</h2>
                </div>
                <Link href="/notices" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 min-h-[160px] flex flex-col justify-center">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    Checking announcements...
                  </div>
                ) : latestNotices.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center">No current public notices.</p>
                ) : (
                  latestNotices.map((notice, idx) => (
                    <div key={notice.id} className={idx !== latestNotices.length - 1 ? "border-b border-slate-800 pb-3" : ""}>
                      <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">{notice.category}</span>
                      <h4 className="text-sm font-semibold text-slate-200 mt-0.5">{notice.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{notice.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Events Container */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
                </div>
                <Link href="/events" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 min-h-[160px] flex flex-col justify-center">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    Checking calendar...
                  </div>
                ) : latestEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center">No upcoming events scheduled.</p>
                ) : (
                  latestEvents.map((evt, idx) => (
                    <div key={evt.id} className={idx !== latestEvents.length - 1 ? "border-b border-slate-800 pb-3" : ""}>
                      <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">{evt.date}</span>
                      <h4 className="text-sm font-semibold text-slate-200 mt-0.5">{evt.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{evt.venue}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}