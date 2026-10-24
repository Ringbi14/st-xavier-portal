"use client";

import React from "react";

export default function ResearchPage() {
  const projects = [
    {
      title: "Participatory Assessment of Maternal and Child Health in Senapati District",
      focus: "Community Health & Traditional Support Systems",
      faculty: "Prof. Mary Grace (Fieldwork Supervisor)",
      summary:
        "Qualitative research surveying community-level antenatal practices and primary health sub-center accessibility across hill village clusters.",
    },
    {
      title: "Human Resource Practices in Small-Scale Enterprises in Rural Manipur",
      focus: "Social Policy & Labor Welfare",
      faculty: "Prof. K. John Vianney",
      summary:
        "Investigating employment relations, wage protection, and informal safety networks within rural enterprise collectives.",
    },
    {
      title: "Indigenous Youth Collectives and Grassroots Self-Governance",
      focus: "Tribal Studies & Community Organization",
      faculty: "Dr. L. Timothy (Head of Department)",
      summary:
        "Documenting traditional youth institutions and their contemporary transition toward community development leadership.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Department Research Desk
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Social Research & Field Projects</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Community-centered inquiry, Participatory Rural Appraisals (PRA), and empirical social policy studies conducted in Northeast India.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        <div className="space-y-4">
          {projects.map((p, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {p.focus}
              </span>
              <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Principal Coordinator: {p.faculty}</p>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{p.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}