"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { FacultyMember } from "@/lib/types";
import { 
  Users, 
  Mail, 
  GraduationCap, 
  Search, 
  Phone, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const DEFAULT_FACULTY_FALLBACK: FacultyMember[] = [
  {
    id: "default-fac-1",
    name: "Dr. Rosemary V.",
    designation: "Assistant Professor & Head",
    qualification: "MSW, Ph.D. (Social Work), UGC-NET",
    specialization: "Community Development",
    email: "hod.socialwork@stxaviercollegespt.ac.in",
    officeExtension: "Dept Block A, Room 102",
    bio: "Guiding departmental academic planning, community immersion camps, and institutional research collaborations across Senapati, Manipur.",
  },
  {
    id: "default-fac-2",
    name: "Prof. L. David",
    designation: "Assistant Professor & Fieldwork Director",
    qualification: "MSW (Medical & Psychiatric Social Work), UGC-NET",
    specialization: "Medical & Psychiatric",
    email: "fieldwork@stxaviercollegespt.ac.in",
    officeExtension: "Ext. 204",
    bio: "Coordinating concurrent field placements, agency supervisor conferences, and student evaluation matrices.",
  },
  {
    id: "default-fac-3",
    name: "Ms. Philomena K.",
    designation: "Assistant Professor",
    qualification: "MSW (Human Resource Management), UGC-NET",
    specialization: "Human Resource Management",
    email: "socialwork@stxaviercollegespt.ac.in",
    officeExtension: "Dept Block B",
    bio: "Directing annual 7-day rural educational camps and supervising qualitative social research projects.",
  },
];

function DirectoryAvatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanUrl = imageUrl?.trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  const cleanName = (name || "")
    .replace(/^(Dr\.|Prof\.|Rev\.|Fr\.|Mr\.|Ms\.|Mrs\.)\s+/gi, "")
    .replace(/,\s*(S\.J\.|Ph\.D\.|MSW|M\.Phil\.).*$/gi, "")
    .trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : cleanName.slice(0, 2).toUpperCase() || "SX";

  if (cleanUrl && !hasError) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cleanUrl}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-800 to-slate-900 border border-teal-700/50 flex items-center justify-center text-teal-100 font-black text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300 select-none">
      <span>{initials}</span>
    </div>
  );
}

export default function FacultySection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchFaculty() {
      try {
        setLoading(true);
        let docsSnap;
        try {
          const q = query(collection(db, "faculty"), orderBy("createdAt", "desc"));
          docsSnap = await getDocs(q);
        } catch {
          docsSnap = await getDocs(collection(db, "faculty"));
        }

        if (!docsSnap.empty) {
          const loaded: FacultyMember[] = [];
          docsSnap.forEach((doc) => {
            const d = doc.data();
            loaded.push({
              id: doc.id,
              name: d.name || "Faculty Member",
              designation: d.designation || "Assistant Professor",
              specialization: d.specialization || "Social Work",
              email: d.email || "",
              officeExtension: d.officeExtension,
              qualification: d.qualification,
              bio: d.bio,
              imageUrl: (d.photoUrl || d.imageUrl || d.publicUrl || "").trim(),
            });
          });
          setFacultyList(loaded);
        } else {
          // Check legacy 'staff' collection fallback
          const staffSnap = await getDocs(collection(db, "staff"));
          if (!staffSnap.empty) {
            const loadedStaff = staffSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as FacultyMember[];
            setFacultyList(loadedStaff);
          } else {
            setFacultyList(DEFAULT_FACULTY_FALLBACK);
          }
        }
      } catch (err) {
        console.warn("Could not fetch faculty from Firestore, using default directory:", err);
        setFacultyList(DEFAULT_FACULTY_FALLBACK);
      } finally {
        setLoading(false);
      }
    }

    fetchFaculty();
  }, []);

  const filtered = facultyList.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.designation?.toLowerCase().includes(q) ||
      f.specialization?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q)
    );
  });

  return (
    <section id="faculty-directory" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Mentorship & Guidance</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Faculty & Field Supervisors
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Meet the experienced educators, field supervisors, and research coordinators mentoring student social workers at St. Xavier&apos;s College, Senapati.
          </p>
        </div>

        {!isStandalonePage && (
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>Full Faculty Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search faculty by name, academic specialization, designation, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition shadow-xs"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="mt-6">
        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 animate-pulse shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          // Empty State
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No faculty members found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or check back later.</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          // Profile Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((faculty) => (
              <div
                key={faculty.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs space-y-4"
              >
                <div className="space-y-4">
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-4">
                    <DirectoryAvatar name={faculty.name} imageUrl={faculty.imageUrl} />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                        {faculty.name}
                      </h3>
                      <p className="text-xs font-semibold text-teal-700 mt-0.5">
                        {faculty.designation}
                      </p>
                    </div>
                  </div>

                  {/* Specialization Badge */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Academic Specialization
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200">
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      {faculty.specialization}
                    </span>
                  </div>

                  {/* Qualification */}
                  {faculty.qualification && (
                    <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <GraduationCap className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <span className="leading-snug">{faculty.qualification}</span>
                    </div>
                  )}

                  {/* Bio */}
                  {faculty.bio && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {faculty.bio}
                    </p>
                  )}
                </div>

                {/* Contact Footer */}
                <div className="pt-3.5 border-t border-slate-100 space-y-1.5 text-xs">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-teal-800 transition truncate"
                    title={`Email ${faculty.name}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="truncate">{faculty.email}</span>
                  </a>

                  {faculty.officeExtension && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Phone className="w-3 h-3 text-teal-700 shrink-0" />
                      <span className="truncate">{faculty.officeExtension}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
