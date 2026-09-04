"use client";

import React from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  HeartHandshake, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function AlumniComingSoonPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      <section className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Alumni Network & Relations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl">
            Department of Social Work <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Alumni Association
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mt-4 leading-relaxed">
            Connecting graduated batches, celebrating professional journeys in development, and linking current scholars with experienced mentors across Northeast India and beyond.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Alumni Directory & Mentorship Platform Under Active Setup
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              We are compiling authentic graduation batch records, career testimonials, and organization affiliations. No unverified records will be published until official registration opens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-white">Batch Directories</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Search fellow graduates by year, sector, and professional specialization.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-white">Agency Linkages</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect with alumni working in leading NGOs, UN bodies, and CSR initiatives.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-white">Student Mentorship</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Direct guidance for current BSW scholars preparing for fieldwork and career steps.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/organizations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/10"
            >
              <span>Explore Fieldwork & Organizations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}