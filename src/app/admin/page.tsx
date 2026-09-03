"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  Trash2, 
  GraduationCap, 
  Mail, 
  Building, 
  BookOpen, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

interface FacultyItem {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  officeRoom?: string;
  createdAt?: string;
}

export default function AdminPortalPage() {
  const { user, profile } = useAuth();
  const [facultyMembers, setFacultyMembers] = useState<FacultyItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"staff" | "overview">("staff");

  // Form input states
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    qualification: "",
    specialization: "",
    email: "",
    officeRoom: "",
  });

  // Listen to the 'staff' collection in real-time
  useEffect(() => {
    try {
      const q = query(collection(db, "staff"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const staffList: FacultyItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FacultyItem, "id">),
        }));
        setFacultyMembers(staffList);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching staff records:", error);
    }
  }, []);

  // Handle staff addition
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.email) {
      alert("Name, Designation, and Email are required.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "staff"), {
        ...formData,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });

      setFormData({
        name: "",
        designation: "",
        qualification: "",
        specialization: "",
        email: "",
        officeRoom: "",
      });
      alert("Faculty profile published! It is now live on the public Faculty Directory.");
    } catch (err: any) {
      console.error("Failed to add profile:", err);
      alert("Error publishing profile: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle staff removal
  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the public directory?`)) return;
    try {
      await deleteDoc(doc(db, "staff", id));
      alert(`${name} removed successfully.`);
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert("Failed to delete record: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Admin Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrative Control Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Department Management Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage public directory entries, circulars, and departmental records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/staff"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>View Live Directory</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "staff"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty Directory</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px]">
                {facultyMembers.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form: Add / Register Profile */}
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Add Faculty Profile</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fill out this form to immediately add yourself or a colleague to the public directory.
                </p>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Full Name & Honorific *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. L. Timothy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assistant Professor & Head of Department"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Academic Degrees
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MSW, Ph.D., UGC-NET"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. hod.sw@stxaviers.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Specialization & Research Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Development & Field Practicum"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Office Desk / Cabin Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Academic Block A, Room 204"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/10 disabled:opacity-50 mt-2"
                >
                  {submitting ? "Publishing..." : "Publish to Public Faculty Page"}
                </button>
              </form>
            </div>

            {/* Right List: Currently Published Faculty Profiles */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Active Directory Profiles ({facultyMembers.length})
                </h2>
                <p className="text-xs text-slate-400">
                  These profiles are currently visible to all students and visitors on `/staff`.
                </p>
              </div>

              {facultyMembers.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No dynamic faculty records in Firestore yet. Submit the form on the left to add your first profile.
                </div>
              ) : (
                <div className="space-y-3">
                  {facultyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{member.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                            Live
                          </span>
                        </div>
                        <p className="text-xs text-amber-400">{member.designation}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                            {member.qualification || "Not specified"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            {member.email}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteStaff(member.id, member.name)}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition shrink-0 ml-3"
                        title="Remove Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}