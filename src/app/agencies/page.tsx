"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  Building2,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Phone,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Sparkles,
  Users,
  Compass,
} from "lucide-react";

export interface AgencyItem {
  id: string;
  name: string;
  domain: string;
  location: string;
  description: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
}

const DOMAIN_FILTERS = [
  "All Settings",
  "Community Development",
  "Child Welfare",
  "Healthcare",
  "Women & Family",
] as const;

const DEFAULT_AGENCIES: AgencyItem[] = [
  {
    id: "agency-1",
    name: "District Child Protection Unit (DCPU) — Senapati",
    domain: "Child Welfare",
    location: "Senapati District Headquarters, Manipur",
    description:
      "Statutory nodal child protection body operating under Mission Vatsalya and the Juvenile Justice Act. BSW students assist in case studies of children in need of care and protection, child welfare committee documentation, foster care follow-ups, and rural school awareness rallies on child rights.",
    contactPerson: "District Child Protection Officer (DCPO)",
    phone: "+91 3871 222145",
    website: "https://senapati.nic.in",
  },
  {
    id: "agency-2",
    name: "Senapati District Hospital — Medical Social Work Unit",
    domain: "Healthcare",
    location: "District Hospital Campus, Senapati, Manipur",
    description:
      "Principal government healthcare institution in the district. Trainee social workers support patient navigation, psycho-social intake assessments in the psychiatric ward, maternal health counseling, and health literacy drives across surrounding hill villages.",
    contactPerson: "Medical Superintendent / Social Work In-Charge",
    phone: "+91 3871 222300",
    website: "",
  },
  {
    id: "agency-3",
    name: "Maram Rural Community Development Association (MRCDA)",
    domain: "Community Development",
    location: "Maram Khunou, Senapati District, Manipur",
    description:
      "Indigenous grassroots society engaged in rural community mobilization, tribal farmer livelihoods, and self-help group federation strengthening. Students conduct Participatory Rural Appraisals (PRA), community need assessments, and skill-training workshops for village youth.",
    contactPerson: "Field Program Director",
    phone: "+91 9436 032110",
    website: "https://stxaviercollegespt.ac.in",
  },
  {
    id: "agency-4",
    name: "Kangpokpi Women & Family Counseling Centre",
    domain: "Women & Family",
    location: "Kangpokpi Town, Manipur",
    description:
      "Community center dedicated to women's legal awareness, dispute mediation, family preservation, and survivor rehabilitation. Fieldwork students engage in casework documentation, family counseling assistance, and economic self-reliance workshops for single mothers.",
    contactPerson: "General Secretary",
    phone: "+91 9862 109845",
    website: "",
  },
  {
    id: "agency-5",
    name: "Karong Youth Action & Environmental Society",
    domain: "Community Development",
    location: "Karong, Senapati District, Manipur",
    description:
      "Civil society collective addressing watershed conservation, village sanitation, youth leadership, and tribal cultural heritage preservation. Practicum students coordinate community cleanliness campaigns, eco-clubs in schools, and environmental baseline surveys.",
    contactPerson: "Youth Coordinator",
    phone: "+91 9436 887213",
    website: "",
  },
  {
    id: "agency-6",
    name: "Primary Health Centre (PHC) — Tadubi",
    domain: "Healthcare",
    location: "Tadubi Block, Senapati District, Manipur",
    description:
      "Community health facility providing rural outpatient care, immunization, and community outreach. Trainee social workers facilitate patient counseling, immunization awareness campaigns in remote hamlets, and community feedback surveys on healthcare access.",
    contactPerson: "Medical Officer In-Charge",
    phone: "+91 3871 242010",
    website: "",
  },
];

function getDomainBadge(domain: string) {
  const normalized = domain.toLowerCase();
  if (normalized.includes("community")) {
    return "bg-teal-50 text-teal-800 border-teal-200 ring-1 ring-teal-100";
  }
  if (normalized.includes("child") || normalized.includes("youth")) {
    return "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-100";
  }
  if (normalized.includes("health") || normalized.includes("medical") || normalized.includes("psychiatric")) {
    return "bg-rose-50 text-rose-800 border-rose-200 ring-1 ring-rose-100";
  }
  if (normalized.includes("women") || normalized.includes("family")) {
    return "bg-purple-50 text-purple-800 border-purple-200 ring-1 ring-purple-100";
  }
  if (normalized.includes("environ")) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200 ring-1 ring-emerald-100";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function matchesDomainFilter(agencyDomain: string, filter: string): boolean {
  if (filter === "All Settings") return true;
  const aDom = agencyDomain.toLowerCase();
  const fDom = filter.toLowerCase();

  if (fDom === "community development") return aDom.includes("community");
  if (fDom === "child welfare") return aDom.includes("child") || aDom.includes("youth");
  if (fDom === "healthcare") return aDom.includes("health") || aDom.includes("medical") || aDom.includes("psychiatric");
  if (fDom === "women & family") return aDom.includes("women") || aDom.includes("family");
  return aDom.includes(fDom);
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<AgencyItem[]>(DEFAULT_AGENCIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All Settings");

  useEffect(() => {
    let isMounted = true;

    async function fetchAgencyData() {
      try {
        setLoading(true);
        const colRef = collection(db, "agencies");
        let docsData: AgencyItem[] = [];

        try {
          const q = query(colRef, orderBy("createdAt", "desc"), limit(40));
          const snap = await getDocs(q);
          if (!snap.empty) {
            docsData = snap.docs.map((doc) => {
              const d = doc.data();
              return {
                id: doc.id,
                name: d.name || "Fieldwork Organization",
                domain: d.domain || d.sector || "Community Development",
                location: d.location || "Senapati District, Manipur",
                description: d.description || d.areaOfWork || "Fieldwork placement setting.",
                contactPerson: d.contactPerson || d.supervisorName,
                phone: d.phone,
                email: d.email,
                website: d.website,
              };
            });
          }
        } catch (queryErr) {
          console.warn("Ordered agency query fell back:", queryErr);
          const fallbackSnap = await getDocs(query(colRef, limit(40)));
          if (!fallbackSnap.empty) {
            docsData = fallbackSnap.docs.map((doc) => {
              const d = doc.data();
              return {
                id: doc.id,
                name: d.name || "Fieldwork Organization",
                domain: d.domain || d.sector || "Community Development",
                location: d.location || "Senapati District, Manipur",
                description: d.description || d.areaOfWork || "Fieldwork placement setting.",
                contactPerson: d.contactPerson || d.supervisorName,
                phone: d.phone,
                email: d.email,
                website: d.website,
              };
            });
          }
        }

        // Check legacy 'organizations' collection if still empty
        if (docsData.length === 0) {
          try {
            const orgSnap = await getDocs(collection(db, "organizations"));
            if (!orgSnap.empty) {
              docsData = orgSnap.docs.map((doc) => {
                const d = doc.data();
                return {
                  id: doc.id,
                  name: d.name || "Partner Organization",
                  domain: d.type || "Community Development",
                  location: d.location || "Senapati, Manipur",
                  description: d.description || d.areaOfWork || "",
                  phone: d.phone,
                  website: d.website,
                };
              });
            }
          } catch {
            // ignore
          }
        }

        if (docsData.length > 0 && isMounted) {
          setAgencies(docsData);
        }
      } catch (err) {
        console.warn("Using fallback agency directory:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAgencyData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAgencies = agencies.filter((agency) => {
    const matchesDomain = matchesDomainFilter(agency.domain, selectedDomain);

    const q = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      agency.name.toLowerCase().includes(q) ||
      agency.location.toLowerCase().includes(q) ||
      agency.domain.toLowerCase().includes(q) ||
      agency.description.toLowerCase().includes(q) ||
      (agency.contactPerson && agency.contactPerson.toLowerCase().includes(q));

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* ========================================================= */}
      {/* 1. PAGE HEADER & PURPOSE                                  */}
      {/* ========================================================= */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </Link>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>DEPARTMENT OF SOCIAL WORK — BSW PRACTICUM ARCHIVE</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Fieldwork Placement & Partner Directory
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl leading-relaxed">
            A verified directory of organizations, institutions, and NGOs where BSW students across previous batches have undertaken concurrent fieldwork and block placements. Designed as a practical guide for junior batches exploring future placement settings.
          </p>

          {/* Quick Practicum Note */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
              <span>Verified Supervised Settings</span>
            </div>
            <span>•</span>
            <span>Concurrent Practicum (2 Days / Week)</span>
            <span>•</span>
            <span>Senapati, Kangpokpi, and Regional Manipur Linkages</span>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. JUNIOR-FRIENDLY SEARCH & DOMAIN FILTERS                */}
      {/* ========================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          
          {/* Domain Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Practice Domain:
              </span>
              {DOMAIN_FILTERS.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSelectedDomain(pill)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDomain === pill
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Showing {filteredAgencies.length} {filteredAgencies.length === 1 ? "organization" : "organizations"}
            </div>
          </div>

          {/* Search Box: Name or District */}
          <div className="relative pt-2 border-t border-slate-100">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by organization name or district (e.g. Senapati, Kangpokpi, Imphal)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. SKELETON LOADERS                                       */}
        {/* ========================================================= */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-28 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-20 bg-slate-100 rounded-md"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. AGENCY CARDS GRID                                      */}
        {/* ========================================================= */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency) => (
              <div
                key={agency.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs space-y-5"
              >
                <div className="space-y-4">
                  
                  {/* Top Row: Domain Badge & Practicum Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getDomainBadge(
                        agency.domain
                      )}`}
                    >
                      {agency.domain}
                    </span>

                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0">
                      BSW Practicum
                    </span>
                  </div>

                  {/* Organization Name */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-800 transition leading-snug">
                      {agency.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{agency.location}</span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {agency.description}
                  </p>

                  {/* Contact Person (if available) */}
                  {agency.contactPerson && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Supervisory Contact
                      </span>
                      <div className="font-semibold text-slate-900 truncate">
                        {agency.contactPerson}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer: Phone Number & Website Portal Link */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Contact Number */}
                  {agency.phone ? (
                    <a
                      href={`tel:${agency.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-teal-800 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{agency.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Contact via Dept Fieldwork Desk
                    </span>
                  )}

                  {/* Website / Portal Link */}
                  {agency.website ? (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-teal-800 hover:text-teal-900 hover:underline transition ml-auto"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Portal Link</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Institutional Unit</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. EMPTY SEARCH STATE                                     */}
        {/* ========================================================= */}
        {!loading && filteredAgencies.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No organizations found matching this search
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any placement partner matching &quot;{searchTerm}&quot; under the &quot;{selectedDomain}&quot; category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDomain("All Settings");
                setSearchTerm("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
            >
              Reset Filters & View All
            </button>
          </div>
        )}

        {/* Junior Guidance Box */}
        <div className="p-6 rounded-3xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-900 border border-teal-300 shrink-0">
              <Compass className="w-5 h-5 text-teal-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Notice for Junior Batches (Semester I & III Practicum Allotment)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Agency allocations are finalized during the department fieldwork orientation based on individual learning goals and supervisor matching.
              </p>
            </div>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shrink-0"
          >
            <span>Download Fieldwork Manuals</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </div>

      </div>

    </div>
  );
}
