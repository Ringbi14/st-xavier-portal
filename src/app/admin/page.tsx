"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  where 
} from "firebase/firestore";
import { 
  Send, 
  Calendar, 
  Bell, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  UserCheck,
  UserX,
  UserPlus
} from "lucide-react";

interface PendingStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  status: string;
}

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"notice" | "event" | "approvals" | "admins">("notice");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Approvals State
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // New Admin Form
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");

  // Notices Form
  const [noticeData, setNoticeData] = useState({
    title: "",
    category: "General",
    content: "",
    isPublic: true,
  });

  // Events Form
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    resourcePerson: "",
    description: "",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (profile?.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, profile, loading, router]);

  // Load pending students when Approvals tab is selected
  useEffect(() => {
    if (activeTab === "approvals") {
      fetchPendingStudents();
    }
  }, [activeTab]);

  const fetchPendingStudents = async () => {
    setLoadingStudents(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "pending"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as PendingStudent[];
      setPendingStudents(list);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "users", id), { status: "approved" });
      setPendingStudents((prev) => prev.filter((s) => s.id !== id));
      setStatusMessage({ type: "success", text: "Student approved successfully." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to approve student." });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setPendingStudents((prev) => prev.filter((s) => s.id !== id));
      setStatusMessage({ type: "success", text: "Student registration rejected." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to reject registration." });
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      await addDoc(collection(db, "users"), {
        email: newAdminEmail.toLowerCase().trim(),
        name: newAdminName.trim() || "Faculty Admin",
        role: "admin",
        status: "approved",
        createdAt: serverTimestamp(),
      });

      setStatusMessage({ type: "success", text: `Admin privilege pre-assigned to ${newAdminEmail}.` });
      setNewAdminEmail("");
      setNewAdminName("");
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to assign admin role." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      await addDoc(collection(db, "notices"), {
        ...noticeData,
        publishedAt: serverTimestamp(),
        authorEmail: user?.email,
      });

      setStatusMessage({ type: "success", text: "Department notice published successfully." });
      setNoticeData({ title: "", category: "General", content: "", isPublic: true });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to publish notice." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      await addDoc(collection(db, "events"), {
        ...eventData,
        isUpcoming: true,
        createdAt: serverTimestamp(),
        authorEmail: user?.email,
      });

      setStatusMessage({ type: "success", text: "Calendar event scheduled successfully." });
      setEventData({ title: "", date: "", time: "", venue: "", resourcePerson: "", description: "" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to schedule event." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        Verifying administrator credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              Administrative Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Department Management</h1>
            <p className="text-xs text-slate-400">
              Department of Social Work | St. Xavier College, Maram Khunou
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1 text-xs">
            <button
              onClick={() => { setActiveTab("notice"); setStatusMessage(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "notice" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notices
            </button>
            <button
              onClick={() => { setActiveTab("event"); setStatusMessage(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "event" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Events
            </button>
            <button
              onClick={() => { setActiveTab("approvals"); setStatusMessage(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "approvals" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Approvals
            </button>
            <button
              onClick={() => { setActiveTab("admins"); setStatusMessage(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "admins" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admins
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {statusMessage.text}
          </div>
        )}

        {/* Tab 1: Notices Form */}
        {activeTab === "notice" && (
          <form onSubmit={handleNoticeSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white">Publish Notice or Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notice Title</label>
                <input
                  type="text"
                  required
                  value={noticeData.title}
                  onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })}
                  placeholder="e.g., Rural Exposure Camp Schedule 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={noticeData.category}
                    onChange={(e) => setNoticeData({ ...noticeData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Fieldwork">Fieldwork</option>
                    <option value="Examination">Examination</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Visibility</label>
                  <div className="flex items-center gap-4 h-[42px] px-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noticeData.isPublic}
                        onChange={(e) => setNoticeData({ ...noticeData, isPublic: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500"
                      />
                      Make Publicly Visible
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notice Content</label>
                <textarea
                  rows={5}
                  required
                  value={noticeData.content}
                  onChange={(e) => setNoticeData({ ...noticeData, content: e.target.value })}
                  placeholder="Enter full notice body..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Notice
            </button>
          </form>
        )}

        {/* Tab 2: Event Form */}
        {activeTab === "event" && (
          <form onSubmit={handleEventSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white">Schedule Department Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="e.g., Social Casework Practical Workshop"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time</label>
                  <input
                    type="text"
                    value={eventData.time}
                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    placeholder="e.g., 10:00 AM - 1:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Venue</label>
                  <input
                    type="text"
                    required
                    value={eventData.venue}
                    onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                    placeholder="e.g., AV Hall"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resource Person</label>
                  <input
                    type="text"
                    value={eventData.resourcePerson}
                    onChange={(e) => setEventData({ ...eventData, resourcePerson: e.target.value })}
                    placeholder="e.g., Guest Speaker"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Description</label>
                <textarea
                  rows={4}
                  required
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Outline objectives and details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Save Event
            </button>
          </form>
        )}

        {/* Tab 3: Student Approvals Queue */}
        {activeTab === "approvals" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Student Verification Queue</h2>
              <p className="text-xs text-slate-400">
                Review registered students. Approved students gain access to circulars and internal academic resources.
              </p>
            </div>

            {loadingStudents ? (
              <div className="flex items-center justify-center p-8 text-xs text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                Loading pending applications...
              </div>
            ) : pendingStudents.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                No pending student registrations.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{student.name}</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 border border-slate-700">
                          Roll: {student.rollNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(student.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(student.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Add New Faculty Admin */}
        {activeTab === "admins" && (
          <form onSubmit={handleAddAdmin} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Authorize New Administrator</h2>
              <p className="text-xs text-slate-400">
                Grant admin permissions to new department professors or coordinators.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professor Name</label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g., Dr. Mary"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="professor@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Grant Admin Access
            </button>
          </form>
        )}

      </div>
    </div>
  );
}