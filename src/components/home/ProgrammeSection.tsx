"use client";

import React from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Clock, 
  Award, 
  FileText, 
  CheckCircle2, 
  Compass, 
  Users, 
  Tent, 
  Briefcase,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ProgrammeSection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const pillars = [
    {
      title: "Social Work Methods",
      subtitle: "Foundational Practice",
      desc: "In-depth methodology training in Social Casework (individual counseling), Social Group Work (collective facilitation), and Community Organization for systemic grassroots change.",
      icon: Users,
    },
    {
      title: "Concurrent Fieldwork Practicum",
      subtitle: "Two Days Weekly Agency Immersion",
      desc: "500+ hours of continuous supervised practice in partner NGOs, hospitals, rehabilitation centers, and village institutions with weekly supervisory conferences.",
      icon: Briefcase,
    },
    {
      title: "Annual Rural Educational Camp",
      subtitle: "10-Day Village Living & PRA",
      desc: "Intensive 10-day community living experience executing Participatory Rural Appraisals (PRA), social surveys, cultural nights, and community intervention projects.",
      icon: Tent,
    },
    {
      title: "Block Placement & Dissertation",
      subtitle: "Pre-Professional Internship",
      desc: "Four-week full-time block internship with recognized development agencies, coupled with an individual qualitative or quantitative social research dissertation.",
      icon: Compass,
    },
  ];

  const semesters = [
    {
      sem: "Semester I",
      courses: [
        "History & Philosophy of Social Work Profession",
        "Sociology for Social Work Practice",
        "Human Growth and Development",
        "Observational Fieldwork & Orientation Visits",
      ],
    },
    {
      sem: "Semester II",
      courses: [
        "Social Work Concepts & Contemporary Social Problems",
        "Psychology for Social Work Practitioners",
        "Communication & Social Work Practice Skills",
        "Concurrent Fieldwork Practicum II",
      ],
    },
    {
      sem: "Semester III",
      courses: [
        "Social Casework (Working with Individuals & Families)",
        "Social Group Work (Working with Collectives)",
        "Social Casework & Group Work Lab Practice",
        "Concurrent Fieldwork Practicum III",
      ],
    },
    {
      sem: "Semester IV",
      courses: [
        "Community Organization & Social Action",
        "Social Work Research Methods & Social Statistics",
        "Social Policy & Welfare Legislation",
        "Concurrent Fieldwork Practicum IV",
      ],
    },
    {
      sem: "Semester V",
      courses: [
        "Social Welfare Administration & Project Planning",
        "Human Rights, Gender & Social Justice Legislation",
        "10-Day Annual Rural Educational Camp (PRA Immersion)",
        "Concurrent Fieldwork Practicum V",
      ],
    },
    {
      sem: "Semester VI",
      courses: [
        "Tribal & Rural Community Development",
        "Mental Health & Psychosocial Support Interventions",
        "Disaster Mitigation & Community Preparedness",
        "Concurrent Fieldwork Practicum VI & Viva-Voce",
      ],
    },
    {
      sem: "Semester VII",
      courses: [
        "Advanced Specialized Social Work Practice",
        "Corporate Social Responsibility (CSR) & ESG Governance",
        "Advanced Social Policy Formulation & Evaluation",
        "Concurrent Fieldwork Practicum VII",
      ],
    },
    {
      sem: "Semester VIII",
      courses: [
        "Four-Week Intensive Agency Block Fieldwork Placement",
        "Supervised Independent Empirical Research Dissertation",
        "Professional Ethics & Comprehensive Viva-Voce",
        "Community Dissemination Seminar",
      ],
    },
  ];

  return (
    <section id="bsw-programme" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEP 2020 Academic Framework</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Bachelor of Social Work (BSW)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            The Department offers the Four-Year Undergraduate Programme (FYUP) with multiple exit pathways, synthesizing foundational social work methodologies with rigorous supervised field immersion in Senapati, Manipur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            href="/programmes"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>NEP Curriculum Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/agencies"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <span>Partner Agencies</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Degree Key Facts Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Degree Title</span>
          <div className="text-lg font-black text-slate-900 mt-1">Bachelor of Social Work</div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            BSW (Honours / Research)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration & Format</span>
          <div className="text-lg font-black text-slate-900 mt-1">4 Years (8 Semesters)</div>
          <p className="text-[11px] text-slate-500 mt-1">NEP 2020 FYUP with Multiple Exits</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission Eligibility</span>
          <div className="text-lg font-black text-slate-900 mt-1">10+2 / Higher Secondary</div>
          <p className="text-[11px] text-slate-500 mt-1">Any stream (Arts, Science, Commerce)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">University Affiliation</span>
          <div className="text-lg font-black text-slate-900 mt-1">Manipur University</div>
          <p className="text-[11px] text-slate-500 mt-1">UGC Recognized Institution</p>
        </div>
      </div>

      {/* Core Curriculum Pillars */}
      <div className="mt-10 space-y-4">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
            Curriculum Foundation
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            Core Pillars of BSW Education
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{pillar.title}</h4>
                    <span className="text-[10px] font-semibold text-teal-700 block">
                      {pillar.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Semester Course Overview */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              BSW Eight-Semester NEP Academic Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured progressive coursework aligned with UGC-NEP 2020 curriculum standards.
            </p>
          </div>
          <Link
            href="/programmes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:underline shrink-0"
          >
            <span>View Full Exit Pathways</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {semesters.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-teal-800 uppercase tracking-wide">
                  {s.sem}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Year {Math.ceil((idx + 1) / 2)}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {s.courses.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span className="leading-snug">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
