"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { 
  Building2, 
  MapPin, 
  Search, 
  ExternalLink, 
  Briefcase, 
  Info, 
  X
} from "lucide-react";

export interface OrganizationItem {
  id: string;
  name: string;
  location: string;
  stateDistrict?: string;
  orgType: string;
  activities: string[];
  areasOfWork: string[];
  website?: string;
  contact?: string;
  description: string;
  logoUrl?: string;
}

// Sample records without visit year/date
const SAMPLE_ORGANIZATIONS: OrganizationItem[] = [
  {
    id: "sample-1",
    name: "[Sample: Rural Community Development Trust]",
    location: "Senapati District, Manipur",
    stateDistrict: "Senapati, Manipur",
    orgType: "NGO",
    activities: ["Orientation Visit", "Fieldwork"],
    areasOfWork: ["Rural Development", "Community Development", "Livelihood"],
    website: "https://www.stxaviercollegespt.ac.in/",
    description: "Sample demonstration record: An indigenous non-governmental organization working on rural women self-help groups, agro-forestry, and participatory watershed management.",
  },
  {
    id: "sample-2",
    name: "[Sample: Child Welfare & Protection Society]",
    location: "Imphal, Manipur",
    stateDistrict: "Imphal West, Manipur",
    orgType: "Child Welfare Organization",
    activities: ["Internship", "Fieldwork"],
    areasOfWork: ["Child Welfare", "Education", "Human Rights"],
    website: "https://www.stxaviercollegespt.ac.in/",
    description: "Sample demonstration record: Grassroots organization focused on child rights monitoring, juvenile shelter care, and inclusive primary education.",
  },
  {
    id: "sample-3",
    name: "[Sample: District Health & De-Addiction Mission]",
    location: "Kangpokpi / Senapati, Manipur",
    stateDistrict: "Kangpokpi, Manipur",
    orgType: "Healthcare / Rehabilitation",
    activities: ["Study Visit", "Orientation Visit"],
    areasOfWork: ["Healthcare", "Mental Health", "Rehabilitation"],
    website: "https://www.stxaviercollegespt.ac.in/",
    description: "Sample demonstration record: Community health center providing outpatient counseling, substance rehabilitation, and community psychosocial support.",
  }
];

export default function OrganizationsDirectoryPage() {
  const [organizations, setOrganizations] = useState<OrganizationItem[]>(SAMPLE_ORGANIZATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  const [activeModalOrg, setActiveModalOrg] = useState<OrganizationItem | null>(null);

  const orgTypes = [
    "All",
    "NGO",
    "Government Organization",
    "Hospital / Healthcare",
    "School / Educational Institution",
    "Corporate / CSR",
    "Community-Based Organization",
    "Rehabilitation Organization",
    "Child Welfare Organization",
    "Women & Family Welfare Organization",
    "Rural Development Organization",
    "Livelihood Organization",
    "Mental Health Organization",
    "Disability Organization",
    "Other"
  ];

  const activityOptions = [
    "All",
    "Orientation Visit",
    "Fieldwork",
    "Internship",
    "Study Visit",
    "Community Programme",
    "Project",
    "Other"
  ];

  const areaOptions = [
    "All",
    "Child Welfare",
    "Women Empowerment",
    "Community Development",
    "Rural Development",
    "Livelihood",
    "Education",
    "Healthcare",
    "Disability",
    "Rehabilitation",
    "Mental Health",
    "Human Rights",
    "Social Welfare",
    "CSR",
    "HR",
    "Research"
  ];

  // Firestore Sync
  useEffect(() => {
    try {
      const q = query(collection(db, "organizations"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: OrganizationItem[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<OrganizationItem, "id">),
          }));
          setOrganizations(list);
        } else {
          setOrganizations(SAMPLE_ORGANIZATIONS);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Using sample organization data:", err);
      setOrganizations(SAMPLE_ORGANIZATIONS);
    }
  }, []);

  // Filtering Logic
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "All" || org.orgType === selectedType;

    const matchesActivity =
      selectedActivity === "All" ||
      (org.activities && org.activities.includes(selectedActivity));

    const matchesArea =
      selectedArea === "All" ||
      (org.areasOfWork && org.areasOfWork.includes(selectedArea));

    return matchesSearch && matchesType && matchesActivity && matchesArea;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header Banner */}
      <section className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Academic Reference Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Fieldwork & Organizations
            </h1>
            
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400">Notice for Students: </span>
              Explore organizations where students of the Department have participated in orientation visits, concurrent fieldwork, internships, projects, and other academic activities. This directory is designed to help students discover agencies relevant to their future academic and professional development.
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Search & Multi-Filter Controls */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by organization name, location, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-amber-400">{filteredOrganizations.length}</span> organizations
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Organization Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                {orgTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Department Activity</label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                {activityOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Area of Work</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                {areaOptions.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {(selectedType !== "All" || selectedActivity !== "All" || selectedArea !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedType("All");
                setSelectedActivity("All");
                setSelectedArea("All");
                setSearchQuery("");
              }}
              className="text-xs text-amber-400 hover:underline inline-block font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Organizations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div
              key={org.id}
              onClick={() => setActiveModalOrg(org)}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer flex flex-col justify-between group space-y-4 shadow-sm hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    {org.orgType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {org.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{org.location}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {org.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                {/* Activities Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {org.activities?.map((act) => (
                    <span
                      key={act}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300"
                    >
                      {act}
                    </span>
                  ))}
                </div>

                {/* Areas of Work Badges */}
                <div className="flex flex-wrap gap-1">
                  {org.areasOfWork?.slice(0, 3).map((area) => (
                    <span
                      key={area}
                      className="px-2 py-0.5 rounded-md bg-amber-500/5 text-amber-400/90 text-[10px] border border-amber-500/10"
                    >
                      {area}
                    </span>
                  ))}
                  {org.areasOfWork && org.areasOfWork.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-semibold self-center">
                      +{org.areasOfWork.length - 3} more
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                  <span>View Details & Engagement Info</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-400 space-y-2">
            <Info className="w-6 h-6 mx-auto text-slate-500" />
            <p className="font-semibold text-white">No organizations found</p>
            <p>Try resetting your filters or modifying your search query.</p>
          </div>
        )}

      </div>

      {/* Details Modal */}
      {activeModalOrg && (
        <div
          onClick={() => setActiveModalOrg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setActiveModalOrg(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase">
                  {activeModalOrg.orgType}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeModalOrg.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeModalOrg.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                About the Organization
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeModalOrg.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Department Activity Engagements
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalOrg.activities?.map((act) => (
                  <span
                    key={act}
                    className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Areas of Work / Social Sectors
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeModalOrg.areasOfWork?.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {activeModalOrg.website && (
              <div className="pt-2 border-t border-slate-800">
                <a
                  href={activeModalOrg.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/10"
                >
                  <span>Visit Official Organization Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}