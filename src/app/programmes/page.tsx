"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  FileText,
  Briefcase,
  Compass,
  Award,
  Users,
  Tent,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
  HelpCircle,
} from "lucide-react";

interface YearPath {
  yearNum: number;
  yearLabel: string;
  semesters: string;
  theme: string;
  exitAward: string;
  exitLevel: string;
  credits: string;
  focusCourses: string[];
  practicum: string;
  practicumDetails: string;
  accentColor: {
    border: string;
    badge: string;
    bg: string;
  };
}

const NEP_YEARS: YearPath[] = [
  {
    yearNum: 1,
    yearLabel: "Year 1",
    semesters: "Semesters I & II",
    theme: "Foundation & Agency Exposure",
    exitAward: "Undergraduate Certificate in Social Work",
    exitLevel: "NHEQF Level 5.0",
    credits: "40–44 Credits (+ 4-credit summer internship)",
    focusCourses: [
      "History & Philosophy of Social Work Profession",
      "Sociology for Social Work Practice in India",
      "Human Growth, Behavior & Development",
      "Introduction to Social Problems & Social Welfare",
    ],
    practicum: "Structured Observational Visits & Lab Practice",
    practicumDetails:
      "Structured observational exposure visits to grassroots NGOs, welfare institutions, primary health centers, and rural tribal communities in Senapati District.",
    accentColor: {
      border: "border-blue-200 hover:border-blue-400",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      bg: "bg-blue-50/40",
    },
  },
  {
    yearNum: 2,
    yearLabel: "Year 2",
    semesters: "Semesters III & IV",
    theme: "Direct Methods of Social Work",
    exitAward: "Undergraduate Diploma in Social Work",
    exitLevel: "NHEQF Level 5.5",
    credits: "80–88 Cumulative Credits",
    focusCourses: [
      "Social Case Work (Working with Individuals & Families)",
      "Social Group Work (Working with Groups & Collectives)",
      "Community Organization & Social Action",
      "Social Policy & Welfare Legislation",
    ],
    practicum: "Concurrent Fieldwork Practicum (2 Days/Week)",
    practicumDetails:
      "Continuous placement in recognized development organizations, youth clubs, and rehabilitation centers with weekly process recording submissions.",
    accentColor: {
      border: "border-indigo-200 hover:border-indigo-400",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
      bg: "bg-indigo-50/40",
    },
  },
  {
    yearNum: 3,
    yearLabel: "Year 3",
    semesters: "Semesters V & VI",
    theme: "Advanced Practice & Rural Immersion",
    exitAward: "Bachelor of Social Work (BSW Degree)",
    exitLevel: "NHEQF Level 6.0",
    credits: "120–132 Cumulative Credits",
    focusCourses: [
      "Social Welfare Administration & Project Management",
      "Social Work Research Methods & Social Statistics",
      "Human Rights, Gender & Social Justice Legislation",
      "Mental Health & Psychosocial Support Interventions",
    ],
    practicum: "10-Day Annual Rural Educational Camp + Concurrent Practicum",
    practicumDetails:
      "Live-in community immersion conducting Participatory Rural Appraisals (PRA), baseline surveys, street plays, and village community mobilization campaigns.",
    accentColor: {
      border: "border-teal-200 hover:border-teal-400",
      badge: "bg-teal-50 text-teal-800 border-teal-200",
      bg: "bg-teal-50/40",
    },
  },
  {
    yearNum: 4,
    yearLabel: "Year 4",
    semesters: "Semesters VII & VIII",
    theme: "FYUP Advanced / Research Track",
    exitAward: "BSW (Honours / Honours with Research)",
    exitLevel: "NHEQF Level 6.5",
    credits: "160 Cumulative Credits",
    focusCourses: [
      "Specialized Clinical & Community Social Work Practice",
      "Advanced Social Policy Formulation & Evaluation",
      "Corporate Social Responsibility (CSR) & ESG Governance",
      "Independent Research Methodology Seminar",
    ],
    practicum: "Block Fieldwork Internship & Research Dissertation",
    practicumDetails:
      "Four-week full-time intensive pre-professional agency block placement accompanied by a supervised independent empirical research dissertation.",
    accentColor: {
      border: "border-purple-200 hover:border-purple-400",
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      bg: "bg-purple-50/40",
    },
  },
];

const PEDAGOGY_STRIP = [
  {
    title: "Concurrent Fieldwork",
    hours: "2 Days Weekly Practicum",
    desc: "Students spend two continuous days every week placed with partner NGOs and healthcare centers, applying classroom methods directly to real client systems.",
    icon: Briefcase,
  },
  {
    title: "Rural Educational Camp",
    hours: "10-Day Village Immersion",
    desc: "Intensive rural living focusing on Participatory Rural Appraisal (PRA) techniques, socio-economic baseline surveys, and grassroots community conscientization.",
    icon: Tent,
  },
  {
    title: "Individual Supervision",
    hours: "Weekly Conference (IC/GC)",
    desc: "One-on-one and group supervisory conferences with faculty fieldwork supervisors for process record analysis, ethics guidance, and self-awareness.",
    icon: Users,
  },
];

const CAREER_OUTCOMES = [
  {
    title: "District Child Protection Units (DCPU)",
    domain: "Government & Child Welfare",
    desc: "Protection officers, case workers, and counselors under Juvenile Justice and Mission Vatsalya frameworks.",
  },
  {
    title: "Corporate Social Responsibility (CSR)",
    domain: "Corporate Sector",
    desc: "Community relations officers, ESG analysts, and sustainability program managers in private foundations.",
  },
  {
    title: "National & International NGOs",
    domain: "Development Sector",
    desc: "Project coordinators, field managers, and advocacy officers in rural health, livelihood, and education.",
  },
  {
    title: "Hospital & Medical Social Work",
    domain: "Healthcare Institutions",
    desc: "Patient navigators, psychiatric social workers, rehabilitation counselors in government and private hospitals.",
  },
  {
    title: "Rural Development & Panchayati Raj",
    domain: "Community & Local Governance",
    desc: "Mobilizers and baseline analysts working with Autonomous District Councils, SHG federations, and farmer cooperatives.",
  },
  {
    title: "Higher Education & Research Pathways",
    domain: "Postgraduate Studies",
    desc: "Direct eligibility for Master of Social Work (MSW) at premier institutes (TISS, Delhi University, Central Universities) and civil services.",
  },
];

export default function ProgrammesPage() {
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = all years, 1, 2, 3, 4 = individual
  const [syllabusUrl, setSyllabusUrl] = useState<string | null>(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if there is an uploaded syllabus in Firestore 'downloads' collection
    const checkSyllabus = async () => {
      try {
        const qSyllabus = query(
          collection(db, "downloads"),
          where("category", "==", "Syllabus"),
          limit(1)
        );
        const snap = await getDocs(qSyllabus);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          if (docData.fileUrl) {
            setSyllabusUrl(docData.fileUrl);
          }
        }
      } catch (err) {
        console.warn("Could not query syllabus from Firestore downloads:", err);
      }
    };
    checkSyllabus();
  }, []);

  const handleSyllabusClick = () => {
    if (syllabusUrl) {
      window.open(syllabusUrl, "_blank", "noopener,noreferrer");
    } else {
      setShowSyllabusModal(true);
    }
  };

  const displayedYears = activeTab === 0 ? NEP_YEARS : NEP_YEARS.filter((y) => y.yearNum === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* ========================================================= */}
      {/* 1. HERO HEADER & PROGRAMME IDENTITY                       */}
      {/* ========================================================= */}
      <section className="relative bg-white border-b border-slate-200 pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold uppercase tracking-widest shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>NEP 2020 CURRICULUM FRAMEWORK</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Bachelor of Social Work <span className="text-teal-800">(BSW)</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg font-bold text-slate-700">
                Four-Year Undergraduate Programme (FYUP) with Multiple Exit Options
              </p>

              {/* Institutional Line */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  Department of Social Work, St. Xavier College, Maram Khunou | Affiliated to Manipur University
                </span>
              </div>

              {/* Key Quick Facts Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-md border border-slate-200">
                  Duration: 4 Years (8 Semesters)
                </span>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-md border border-slate-200">
                  Eligibility: 10+2 Any Stream
                </span>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-md border border-slate-200">
                  Mode: Full-time Regular
                </span>
                <span className="text-[11px] font-semibold bg-teal-50 text-teal-800 px-3 py-1 rounded-md border border-teal-200">
                  NHEQF Credit-Based Structure
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSyllabusClick}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold transition shadow-xs hover:shadow-md cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download BSW NEP Syllabus (PDF)</span>
                  <Download className="w-3.5 h-3.5 opacity-80" />
                </button>

                <Link
                  href="/agencies"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold transition shadow-xs hover:border-slate-400"
                >
                  <Briefcase className="w-4 h-4 text-teal-700" />
                  <span>Approved Placement Agencies</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

            </div>

            {/* Right Card / Degree Badge Container */}
            <div className="lg:w-80 shrink-0 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shadow-xs">
                  BSW
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">UGC-NEP Model</h3>
                  <p className="text-xs text-slate-500">Choice-Based Credit System</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Faculty Ratio</span>
                  <span className="font-semibold text-slate-900">Supervised 1:8</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Fieldwork Days</span>
                  <span className="font-semibold text-slate-900">2 Days / Week</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Practicum Hours</span>
                  <span className="font-semibold text-slate-900">500+ Supervised</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Rural Immersion</span>
                  <span className="font-semibold text-slate-900">10-Day PRA Camp</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. NEP CREDIT-BASED PROGRESSION & MULTIPLE EXIT PATHWAYS */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>Credit Progression & Multiple Exits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              NEP 2020 Four-Year Structure & Exit Pathways
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Designed in alignment with National Higher Education Qualifications Framework (NHEQF), allowing students flexibility to exit at various levels with formal certifications or complete the full Honours with Research.
            </p>
          </div>

          {/* Interactive Year Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-200/80 border border-slate-300 self-start md:self-auto">
            <button
              onClick={() => setActiveTab(0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 0
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All 4 Years
            </button>
            {NEP_YEARS.map((y) => (
              <button
                key={y.yearNum}
                onClick={() => setActiveTab(y.yearNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === y.yearNum
                    ? "bg-teal-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {y.yearLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Year Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedYears.map((year) => (
            <div
              key={year.yearNum}
              className={`p-6 sm:p-7 rounded-3xl bg-white border ${year.accentColor.border} shadow-xs hover:shadow-md transition flex flex-col justify-between`}
            >
              <div className="space-y-5">
                
                {/* Year Header & Stage */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {year.yearLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {year.semesters}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                      {year.theme}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${year.accentColor.badge} shrink-0`}>
                    {year.exitLevel}
                  </span>
                </div>

                {/* Core Theoretical Focus */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Core Methodological & Theory Focus
                  </span>
                  <ul className="space-y-2">
                    {year.focusCourses.map((course, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practicum & Field Immersion Highlight */}
                <div className={`p-4 rounded-2xl ${year.accentColor.bg} border border-slate-200/80 space-y-1`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Compass className="w-3.5 h-3.5 text-teal-700" />
                    <span>Practicum: {year.practicum}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {year.practicumDetails}
                  </p>
                </div>

              </div>

              {/* Exit Award Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    NEP Multiple Exit Award
                  </span>
                  <div className="text-xs sm:text-sm font-black text-teal-900 flex items-center gap-1.5 mt-0.5">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{year.exitAward}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500 self-start sm:self-auto bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {year.credits}
                </span>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. SIGNATURE FIELDWORK PEDAGOGY STRIP (3 Highlights)      */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-sm space-y-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">
              Field Practicum Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Signature Fieldwork Pedagogy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Social work education derives its strength from the field. Our students undergo structured, supervised community and institutional immersion throughout their progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PEDAGOGY_STRIP.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-500 transition space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{p.title}</h3>
                    <span className="inline-block text-[11px] font-mono text-teal-300 font-semibold mt-0.5">
                      {p.hours}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-center sm:text-left">
            <p className="text-xs text-slate-400">
              Fieldwork evaluations constitute 50% of practical course credits through process recordings, viva-voce, and agency evaluation.
            </p>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shrink-0"
            >
              <span>Explore Partner Agencies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CAREER OUTCOMES & POST-BSW PATHWAYS                   */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
            <span>Professional Horizons</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Career Outcomes & Post-BSW Pathways
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            BSW graduates from St. Xavier College possess hands-on grassroots competence, human relations mastery, and research literacy for immediate employment or competitive postgraduate progression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAREER_OUTCOMES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-block">
                  {item.domain}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-teal-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Active Alumni Placement Domain</span>
              </div>
            </div>
          ))}
        </div>

        {/* Higher Education Note */}
        <div className="mt-8 p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-900 border border-teal-300 shrink-0">
              <Award className="w-5 h-5 text-teal-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Eligibility for National Higher Education & Civil Services
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                The 4-Year BSW Honours degree equips students with direct eligibility for 1-Year Master&apos;s degrees under NEP, TISS National Entrance, and UGC-NET.
              </p>
            </div>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shrink-0"
          >
            <span>Explore Resource Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

      {/* ========================================================= */}
      {/* SYLLABUS DOWNLOAD & OVERVIEW MODAL                        */}
      {/* ========================================================= */}
      {showSyllabusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setShowSyllabusModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">BSW NEP 2020 Curriculum</h3>
                <p className="text-xs text-slate-500">St. Xavier College, Maram Khunou</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The official NEP 2020 syllabus document provides the complete 160-credit course mapping, unit-wise pedagogical objectives, continuous internal evaluation (CIE) schemes, and fieldwork journal guidelines.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Academic Framework:</span>
                <span className="font-bold text-slate-900">NEP 2020 (FYUP)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Affiliating University:</span>
                <span className="font-bold text-slate-900">Manipur University</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Total Credits:</span>
                <span className="font-bold text-slate-900">160 Credits (8 Semesters)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/resources"
                onClick={() => setShowSyllabusModal(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Visit Student Resource Desk</span>
              </Link>
              <button
                onClick={() => setShowSyllabusModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}