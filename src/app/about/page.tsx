"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, 
  Target, 
  Compass, 
  BookOpen, 
  Users, 
  GraduationCap, 
  HeartHandshake, 
  History, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  const historyMilestones = [
    {
      period: "[Year / Era]",
      phase: "[Phase I: Department Foundation & Inception]",
      description:
        "[Detailed milestone will be documented here: establishment of the Department of Social Work under St. Xavier College, initial batch intake, and institutional founding vision.]",
    },
    {
      period: "[Academic Milestone]",
      phase: "[Phase II: Field Practicum & Agency Linkages]",
      description:
        "[Detailed milestone will be documented here: introduction of concurrent fieldwork placements, agency MOU partnerships across Manipur, and curriculum structuring.]",
    },
    {
      period: "[Practicum Milestone]",
      phase: "[Phase III: Rural Educational Camp Tradition]",
      description:
        "[Detailed milestone will be documented here: institutionalization of the annual rural camp practicum, participatory rural appraisals (PRA), and grassroots community outreach.]",
    },
    {
      period: "[Present & Future]",
      phase: "[Phase IV: Contemporary Digital & Regional Transformation]",
      description:
        "[Detailed milestone will be documented here: launch of the digital academic portal, enhanced field research, student internships, and regional community development initiatives.]",
    },
  ];

  const objectives = [
    {
      title: "Concurrent Field Practicum",
      desc: "Providing two days a week of structured field agency immersion, bridging social work theory with grassroots application.",
    },
    {
      title: "Participatory Methodologies",
      desc: "Training undergraduates in Participatory Rural Appraisal (PRA), community needs assessments, and social action models.",
    },
    {
      title: "Ethical & Reflexive Practice",
      desc: "Instilling core professional values, human rights advocacy, and cultural sensitivity across diverse communities in the Northeast.",
    },
    {
      title: "Supervised Conferences",
      desc: "Weekly Individual Conferences (IC) and Group Conferences (GC) providing direct faculty guidance on process recordings.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* 1. Header Banner */}
      <section className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>St. Xavier College, Maram Khunou</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Department of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Social Work
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              Dedicated to preparing competent, ethical, and reflective social work practitioners committed to social justice, community empowerment, and grassroots transformation in Manipur and beyond.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* 2. Department Overview */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Department Overview</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Professional Social Work Education in Manipur
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Department of Social Work at St. Xavier College, Maram Khunou, provides a rigorous 
            undergraduate programme designed to cultivate visionary social changemakers. Blending 
            intensive theoretical modules in sociology, developmental psychology, social legislation, 
            and casework with continuous field agency immersion, our students are groomed to address 
            systemic challenges across tribal, rural, and urban landscapes.
          </p>
        </section>

        {/* 3. History Timeline (Structured Placeholders — No Hallucinated Facts) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Chronicle</span>
              <h2 className="text-2xl font-black text-white">Department History & Milestones</h2>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 sm:pl-8 space-y-8">
            {historyMilestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 group-hover:bg-amber-400 transition" />
                
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/30 transition space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold">
                    {m.period}
                  </span>
                  <h3 className="text-base font-bold text-white">{m.phase}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-500 italic">
            * Note for Administrators: The milestones above represent structured placeholders. Verified department archival dates, founders, and chronological records will be updated as authenticated college records are entered.
          </div>
        </section>

        {/* 4. Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Vision</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To be a premier center of social work education in the region, fostering transformational leaders equipped with intellectual rigor, critical consciousness, and profound dedication to uplifting vulnerable and marginalized populations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Mission</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To provide evidence-based curricula and intensive community field immersion that bridge academic scholarship with community realities, cultivating ethical practitioners who advocate for human rights, equality, and sustainable development.
            </p>
          </div>
        </section>

        {/* 5. Core Objectives */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Educational Pillars
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Fieldwork & Academic Framework
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj) => (
              <div
                key={obj.title}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-amber-500/30 transition"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <h3 className="text-base font-bold text-white">{obj.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 pl-7 leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Social Work Education & Community Engagement Callout */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Fieldwork & Organization Partnerships
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Discover NGOs, government institutions, hospitals, and community programs where our students undergo orientation visits, concurrent fieldwork, and summer internships.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/organizations"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/10"
            >
              <span>Explore Organizations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}