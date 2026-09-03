"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { INITIAL_FACULTY, FacultyMember } from "@/data/facultyData";
import { 
  Users, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  Building, 
  X, 
  CheckCircle,
  Briefcase
} from "lucide-react";

export default function FacultyDirectoryPage() {
  const { user, profile } = useAuth();
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(INITIAL_FACULTY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State for Self-Addition
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    qualification: "",
    specialization: "",
    email: "",
    officeRoom: "",
  });

  // Listen to Firestore 'staff' collection in real-time
  useEffect(() => {
    try {
      const q = query(collection(db, "staff"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedStaff: FacultyMember[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<FacultyMember, "id">),
          }));
          setFacultyList(fetchedStaff);
        } else {
          setFacultyList(INITIAL_FACULTY);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore not yet populated, using verified fallback data:", err);
      setFacultyList(INITIAL_FACULTY);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.email) {
      alert("Please fill in the required fields: Name, Designation, and Email.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "staff"), {
        ...formData,
        createdAt: new Date().toISOString(),
        authorEmail: user?.email || "anonymous",
      });

      setFormData({
        name: "",
        designation: "",
        qualification: "",
        specialization: "",
        email: "",
        officeRoom: "",
      });
      setIsModalOpen(false);
      alert("Faculty profile published successfully!");
    } catch (error: any) {
      console.error("Error adding faculty profile:", error);
      alert("Could not save to database: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Academic Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Faculty & Fieldwork Supervisors
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Dedicated social work educators, researchers, and field practicum coordinators guiding students through fieldwork interventions and academic coursework.
              </p>
            </div>

            {/* Self-Add Button for Staff */}
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/10"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add / Register Faculty Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((member) => (
            <div
              key={member.id}
              className="flex flex-col justify-between rounded-2xl bg-slate-900/60 border border-slate-800 p-6 hover:border-amber-500/40 transition group"
            >
              <div className="space-y-4">
                
                {/* Header Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-amber-400 font-black text-xl group-hover:border-amber-500/50 transition">
                    {member.name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, "").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-xs text-amber-400/90 font-medium">
                      {member.designation}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-800/80 w-full" />

                {/* Academic Qualifications & Specialization */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Degrees</span>
                      <span>{member.qualification}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specialization</span>
                      <span>{member.specialization}</span>
                    </div>
                  </div>

                  {member.officeRoom && (
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Office Desk</span>
                        <span>{member.officeRoom}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Contact */}
              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact via Email</span>
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Staff Self-Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Add Faculty Profile</h3>
                <p className="text-xs text-slate-400">Published directly to the departmental directory.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Professor & Fieldwork Coordinator"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MSW, UGC-NET"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. faculty@stxaviers.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Specialization / Core Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Casework, Community Development, Rural Camp"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Office Room / Department Desk</label>
                <input
                  type="text"
                  placeholder="e.g. Department Office Room 204"
                  value={formData.officeRoom}
                  onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Publish Profile"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}