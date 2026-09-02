"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  ShieldAlert, 
  BellPlus, 
  CalendarPlus, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // Tab switcher: notices or events
  const [activeTab, setActiveTab] = useState<"notice" | "event">("notice");

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<"academic" | "fieldwork" | "examination" | "general">("general");
  const [isNoticePublic, setIsNoticePublic] = useState(true);

  // Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventOrganizer, setEventOrganizer] = useState("");
  const [resourcePerson, setResourcePerson] = useState("");

  // Status & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Route protection
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Verifying administrative authorization...
      </div>
    );
  }

  // Handle Notice Submission
  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, "notices"), {
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory,
        isPublic: isNoticePublic,
        priority: "normal",
        publishedAt: new Date().toISOString().split("T")[0],
        authorId: user.uid,
      });

      setFeedback({ type: "success", text: "Department notice published successfully!" });
      setNoticeTitle("");
      setNoticeContent("");
    } catch (err: any) {
      setFeedback({ type: "error", text: "Error publishing notice. Check Firestore database permissions." });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Event Submission
  const handlePublishEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, "events"), {
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        venue: eventVenue,
        description: eventDesc,
        organizer: eventOrganizer || "Department of Social Work",
        resourcePerson: resourcePerson || "To be confirmed",
        isUpcoming: true,
        createdAt: new Date().toISOString(),
      });

      setFeedback({ type: "success", text: "Department event added successfully!" });
      setEventTitle("");
      setEventDate("");
      setEventTime("");
      setEventVenue("");
      setEventDesc("");
      setResourcePerson("");
    } catch (err: any) {
      setFeedback({ type: "error", text: "Error saving event. Check Firestore database permissions." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administrative Content Manager
            </div>
            <h1 className="text-2xl font-bold text-white">Department Control Center</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Publish announcements, schedule seminars, and manage department resources.
            </p>
          </div>

          {/* Form Selector Tabs */}
          <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1">
            <button
              onClick={() => { setActiveTab("notice"); setFeedback(null); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "notice"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BellPlus className="w-3.5 h-3.5" />
              New Notice
            </button>
            <button
              onClick={() => { setActiveTab("event"); setFeedback(null); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "event"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              New Event
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Notice Publishing Form */}
        {activeTab === "notice" ? (
          <form onSubmit={handlePublishNotice} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BellPlus className="w-4 h-4 text-amber-500" />
              Publish Department Notice
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g., Schedule for Rural Exposure Camp 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="general">General Circular</option>
                    <option value="fieldwork">Fieldwork & Immersion</option>
                    <option value="academic">Academic & Curriculum</option>
                    <option value="examination">Examinations & Viva</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Access Level</label>
                  <select
                    value={isNoticePublic ? "public" : "private"}
                    onChange={(e) => setIsNoticePublic(e.target.value === "public")}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="public">Public (Visible to Visitors)</option>
                    <option value="private">Private (Students & Members Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notice Body / Description</label>
                <textarea
                  required
                  rows={5}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Provide all detailed circular points, reporting dates, prerequisites..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Circular...
                </>
              ) : (
                "Publish Notice to Portal"
              )}
            </button>
          </form>
        ) : (
          /* Event Publishing Form */
          <form onSubmit={handlePublishEvent} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-amber-500" />
              Schedule Department Event
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., Workshop on Participatory Rural Appraisal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g., 10:00 AM - 1:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Venue / Location</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g., College Auditorium / Seminar Hall"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Resource Person / Keynote</label>
                  <input
                    type="text"
                    value={resourcePerson}
                    onChange={(e) => setResourcePerson(e.target.value)}
                    placeholder="e.g., Dr. [Guest Speaker Name]"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event Description</label>
                <textarea
                  required
                  rows={4}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Outline the core objective, agenda, and targeted participant cohort..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Event...
                </>
              ) : (
                "Save Event to Portal"
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}