"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  Users,
  Building2,
  Mail,
  GraduationCap,
  Briefcase,
  Compass,
  ArrowLeft,
  Sparkles,
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
  MapPin,
} from "lucide-react";

interface LeadershipMember {
  id: string;
  name: string;
  qualifications: string;
  designation: string;
  affiliation: string;
  imageUrl?: string;
  roleNote?: string;
}

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  specialization: string;
  supervisoryRole?: string;
  email: string;
  officeExtension?: string;
  imageUrl?: string;
  bio?: string;
}

const COLLEGE_LEADERSHIP: LeadershipMember[] = [
  {
    id: "lead-1",
    name: "Rev. Dr. Joseph M., S.J.",
    qualifications: "Ph.D. in Educational Leadership, M.A., B.Ed.",
    designation: "Principal",
    affiliation: "St. Xavier College, Maram Khunou | Affiliated to Manipur University",
    roleNote: "Institutional Head & Departmental Patron",
    imageUrl: "",
  },
  {
    id: "lead-2",
    name: "Rev. Fr. Thomas K., S.J.",
    qualifications: "M.Phil., M.Sc., PGDEM",
    designation: "Vice-Principal & Academic Dean",
    affiliation: "St. Xavier College, Maram Khunou | Affiliated to Manipur University",
    roleNote: "Academic Administration & Curricular Oversight",
    imageUrl: "",
  },
  {
    id: "lead-3",
    name: "Rev. Fr. David S., S.J.",
    qualifications: "MBA (Finance), M.Com.",
    designation: "Campus Administrator & Bursar",
    affiliation: "St. Xavier College, Maram Khunou | Campus Administration",
    roleNote: "Institutional Facilities & Student Support",
    imageUrl: "",
  },
];

const DEFAULT_FACULTY: FacultyMember[] = [
  {
    id: "fac-1",
    name: "Dr. Rosemary V.",
    designation: "Assistant Professor & Head of Department",
    qualification: "MSW, Ph.D. (Social Work), UGC-NET",
    specialization: "Community Development & Tribal Action",
    supervisoryRole: "Fieldwork Practicum Director & Academic Mentor",
    email: "hod.socialwork@stxaviercollegespt.ac.in",
    officeExtension: "Dept Block A, Room 102",
    bio: "Guiding departmental academic planning, community immersion camps, and institutional research collaborations across Senapati, Manipur.",
  },
  {
    id: "fac-2",
    name: "Prof. L. David",
    designation: "Assistant Professor & Fieldwork Coordinator",
    qualification: "MSW (Medical & Psychiatric Social Work), UGC-NET",
    specialization: "Medical & Psychiatric Social Work",
    supervisoryRole: "Concurrent Fieldwork Supervisor (Hospital & Healthcare Placements)",
    email: "fieldwork@stxaviercollegespt.ac.in",
    officeExtension: "Dept Block A, Room 104",
    bio: "Coordinating concurrent agency placements, clinical supervision, and student evaluation matrices with partner health centers.",
  },
  {
    id: "fac-3",
    name: "Ms. Philomena K.",
    designation: "Assistant Professor & Rural Camp Director",
    qualification: "MSW (Human Resource Management), UGC-NET",
    specialization: "Child & Youth Welfare & NGO Governance",
    supervisoryRole: "Annual Rural Educational Camp Coordinator & PRA Mentor",
    email: "socialwork@stxaviercollegespt.ac.in",
    officeExtension: "Dept Block B, Room 201",
    bio: "Directing 10-day rural educational immersion camps, Participatory Rural Appraisals, and youth awareness initiatives.",
  },
  {
    id: "fac-4",
    name: "Mr. K. Anthony",
    designation: "Assistant Professor & Practicum Advisor",
    qualification: "MSW, UGC-NET, PGDHRM",
    specialization: "Social Policy & Human Rights Advocacy",
    supervisoryRole: "Casework & Group Work Process Recording Supervisor",
    email: "anthony.sw@stxaviercollegespt.ac.in",
    officeExtension: "Dept Block A, Room 105",
    bio: "Supervising individual process recordings, ethical reflections, and social research projects.",
  },
];

// Helper to extract clean initials from name
function getInitials(name: string): string {
  if (!name) return "SX";
  // Remove titles
  const cleanName = name
    .replace(/^(Dr\.|Prof\.|Rev\.|Fr\.|Mr\.|Ms\.|Mrs\.)\s+/gi, "")
    .replace(/,\s*(S\.J\.|Ph\.D\.|MSW|M\.Phil\.).*$/gi, "")
    .trim();

  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return "SX";
}

// Graceful Avatar with image support & high-contrast initials fallback
function FacultyAvatar({
  name,
  imageUrl,
  size = "md",
}: {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);

  // Reset error when imageUrl prop changes
  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const sizeClasses =
    size === "lg"
      ? "w-20 h-20 text-xl rounded-2xl"
      : size === "sm"
      ? "w-10 h-10 text-xs rounded-xl"
      : "w-14 h-14 text-base rounded-2xl";

  const cleanUrl = imageUrl?.trim();

  if (cleanUrl && !hasError) {
    return (
      <div className={`relative ${sizeClasses} overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs`}>
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
    <div
      className={`${sizeClasses} shrink-0 bg-gradient-to-br from-teal-800 to-slate-900 text-teal-100 flex items-center justify-center font-black tracking-wider shadow-xs border border-teal-700/50 select-none`}
    >
      <span>{initials}</span>
    </div>
  );
}

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(DEFAULT_FACULTY);
  const [leadershipList, setLeadershipList] = useState<LeadershipMember[]>(COLLEGE_LEADERSHIP);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchFacultyData() {
      try {
        setLoading(true);
        const colRef = collection(db, "faculty");
        let rawDocs: any[] = [];

        try {
          const q = query(colRef, orderBy("createdAt", "desc"), limit(30));
          const snap = await getDocs(q);
          if (!snap.empty) {
            rawDocs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }
        } catch (queryErr) {
          console.warn("Ordered faculty query fell back:", queryErr);
          const fallbackSnap = await getDocs(query(colRef, limit(30)));
          if (!fallbackSnap.empty) {
            rawDocs = fallbackSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }
        }

        if (rawDocs.length > 0 && isMounted) {
          const leadershipFromDb = rawDocs.filter((d) => d.categoryTier === "College Leadership");
          const facultyFromDb = rawDocs.filter((d) => d.categoryTier !== "College Leadership");

          if (leadershipFromDb.length > 0) {
            setLeadershipList(
              leadershipFromDb.map((d) => ({
                id: d.id,
                name: d.name || "Leadership Member",
                qualifications: d.qualification || "",
                designation: d.designation || "College Executive",
                affiliation: d.affiliation || "St. Xavier College, Maram Khunou | Affiliated to Manipur University",
                roleNote: d.supervisoryRole || "College Leadership & Patron",
                imageUrl: (d.photoUrl || d.imageUrl || d.publicUrl || "").trim(),
              }))
            );
          }

          if (facultyFromDb.length > 0) {
            setFacultyList(
              facultyFromDb.map((d) => ({
                id: d.id,
                name: d.name || "Faculty Member",
                designation: d.designation || "Assistant Professor",
                qualification: d.qualification,
                specialization: d.specialization || "Social Work",
                supervisoryRole: d.supervisoryRole || "Fieldwork Supervisor",
                email: d.email || "",
                officeExtension: d.officeExtension,
                imageUrl: (d.photoUrl || d.imageUrl || d.publicUrl || "").trim(),
                bio: d.bio,
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Could not fetch faculty from Firestore, using default directory:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFacultyData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFaculty = facultyList.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q) ||
      f.supervisoryRole?.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Users className="w-3.5 h-3.5 text-teal-700" />
            <span>Academic Leadership & Mentors</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            College Leadership & Faculty Directory
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl leading-relaxed">
            St. Xavier College, Maram Khunou blends Jesuit educational excellence with committed social work educators, researchers, and fieldwork supervisors dedicated to tribal and regional empowerment in Manipur.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* ========================================================= */}
        {/* TIER 1: COLLEGE LEADERSHIP & PATRONS                      */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Executive Governance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                College Leadership & Patrons
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              St. Xavier College, Maram Khunou | Senapati District
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadershipList.map((leader) => (
              <div
                key={leader.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <FacultyAvatar
                      name={leader.name}
                      imageUrl={leader.imageUrl}
                      size="lg"
                    />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      {leader.designation}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-800 transition">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">
                      {leader.qualifications}
                    </p>
                    {leader.roleNote && (
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {leader.roleNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="truncate">{leader.affiliation}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* TIER 2: DEPARTMENT FACULTY & FIELDWORK SUPERVISORS         */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-widest">
                <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
                <span>Department Staff</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Department Faculty & Fieldwork Supervisors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Academic mentors and practice supervisors guiding BSW students through classroom methods and concurrent agency fieldwork.
              </p>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-72 self-start sm:self-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty by name, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
              />
            </div>
          </div>

          {/* Skeleton Loaders */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-48 bg-slate-200 rounded"></div>
                      <div className="h-3 w-32 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Faculty Cards Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFaculty.map((faculty) => (
                <div
                  key={faculty.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs space-y-5"
                >
                  <div className="space-y-4">
                    
                    {/* Header Row: Avatar, Name, Designation */}
                    <div className="flex items-start gap-4">
                      <FacultyAvatar
                        name={faculty.name}
                        imageUrl={faculty.imageUrl}
                        size="md"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-800 transition truncate">
                          {faculty.name}
                        </h3>
                        <p className="text-xs font-bold text-teal-800 mt-0.5">
                          {faculty.designation}
                        </p>
                        {faculty.qualification && (
                          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {faculty.qualification}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Core Specialization */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Academic Specialization
                      </span>
                      <div className="text-xs font-bold text-slate-900">
                        {faculty.specialization}
                      </div>
                    </div>

                    {/* Fieldwork Supervisory Role */}
                    {faculty.supervisoryRole && (
                      <div className="flex items-start gap-2 text-xs text-slate-600">
                        <Compass className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900">Supervisory Practicum: </span>
                          <span>{faculty.supervisoryRole}</span>
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {faculty.bio && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {faculty.bio}
                      </p>
                    )}

                  </div>

                  {/* Footer: Email & Extension */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <a
                      href={`mailto:${faculty.email}`}
                      className="inline-flex items-center gap-1.5 text-teal-800 font-bold hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-teal-700" />
                      <span className="truncate">{faculty.email}</span>
                    </a>

                    {faculty.officeExtension && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{faculty.officeExtension}</span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Empty Search State */}
          {!loading && filteredFaculty.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No faculty members found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No profiles matched your search term &quot;{searchTerm}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
