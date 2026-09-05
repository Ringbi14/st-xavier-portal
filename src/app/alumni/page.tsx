"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Search, 
  Tag, 
  Mail, 
  ExternalLink,
  Award,
  HeartHandshake,
  UserCheck
} from "lucide-react";

interface AlumniMember {
  id: string;
  name: string;
  batch: string;
  currentRole: string;
  organization: string;
  location: string;
  sector: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  imageUrl?: string;
}

const DEFAULT_ALUMNI: AlumniMember[] = [
  {
    id: "alm-1",
    name: "Alumni Practitioner",
    batch: "Class of 2022",
    currentRole: "Project Coordinator",
    organization: "Rural Women Empowerment Collective",
    location: "Imphal, Manipur",
    sector: "Women & Child Development",
    bio: "Supervising field initiatives for livelihood enhancement and reproductive health education across rural blocks.",
  },
  {
    id: "alm-2",
    name: "Community Organizer",
    batch: "Class of 2023",
    currentRole: "Grassroots Field Officer",
    organization: "Tribal Rights & Youth Development Forum",
    location: "Senapati, Manipur",
    sector: "Tribal Governance & Rights",
    bio: "Mobilizing youth groups and facilitating participatory community action programs in hill district villages.",
  },
  {
    id: "alm-3",
    name: "Medical Social Worker",
    batch: "Class of 2024",
    currentRole: "Counselor & Social Worker",
    organization: "Community Health & Rehabilitation Mission",
    location: "Dimapur, Nagaland",
    sector: "Healthcare & Mental Health",
    bio: "Providing psychosocial support, patient counseling, and rehabilitation coordination in primary healthcare settings.",
  },
];

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<AlumniMember[]>(DEFAULT_ALUMNI);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "alumni"), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AlumniMember[];
          setAlumniList(loaded);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn("Firestore alumni subscription error:", err);
    }
  }, []);

  const batches = ["All", ...Array.from(new Set(alumniList.map((a) => a.batch).filter(Boolean)))];

  const filteredAlumni = alumniList.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === "All" || alum.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Practitioner Network & Legacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Alumni & Practitioner Community
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Celebrating graduates of the Bachelor of Social Work (BSW) program leading grassroots change, human rights advocacy, and policy action across Northeast India.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Search & Filter Controls */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alumni by name, organization, designation, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Batch:
            </span>
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedBatch === batch
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>

        {/* Alumni Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alum) => (
            <div
              key={alum.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition shadow-xs flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    {alum.sector}
                  </span>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {alum.batch}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-base shrink-0">
                    {alum.imageUrl ? (
                      <Image
                        src={alum.imageUrl}
                        alt={alum.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <GraduationCap className="w-6 h-6 opacity-80" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition">
                      {alum.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600">
                      {alum.currentRole}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Briefcase className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="truncate">{alum.organization}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{alum.location}</span>
                  </div>
                </div>

                {alum.bio && (
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {alum.bio}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {alum.email ? (
                  <a
                    href={`mailto:${alum.email}`}
                    className="text-slate-500 hover:text-teal-800 flex items-center gap-1 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Verified Graduate</span>
                )}

                {alum.linkedin && (
                  <a
                    href={alum.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlumni.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No alumni found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or selecting &quot;All&quot; batches.</p>
          </div>
        )}

        {/* Alumni Join Callout */}
        <section className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-700" />
              <span>Are You a St. Xavier BSW Graduate?</span>
            </h3>
            <p className="text-xs text-slate-600">
              Stay connected with your department, mentor current student practitioners, and share fieldwork placement opportunities.
            </p>
          </div>
          <a
            href="mailto:socialwork@stxaviercollegespt.ac.in?subject=Alumni%20Network%20Registration"
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs shrink-0"
          >
            Connect With the Department
          </a>
        </section>

      </div>
    </div>
  );
}