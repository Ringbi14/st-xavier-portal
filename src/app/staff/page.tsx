"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  Users, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award,
  Search,
  Building2
} from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  experience?: string;
  bio?: string;
  imageUrl?: string;
}

const DEFAULT_STAFF: FacultyMember[] = [
  {
    id: "fac-1",
    name: "Head of Department",
    designation: "Assistant Professor & Head",
    qualification: "MSW, Ph.D. (Social Work), UGC-NET",
    specialization: "Community Organization, Rural Development & Indigenous Studies",
    email: "hod.socialwork@stxaviercollegespt.ac.in",
    experience: "8+ Years in Higher Education & Grassroots Field Action",
    bio: "Guiding departmental academic planning, community immersion camps, and institutional research collaborations across Manipur.",
  },
  {
    id: "fac-2",
    name: "Fieldwork Coordinator",
    designation: "Assistant Professor & Fieldwork Director",
    qualification: "MSW (Medical & Psychiatric Social Work), UGC-NET",
    specialization: "Social Casework, Mental Health, Clinical Practicum Supervision",
    email: "fieldwork@stxaviercollegespt.ac.in",
    experience: "6+ Years Fieldwork Supervision & Clinical Liaison",
    bio: "Coordinating concurrent field placements, agency supervisor conferences, and student evaluation matrices.",
  },
  {
    id: "fac-3",
    name: "Faculty Member & Camp In-charge",
    designation: "Assistant Professor",
    qualification: "MSW (Human Resource Management), UGC-NET",
    specialization: "Social Group Work, Youth Leadership, Participatory Rural Appraisal (PRA)",
    email: "socialwork@stxaviercollegespt.ac.in",
    experience: "5+ Years Academic & Youth Collective Mentorship",
    bio: "Directing annual 7-day rural educational camps and supervising qualitative social research projects.",
  },
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<FacultyMember[]>(DEFAULT_STAFF);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "staff"), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FacultyMember[];
          setStaffList(loaded);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn("Firestore staff subscription error:", err);
    }
  }, []);

  const filteredStaff = staffList.filter((faculty) => {
    return (
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Academic Leadership & Mentors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Faculty & Field Supervisors
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Meet the educators and fieldwork coordinators guiding student practitioners through rigorous classroom methodology and supervised community practice.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Search */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, specialization, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((faculty) => (
            <div
              key={faculty.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition shadow-xs flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-4">
                
                {/* Avatar / Placeholder */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-xl overflow-hidden shrink-0 shadow-xs">
                    {faculty.imageUrl ? (
                      <Image
                        src={faculty.imageUrl}
                        alt={faculty.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 opacity-80" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                      {faculty.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">
                      {faculty.designation}
                    </p>
                  </div>
                </div>

                {/* Qualification badge */}
                <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{faculty.qualification}</span>
                </div>

                {/* Specialization */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Specialization
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    {faculty.specialization}
                  </p>
                </div>

                {/* Experience & Bio */}
                {faculty.bio && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {faculty.bio}
                  </p>
                )}

              </div>

              {/* Contact Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <a
                  href={`mailto:${faculty.email}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-teal-800 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="truncate">{faculty.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStaff.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No faculty members found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query.</p>
          </div>
        )}

      </div>
    </div>
  );
}