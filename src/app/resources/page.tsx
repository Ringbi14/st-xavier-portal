"use client";

import React from "react";
import ResourceDesk from "@/components/home/ResourceDesk";
import { BookOpen } from "lucide-react";

export default function PublicResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic & Fieldwork Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Student Resource Desk & Syllabi
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Official curriculum documentation, university ordinances, fieldwork recording templates, and rural camp manuals for BSW students.
          </p>
        </div>
      </div>

      <ResourceDesk />
    </div>
  );
}