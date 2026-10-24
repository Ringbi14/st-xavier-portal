"use client";

import React from "react";
import ShowcaseSection from "@/components/home/ShowcaseSection";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicGalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Page Header */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Fieldwork Photographic Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fieldwork & Action Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Photographic records of rural immersion camps, community interventions, and departmental milestones in Senapati, Manipur.
          </p>
        </div>
      </section>

      {/* Main Showcase Grid Component */}
      <ShowcaseSection isStandalonePage={true} />
    </div>
  );
}