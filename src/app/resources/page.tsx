"use client";

import React from "react";
import ResourceDesk from "@/components/home/ResourceDesk";
import { BookOpen } from "lucide-react";

export default function PublicResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f2042] text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Academic Repository</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              St. Xavier College, Maram Khunou • Affiliated to Manipur University
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f2042] tracking-tight">
            BSW Student Resource Desk & Fieldwork Log Sheets
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Official curriculum documentation, daily fieldwork observation sheets, practicum evaluation rubrics, and rural camp manuals for Bachelor of Social Work students.
          </p>
        </div>
      </div>

      <ResourceDesk />
    </div>
  );
}