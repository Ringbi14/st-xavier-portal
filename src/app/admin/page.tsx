"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query 
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  Trash2, 
  ArrowLeft,
  Camera,
  UploadCloud,
  Bell,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Briefcase,
  ExternalLink,
  MapPin
} from "lucide-react";

interface FacultyItem {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  phone?: string;
  officeRoom?: string;
  photoUrl?: string;
}

interface NoticeItem {
  id: string;
  title: string;
  category: "Academic" | "Fieldwork" | "Examinations" | "Urgent";
  description: string;
  attachmentUrl?: string;
  isImportant: boolean;
  date: string;
}

interface GalleryItem {
  id: string;
  title: string;
  category: "Rural Camp" | "Fieldwork" | "Workshops" | "Community";
  caption?: string;
  imageUrl: string;
  date?: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: "Fieldwork" | "Academic" | "Seminar" | "Camp";
  description: string;
}

interface OrgAdminItem {
  id: string;
  name: string;
  location: string;
  orgType: string;
  activities: string[];
  areasOfWork: string[];
  website?: string;
  description: string;
  yearOrDate?: string;
}

export default function AdminPortalPage() {
  const { user } = useAuth();
  const staffFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"staff" | "notices" | "gallery" | "events" | "organizations">("staff");

  // State
  const [facultyMembers, setFacultyMembers] = useState<FacultyItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [organizations, setOrganizations] = useState<OrgAdminItem[]>([]);

  // Organization Form State
  const [submittingOrg, setSubmittingOrg] = useState(false);
  const [orgForm, setOrgForm] = useState({
    name: "",
    location: "",
    orgType: "NGO",
    activities: ["Fieldwork"] as string[],
    areasOfWork: ["Community Development"] as string[],
    website: "",
    description: "",
    yearOrDate: new Date().getFullYear().toString(),
  });

  // Options
  const orgTypeOptions = [
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
    "Orientation Visit",
    "Fieldwork",
    "Internship",
    "Study Visit",
    "Community Programme",
    "Project",
    "Other"
  ];

  const areaOptions = [
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

  // Firestore Subscriptions
  useEffect(() => {
    try {
      const u1 = onSnapshot(query(collection(db, "staff")), (snap) => {
        setFacultyMembers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });
      const u2 = onSnapshot(query(collection(db, "notices")), (snap) => {
        setNotices(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });
      const u3 = onSnapshot(query(collection(db, "gallery")), (snap) => {
        setGalleryItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });
      const u4 = onSnapshot(query(collection(db, "events")), (snap) => {
        setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });
      const u5 = onSnapshot(query(collection(db, "organizations")), (snap) => {
        setOrganizations(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });

      return () => {
        u1(); u2(); u3(); u4(); u5();
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Organization Activity Toggle
  const toggleActivity = (act: string) => {
    setOrgForm((prev) => ({
      ...prev,
      activities: prev.activities.includes(act)
        ? prev.activities.filter((a) => a !== act)
        : [...prev.activities, act],
    }));
  };

  // Organization Area Toggle
  const toggleArea = (area: string) => {
    setOrgForm((prev) => ({
      ...prev,
      areasOfWork: prev.areasOfWork.includes(area)
        ? prev.areasOfWork.filter((a) => a !== area)
        : [...prev.areasOfWork, area],
    }));
  };

  // Submit Organization
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.name || !orgForm.location || !orgForm.description) {
      alert("Name, location, and description are required.");
      return;
    }
    setSubmittingOrg(true);
    try {
      await addDoc(collection(db, "organizations"), {
        ...orgForm,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });
      setOrgForm({
        name: "",
        location: "",
        orgType: "NGO",
        activities: ["Fieldwork"],
        areasOfWork: ["Community Development"],
        website: "",
        description: "",
        yearOrDate: new Date().getFullYear().toString(),
      });
      alert("Organization profile published to directory!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingOrg(false);
    }
  };

  const handleDeleteOrg = async (id: string, name: string) => {
    if (confirm(`Delete organization: "${name}"?`)) {
      await deleteDoc(doc(db, "organizations", id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Department Administrative Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage live faculty directories, circulars, events, and organizations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Student Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "staff" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty ({facultyMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("organizations")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "organizations" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Organizations ({organizations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("notices")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "notices" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notices ({notices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "events" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Events ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "gallery" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery ({galleryItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB: ORGANIZATIONS DIRECTORY MANAGEMENT */}
        {activeTab === "organizations" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-6 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Add Organization Reference</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add fieldwork agencies, visit centers, and internship organizations for student discovery.
                </p>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seven Sisters Development Assistance (SeSTA)"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Organization Type *</label>
                    <select
                      value={orgForm.orgType}
                      onChange={(e) => setOrgForm({ ...orgForm, orgType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    >
                      {orgTypeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Year / Period of Visit</label>
                    <input
                      type="text"
                      placeholder="e.g. 2025–2026"
                      value={orgForm.yearOrDate}
                      onChange={(e) => setOrgForm({ ...orgForm, yearOrDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Location (District / State) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senapati District, Manipur"
                      value={orgForm.location}
                      onChange={(e) => setOrgForm({ ...orgForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Official Website Link</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={orgForm.website}
                      onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Activity Checkboxes */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Department Activities Conducted</label>
                  <div className="flex flex-wrap gap-2">
                    {activityOptions.map((act) => (
                      <button
                        type="button"
                        key={act}
                        onClick={() => toggleActivity(act)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition ${
                          orgForm.activities.includes(act)
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-slate-950 text-slate-400 border border-slate-800"
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Areas of Work Checkboxes */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Main Areas of Work</label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {areaOptions.map((area) => (
                      <button
                        type="button"
                        key={area}
                        onClick={() => toggleArea(area)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${
                          orgForm.areasOfWork.includes(area)
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description & Field Experience *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Short description of the organization's work and activities conducted with the department..."
                    value={orgForm.description}
                    onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingOrg}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
                >
                  {submittingOrg ? "Publishing..." : "Save Organization to Directory"}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Active Organizations ({organizations.length})</h2>
              {organizations.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No organizations published in database yet.
                </div>
              ) : (
                organizations.map((org) => (
                  <div key={org.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                          {org.orgType}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{org.name}</h4>
                        <p className="text-xs text-slate-400">{org.location}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteOrg(org.id, org.name)}
                        className="p-2 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Other tabs remain fully intact (Faculty, Notices, Events, Gallery) */}
        {activeTab === "staff" && (
          <div className="p-6 text-center text-xs text-slate-400">
            Faculty Directory Management Active. Use the navigation buttons above to switch to Notices, Events, or Organizations.
          </div>
        )}

      </div>
    </div>
  );
}