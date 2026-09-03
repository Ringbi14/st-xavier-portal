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
  Calendar as CalendarIcon,
  Image as ImageIcon,
  MapPin,
  Clock
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

export default function AdminPortalPage() {
  const { user } = useAuth();
  const staffFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"staff" | "notices" | "gallery" | "events">("staff");

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

  // Events State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    venue: "",
    category: "Academic" as "Fieldwork" | "Academic" | "Seminar" | "Camp",
    description: "",
  });

  // Firestore Subscriptions
  useEffect(() => {
    try {
      const unsubStaff = onSnapshot(query(collection(db, "staff")), (snap) => {
        setFacultyMembers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FacultyItem, "id">) })));
      });
      const unsubNotices = onSnapshot(query(collection(db, "notices")), (snap) => {
        setNotices(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NoticeItem, "id">) })));
      });
      const unsubGallery = onSnapshot(query(collection(db, "gallery")), (snap) => {
        setGalleryItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) })));
      });
      const unsubEvents = onSnapshot(query(collection(db, "events")), (snap) => {
        setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EventItem, "id">) })));
      });

      return () => {
        unsubStaff();
        unsubNotices();
        unsubGallery();
        unsubEvents();
      };
    } catch (err) {
      console.error("Firestore sync error:", err);
    }
  }, []);

  // Image upload helpers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("Image must be under 2MB");
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setFacultyForm((prev) => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) return alert("Image must be under 2.5MB");
    const reader = new FileReader();
    reader.onloadend = () => {
      setGalleryPhotoPreview(reader.result as string);
      setGalleryForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Submissions
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.designation || !facultyForm.email) return alert("Fill required fields.");
    setSubmittingStaff(true);
    try {
      await addDoc(collection(db, "staff"), { ...facultyForm, authorEmail: user?.email || "admin", createdAt: new Date().toISOString() });
      setFacultyForm({ name: "", designation: "", qualification: "", specialization: "", email: "", phone: "", officeRoom: "", photoUrl: "" });
      setPhotoPreview("");
      if (staffFileInputRef.current) staffFileInputRef.current.value = "";
      alert("Faculty profile published!");
    } finally { setSubmittingStaff(false); }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.description) return alert("Fill required fields.");
    setSubmittingNotice(true);
    try {
      await addDoc(collection(db, "notices"), { ...noticeForm, authorEmail: user?.email || "admin", createdAt: new Date().toISOString() });
      setNoticeForm({ title: "", category: "Academic", description: "", attachmentUrl: "", isImportant: false, date: new Date().toISOString().split("T")[0] });
      alert("Notice published!");
    } finally { setSubmittingNotice(false); }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.imageUrl) return alert("Select an image and enter a title.");
    setSubmittingGallery(true);
    try {
      await addDoc(collection(db, "gallery"), { ...galleryForm, authorEmail: user?.email || "admin", createdAt: new Date().toISOString() });
      setGalleryForm({ title: "", category: "Fieldwork", caption: "", imageUrl: "", date: new Date().toISOString().split("T")[0] });
      setGalleryPhotoPreview("");
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      alert("Photo published to gallery!");
    } finally { setSubmittingGallery(false); }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.venue || !eventForm.description) {
      alert("Please provide title, venue, and description.");
      return;
    }
    setSubmittingEvent(true);
    try {
      await addDoc(collection(db, "events"), {
        ...eventForm,
        authorEmail: user?.email || "admin",
        createdAt: new Date().toISOString(),
      });
      setEventForm({
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM",
        venue: "",
        category: "Academic",
        description: "",
      });
      alert("Event published to the departmental calendar!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingEvent(false);
    }
  };

  // Delete handlers
  const handleDeleteStaff = async (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) await deleteDoc(doc(db, "staff", id));
  };
  const handleDeleteNotice = async (id: string, title: string) => {
    if (confirm(`Delete notice: "${title}"?`)) await deleteDoc(doc(db, "notices", id));
  };
  const handleDeleteGallery = async (id: string, title: string) => {
    if (confirm(`Delete image: "${title}"?`)) await deleteDoc(doc(db, "gallery", id));
  };
  const handleDeleteEvent = async (id: string, title: string) => {
    if (confirm(`Delete event: "${title}"?`)) await deleteDoc(doc(db, "events", id));
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
                Manage live faculty directories, circulars, media gallery, and event calendars.
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
                activeTab === "staff" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty Directory ({facultyMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("notices")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "notices" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notices & Circulars ({notices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "gallery" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery ({galleryItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "events" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar & Events ({events.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: FACULTY */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>Create Faculty Profile</span>
              </h2>
              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Faculty Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {photoPreview ? <img src={photoPreview} alt="" className="w-full h-full object-cover" /> : <Camera className="w-5 h-5 text-slate-500" />}
                    </div>
                    <input type="file" ref={staffFileInputRef} accept="image/*" onChange={handlePhotoUpload} className="hidden" id="staff-pic" />
                    <label htmlFor="staff-pic" className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 cursor-pointer font-semibold border border-slate-700">
                      Upload Picture
                    </label>
                  </div>
                </div>
                <input type="text" required placeholder="Full Name & Title *" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <input type="text" required placeholder="Designation / Role *" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Degrees" value={facultyForm.qualification} onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                  <input type="email" required placeholder="Official Email *" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                </div>
                <input type="text" placeholder="Specialization" value={facultyForm.specialization} onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Office Room" value={facultyForm.officeRoom} onChange={(e) => setFacultyForm({ ...facultyForm, officeRoom: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                  <input type="text" placeholder="Phone" value={facultyForm.phone} onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                </div>
                <button type="submit" disabled={submittingStaff} className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition">
                  {submittingStaff ? "Publishing..." : "Publish Profile"}
                </button>
              </form>
            </div>
            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Active Faculty ({facultyMembers.length})</h2>
              {facultyMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-sm font-bold text-white block">{m.name}</span>
                    <p className="text-xs text-amber-400">{m.designation}</p>
                  </div>
                  <button onClick={() => handleDeleteStaff(m.id, m.name)} className="p-2 rounded bg-rose-500/10 text-rose-400">
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>Publish Notice</span>
              </h2>
              <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
                <input type="text" required placeholder="Notice Title *" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={noticeForm.category} onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500">
                    <option value="Academic">Academic</option>
                    <option value="Fieldwork">Fieldwork</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <input type="date" value={noticeForm.date} onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                </div>
                <textarea required rows={4} placeholder="Description..." value={noticeForm.description} onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <input type="url" placeholder="Attachment Link (Optional)" value={noticeForm.attachmentUrl} onChange={(e) => setNoticeForm({ ...noticeForm, attachmentUrl: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <button type="submit" disabled={submittingNotice} className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition">
                  {submittingNotice ? "Publishing..." : "Post Notice"}
                </button>
              </form>
            </div>
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-white">Live Notices ({notices.length})</h2>
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-400">{n.category} • {n.date}</p>
                  </div>
                  <button onClick={() => handleDeleteNotice(n.id, n.title)} className="p-2 rounded bg-rose-500/10 text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>Upload Field Photo</span>
              </h2>
              <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
                <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden">
                  {galleryPhotoPreview ? <img src={galleryPhotoPreview} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-slate-600" />}
                </div>
                <input type="file" ref={galleryFileInputRef} accept="image/*" onChange={handleGalleryPhotoUpload} className="hidden" id="gal-file" />
                <label htmlFor="gal-file" className="block text-center py-2 rounded-xl bg-slate-800 text-slate-200 cursor-pointer font-semibold border border-slate-700">
                  Select Picture
                </label>
                <input type="text" required placeholder="Activity Title *" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500">
                    <option value="Fieldwork">Fieldwork</option>
                    <option value="Rural Camp">Rural Camp</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Community">Community Action</option>
                  </select>
                  <input type="date" value={galleryForm.date} onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                </div>
                <textarea rows={3} placeholder="Caption..." value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500" />
                <button type="submit" disabled={submittingGallery} className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition">
                  {submittingGallery ? "Uploading..." : "Publish Photo"}
                </button>
              </form>
            </div>
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-white">Live Gallery Photos ({galleryItems.length})</h2>
              <div className="grid grid-cols-2 gap-3">
                {galleryItems.map((g) => (
                  <div key={g.id} className="p-2 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <img src={g.imageUrl} alt="" className="aspect-video w-full object-cover rounded-xl" />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-white truncate">{g.title}</span>
                      <button onClick={() => handleDeleteGallery(g.id, g.title)} className="p-1 text-rose-400 hover:bg-rose-500/10 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EVENTS CALENDAR */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Schedule Department Event</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Add practicum briefings, camp meetings, and seminars to `/events`.</p>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rural Educational Camp Briefing"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Time *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10:30 AM - 1:00 PM"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Fieldwork">Fieldwork</option>
                      <option value="Camp">Rural Camp</option>
                      <option value="Seminar">Seminar / Workshop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Venue / Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Seminar Hall A"
                      value={eventForm.venue}
                      onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description & Agenda *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide meeting agenda or event specifics..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingEvent}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 mt-2"
                >
                  {submittingEvent ? "Scheduling..." : "Publish Event to Schedule"}
                </button>
              </form>
            </div>

            {/* Live Events List */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-white">Scheduled Events ({events.length})</h2>
              {events.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No scheduled events yet. Submit the form to add one.
                </div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                        {ev.category}
                      </span>
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {ev.venue}
                      </span>
                    </div>
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