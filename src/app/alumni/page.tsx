"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { AlumniProfile, AlumniSector } from "@/lib/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { normalizeBatchYear } from "@/lib/utils";
import { InlineBanner } from "@/components/ui/Toast";
import {
  GraduationCap,
  Sparkles,
  Users,
  Briefcase,
  Award,
  ArrowLeft,
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

// Single Clean Reference BSW Alumni Profile (St. Xavier College, Maram Khunou - Est. 2019)
const SECTORS: AlumniSector[] = [
  "All",
  "Higher Education",
  "Child Welfare",
  "Rural Development",
  "Public Sector",
  "Healthcare & Mental Health",
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
    const optimized = optimizeCloudinaryUrl(cleanUrl, 300);
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimized}
          alt={name}
          loading="lazy"
          decoding="async"
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
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "alumni");
      const q = query(colRef, where("status", "==", "approved"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: AlumniProfile[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AlumniProfile, "id">),
        }));
        setAlumni(list);
      } else {
        setAlumni([]);
      }
    } catch (err) {
      console.warn("Firestore error fetching alumni:", err);
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // Dynamically extract unique available graduating batches from approved profiles
  const dynamicBatches = Array.from(
    new Set(alumni.map((item) => normalizeBatchYear(item.batchYear || "")))
  )
    .filter((b): b is string => Boolean(b))
    .sort()
    .reverse();

  // Filter and auto-sort: newest batch first, case-insensitive search
  const filteredAlumni = alumni
    .filter((item) => {
      const matchesSector =
        selectedSector === "All" || item.sector === selectedSector;
      const normalizedItemBatch = normalizeBatchYear(item.batchYear || "");
      const matchesBatch =
        selectedBatch === "all" || normalizedItemBatch === selectedBatch;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.fullName.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.currentRole.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.higherStudies && item.higherStudies.toLowerCase().includes(q));

      return matchesSector && matchesBatch && matchesSearch;
    })
    .sort((a, b) => {
      const batchA = normalizeBatchYear(a.batchYear || "");
      const batchB = normalizeBatchYear(b.batchYear || "");
      return batchB.localeCompare(batchA, undefined, { numeric: true });
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
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alumni by name, role, organization, or location..."
              className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f2042]/20 focus:border-[#0f2042] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Batch Filter Pills & Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Batch:
              </span>
              <button
                type="button"
                onClick={() => setSelectedBatch("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedBatch === "all"
                    ? "bg-[#0f2042] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                All Batches
              </button>
              {dynamicBatches.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBatch(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedBatch === b
                      ? "bg-[#0f2042] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  Batch {b}
                </button>
              ))}
            </div>

            {dynamicBatches.length > 0 && (
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Cohort:
                </span>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f2042]/20 cursor-pointer"
                >
                  <option value="all">All Batches</option>
                  {dynamicBatches.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Sector Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Sector:
            </span>
            {SECTORS.map((sector) => (
              <button
                key={sector}
                type="button"
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

        </div>

        {/* Directory Count Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{filteredAlumni.length}</strong> verified alumni profile{filteredAlumni.length === 1 ? "" : "s"}
          </span>
          {(selectedSector !== "All" || selectedBatch !== "all" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedSector("All");
                setSelectedBatch("all");
                setSearchQuery("");
              }}
              className="text-[#0f2042] hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
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
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {alumni.length === 0
                ? "No alumni profiles published yet for this cohort."
                : "No alumni profiles found"}
            </h3>
            <p className="text-xs text-slate-500">
              {alumni.length === 0 ? (
                <>
                  Are you an SXC Social Work graduate?{" "}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#0f2042] font-bold underline hover:text-amber-600 cursor-pointer"
                  >
                    Submit your career update
                  </button>
                  .
                </>
              ) : (
                "No verified profiles match the selected filters. Try choosing \"All\" or submitting a new profile update."
              )}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2042] text-white text-xs font-bold hover:bg-[#142a55] transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
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
            fetchAlumni();
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
            type="button"
            onClick={() => setSubmitSuccess(false)}
            aria-label="Close notification"
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
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
  const [batchYear, setBatchYear] = useState("");
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
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary Direct Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      const errMsg = "Cloudinary environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) are required for photo upload.";
      console.error(errMsg);
      setUploadError(errMsg);
      return;
    }

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
    if (!fullName.trim() || !batchYear.trim() || !currentRole.trim() || !organization.trim() || !email.trim()) {
      setFormError("Please fill in your name, graduating batch, current role, organization, and email.");
      return;
    }
    setFormError(null);

    try {
      setIsSubmitting(true);
      let cleanPhoto = (photoUrl || "").trim();
      if (cleanPhoto.startsWith("http://")) {
        cleanPhoto = cleanPhoto.replace("http://", "https://");
      }

      let cleanLinkedin = (linkedinUrl || "").trim();
      if (cleanLinkedin && !cleanLinkedin.startsWith("http://") && !cleanLinkedin.startsWith("https://")) {
        cleanLinkedin = "https://" + cleanLinkedin;
      }

      const newAlumRef = doc(collection(db, "alumni"));
      const normalizedBatch = normalizeBatchYear(batchYear);

      const publicPayload = {
        fullName: fullName.trim(),
        batchYear: normalizedBatch,
        currentRole: currentRole.trim(),
        organization: organization.trim(),
        sector: sector || "Public Sector",
        location: location.trim(),
        higherStudies: (higherStudies || "").trim(),
        quote: (quote || "").trim(),
        photoUrl: cleanPhoto,
        linkedinUrl: cleanLinkedin,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      // 1. Write public profile document without email
      await setDoc(newAlumRef, publicPayload);

      // 2. Write private contact record for departmental verification only
      await setDoc(doc(db, "alumni_private", newAlumRef.id), {
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        createdAt: serverTimestamp(),
      });

      onSubmitted();
    } catch (err: unknown) {
      console.error("Failed to submit alumni profile:", err);
      const msg = err instanceof Error ? err.message : "Please check your network and submission fields.";
      setFormError(`Submission failed: ${msg}`);
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
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {formError && (
            <InlineBanner
              message={formError}
              type="error"
              onClose={() => setFormError(null)}
            />
          )}
          
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
              <input
                type="text"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                onBlur={() => setBatchYear(normalizeBatchYear(batchYear))}
                placeholder="e.g., 2021–2024 or 2024"
                maxLength={20}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20 font-semibold"
              />
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
                  <img
                    src={optimizeCloudinaryUrl(photoUrl, 300)}
                    alt="Preview"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
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