"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  ShieldAlert, 
  Send, 
  Calendar, 
  Bell, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"notice" | "event">("notice");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State for Notices
  const [noticeData, setNoticeData] = useState({
    title: "",
    category: "General",
    content: "",
    isPublic: true,
  });

  // Form State for Events
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    resourcePerson: "",
    description: "",
  });

  // Role Protection Check
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

  if (loading || !user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        Verifying administrator credentials...
      </div>
    );
  }

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      await addDoc(collection(db, "notices"), {
        ...noticeData,
        publishedAt: serverTimestamp(),
        authorEmail: user.email,
      });

      setStatusMessage({ type: "success", text: "Department notice published successfully." });
      setNoticeData({
        title: "",
        category: "General",
        content: "",
        isPublic: true,
      });
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
        authorEmail: user.email,
      });

      setStatusMessage({ type: "success", text: "Calendar event scheduled successfully." });
      setEventData({
        title: "",
        date: "",
        time: "",
        venue: "",
        resourcePerson: "",
        description: "",
      });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to schedule event." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              Administrative Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Content Management</h1>
            <p className="text-xs text-slate-400">
              Department of Social Work | St. Xavier College, Maram Khunou
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => {
                setActiveTab("notice");
                setStatusMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "notice"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              New Notice
            </button>
            <button
              onClick={() => {
                setActiveTab("event");
                setStatusMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "event"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              New Event
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {statusMessage.text}
          </div>
        )}

        {/* Notice Form */}
        {activeTab === "notice" && (
          <form
            onSubmit={handleNoticeSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Publish Notice or Announcement</h2>
              <p className="text-xs text-slate-400">
                Notices marked public appear on the home page and public notice board.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notice Title
                </label>
                <input
                  type="text"
                  required
                  value={noticeData.title}
                  onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })}
                  placeholder="e.g., Rural Exposure Camp Schedule 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={noticeData.category}
                    onChange={(e) => setNoticeData({ ...noticeData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100"
                  >
                    <option value="General">General</option>
                    <option value="Fieldwork">Fieldwork</option>
                    <option value="Examination">Examination</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Visibility
                  </label>
                  <div className="flex items-center gap-4 h-[42px] px-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noticeData.isPublic}
                        onChange={(e) => setNoticeData({ ...noticeData, isPublic: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/20"
                      />
                      Make Publicly Visible
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notice Content
                </label>
                <textarea
                  rows={5}
                  required
                  value={noticeData.content}
                  onChange={(e) => setNoticeData({ ...noticeData, content: e.target.value })}
                  placeholder="Enter full notice body..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Notice
            </button>
          </form>
        )}

        {/* Event Form */}
        {activeTab === "event" && (
          <form
            onSubmit={handleEventSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Schedule Department Event</h2>
              <p className="text-xs text-slate-400">
                Scheduled events appear in the events calendar and the homepage feed.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="e.g., Participatory Rural Appraisal (PRA) Skill Workshop"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Time
                  </label>
                  <input
                    type="text"
                    value={eventData.time}
                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    placeholder="e.g., 10:00 AM - 1:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={eventData.venue}
                    onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                    placeholder="e.g., Audio-Visual Hall / Rural Field Site"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Resource Person / Keynote
                  </label>
                  <input
                    type="text"
                    value={eventData.resourcePerson}
                    onChange={(e) => setEventData({ ...eventData, resourcePerson: e.target.value })}
                    placeholder="e.g., Dr. Name / Guest Lecturer"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Event Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Outline objectives, target batch, and program details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Save Event to Portal
            </button>
          </form>
        )}

      </div>
    </div>
  );
}