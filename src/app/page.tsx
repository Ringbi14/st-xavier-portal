"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import { 
  Building2, 
  ExternalLink, 
  Users, 
  Bell, 
  Calendar as CalendarIcon, 
  Camera, 
  FileText, 
  Compass, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const [latestNotice, setLatestNotice] = useState<any>(null);
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);

  useEffect(() => {
    try {
      const qNotice = query(collection(db, "notices"), limit(1));
      const unsubNotice = onSnapshot(qNotice, (snap) => {
        if (!snap.empty) {
          setLatestNotice({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      });

      const qEvent = query(collection(db, "events"), limit(1));
      const unsubEvent = onSnapshot(qEvent, (snap) => {
        if (!snap.empty) {
          setUpcomingEvent({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      });

      return () => {
        unsubNotice();
        unsubEvent();
      };
    } catch (err) {
      console.warn("Firestore live feed active:", err);
    }
  }, []);

  const departmentMetrics = [
    { label: "Agency Linkages", value: "25+", desc: "Active Fieldwork & Internship NGOs" },
    { label: "Practicum Hours", value: "500+", desc: "Supervised Fieldwork per Student" },
    { label: "Rural Immersion", value: "100%", desc: "Annual Intensive Community Camp" },
    { label: "Placement Focus", value: "Grassroots", desc: "Regional Social & Tribal Action" },
  ];

  const journeyStages = [
    { step: "01", title: "Classroom Foundation", desc: "Casework, Group Work, Community Organization & Indian Social Legislation" },
    { step: "02", title: "Agency Orientation", desc: "Structured observational exposure visits to grassroots NGOs and healthcare centers" },
    { step: "03", title: "Concurrent Fieldwork", desc: "Two days weekly institutional placement with supervised process recordings" },
    { step: "04", title: "Rural Educational Camp", desc: "One-week rural immersion executing Participatory Rural Appraisals (PRA)" },
    { step: "05", title: "Block Internship", desc: "Four-week intensive agency placement preparing practitioners for professional recruitment" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* 1. Academic Hero Section */}
      <section className="relative pt-10 pb-16 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Live Academic Session Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <span>Academic Session 2026–2027 Portal</span>
          </div>

          {/* Official College Link Banner */}
          <a
            href="https://www.stxaviercollegespt.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-teal-50/80 border border-teal-200 text-teal-900 text-xs font-bold tracking-wide hover:bg-teal-100 transition shadow-xs mb-6 group"
          >
            <Building2 className="w-4 h-4 text-teal-700 group-hover:scale-105 transition-transform" />
            <span className="uppercase">St. Xavier College, Maram Khunou</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
          </a>

          {/* Department Crest Container */}
          <div className="relative w-40 h-40 rounded-3xl bg-white p-3 border-2 border-slate-200 shadow-sm flex items-center justify-center mb-6">
            <Image
              src="/dept-logo.png"
              alt="Department Emblem"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl">
            Department of <br />
            <span className="text-teal-800">Social Work</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-4 leading-relaxed font-normal">
            Preparing ethical, reflective, and professional changemakers through grounded fieldwork immersion, community action, and social research in Senapati, Manipur.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              href="/organizations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold transition shadow-xs"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Fieldwork Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <Compass className="w-4 h-4 text-teal-700" />
              <span>Department & History</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Student Downloads</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. Metrics / Impact Counter Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {departmentMetrics.map((m, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition text-center sm:text-left"
            >
              <div className="text-2xl sm:text-3xl font-black text-teal-800">
                {m.value}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">{m.label}</div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Dynamic "What's Happening" Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Latest Notice
                </span>
                {latestNotice?.date && (
                  <span className="text-[11px] text-slate-400">{latestNotice.date}</span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                {latestNotice?.title || "Regular Concurrent Fieldwork in Progress"}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                {latestNotice?.description || "Students must submit process recordings during scheduled weekly conferences."}
              </p>
              <Link href="/notices" className="text-[11px] font-bold text-teal-700 hover:underline inline-flex items-center gap-1 mt-2">
                <span>View all circulars</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Upcoming Event
                </span>
                {upcomingEvent?.date && (
                  <span className="text-[11px] text-slate-400">{upcomingEvent.date}</span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                {upcomingEvent?.title || "Departmental Supervisory Conferences"}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                {upcomingEvent?.venue ? `Venue: ${upcomingEvent.venue}` : "Weekly individual process review meetings."}
              </p>
              <Link href="/events" className="text-[11px] font-bold text-teal-700 hover:underline inline-flex items-center gap-1 mt-2">
                <span>Check calendar</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Core Ecosystem Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-6">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic & Field Ecosystem</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Department Portals & Desks
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <Link
            href="/organizations"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                Fieldwork & Organizations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Directory of partner NGOs, hospitals, and community centers where students undergo practicum and internships.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-800">
              <span>Search Directory →</span>
            </div>
          </Link>

          <Link
            href="/staff"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                Faculty & Supervisors
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet the faculty team, field coordinators, and research advisors guiding student practice and conference hours.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-800">
              <span>View Faculty →</span>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                Student Downloads
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download log sheets, casework process record templates, fieldwork rubrics, and academic syllabi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-800">
              <span>Access Files →</span>
            </div>
          </Link>

          <Link
            href="/notices"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                Department Notices
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official announcements, examination routines, practicum schedules, and academic circulars.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-800">
              <span>Read Circulars →</span>
            </div>
          </Link>

          <Link
            href="/events"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                Events & Schedules
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Key dates for rural camps, orientation visits, seminars, and supervisory conferences.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-800">
              <span>View Calendar →</span>
            </div>
          </Link>

          <Link
            href="/gallery"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                Fieldwork Gallery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Photographic documentation of rural educational camps, surveys, and community interventions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-800">
              <span>Browse Photos →</span>
            </div>
          </Link>

        </div>
      </section>

      {/* 5. Practitioner Journey */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Practitioner Development Pathway
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              The Social Work Educational Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {journeyStages.map((j) => (
              <div key={j.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-black text-teal-700 font-mono">{j.step}</span>
                <h4 className="text-xs font-bold text-slate-900">{j.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Admin Control Center Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Faculty Content Management</h4>
              <p className="text-xs text-slate-500">Publish circulars, manage agencies, and post announcements.</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs shrink-0"
          >
            Launch Admin Panel
          </Link>
        </div>
      </section>

    </div>
  );
}