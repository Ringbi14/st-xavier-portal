"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { STUDENT_RESOURCES } from "@/data/studentResources";
import { 
  FileText, 
  Download, 
  Bell, 
  Users, 
  GraduationCap, 
  Search
} from "lucide-react";

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Fieldwork", "Templates", "Syllabus", "Guidelines"];

  // Display user name safely without relying on a strict UserProfile property
  const studentName = 
    user?.displayName || 
    (profile as any)?.name || 
    (profile as any)?.displayName || 
    user?.email?.split("@")[0] || 
    "Scholar";

  const filteredResources = STUDENT_RESOURCES.filter((res) => {
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Academic Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {studentName}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Access official fieldwork templates, syllabus copies, circulars, and departmental materials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/notices"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>View Circulars</span>
              </Link>
              <Link
                href="/staff"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/10"
              >
                <Users className="w-4 h-4" />
                <span>Contact Faculty</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Quick Academic Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Academic Program</div>
            <div className="text-lg font-bold text-white">Bachelor of Social Work</div>
            <div className="text-xs text-slate-400 mt-1">3 Years Full-Time</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Fieldwork Status</div>
            <div className="text-lg font-bold text-white">Concurrent Practicum</div>
            <div className="text-xs text-slate-400 mt-1">2 Days / Week Placements</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Department Desk</div>
            <div className="text-lg font-bold text-white">Maram Khunou</div>
            <div className="text-xs text-slate-400 mt-1">Senapati, Manipur</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Supervisory Hour</div>
            <div className="text-lg font-bold text-white">Individual Conference</div>
            <div className="text-xs text-slate-400 mt-1">Weekly IC/GC Sessions</div>
          </div>
        </div>

        {/* Resources & Download Center */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Fieldwork & Academic Downloads</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Download verified report formats, observation guidelines, and syllabus documents.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates or syllabus..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Download Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.fileSize}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2 mb-5">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.downloadUrl}
                  download
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-400 text-xs">
              No academic resources found matching your search.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}