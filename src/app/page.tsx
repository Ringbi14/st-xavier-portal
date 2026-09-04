"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  ExternalLink, 
  Users, 
  Bell, 
  Calendar, 
  Camera, 
  FileText, 
  Compass,
  Briefcase,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <a
            href="https://www.stxaviercollegespt.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/70 transition-all duration-300 group cursor-pointer shadow-lg shadow-amber-500/10 mb-8"
          >
            <Building2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base font-extrabold tracking-wider uppercase">
              St. Xavier College, Maram Khunou
            </span>
            <ExternalLink className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </a>

          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-white p-3 border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 flex items-center justify-center mb-8">
            <Image
              src="/dept-logo.png"
              alt="Department of Social Work Emblem"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Department of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Social Work
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-4 leading-relaxed">
            Nurturing reflective practitioners, ethical leaders, and community builders equipped with theoretical mastery and transformative fieldwork competencies in Senapati, Manipur.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition shadow-lg shadow-amber-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Student Download Portal</span>
            </Link>

            <Link
              href="/organizations"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Fieldwork & Organizations</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link
            href="/about"
            className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              About Department
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our institutional vision, field practicum philosophy, and academic curriculum under Manipur University.
            </p>
          </Link>

          <Link
            href="/organizations"
            className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Fieldwork Directory
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Student reference directory to discover placement organizations, NGOs, and community programs.
            </p>
          </Link>

          <Link
            href="/notices"
            className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Notice Board
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live notifications, circulars, practicum announcements, and official exam memos.
            </p>
          </Link>

          <Link
            href="/events"
            className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Events Calendar
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dates and schedules for rural camps, orientation seminars, and individual supervisory conferences.
            </p>
          </Link>

        </div>
      </section>

    </div>
  );
}