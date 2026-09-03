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
  GraduationCap, 
  Mail, 
  Building, 
  BookOpen, 
  ArrowLeft,
  Camera,
  Phone,
  CheckCircle2,
  UploadCloud
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
  createdAt?: string;
}

export default function AdminPortalPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facultyMembers, setFacultyMembers] = useState<FacultyItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // Form State for Faculty Details
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    qualification: "",
    specialization: "",
    email: "",
    phone: "",
    officeRoom: "",
    photoUrl: "",
  });

  // Real-time Firestore sync
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

  // Handle Photo Selection & Conversion
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select a photo smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhotoPreview(base64String);
      setFormData((prev) => ({ ...prev, photoUrl: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Publish to Firestore
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.email) {
      alert("Please fill in the required fields: Name, Designation, and Email.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "staff"), {
        ...formData,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });

      // Reset form
      setFormData({
        name: "",
        designation: "",
        qualification: "",
        specialization: "",
        email: "",
        phone: "",
        officeRoom: "",
        photoUrl: "",
      });
      setPhotoPreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      alert("Faculty profile published! It will now appear on the public Faculty directory.");
    } catch (err: any) {
      console.error("Failed to add profile:", err);
      alert("Error publishing profile: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Remove staff profile
  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the directory?`)) return;
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
      
      {/* Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Faculty & Staff Profile Creator
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Upload faculty portraits, academic credentials, and contact details to the live website.
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form with Photo Upload */}
          <div className="lg:col-span-6 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>Create Faculty Profile</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload a portrait and enter your academic details to be showcased on the public portal.
              </p>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-5 text-xs">
              
              {/* Photo Upload Section */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Faculty Photo / Portrait
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0 group">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="faculty-photo"
                    />
                    <label
                      htmlFor="faculty-photo"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer font-semibold transition border border-slate-700"
                    >
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>{photoPreview ? "Change Photo" : "Upload Picture"}</span>
                    </label>
                    <p className="text-[10px] text-slate-500">
                      PNG, JPG up to 2MB. Square headshots work best.
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name & Title *
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

              {/* Designation */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Professor & Fieldwork Coordinator"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Qualifications & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Degrees / Qualifications
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
                    Official College Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. faculty.sw@stxaviers.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Area of Specialization & Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Community Development, Casework, Mental Health"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Office Location & Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Office / Cabin Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Academic Block A, Room 204"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Phone / Extension (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/10 disabled:opacity-50 mt-4"
              >
                {submitting ? "Uploading Profile..." : "Publish Profile to Live Directory"}
              </button>
            </form>
          </div>

          {/* Right Column: Published Profiles List */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Published Profiles ({facultyMembers.length})
              </h2>
              <p className="text-xs text-slate-400">
                These profiles are live on the public <code className="text-amber-400">/staff</code> page.
              </p>
            </div>

            {facultyMembers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                No custom profiles uploaded yet. Use the form to publish your first faculty entry.
              </div>
            ) : (
              <div className="space-y-3">
                {facultyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      {/* Photo or Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-amber-400 font-bold">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{member.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                            Live
                          </span>
                        </div>
                        <p className="text-xs text-amber-400">{member.designation}</p>
                        <p className="text-[11px] text-slate-400">{member.email}</p>
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
      </div>

    </div>
  );
}