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



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f2042] text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>College Motto: &quot;Education for Service&quot;</span>
            </div>
            <a
              href="https://stxaviercollegespt.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <Building2 className="w-3.5 h-3.5 text-[#0f2042]" />
              <span>St. Xavier College, Maram Khunou</span>
            </a>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2042] tracking-tight">
            About the Department of Social Work
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl leading-relaxed">
            St. Xavier College, Maram Khunou (Affiliated to Manipur University) — Guided by the Jesuit ethos of academic rigor and selfless service, preparing social work professionals committed to justice, peace, and tribal community advancement in Manipur.
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