"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { AgencyItem, AgencyDomain } from "@/lib/types";
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Search, 
  Filter, 
  Users, 
  Globe, 
  Briefcase,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const DOMAIN_FILTERS: { label: string; value: string }[] = [
  { label: "All Settings", value: "All" },
  { label: "Community Development", value: "Community Development" },
  { label: "Medical & Psychiatric", value: "Medical & Psychiatric" },
  { label: "Child & Youth Welfare", value: "Child & Youth Welfare" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Women & Family", value: "Women & Family" },
];

const DEFAULT_AGENCIES_FALLBACK: AgencyItem[] = [
  {
    id: "default-org-1",
    name: "Senapati District Community Development Trust",
    domain: "Community Development",
    location: "Senapati Headquarters, Manipur",
    contactPerson: "Field Liaison Officer",
    website: "https://stxaviercollegespt.ac.in",
    description: "Active community organization partnering on participatory rural appraisals, village youth collectives, and women self-help group capacity building.",
  },
  {
    id: "default-org-2",
    name: "Maram Rural Health & Child Care Center",
    domain: "Medical & Psychiatric",
    location: "Maram, Senapati District",
    contactPerson: "Dr. K. Mathew (Chief Medical Officer)",
    website: "",
    description: "Primary clinical healthcare setting focusing on community health interventions, maternal nutrition, and mental health counseling.",
  },
  {
    id: "default-org-3",
    name: "Youth Action & Child Welfare Society",
    domain: "Child & Youth Welfare",
    location: "Tadubi, Senapati District",
    contactPerson: "Ms. Veronica (Director)",
    website: "",
    description: "Grassroots organization assisting indigenous youth collectives through advocacy, child protection workshops, and village immersion programs.",
  },
  {
    id: "default-org-4",
    name: "Kangpokpi Women Empowerment Federation",
    domain: "Women & Family",
    location: "Kangpokpi, Manipur",
    contactPerson: "Mrs. Esther (Secretary)",
    website: "",
    description: "District-level social collective fostering legal literacy, rural microfinance cooperatives, and family counseling desks.",
  },
];

export default function AgencyDirectorySection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const [agencies, setAgencies] = useState<AgencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchAgencies() {
      try {
        setLoading(true);
        let docsSnap;
        try {
          const q = query(collection(db, "agencies"), orderBy("createdAt", "desc"));
          docsSnap = await getDocs(q);
        } catch {
          docsSnap = await getDocs(collection(db, "agencies"));
        }

        if (!docsSnap.empty) {
          const loaded: AgencyItem[] = [];
          docsSnap.forEach((doc) => {
            const d = doc.data();
            loaded.push({
              id: doc.id,
              name: d.name || "Fieldwork Agency",
              domain: (d.domain || d.sector || "Community Development") as AgencyDomain,
              location: d.location || "Senapati District, Manipur",
              contactPerson: d.contactPerson || d.supervisorName,
              phone: d.phone,
              email: d.email,
              website: d.website,
              description: d.description || d.areaOfWork,
            });
          });
          setAgencies(loaded);
        } else {
          // Check legacy 'organizations' collection fallback
          const orgSnap = await getDocs(collection(db, "organizations"));
          if (!orgSnap.empty) {
            const loadedOrgs = orgSnap.docs.map((doc) => {
              const d = doc.data();
              return {
                id: doc.id,
                name: d.name,
                domain: d.type || "Community Development",
                location: d.location,
                description: d.description || d.areaOfWork,
                website: d.website,
              } as AgencyItem;
            });
            setAgencies(loadedOrgs);
          } else {
            setAgencies(DEFAULT_AGENCIES_FALLBACK);
          }
        }
      } catch (err) {
        console.warn("Could not fetch agencies from Firestore, using default directory:", err);
        setAgencies(DEFAULT_AGENCIES_FALLBACK);
      } finally {
        setLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  const filtered = agencies.filter((a) => {
    const matchesDomain =
      selectedDomain === "All" ||
      a.domain?.toLowerCase() === selectedDomain.toLowerCase();

    const q = searchTerm.toLowerCase();
    const matchesSearch =
      a.name?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.domain?.toLowerCase().includes(q) ||
      (a.contactPerson && a.contactPerson.toLowerCase().includes(q)) ||
      (a.description && a.description.toLowerCase().includes(q));

    return matchesDomain && matchesSearch;
  });

  const getDomainBadge = (domain: string) => {
    switch (domain) {
      case "Community Development":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "Medical & Psychiatric":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Child & Youth Welfare":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Human Resources":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Women & Family":
        return "bg-pink-50 text-pink-800 border-pink-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <section id="agency-directory" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Field Practicum & Agency Linkages</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Fieldwork Placement Agency Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Approved partner NGOs, healthcare centers, government welfare departments, and civil society settings where BSW students undergo supervised fieldwork.
          </p>
        </div>

        {!isStandalonePage && (
          <Link
            href="/agencies"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>Full Agency Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="mt-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agencies by name, location, supervisor, or area of work..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition shadow-xs"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {DOMAIN_FILTERS.map((f) => {
            const isActive = selectedDomain === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedDomain(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="mt-6">
        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 animate-pulse shadow-xs">
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="h-5 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          // Empty State
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No partner agencies match your filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or selecting &quot;All Settings&quot;.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDomain("All");
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          // Agency Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((agency) => (
              <div
                key={agency.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getDomainBadge(agency.domain)}`}>
                      {agency.domain}
                    </span>
                    {agency.website && (
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-teal-700 transition"
                        title="Visit External Agency Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2">
                      {agency.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{agency.location}</span>
                    </div>
                  </div>

                  {agency.contactPerson && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="truncate font-medium">{agency.contactPerson}</span>
                    </div>
                  )}

                  {agency.description && (
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {agency.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-teal-800">
                    Approved Practicum Setting
                  </span>
                  {agency.website ? (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Institutional Partner</span>
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
