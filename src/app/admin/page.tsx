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
  ArrowLeft,
  Camera,
  UploadCloud,
  Bell,
  Calendar,
  AlertCircle
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

interface NoticeItem {
  id: string;
  title: string;
  category: "Academic" | "Fieldwork" | "Examinations" | "Urgent";
  description: string;
  attachmentUrl?: string;
  isImportant: boolean;
  date: string;
  createdAt?: string;
}

export default function AdminPortalPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"staff" | "notices">("staff");

  // Faculty State
  const [facultyMembers, setFacultyMembers] = useState<FacultyItem[]>([]);
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [facultyForm, setFacultyForm] = useState({
    name: "",
    designation: "",
    qualification: "",
    specialization: "",
    email: "",
    phone: "",
    officeRoom: "",
    photoUrl: "",
  });

  // Notices State
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [submittingNotice, setSubmittingNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    category: "Academic" as "Academic" | "Fieldwork" | "Examinations" | "Urgent",
    description: "",
    attachmentUrl: "",
    isImportant: false,
    date: new Date().toISOString().split("T")[0],
  });

  // Listen to 'staff' collection
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

  // Listen to 'notices' collection
  useEffect(() => {
    try {
      const q = query(collection(db, "notices"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const noticeList: NoticeItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NoticeItem, "id">),
        }));
        setNotices(noticeList);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }, []);

  // Handle Photo Selection
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
      setFacultyForm((prev) => ({ ...prev, photoUrl: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Faculty Profile
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.designation || !facultyForm.email) {
      alert("Please fill in Name, Designation, and Email.");
      return;
    }

    setSubmittingStaff(true);
    try {
      await addDoc(collection(db, "staff"), {
        ...facultyForm,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });

      setFacultyForm({
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
      alert("Faculty profile published successfully!");
    } catch (err: any) {
      console.error("Failed to add profile:", err);
      alert("Error publishing profile: " + err.message);
    } finally {
      setSubmittingStaff(false);
    }
  };

  // Delete Faculty Profile
  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the directory?`)) return;
    try {
      await deleteDoc(doc(db, "staff", id));
      alert(`${name} removed successfully.`);
    } catch (err: any) {
      alert("Failed to delete record: " + err.message);
    }
  };

  // Submit Notice
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.description) {
      alert("Please provide a title and description for the notice.");
      return;
    }

    setSubmittingNotice(true);
    try {
      await addDoc(collection(db, "notices"), {
        ...noticeForm,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });

      setNoticeForm({
        title: "",
        category: "Academic",
        description: "",
        attachmentUrl: "",
        isImportant: false,
        date: new Date().toISOString().split("T")[0],
      });
      alert("Notice published live on the Noticeboard!");
    } catch (err: any) {
      alert("Error publishing notice: " + err.message);
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Delete Notice
  const handleDeleteNotice = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete notice: "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, "notices", id));
      alert("Notice removed.");
    } catch (err: any) {
      alert("Failed to delete notice: " + err.message);
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
                Department Administrative Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage live faculty directories, publish circulars, and review records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "staff"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty Directory ({facultyMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("notices")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "notices"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notices & Circulars ({notices.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: FACULTY MANAGEMENT */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Create Faculty Profile</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload portrait and details to be showcased on `/staff`.
                </p>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Faculty Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
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
                      <p className="text-[10px] text-slate-500">Max 2MB. Square headshots look best.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name & Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. L. Timothy"
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assistant Professor & Head of Department"
                    value={facultyForm.designation}
                    onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Qualifications</label>
                    <input
                      type="text"
                      placeholder="e.g. MSW, Ph.D., UGC-NET"
                      value={facultyForm.qualification}
                      onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. faculty.sw@stxaviers.edu.in"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Community Development, Casework, Mental Health"
                    value={facultyForm.specialization}
                    onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Office Room</label>
                    <input
                      type="text"
                      placeholder="e.g. Academic Block A, Room 204"
                      value={facultyForm.officeRoom}
                      onChange={(e) => setFacultyForm({ ...facultyForm, officeRoom: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={facultyForm.phone}
                      onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingStaff}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 mt-2"
                >
                  {submittingStaff ? "Uploading Profile..." : "Publish Profile to Live Directory"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Active Faculty Profiles ({facultyMembers.length})</h2>
              {facultyMembers.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No dynamic profiles in database.
                </div>
              ) : (
                facultyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-amber-400 font-bold">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{member.name}</span>
                        <p className="text-xs text-amber-400">{member.designation}</p>
                        <p className="text-[11px] text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStaff(member.id, member.name)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                      title="Remove Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: NOTICES & CIRCULARS MANAGEMENT */}
        {activeTab === "notices" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Publish Notice / Circular</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Post departmental announcements and circulars directly to `/notices`.
                </p>
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rural Camp Orientation Schedule"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={noticeForm.category}
                      onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Fieldwork">Fieldwork</option>
                      <option value="Examinations">Examinations</option>
                      <option value="Urgent">Urgent Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={noticeForm.date}
                      onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Content / Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write the full announcement or instructions here..."
                    value={noticeForm.description}
                    onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Attachment / PDF Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or document link"
                    value={noticeForm.attachmentUrl}
                    onChange={(e) => setNoticeForm({ ...noticeForm, attachmentUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={noticeForm.isImportant}
                    onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                    className="rounded border-slate-800 text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="isImportant" className="text-slate-300 font-semibold cursor-pointer">
                    Mark as Urgent / Priority Notice
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submittingNotice}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 mt-2"
                >
                  {submittingNotice ? "Publishing..." : "Post to Public Noticeboard"}
                </button>
              </form>
            </div>

            {/* Active Notices List */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-white">Live Notices ({notices.length})</h2>
              {notices.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No notices posted yet. Use the form to publish your first announcement.
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                          {notice.category}
                        </span>
                        {notice.isImportant && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                            Urgent
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">{notice.date}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteNotice(notice.id, notice.title)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white">{notice.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{notice.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}