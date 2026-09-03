import React from "react";
import Link from "next/link";
import { 
  Building2, 
  Target, 
  Compass, 
  BookOpen, 
  Users, 
  Award, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin
} from "lucide-react";

export default function AboutPage() {
  const objectives = [
    {
      title: "Concurrent Fieldwork Practicum",
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

  const highlights = [
    { number: "3 Years", label: "Full-Time BSW Degree" },
    { number: "500+ Hrs", label: "Supervised Field Practicum" },
    { number: "100%", label: "Placement Assistance" },
    { number: "2019", label: "Department Inception" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Hero Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Department Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center"
            >
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">
                {item.number}
              </div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        {/* Core Educational Pillars */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Curricular Highlights
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
        </div>

        {/* Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Connect with Department Faculty & Resources
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Access syllabus guidelines, student fieldwork records, or get in touch directly with our academic coordinators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/staff"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/10"
            >
              Faculty Directory
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              Student Downloads
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}