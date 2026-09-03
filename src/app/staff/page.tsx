"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { INITIAL_FACULTY, FacultyMember } from "@/data/facultyData";
import { 
  Users, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Building,
  ArrowRight
} from "lucide-react";

export default function FacultyDirectoryPage() {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(INITIAL_FACULTY);

  // Auto-sync real-time with Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "staff"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const dbStaff: FacultyMember[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<FacultyMember, "id">),
          }));
          setFacultyList(dbStaff);
        } else {
          setFacultyList(INITIAL_FACULTY);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Using fallback faculty dataset:", err);
      setFacultyList(INITIAL_FACULTY);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Academic Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Faculty & Fieldwork Supervisors
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Dedicated educators, researchers, and field practicum coordinators guiding students through fieldwork interventions and social work theory.
            </p>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((member) => (
            <div
              key={member.id}
              className="flex flex-col justify-between rounded-3xl bg-slate-900/60 border border-slate-800 p-6 hover:border-amber-500/40 transition group"
            >
              <div className="space-y-4">
                
                {/* Faculty Card Avatar & Name */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-amber-400 font-black text-xl group-hover:border-amber-500/50 transition">
                    {member.name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, "").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-xs text-amber-400/90 font-medium leading-snug">
                      {member.designation}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-800/80 w-full" />

                {/* Qualifications & Specialization */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Degrees</span>
                      <span>{member.qualification || "MSW"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Specialization</span>
                      <span>{member.specialization || "Social Work Practice"}</span>
                    </div>
                  </div>

                  {member.officeRoom && (
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Office Desk</span>
                        <span>{member.officeRoom}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Email Contact Button */}
              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}