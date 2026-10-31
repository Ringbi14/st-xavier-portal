"use client";

import React, { useState, useEffect } from "react";
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
  Plus,
  Pencil,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { NoticeItem } from "@/lib/types";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function NoticesTab() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [title, setTitle] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Fieldwork");
  const [fileUrl, setFileUrl] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("Department of Social Work, SXC Maram");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsModalOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("publishedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setNotices(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NoticeItem)));
      },
      (err) => {
        console.warn("Ordered notices fetch fell back:", err);
        const fallbackUnsub = onSnapshot(
          collection(db, "notices"),
          (snap) => {
            setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as NoticeItem)));
          },
          (fallbackErr) => {
            console.error("Fallback notices subscription error:", fallbackErr);
          }
        );
        return () => fallbackUnsub();
      }
    );
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setPublishedAt(new Date().toISOString().split("T")[0]);
    setCategory("Fieldwork");
    setFileUrl("");
    setBody("");
    setAuthor("Department of Social Work, SXC Maram");
    setIsModalOpen(true);
  };

  const openEditModal = (item: NoticeItem) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setPublishedAt(item.publishedAt || item.date || new Date().toISOString().split("T")[0]);
    setCategory(item.category || "General");
    setFileUrl(item.fileUrl || item.attachmentUrl || "");
    setBody(item.body || item.description || "");
    setAuthor(item.author || "Department of Social Work, SXC Maram");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setToast({ message: "Please enter both the notice headline and circular body text.", type: "error" });
      return;
    }
    setIsSubmitting(true);

    try {
      const cleanFile = (fileUrl || "").trim();
      const payload: Record<string, any> = {
        title: title.trim(),
        publishedAt: (publishedAt || new Date().toISOString().split("T")[0]).trim(),
        category: category || "General",
        body: body.trim(),
        author: (author || "").trim() || "Department of Social Work, SXC Maram",
        fileUrl: cleanFile,
        attachmentUrl: cleanFile,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "notices", editingId), payload);
        setToast({ message: "Circular notice updated successfully.", type: "success" });
      } else {
        await addDoc(collection(db, "notices"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setToast({ message: "New circular notice published successfully.", type: "success" });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Notice save failed:", err);
      const msg = err instanceof Error ? err.message : "Please verify permissions.";
      setToast({ message: `Failed to save circular: ${msg}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, "notices", deleteConfirmId));
      setToast({ message: "Circular notice deleted successfully.", type: "success" });
    } catch (err: unknown) {
      console.error("Notice delete failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: `Failed to delete circular: ${msg}`, type: "error" });
    } finally {
      setDeleteConfirmId(null);
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
                    {n.publishedAt || n.date}
                  </td>

                  <td className="py-3 px-4 align-top max-w-sm">
                    <p className="line-clamp-2 leading-relaxed text-[11px] text-slate-600">
                      {n.body || n.description}
                    </p>
                  </td>

                  <td className="py-3 px-4 align-top">
                    {n.fileUrl || n.attachmentUrl ? (
                      <a
                        href={n.fileUrl || n.attachmentUrl}
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
                        onClick={() => setDeleteConfirmId(n.id)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Delete Notice"
                        aria-label={`Delete notice: ${n.title}`}
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
                aria-label="Close modal"
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
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Author / Issuing Desk
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Department of Social Work, SXC Maram"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Attachment / Circular URL (Optional PDF/Document Link)
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Circular Notice"
        message="Are you sure you want to delete this circular notice? It will no longer be visible on the public portal."
        confirmText="Delete Notice"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
