import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  GraduationCap 
} from "lucide-react";

export default function Home() {
  const pillars = [
    {
      title: "Community Fieldwork",
      desc: "Immersive grassroots fieldwork placements across local rural settings, sharpening practical intervention strategies.",
      icon: Users,
    },
    {
      title: "Evidence-Based Theory",
      desc: "Grounding casework, group work, and community organization in rigorous social science methodologies.",
      icon: BookOpen,
    },
    {
      title: "Social Leadership",
      desc: "Equipping graduates with ethical leadership, advocacy skills, and institutional compliance knowledge.",
      icon: Award,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-slate-850">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>St. Xavier College, Maram Khunou</span>
            </div>

            {/* Department Emblem (Placed directly above the heading) */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-white p-2.5 shadow-2xl border-2 border-amber-500/30 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
              <img
                src="/dept-logo.png"
                alt="Department of Social Work Emblem"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Department of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Social Work
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Nurturing reflective practitioners, ethical leaders, and community builders equipped with theoretical mastery and transformative fieldwork competencies in Senapati, Manipur.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/about"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/20"
              >
                Explore Department
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-semibold text-sm border border-slate-700 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Student Portal
              </Link>
            </div>

            {/* Program Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>BSW Degree Program</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Concurrent Fieldwork</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-16 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Core Pillars</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Cultivating Professional Excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 hover:border-amber-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/notices"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition block group"
            >
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Noticeboard</div>
              <div className="text-white font-bold group-hover:text-amber-400 transition flex items-center justify-between">
                <span>Latest Circulars</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link
              href="/events"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition block group"
            >
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Schedule</div>
              <div className="text-white font-bold group-hover:text-amber-400 transition flex items-center justify-between">
                <span>Upcoming Events</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link
              href="/staff"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition block group"
            >
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Directory</div>
              <div className="text-white font-bold group-hover:text-amber-400 transition flex items-center justify-between">
                <span>Faculty Profiles</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link
              href="/gallery"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition block group"
            >
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Media</div>
              <div className="text-white font-bold group-hover:text-amber-400 transition flex items-center justify-between">
                <span>Fieldwork Gallery</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}