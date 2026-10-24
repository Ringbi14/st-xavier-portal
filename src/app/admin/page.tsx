"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Bell,
  FileText,
  Camera,
  Building2,
  GraduationCap,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  Download,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type AdminTab = "notices" | "resources" | "showcase" | "agencies" | "faculty";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("notices");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* ========================================================= */}
      {/* ADMIN HEADER & CONTROL BAR                                */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Department Content Management System
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">St. Xavier College, Maram Khunou</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Portal Control & Governance Console
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Authenticated Admin: <span className="font-bold text-teal-900">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5-TAB NAVIGATION BAR                                      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <TabButton
          active={activeTab === "notices"}
          onClick={() => setActiveTab("notices")}
          icon={<Bell className="w-4 h-4" />}
          label="1. Notices & Circulars"
        />
        <TabButton
          active={activeTab === "resources"}
          onClick={() => setActiveTab("resources")}
          icon={<FileText className="w-4 h-4" />}
          label="2. BSW Resource Desk"
        />
        <TabButton
          active={activeTab === "showcase"}
          onClick={() => setActiveTab("showcase")}
          icon={<Camera className="w-4 h-4" />}
          label="3. Fieldwork & Camp Showcase"
        />
        <TabButton
          active={activeTab === "agencies"}
          onClick={() => setActiveTab("agencies")}
          icon={<Building2 className="w-4 h-4" />}
          label="4. Placement Directory"
        />
        <TabButton
          active={activeTab === "faculty"}
          onClick={() => setActiveTab("faculty")}
          icon={<GraduationCap className="w-4 h-4" />}
          label="5. Faculty & Leadership"
        />
      </div>

      {/* ========================================================= */}
      {/* ACTIVE TAB CONTENT VIEW                                   */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {activeTab === "notices" && <NoticesTab />}
        {activeTab === "resources" && <ResourcesTab />}
        {activeTab === "showcase" && <ShowcaseTab />}
        {activeTab === "agencies" && <AgenciesTab />}
        {activeTab === "faculty" && <FacultyTab />}
      </div>

    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
        active
          ? "bg-teal-700 text-white shadow-xs"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ====================================================================
// TAB 1: NOTICES & CIRCULARS (Manage /notices)
// ====================================================================
function NoticesTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Fieldwork");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Fieldwork");
    setAttachmentUrl("");
    setBody("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setDate(item.date || new Date().toISOString().split("T")[0]);
    setCategory(item.category || "General");
    setAttachmentUrl(item.attachmentUrl || item.fileUrl || "");
    setBody(item.body || item.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert("Please enter both the notice headline and circular body text.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        date: date || new Date().toISOString().split("T")[0],
        category,
        attachmentUrl: attachmentUrl.trim(),
        fileUrl: attachmentUrl.trim(),
        description: body.trim(),
        body: body.trim(),
      };

      if (editingId) {
        await updateDoc(doc(db, "notices", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "notices"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Notice save failed:", err);
      alert("Failed to save circular. Please verify permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this circular notice?")) return;
    try {
      await deleteDoc(doc(db, "notices", id));
    } catch (err) {
      console.error("Notice delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Department Notices & Circulars ({notices.length})
          </h2>
          <p className="text-xs text-slate-500">
            Publish and manage official announcements displayed on /notices and the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Notice</span>
        </button>
      </div>

      {notices.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <Bell className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No circulars posted yet</h3>
          <p className="text-xs text-slate-500">Click &quot;Post New Notice&quot; to publish your first announcement.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Headline & Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Circular Body Preview</th>
                <th className="py-3 px-4">Attachment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {n.title}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border bg-teal-50 text-teal-800 border-teal-200">
                      {n.category || "General"}
                    </span>
                  </td>

                  <td className="py-3 px-4 align-top font-mono text-slate-600 whitespace-nowrap">
                    {n.date}
                  </td>

                  <td className="py-3 px-4 align-top max-w-sm">
                    <p className="line-clamp-2 leading-relaxed text-[11px] text-slate-600">
                      {n.body || n.description}
                    </p>
                  </td>

                  <td className="py-3 px-4 align-top">
                    {n.attachmentUrl || n.fileUrl ? (
                      <a
                        href={n.attachmentUrl || n.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-800 hover:underline font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Doc</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(n)}
                        className="p-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                        title="Edit Notice"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? "Edit Circular Notice" : "Post Official Circular Notice"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Headline / Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Concurrent Fieldwork Placement Orientation Schedule"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  >
                    <option value="Fieldwork">Fieldwork</option>
                    <option value="Exam">Exam</option>
                    <option value="Rural Camp">Rural Camp</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Publication Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Attachment / Circular URL (Optional PDF/Document Link)
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Circular Body Text * (Full announcements with whitespace preservation)
                </label>
                <textarea
                  rows={5}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter full notice instructions, process, venue, or submission guidelines..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// TAB 2: BSW RESOURCE DESK (Manage public downloads /resources)
// ====================================================================
function ResourcesTab() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fieldwork Forms");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "downloads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setDownloads(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Fieldwork Forms");
    setUrl("");
    setNote("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setCategory(item.category || "Fieldwork Forms");
    setUrl(item.url || "");
    setNote(item.note || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      alert("Please provide the document title and downloadable file URL.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        category,
        targetProgram: "BSW",
        url: url.trim(),
        note: note.trim() || undefined,
      };

      if (editingId) {
        await updateDoc(doc(db, "downloads", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "downloads"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Resource save failed:", err);
      alert("Failed to save resource. Please verify permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource document?")) return;
    try {
      await deleteDoc(doc(db, "downloads", id));
    } catch (err) {
      console.error("Resource delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900">
            BSW Student Resource Desk ({downloads.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage academic syllabus PDFs, fieldwork process recording forms, and camp guidelines.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource Document</span>
        </button>
      </div>

      {downloads.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No downloadable files listed yet</h3>
          <p className="text-xs text-slate-500">Click &quot;Add Resource Document&quot; to upload or link a syllabus or template.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Title & Category</th>
                <th className="py-3 px-4">Note / Batch</th>
                <th className="py-3 px-4">Download Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {downloads.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {d.title}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-200">
                      {d.category || "General Guidelines"}
                    </span>
                  </td>

                  <td className="py-3 px-4 align-top text-slate-500">
                    {d.note || "Standard Document"}
                  </td>

                  <td className="py-3 px-4 align-top">
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-800 hover:underline font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Access File</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </td>

                  <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(d)}
                        className="p-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                        title="Edit Resource"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? "Edit Resource Document" : "Add Resource Document"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BSW NEP 2020 Course Syllabus (PDF)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Category Tag *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                >
                  <option value="Syllabus">Syllabus</option>
                  <option value="Fieldwork Forms">Fieldwork Forms</option>
                  <option value="Camp Manuals">Camp Manuals</option>
                  <option value="General Guidelines">General Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  File Link / Cloud Storage URL * (Direct PDF download link)
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Brief Note (Optional e.g. &quot;Updated for 2026-2027 batch&quot;)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Approved by Manipur University Academic Council"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// TAB 3: FIELDWORK & CAMP SHOWCASE (Manage /gallery)
// ====================================================================
function ShowcaseTab() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rural Camp");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Rural Camp");
    setAcademicYear("2025-2026");
    setLocation("");
    setSummary("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setCategory(item.category || "Rural Camp");
    setAcademicYear(item.academicYear || item.year || "2025-2026");
    setLocation(item.location || "");
    setSummary(item.impactSummary || item.description || "");
    setImageUrl(item.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !summary.trim()) {
      alert("Please provide the initiative title, summary, and cover image URL.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        category,
        academicYear: academicYear.trim(),
        year: academicYear.trim(),
        location: location.trim() || "Senapati District, Manipur",
        impactSummary: summary.trim(),
        description: summary.trim(),
        imageUrl: imageUrl.trim(),
      };

      if (editingId) {
        await updateDoc(doc(db, "gallery", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "gallery"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Showcase save failed:", err);
      alert("Failed to save showcase highlight. Please check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this showcase entry?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
    } catch (err) {
      console.error("Showcase delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Fieldwork & Camp Showcase Highlights ({items.length})
          </h2>
          <p className="text-xs text-slate-500">
            Showcase rural camps, PRA surveys, and agency immersion photos on /gallery and the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Showcase Highlight</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <Camera className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No showcase entries added yet</h3>
          <p className="text-xs text-slate-500">Click &quot;Add Showcase Highlight&quot; to publish rural camp albums and community outreach photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                    <span>{item.location || "Senapati District"}</span>
                    <span>•</span>
                    <span className="font-mono">{item.academicYear || item.year}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.impactSummary || item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                  title="Edit Entry"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Showcase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? "Edit Showcase Highlight" : "Add Fieldwork / Camp Highlight"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Initiative Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Rural Educational Camp: PRA Assessment"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  >
                    <option value="Rural Camp">Rural Camp</option>
                    <option value="Community Awareness">Community Awareness</option>
                    <option value="Agency Visit">Agency Visit</option>
                    <option value="Department Event">Department Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Village / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Maram Khunou / Senapati District"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Cover Photo / Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Summary / Fieldwork Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description of community activities, assessments, or outcomes..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Save Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// TAB 4: PLACEMENT AGENCY DIRECTORY (Manage /agencies)
// ====================================================================
function AgenciesTab() {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("Community Development");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "agencies"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setAgencies(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setDomain("Community Development");
    setLocation("");
    setPhone("");
    setWebsite("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setName(item.name || "");
    setDomain(item.domain || item.sector || "Community Development");
    setLocation(item.location || "");
    setPhone(item.phone || "");
    setWebsite(item.website || "");
    setDescription(item.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !description.trim()) {
      alert("Please provide the organization name, location, and a short description.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        domain,
        sector: domain,
        location: location.trim(),
        description: description.trim(),
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
      };

      if (editingId) {
        await updateDoc(doc(db, "agencies", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "agencies"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Agency save failed:", err);
      alert("Failed to save agency profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this placement partner organization?")) return;
    try {
      await deleteDoc(doc(db, "agencies", id));
    } catch (err) {
      console.error("Agency delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Placement Agency Directory ({agencies.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage partner NGOs, hospital units, and community centers where junior students explore placements.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Organization</span>
        </button>
      </div>

      {agencies.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No partner organizations added yet</h3>
          <p className="text-xs text-slate-500">Click &quot;Add Organization&quot; to register fieldwork placement partners.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization & Domain</th>
                <th className="py-3 px-4">Location / District</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {agencies.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {a.name}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border bg-teal-50 text-teal-800 border-teal-200">
                      {a.domain}
                    </span>
                  </td>

                  <td className="py-3 px-4 align-top font-medium text-slate-700">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{a.location}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 align-top space-y-1">
                    {a.phone && (
                      <div className="flex items-center gap-1 font-mono text-slate-700">
                        <Phone className="w-3 h-3 text-teal-700 shrink-0" />
                        <span>{a.phone}</span>
                      </div>
                    )}
                    {a.website && (
                      <a
                        href={a.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-800 hover:underline font-semibold"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Website</span>
                      </a>
                    )}
                    {!a.phone && !a.website && (
                      <span className="text-[11px] text-slate-400 italic">None provided</span>
                    )}
                  </td>

                  <td className="py-3 px-4 align-top max-w-xs">
                    <p className="line-clamp-2 leading-relaxed text-[11px] text-slate-600">
                      {a.description}
                    </p>
                  </td>

                  <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(a)}
                        className="p-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                        title="Edit Organization"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Delete Organization"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Agency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? "Edit Organization" : "Add Placement Partner"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. District Child Protection Unit, Senapati"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Practice Domain *
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  >
                    <option value="Community Development">Community Development</option>
                    <option value="Child & Youth Welfare">Child & Youth Welfare</option>
                    <option value="Healthcare & Mental Health">Healthcare & Mental Health</option>
                    <option value="Women & Family">Women & Family</option>
                    <option value="Environment & Livelihood">Environment & Livelihood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Location / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Senapati / Kangpokpi / Imphal"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 3871 222145"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Short Description * (Tasks done by social work students)
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the scope of student fieldwork, casework, and community projects..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Add Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// TAB 5: FACULTY & COLLEGE LEADERSHIP (Manage /faculty)
// ====================================================================
function FacultyTab() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [categoryTier, setCategoryTier] = useState<"Department Faculty" | "College Leadership">("Department Faculty");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [qualification, setQualification] = useState("");
  const [supervisoryRole, setSupervisoryRole] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "faculty"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setFaculty(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setCategoryTier("Department Faculty");
    setName("");
    setDesignation("");
    setSpecialization("");
    setEmail("");
    setImageUrl("");
    setQualification("");
    setSupervisoryRole("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setCategoryTier(item.categoryTier || "Department Faculty");
    setName(item.name || "");
    setDesignation(item.designation || "");
    setSpecialization(item.specialization || "");
    setEmail(item.email || "");
    setImageUrl(item.imageUrl || "");
    setQualification(item.qualification || "");
    setSupervisoryRole(item.supervisoryRole || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      alert("Please provide the full name and designation.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        categoryTier,
        designation: designation.trim(),
        specialization: specialization.trim() || "Social Work",
        email: email.trim().toLowerCase(),
        imageUrl: imageUrl.trim() || undefined,
        qualification: qualification.trim() || undefined,
        supervisoryRole: supervisoryRole.trim() || undefined,
      };

      if (editingId) {
        await updateDoc(doc(db, "faculty", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "faculty"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Faculty save failed:", err);
      alert("Failed to save faculty profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await deleteDoc(doc(db, "faculty", id));
    } catch (err) {
      console.error("Faculty delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Faculty & College Leadership Directory ({faculty.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage academic mentors, fieldwork supervisors, and college patrons on /faculty.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty / Patron</span>
        </button>
      </div>

      {faculty.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No profiles listed yet</h3>
          <p className="text-xs text-slate-500">Click &quot;Add Faculty / Patron&quot; to register departmental staff and leadership.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Name & Designation</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Specialization / Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {f.name}
                    </div>
                    <div className="text-[11px] font-semibold text-teal-800 mt-0.5">
                      {f.designation}
                    </div>
                    {f.qualification && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        {f.qualification}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 align-top">
                    <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      f.categoryTier === "College Leadership"
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : "bg-teal-50 text-teal-800 border-teal-200"
                    }`}>
                      {f.categoryTier || "Department Faculty"}
                    </span>
                  </td>

                  <td className="py-3 px-4 align-top">
                    <div className="font-medium text-slate-800">{f.specialization}</div>
                    {f.supervisoryRole && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {f.supervisoryRole}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 align-top">
                    {f.email ? (
                      <a href={`mailto:${f.email}`} className="text-teal-800 hover:underline font-mono">
                        {f.email}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(f)}
                        className="p-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                        title="Edit Profile"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Faculty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {editingId ? "Edit Profile" : "Add Faculty / College Patron"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category Tier *
                  </label>
                  <select
                    value={categoryTier}
                    onChange={(e) => setCategoryTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  >
                    <option value="Department Faculty">Department Faculty</option>
                    <option value="College Leadership">College Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rosemary V. / Rev. Dr. Joseph M."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Assistant Professor & HOD / Principal"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Highest Qualifications
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. MSW, Ph.D. / M.Phil."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Academic Specialization / Administrative Role *
                </label>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Community Development / Medical & Psychiatric / Institutional Head"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. faculty@stxaviercollegespt.ac.in"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              {categoryTier === "Department Faculty" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Fieldwork Supervisory Role
                  </label>
                  <input
                    type="text"
                    value={supervisoryRole}
                    onChange={(e) => setSupervisoryRole(e.target.value)}
                    placeholder="e.g. Concurrent Fieldwork Supervisor (Hospital Placements)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Add Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}