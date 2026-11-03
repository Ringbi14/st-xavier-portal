"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { AlumniProfile, AlumniSector } from "@/lib/types";
import { optimizeCloudinaryUrl, openCloudinaryWidget } from "@/lib/cloudinary";
import { normalizeBatchYear } from "@/lib/utils";
import { InlineBanner } from "@/components/ui/Toast";
import {
  GraduationCap,
  Sparkles,
  Users,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Search,
  Quote,
  Loader2,
  X,
  AlertCircle,
  PlusCircle,
  HeartHandshake,
  TrendingUp,
  Globe2,
  Camera,
  RefreshCw,
  Trash2,
} from "lucide-react";

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

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
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

  // Check if legacy sector filtering is relevant
  const hasSectors = alumni.some((item) => Boolean(item.sector && item.sector.trim()));

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
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.batchYear && item.batchYear.toLowerCase().includes(q)) ||
        (item.quote && item.quote.toLowerCase().includes(q)) ||
        (item.organization && item.organization.toLowerCase().includes(q)) ||
        (item.currentRole && item.currentRole.toLowerCase().includes(q));

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
            Alumni Showcase & Directory
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl leading-relaxed">
            Reconnecting social work graduates of St. Xavier College, sharing memories, guidance for juniors, and building a community of compassionate change-makers.
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
              placeholder="Search alumni by name, batch, or message..."
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

          {/* Sector Filter Pills (displayed when sector data exists) */}
          {hasSectors && (
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
          )}

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
                    Submit your profile update
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
            {filteredAlumni.map((alum) => {
              const rawBatch = (alum.batchYear || "").trim();
              const cleanBatch = rawBatch.replace(/^Batch\s*(of)?\s*/i, "").trim();
              const batchBadgeText = cleanBatch ? `Batch of ${cleanBatch}` : "Alumnus";

              return (
                <div
                  key={alum.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs space-y-4"
                >
                  <div className="space-y-4">
                    
                    {/* Card Header: Portrait, Full Name, "Batch of {batchYear}" badge */}
                    <div className="flex items-start gap-3.5">
                      <AlumniAvatar name={alum.fullName} photoUrl={alum.photoUrl} />
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-mono tracking-wide">
                          {batchBadgeText}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0f2042] transition leading-snug mt-1.5 break-words">
                          {alum.fullName}
                        </h3>
                      </div>
                    </div>

                    {/* Junior Advice / Message Quote in styled blockquote */}
                    {alum.quote && alum.quote.trim() && (
                      <blockquote className="relative p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 border-l-4 border-amber-500 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                        <Quote className="w-4 h-4 text-amber-500/70 mb-1" />
                        <p>&ldquo;{alum.quote.trim()}&rdquo;</p>
                      </blockquote>
                    )}

                  </div>

                  {/* LinkedIn Action: Only rendered when linkedinUrl exists; hidden completely if absent */}
                  {alum.linkedinUrl && alum.linkedinUrl.trim() && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">
                        St. Xavier Alumni
                      </span>
                      <a
                        href={alum.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#0077b5]/10 text-slate-700 hover:text-[#0077b5] border border-slate-200 hover:border-[#0077b5]/30 text-xs font-semibold transition group/link"
                        aria-label={`${alum.fullName}'s LinkedIn Profile`}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5 text-[#0077b5]" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-[#0077b5] transition-colors" />
                      </a>
                    </div>
                  )}

                </div>
              );
            })}
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
              Share your graduating batch, a message to incoming batches, and connect with fellow alumni across the practitioner network.
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
// STREAMLINED PUBLIC ALUMNI PROFILE SUBMISSION MODAL
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
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [quote, setQuote] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [botCheck, setBotCheck] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manage body scroll lock and escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Open Cloudinary Upload Widget
  const handleOpenCloudinaryWidget = () => {
    setUploadError(null);
    setIsUploading(true);
    openCloudinaryWidget({
      folder: "st_xavier_portal/alumni",
      resourceType: "image",
      multiple: false,
      onSuccess: (secureUrl) => {
        setPhotoUrl(secureUrl);
        setUploadError(null);
        setIsUploading(false);
      },
      onError: (err) => {
        console.error("Cloudinary widget error:", err);
        setUploadError(err.message || "Failed to complete Cloudinary upload.");
        setIsUploading(false);
      },
    }).catch((err: unknown) => {
      console.error("Failed to initialize Cloudinary widget:", err);
      const msg = err instanceof Error ? err.message : "Could not open Cloudinary widget.";
      setUploadError(msg);
      setIsUploading(false);
    });

    // Reset uploading spinner in case user closes dialog without upload
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !batchYear.trim() || !email.trim()) {
      setFormError("Please fill in your full name, graduating batch, and email.");
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!photoUrl.trim()) {
      setFormError("Please upload your portrait photo using the Cloudinary uploader before submitting.");
      return;
    }

    if (quote.trim().length > 300) {
      setFormError("Message to juniors / note must be 300 characters or fewer.");
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
      if (cleanLinkedin.startsWith("http://")) {
        cleanLinkedin = cleanLinkedin.replace("http://", "https://");
      }
      if (cleanLinkedin && !cleanLinkedin.startsWith("https://")) {
        cleanLinkedin = "https://" + cleanLinkedin;
      }
      cleanLinkedin = cleanLinkedin.replace(/^https:\/\/[a-z]{2}\.linkedin\.com\//i, "https://www.linkedin.com/");

      const normalizedBatch = normalizeBatchYear(batchYear);

      const formData = {
        fullName: fullName.trim(),
        batchYear: normalizedBatch,
        email: email.trim().toLowerCase(),
        photoUrl: cleanPhoto,
        quote: quote.trim().slice(0, 300),
        linkedinUrl: cleanLinkedin,
        bot_check: botCheck,
      };

      const res = await fetch("/api/alumni/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({ error: "Server returned an invalid response." }));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit profile. Please verify your details.");
      }

      // Reset form state on successful submission
      setFullName("");
      setBatchYear("");
      setEmail("");
      setPhotoUrl("");
      setQuote("");
      setLinkedinUrl("");
      setBotCheck("");

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
      <div className="relative w-full max-w-lg my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
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
              Your profile will be reviewed by the Department of Social Work before publishing to maintain verified cohort records.
            </span>
          </div>

          {/* Honeypot field for bot detection */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="bot_check">Leave this field empty</label>
            <input
              id="bot_check"
              type="text"
              name="bot_check"
              value={botCheck}
              onChange={(e) => setBotCheck(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
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
                Graduating Batch <span className="text-rose-500">*</span>
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-amber-700 font-semibold">
                Kept private for department verification
              </span>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">
              Your email will not be displayed publicly in the alumni directory.
            </p>
          </div>

          {/* Cloudinary Portrait Upload Widget */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Portrait Photo <span className="text-rose-500">*</span>
              </label>
              {photoUrl ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Cloudinary Asset Attached
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium">JPEG, PNG, WEBP up to 10MB</span>
              )}
            </div>

            {!photoUrl ? (
              <div className="mt-2 flex flex-col sm:flex-row items-center gap-3.5 p-4 bg-white rounded-xl border border-dashed border-slate-300 hover:border-amber-400 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-xs font-bold text-slate-900">
                    Upload Official Alumni Portrait
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload from your device, capture with camera, or select via Cloudinary.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCloudinaryWidget}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2042] hover:bg-[#162e5d] text-amber-300 text-xs font-bold transition shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Opening...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload with Cloudinary</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-500/40 shrink-0 shadow-xs relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={optimizeCloudinaryUrl(photoUrl, 300)}
                      alt="Portrait Preview"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Portrait Attached</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5 max-w-[220px] sm:max-w-xs">
                      {photoUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleOpenCloudinaryWidget}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0f2042] bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition cursor-pointer"
                    title="Replace with another photo"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl("");
                      setUploadError(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                    title="Remove attached portrait"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Quote: Optional message to juniors / note to visitors (max 300 chars) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Message to Juniors / Note to Visitors (Optional)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {quote.length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Share memories, encouragement for junior batches, or a note to visitors..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20 text-slate-900"
            />
          </div>

          {/* LinkedIn Profile URL (Optional) */}
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

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
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
