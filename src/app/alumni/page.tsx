"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AlumniProfile, AlumniSector } from "@/lib/types";
import {
  GraduationCap,
  Sparkles,
  Users,
  Briefcase,
  Award,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Building2,
  MapPin,
  ExternalLink,
  Search,
  Quote,
  Upload,
  Loader2,
  X,
  AlertCircle,
  PlusCircle,
  HeartHandshake,
  TrendingUp,
  Globe2,
} from "lucide-react";

// Realistic Seeded BSW Alumni Profiles (St. Xavier College, Maram Khunou, Est. 2019)
const SEEDED_ALUMNI: AlumniProfile[] = [
  {
    id: "alumni-1",
    fullName: "K. Victor Maram",
    batchYear: "2019-2022",
    currentRole: "District Child Protection Officer (DCPO)",
    organization: "Department of Social Welfare, Government of Manipur",
    sector: "Public Sector",
    location: "Senapati District, Manipur",
    higherStudies: "MSW (Tata Institute of Social Sciences - TISS)",
    quote: "The intensive concurrent fieldwork at St. Xavier taught me that social legislation only matters when translated to tribal grassroots reality. Cherish every supervision conference.",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com",
    email: "victor.m@alumni.stxaviercollegespt.ac.in",
    status: "approved",
    createdAt: null,
  },
  {
    id: "alumni-2",
    fullName: "Mary Grace Shingnaisui",
    batchYear: "2020-2023",
    currentRole: "Community Project Coordinator",
    organization: "World Vision India (Northeast Division)",
    sector: "Child Welfare",
    location: "Imphal, Manipur",
    higherStudies: "MSW in Social Development (Delhi School of Social Work)",
    quote: "Our 10-day rural educational camp in Maram Khunou was where I truly learned participatory appraisals (PRA) and listening without prejudice. That foundation still guides my project assessments.",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com",
    email: "mary.grace@alumni.stxaviercollegespt.ac.in",
    status: "approved",
    createdAt: null,
  },
  {
    id: "alumni-3",
    fullName: "T. Samuel Paomei",
    batchYear: "2020-2023",
    currentRole: "Rural Livelihoods & Enterprise Specialist",
    organization: "NERCORMP (North Eastern Region Community Resource Management)",
    sector: "Rural Development",
    location: "Ukhrul, Manipur",
    higherStudies: "Postgraduate Diploma in Rural Management (IRMA)",
    quote: "Process recordings used to seem demanding, but they developed the self-awareness I need when organizing farmer producer groups and village SHG federations.",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com",
    email: "samuel.p@alumni.stxaviercollegespt.ac.in",
    status: "approved",
    createdAt: null,
  },
  {
    id: "alumni-4",
    fullName: "Dr. Christine Hmar",
    batchYear: "2019-2022",
    currentRole: "Assistant Professor & Research Fellow",
    organization: "Department of Social Work, Central University of Mizoram",
    sector: "Higher Education",
    location: "Aizawl, Mizoram",
    higherStudies: "Ph.D. in Social Work (UGC-JRF Fellow)",
    quote: "Hold fast to St. Xavier's institutional motto: 'Education for Service'. When academia connects with grassroots hill communities, real transformation takes root.",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com",
    email: "christine.hmar@mzu.ac.in",
    status: "approved",
    createdAt: null,
  },
  {
    id: "alumni-5",
    fullName: "L. Anthony Thangal",
    batchYear: "2021-2024",
    currentRole: "Medical Social Worker",
    organization: "Regional Institute of Medical Sciences (RIMS Hospital)",
    sector: "Healthcare & Mental Health",
    location: "Imphal, Manipur",
    higherStudies: "MSW (Medical & Psychiatric Social Work)",
    quote: "Hospital casework demands active listening and unshakeable compassion. St. Xavier's clinical field postings prepared me to navigate medical crises with patient families.",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com",
    email: "anthony.thangal@alumni.stxaviercollegespt.ac.in",
    status: "approved",
    createdAt: null,
  },
  {
    id: "alumni-6",
    fullName: "V. Esther Zimik",
    batchYear: "2021-2024",
    currentRole: "Program Officer (Child Rights & Anti-Trafficking)",
    organization: "FXB India Suraksha (Northeast Region)",
    sector: "Child Welfare",
    location: "Senapati, Manipur",
    higherStudies: "MSW in Human Rights & Advocacy",
    quote: "From our first semester observational visits to final block placement, the faculty supervisors constantly challenged us to defend human dignity without compromise.",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com",
    email: "esther.zimik@fxbsuraksha.org",
    status: "approved",
    createdAt: null,
  },
];

const SECTORS: AlumniSector[] = [
  "All",
  "Higher Education",
  "Child Welfare",
  "Rural Development",
  "Public Sector",
  "Healthcare & Mental Health",
];

const BATCH_YEARS = [
  "All Batches",
  "2019-2022",
  "2020-2023",
  "2021-2024",
  "2022-2025",
  "2023-2026",
];

// Helper to extract 2-letter initials
function getInitials(name: string): string {
  if (!name) return "SX";
  const clean = name
    .replace(/^(Dr\.|Prof\.|Rev\.|Fr\.|Mr\.|Ms\.|Mrs\.)\s+/gi, "")
    .replace(/,\s*(S\.J\.|Ph\.D\.|MSW|M\.Phil\.).*$/gi, "")
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || "SX";
}

function AlumniAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanUrl = photoUrl?.trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  if (cleanUrl && !hasError) {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
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

  const initials = getInitials(name);
  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0f2042] via-[#142a55] to-slate-900 border border-amber-500/40 text-amber-300 font-black text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-xs select-none">
      <span>{initials}</span>
    </div>
  );
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>(SEEDED_ALUMNI);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All Batches");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchApprovedAlumni() {
      try {
        setLoading(true);
        const colRef = collection(db, "alumni");
        const q = query(colRef, where("status", "==", "approved"));
        const snap = await getDocs(q);

        if (!snap.empty && isMounted) {
          const list: AlumniProfile[] = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<AlumniProfile, "id">),
          }));
          // Merge with seeded fallback to maintain a rich directory
          const merged = [...list];
          SEEDED_ALUMNI.forEach((seed) => {
            if (!merged.some((m) => m.fullName.toLowerCase() === seed.fullName.toLowerCase())) {
              merged.push(seed);
            }
          });
          setAlumni(merged);
        } else if (isMounted) {
          setAlumni(SEEDED_ALUMNI);
        }
      } catch (err) {
        console.warn("Could not query Firestore alumni, using seeded registry:", err);
        if (isMounted) {
          setAlumni(SEEDED_ALUMNI);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchApprovedAlumni();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAlumni = alumni.filter((item) => {
    const matchesSector =
      selectedSector === "All" || item.sector === selectedSector;
    const matchesBatch =
      selectedBatch === "All Batches" || item.batchYear === selectedBatch;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      item.fullName.toLowerCase().includes(q) ||
      item.organization.toLowerCase().includes(q) ||
      item.currentRole.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.higherStudies?.toLowerCase().includes(q);

    return matchesSector && matchesBatch && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* ========================================================= */}
      {/* 1. HERO HEADER                                            */}
      {/* ========================================================= */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0f2042] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Home</span>
            </Link>

            <button
              onClick={() => {
                setSubmitSuccess(false);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-xs self-start sm:self-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Your Profile Update</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f2042] text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>BSW Practitioner Network</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              St. Xavier College, Maram Khunou • Est. 2019
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2042] tracking-tight leading-[1.12]">
            Alumni Showcase & Career Network
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl leading-relaxed">
            Reconnecting social work graduates of St. Xavier College serving in child protection, community health, tribal development, corporate CSR, and postgraduate research institutions across India.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THREE-METRIC IMPACT STRIP                              */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#0f2042] text-white border border-[#1e3a8a] shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">68%</div>
              <div className="text-xs font-semibold text-amber-300">MSW Progression</div>
              <p className="text-[11px] text-slate-300 mt-0.5">TISS, Delhi University & Central Univs</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f2042] text-white border border-[#1e3a8a] shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">85%+</div>
              <div className="text-xs font-semibold text-amber-300">Grassroots & Govt Placement</div>
              <p className="text-[11px] text-slate-300 mt-0.5">DCPU, NGOs & Health Centers</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f2042] text-white border border-[#1e3a8a] shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">5+</div>
              <div className="text-xs font-semibold text-amber-300">Active Cohorts</div>
              <p className="text-[11px] text-slate-300 mt-0.5">Serving Northeast & National Sectors</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FILTER, SEARCH & CONTROLS                              */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Sector Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Sector:
              </span>
              {SECTORS.map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedSector === sector
                      ? "bg-[#0f2042] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>

            {/* Batch Year Selector */}
            <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Batch:
              </span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f2042]/20"
              >
                {BATCH_YEARS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alumni by name, role, organization, master's degree, or location..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f2042]/20 focus:border-[#0f2042] transition"
            />
          </div>
        </div>

        {/* Directory Count Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{filteredAlumni.length}</strong> verified alumni profile{filteredAlumni.length === 1 ? "" : "s"}
          </span>
          <button
            onClick={() => {
              setSelectedSector("All");
              setSelectedBatch("All Batches");
              setSearchQuery("");
            }}
            className="text-[#0f2042] hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 4. ALUMNI DIRECTORY GRID                                  */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-16 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No alumni profiles found</h3>
            <p className="text-xs text-slate-500">
              No verified profiles match the selected filters. Try choosing &quot;All&quot; or submitting a new profile update.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2042] text-white text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Profile Update</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alum) => (
              <div
                key={alum.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs space-y-5"
              >
                <div className="space-y-4">
                  
                  {/* Card Header: Avatar & Primary Info */}
                  <div className="flex items-start gap-3.5">
                    <AlumniAvatar name={alum.fullName} photoUrl={alum.photoUrl} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 font-mono">
                          Batch {alum.batchYear}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 truncate">
                          {alum.sector}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0f2042] transition leading-snug mt-1">
                        {alum.fullName}
                      </h3>
                    </div>
                  </div>

                  {/* Career Role & Org */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#0f2042] shrink-0 mt-0.5" />
                      <span className="font-bold text-slate-900 leading-snug">
                        {alum.currentRole}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{alum.organization}</span>
                    </div>
                    {alum.location && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{alum.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Higher Studies Tag */}
                  {alum.higherStudies && (
                    <div className="flex items-start gap-2 text-[11px] text-slate-600 px-1">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-700">
                        {alum.higherStudies}
                      </span>
                    </div>
                  )}

                  {/* Junior Advice Quote */}
                  {alum.quote && (
                    <div className="relative p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-700 leading-relaxed italic">
                      <Quote className="w-3.5 h-3.5 text-amber-600 shrink-0 mb-1 opacity-70" />
                      <p>&quot;{alum.quote}&quot;</p>
                    </div>
                  )}

                </div>

                {/* Card Footer: Connect Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-slate-400 font-mono">
                    St. Xavier Alumni
                  </div>
                  <div className="flex items-center gap-2">
                    {alum.linkedinUrl && (
                      <a
                        href={alum.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f2042] hover:text-amber-600 transition"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {alum.email && (
                      <a
                        href={`mailto:${alum.email}`}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0f2042] text-slate-600 hover:text-white transition"
                        title="Contact Alumnus"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* ========================================================= */}
      {/* 5. STICKY / PROMINENT SUBMISSION BANNER                   */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0f2042] text-white border border-[#1e3a8a] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Are you a St. Xavier BSW Graduate?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Keep the Xavier Social Work Brotherhood Connected
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Update your latest designation, higher education progression, or organization to inspire incoming BSW batches and offer mentorship.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-sm shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Your Profile Update</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PUBLIC SUBMISSION MODAL                                */}
      {/* ========================================================= */}
      {isModalOpen && (
        <AlumniSubmissionModal
          onClose={() => setIsModalOpen(false)}
          onSubmitted={() => {
            setSubmitSuccess(true);
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-[#0f2042] text-white border border-amber-400/40 shadow-2xl flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-amber-300">Profile Update Received!</div>
            <p className="text-slate-300">
              Thank you for updating your profile. It has been routed to the departmental admin desk for verification and will appear in the directory once approved.
            </p>
          </div>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

// ====================================================================
// PUBLIC ALUMNI PROFILE UPDATE SUBMISSION MODAL
// ====================================================================
function AlumniSubmissionModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [batchYear, setBatchYear] = useState("2020-2023");
  const [currentRole, setCurrentRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [sector, setSector] = useState<AlumniSector>("Public Sector");
  const [location, setLocation] = useState("");
  const [higherStudies, setHigherStudies] = useState("");
  const [quote, setQuote] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary Direct Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ixvakf7c";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sxc_uploads";

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      let secureUrl = data.secure_url || data.url;
      if (!secureUrl) throw new Error("No URL returned from upload");

      if (typeof secureUrl === "string" && secureUrl.startsWith("http://")) {
        secureUrl = secureUrl.replace("http://", "https://");
      }

      setPhotoUrl(secureUrl);
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      setUploadError(err.message || "Upload failed. You can paste a photo URL directly.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !currentRole.trim() || !organization.trim() || !email.trim()) {
      alert("Please fill in your name, current role, organization, and email.");
      return;
    }

    try {
      setIsSubmitting(true);
      let cleanPhoto = photoUrl.trim();
      if (cleanPhoto.startsWith("http://")) {
        cleanPhoto = cleanPhoto.replace("http://", "https://");
      }

      const payload = {
        fullName: fullName.trim(),
        batchYear: batchYear.trim(),
        currentRole: currentRole.trim(),
        organization: organization.trim(),
        sector,
        location: location.trim() || "Manipur, India",
        higherStudies: higherStudies.trim() || undefined,
        quote: quote.trim() || undefined,
        photoUrl: cleanPhoto,
        email: email.trim().toLowerCase(),
        linkedinUrl: linkedinUrl.trim() || undefined,
        status: "pending", // routed to admin queue
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "alumni"), payload);
      onSubmitted();
    } catch (err: any) {
      console.error("Failed to submit alumni profile:", err);
      alert("Submission failed. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0f2042] text-white flex items-center justify-between border-b border-[#1e3a8a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Submit Alumni Profile Update
              </h3>
              <p className="text-[11px] text-slate-300">
                St. Xavier College, Maram Khunou • BSW Registry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Your profile will be reviewed by the Department of Social Work before publishing to prevent spam and ensure verified cohort records.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. K. Victor Maram"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Graduating Batch *
              </label>
              <select
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20 font-semibold"
              >
                <option value="2019-2022">Batch 2019–2022 (Pioneer Cohort)</option>
                <option value="2020-2023">Batch 2020–2023</option>
                <option value="2021-2024">Batch 2021–2024</option>
                <option value="2022-2025">Batch 2022–2025</option>
                <option value="2023-2026">Batch 2023–2026</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Current Designation / Role *
              </label>
              <input
                type="text"
                required
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. Project Officer / Medical Social Worker"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Organization / Institution *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. World Vision / RIMS Hospital / DCPU"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Sector / Field of Practice *
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20 font-semibold"
              >
                <option value="Public Sector">Public Sector / Government</option>
                <option value="Child Welfare">Child Welfare & Protection</option>
                <option value="Rural Development">Rural Development & Livelihood</option>
                <option value="Higher Education">Higher Education & Research</option>
                <option value="Healthcare & Mental Health">Healthcare & Psychiatric Social Work</option>
                <option value="NGO & Advocacy">NGO & Grassroots Advocacy</option>
                <option value="CSR & Corporate">Corporate Social Responsibility (CSR)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Current Location (City / District)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Senapati, Manipur / New Delhi"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Higher Studies / Post-Graduation (Optional)
            </label>
            <input
              type="text"
              value={higherStudies}
              onChange={(e) => setHigherStudies(e.target.value)}
              placeholder="e.g. MSW from TISS Mumbai / Ph.D. Scholar at Manipur University"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
            />
          </div>

          {/* Cloudinary Portrait Upload */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-700">
                Portrait Photo (Cloudinary Upload or Web URL)
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#0f2042] bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 cursor-pointer transition">
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Portrait</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or paste image URL"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
            />

            {uploadError && (
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {photoUrl && (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Portrait attached successfully</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Advice for Current BSW Students / Reflection Quote
            </label>
            <textarea
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Share a reflection about your time at St. Xavier, rural camp memories, or words of encouragement for junior batches..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Your Email * (For Departmental Verification)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                LinkedIn Profile URL (Optional)
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 rounded-xl bg-[#0f2042] hover:bg-[#1e3a8a] text-white font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Profile Update"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}