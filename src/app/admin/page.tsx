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
  Image as ImageIcon,
  CheckCircle2
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

export default function AdminPortalPage() {
  const { user } = useAuth();
  const staffFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"staff" | "notices" | "gallery">("staff");

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

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [submittingGallery, setSubmittingGallery] = useState(false);
  const [galleryPhotoPreview, setGalleryPhotoPreview] = useState<string>("");
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Fieldwork" as "Rural Camp" | "Fieldwork" | "Workshops" | "Community",
    caption: "",
    imageUrl: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Listen to 'staff'
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(query(collection(db, "staff")), (snapshot) => {
        const list: FacultyItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FacultyItem, "id">),
        }));
        setFacultyMembers(list);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Staff fetch error:", err);
    }
  }, []);

  // Listen to 'notices'
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(query(collection(db, "notices")), (snapshot) => {
        const list: NoticeItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NoticeItem, "id">),
        }));
        setNotices(list);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Notices fetch error:", err);
    }
  }, []);

  // Listen to 'gallery'
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(query(collection(db, "gallery")), (snapshot) => {
        const list: GalleryItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GalleryItem, "id">),
        }));
        setGalleryItems(list);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Gallery fetch error:", err);
    }
  }, []);

  // Handle Faculty Photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
      setFacultyForm((prev) => ({ ...prev, photoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Gallery Photo
  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert("Image is too large. Please select a photo under 2.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setGalleryPhotoPreview(base64);
      setGalleryForm((prev) => ({ ...prev, imageUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Faculty
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.designation || !facultyForm.email) {
      alert("Name, Designation, and Email are required.");
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
      if (staffFileInputRef.current) staffFileInputRef.current.value = "";
      alert("Faculty profile published successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingStaff(false);
    }
  };

  // Submit Notice
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.description) {
      alert("Title and description are required.");
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
      alert("Notice published!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Submit Gallery Photo
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.imageUrl) {
      alert("Please choose a photo and enter a title.");
      return;
    }
    setSubmittingGallery(true);
    try {
      await addDoc(collection(db, "gallery"), {
        ...galleryForm,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });
      setGalleryForm({
        title: "",
        category: "Fieldwork",
        caption: "",
        imageUrl: "",
        date: new Date().toISOString().split("T")[0],
      });
      setGalleryPhotoPreview("");
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      alert("Photo added to the Gallery!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingGallery(false);
    }
  };

  // Delete helpers
  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    await deleteDoc(doc(db, "staff", id));
  };

  const handleDeleteNotice = async (id: string, title: string) => {
    if (!confirm(`Delete notice: "${title}"?`)) return;
    await deleteDoc(doc(db, "notices", id));
  };

  const handleDeleteGallery = async (id: string, title: string) => {
    if (!confirm(`Delete picture: "${title}"?`)) return;
    await deleteDoc(doc(db, "gallery", id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Top Navigation */}
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
                Manage live faculty directories, circulars, and fieldwork photo media.
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "notices"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notices & Circulars ({notices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "gallery"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Fieldwork Gallery ({galleryItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: FACULTY */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Create Faculty Profile</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload portrait and details to appear on `/staff`.
                </p>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Faculty Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        ref={staffFileInputRef}
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
                      <p className="text-[10px] text-slate-500">Max 2MB. Square headshot works best.</p>
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
                  {submittingStaff ? "Publishing Profile..." : "Publish Profile to Live Directory"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Active Faculty Profiles ({facultyMembers.length})</h2>
              {facultyMembers.map((member) => (
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
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NOTICES */}
        {activeTab === "notices" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Publish Notice / Circular</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Post announcements directly to `/notices`.</p>
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fieldwork Practicum Guidelines"
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
                    <label className="block text-slate-300 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={noticeForm.date}
                      onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Announcement details..."
                    value={noticeForm.description}
                    onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Attachment Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={noticeForm.attachmentUrl}
                    onChange={(e) => setNoticeForm({ ...noticeForm, attachmentUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isImp"
                    checked={noticeForm.isImportant}
                    onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                    className="rounded border-slate-800 text-amber-500"
                  />
                  <label htmlFor="isImp" className="text-slate-300 font-semibold cursor-pointer">
                    Urgent / High Priority
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submittingNotice}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
                >
                  {submittingNotice ? "Publishing..." : "Post Notice"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-white">Live Notices ({notices.length})</h2>
              {notices.map((n) => (
                <div key={n.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                      {n.category}
                    </span>
                    <button
                      onClick={() => handleDeleteNotice(n.id, n.title)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  <p className="text-xs text-slate-400">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Upload Fieldwork Photo</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Showcase grassroots immersion, camp activities, and practical sessions on `/gallery`.
                </p>
              </div>

              <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Select Image *</label>
                  <div className="relative aspect-video rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                    {galleryPhotoPreview ? (
                      <img src={galleryPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 text-slate-500">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span>No image chosen yet</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      accept="image/*"
                      onChange={handleGalleryPhotoUpload}
                      className="hidden"
                      id="gallery-file"
                    />
                    <label
                      htmlFor="gallery-file"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer font-semibold transition border border-slate-700"
                    >
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>{galleryPhotoPreview ? "Change Photo" : "Upload Picture"}</span>
                    </label>
                    <span className="text-[10px] text-slate-500 ml-2">Under 2.5MB</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title / Activity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rural Educational Camp 2026 – Community Survey"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Fieldwork">Fieldwork</option>
                      <option value="Rural Camp">Rural Camp</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Community">Community Action</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Event Date</label>
                    <input
                      type="date"
                      value={galleryForm.date}
                      onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Caption / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the intervention or learning objective..."
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingGallery}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 mt-2"
                >
                  {submittingGallery ? "Uploading..." : "Publish to Public Gallery"}
                </button>
              </form>
            </div>

            {/* Gallery Grid List */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-bold text-white">Live Gallery Photos ({galleryItems.length})</h2>
              {galleryItems.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No images uploaded yet. Submit the form to add your first photo.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="relative rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden group">
                      <div className="aspect-video w-full overflow-hidden bg-slate-950">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                            {item.category}
                          </span>
                          <button
                            onClick={() => handleDeleteGallery(item.id, item.title)}
                            className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        {item.caption && (
                          <p className="text-[11px] text-slate-400 line-clamp-2">{item.caption}</p>
                        )}
                      </div>
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