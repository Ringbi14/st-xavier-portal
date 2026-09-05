"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  Building2, 
  Briefcase, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  const coreValues = [
    {
      title: "Human Dignity & Social Justice",
      desc: "Upholding the inherent worth of every individual and confronting systemic inequalities across marginalized communities.",
    },
    {
      title: "Integrity & Professional Ethics",
      desc: "Operating with absolute transparency, confidentiality, and professional accountability as guided by national social work codes.",
    },
    {
      title: "Community Immersion",
      desc: "Grounded praxis through continuous, respectful engagement with indigenous rural communities across Senapati and Manipur.",
    },
    {
      title: "Reflective Praxis",
      desc: "Synthesizing theoretical casework frameworks with supervised weekly field recordings and analytical conferences.",
    },
  ];

  const methodologyPillars = [
    {
      name: "Social Casework",
      desc: "Working with individuals and families facing psychosocial challenges through systematic assessment and supportive intervention.",
    },
    {
      name: "Social Group Work",
      desc: "Facilitating group dynamics, youth leadership, and peer support systems to enhance social functioning and collaboration.",
    },
    {
      name: "Community Organization",
      desc: "Mobilizing grassroots collectives to identify local needs, utilize community resources, and build sustainable local infrastructure.",
    },
    {
      name: "Social Action & Research",
      desc: "Conducting empirical field research and participatory rural appraisals to advocate for structural policy reform and rights.",
    },
  ];

  const historyMilestones = [
    {
      year: "2019",
      title: "Establishment of the Department",
      desc: "The Department of Social Work was formally established at St. Xavier College, Maram Khunou, introducing the Bachelor of Social Work (BSW) curriculum affiliated with Manipur University.",
    },
    {
      year: "2020–2021",
      title: "Fieldwork Network Foundation",
      desc: "Formulated formal institutional linkages with civil society organizations, health centers, and community institutions across Senapati district.",
    },
    {
      year: "2022–2024",
      title: "Rural Educational Camps & Outreach",
      desc: "Expanded annual intensive 7-day rural educational camps, conducting participatory rural appraisals (PRA), health camps, and cultural documentation.",
    },
    {
      year: "2025–Present",
      title: "Digital Ecosystem & Regional Impact",
      desc: "Launched centralized digital archives, formal alumni networks, and expanded block internship placements across Northeast India.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Academic Identity & Philosophy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About the Department of Social Work
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            St. Xavier College, Maram Khunou — Preparing professional social workers grounded in ethical discernment, scientific inquiry, and grassroots community commitment.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        
        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Department Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be a premier center of social work education and community engagement in Northeast India, forming competent, compassionate, and ethical practitioners committed to justice, peace, and sustainable human development.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Department Mission</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>Deliver rigorous classroom pedagogy integrated with supervised concurrent fieldwork.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>Empower marginalized communities through participatory rural appraisals and action research.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>Inculcate professional values of empathy, social equality, and institutional accountability.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Guiding Principles
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">
              Core Professional Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((val, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-700" />
                  <span>{val.title}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-4">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Work Methods Taught */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Curriculum Core
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">
              Social Work Methods & Practice
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {methodologyPillars.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="text-xs font-bold text-slate-900">{m.name}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Department History Timeline */}
        <section className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Department Chronicle</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                History & Milestones
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Est. 2019
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 pl-6 space-y-8 ml-2">
            {historyMilestones.map((h, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-teal-700 shadow-xs" />
                <span className="text-xs font-bold text-teal-800 font-mono">{h.year}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{h.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Step Callout */}
        <section className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Explore Fieldwork Opportunities</h3>
            <p className="text-xs text-slate-600">Browse the directory of agencies and NGOs partnered with our department.</p>
          </div>
          <Link
            href="/organizations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs shrink-0"
          >
            <span>View Agency Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

      </div>
    </div>
  );
}