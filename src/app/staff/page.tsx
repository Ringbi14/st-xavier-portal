import React from "react";
import { UserCheck, Mail } from "lucide-react";

const PLACEHOLDER_FACULTY = [
  {
    name: "[ADD FACULTY NAME]",
    designation: "Head of Department / Assistant Professor",
    qualification: "[ADD QUALIFICATION, e.g., MSW, Ph.D., NET]",
    specialization: "[ADD SPECIALIZATION, e.g., Community Development / HRM / Medical & Psychiatric]",
    bio: "[ADD FACULTY BIOGRAPHY AND RESEARCH INTERESTS]",
  },
  {
    name: "[ADD FACULTY NAME]",
    designation: "Assistant Professor",
    qualification: "[ADD QUALIFICATION, e.g., MSW, NET]",
    specialization: "[ADD SPECIALIZATION]",
    bio: "[ADD FACULTY BIOGRAPHY AND RESEARCH INTERESTS]",
  },
  {
    name: "[ADD FACULTY NAME]",
    designation: "Fieldwork Coordinator / Faculty Member",
    qualification: "[ADD QUALIFICATION]",
    specialization: "[ADD SPECIALIZATION]",
    bio: "[ADD FACULTY BIOGRAPHY AND RESEARCH INTERESTS]",
  },
];

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Faculty Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Academic & Fieldwork Mentors
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Dedicated educators and practitioners guiding social work scholars at St. Xavier College, Maram Khunou.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_FACULTY.map((faculty, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xl">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{faculty.name}</h3>
                  <p className="text-xs font-semibold text-amber-500 mt-0.5">{faculty.designation}</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{faculty.qualification}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-300 block mb-1">Specialization:</span>
                  <p className="text-xs text-slate-400">{faculty.specialization}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{faculty.bio}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" /> [ADD OFFICIAL EMAIL]
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}