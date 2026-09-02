import React from "react";
import { BookOpen, Target, Compass, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            About Our Department
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Department of Social Work
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            St. Xavier College, Maram Khunou, Senapati District, Manipur.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Vision</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              [ADD OFFICIAL DEPARTMENT VISION STATEMENT]
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Mission</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              [ADD OFFICIAL DEPARTMENT MISSION STATEMENT]
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Objectives & Social Work Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="font-semibold text-amber-400 block mb-1">Theoretical Competence</span>
              Mastery of casework, group work, community organization, and social administration.
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="font-semibold text-amber-400 block mb-1">Field Immersion</span>
              Hands-on concurrent fieldwork, agency visits, and rural development camps.
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="font-semibold text-amber-400 block mb-1">Professional Ethics</span>
              Fostering empathy, confidentiality, human dignity, and social justice.
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="font-semibold text-amber-400 block mb-1">Community Research</span>
              Empirical participatory research addressing grassroots socioeconomic realities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}