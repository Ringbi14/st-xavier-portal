"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Search, 
  Filter, 
  Briefcase, 
  Tag, 
  Globe, 
  X, 
  Layers,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: string;
  activityType: string;
  location: string;
  areaOfWork: string;
  description: string;
  website?: string;
  year?: string;
}

const DEFAULT_ORGS: Organization[] = [
  {
    id: "default-1",
    name: "Senapati District Community Development Trust",
    type: "NGO",
    activityType: "Concurrent Fieldwork",
    location: "Senapati, Manipur",
    areaOfWork: "Rural Livelihoods & Women Self-Help Groups",
    description: "Active community organization partnering on participatory rural appraisals and village youth leadership capacity building.",
    website: "https://stxaviercollegespt.ac.in",
    year: "2021",
  },
  {
    id: "default-2",
    name: "Maram Rural Health & Child Care Center",
    type: "Healthcare",
    activityType: "Block Internship",
    location: "Maram, Senapati",
    areaOfWork: "Maternal Health & Primary Healthcare Immersion",
    description: "Primary clinical social work setting focusing on family counseling, nutrition drives, and immunization outreach.",
    website: "",
    year: "2020",
  },
  {
    id: "default-3",
    name: "Youth Action for Tribal Rights",
    type: "Civil Society",
    activityType: "Rural Camp",
    location: "Tadubi, Senapati",
    areaOfWork: "Tribal Education & Rights Advocacy",
    description: "Grassroots organization assisting indigenous youth collectives through advocacy, educational workshops, and rural camp programs.",
    website: "",
    year: "2022",
  },
];

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>(DEFAULT_ORGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedActivity, setSelectedActivity] = useState<string>("All");
  const [activeModalOrg, setActiveModalOrg] = useState<Organization | null>(null);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "organizations"), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Organization[];
          setOrgs(loaded);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn("Firestore organizations subscription error:", err);
    }
  }, []);

  const types = ["All", ...Array.from(new Set(orgs.map((o) => o.type).filter(Boolean)))];
  const activities = ["All", ...Array.from(new Set(orgs.map((o) => o.activityType).filter(Boolean)))];

  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.areaOfWork.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || org.type === selectedType;
    const matchesActivity = selectedActivity === "All" || org.activityType === selectedActivity;
    return matchesSearch && matchesType && matchesActivity;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Field Practicum Agency Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fieldwork & Partner Organizations
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Explore verified partner NGOs, hospital units, and social welfare institutions where BSW students complete concurrent fieldwork, rural camps, and block internships.
          </p>
        </div>
      </section>

      {/* Main Content & Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Search & Filter Controls */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by agency name, location, or area of work..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Type:
              </span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedType === type
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Activity Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Activity:
              </span>
              {activities.map((act) => (
                <button
                  key={act}
                  onClick={() => setSelectedActivity(act)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedActivity === act
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Agency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {org.type || "Organization"}
                  </span>
                  {org.activityType && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {org.activityType}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2">
                    {org.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                    <span>{org.location}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider mb-0.5">
                    Area of Work
                  </span>
                  <p className="line-clamp-2">{org.areaOfWork}</p>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {org.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveModalOrg(org)}
                  className="font-bold text-teal-700 hover:text-teal-900 transition flex items-center gap-1"
                >
                  <span>Full Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-teal-700 transition"
                    title="External Agency Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredOrgs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No organizations match your filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search bar or choosing &quot;All&quot; in the type selectors.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("All");
                setSelectedActivity("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Organization Modal Detail View */}
      {activeModalOrg && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setActiveModalOrg(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                {activeModalOrg.type}
              </span>
              {activeModalOrg.activityType && (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  {activeModalOrg.activityType}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">{activeModalOrg.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>{activeModalOrg.location}</span>
                {activeModalOrg.year && <span>• Linkage Year: {activeModalOrg.year}</span>}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Primary Thematic Focus
              </span>
              <p className="text-xs font-semibold text-slate-800">{activeModalOrg.areaOfWork}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Agency Description & Practicum Role
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{activeModalOrg.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {activeModalOrg.website ? (
                <a
                  href={activeModalOrg.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Agency Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">No external website recorded</span>
              )}

              <button
                onClick={() => setActiveModalOrg(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}