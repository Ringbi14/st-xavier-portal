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
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import CloudinaryUploadField from "./CloudinaryUploadField";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { FacultyMember } from "@/lib/types";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

function AdminFacultyAvatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanUrl = imageUrl?.trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  const cleanName = (name || "")
    .replace(/^(Dr\.|Prof\.|Rev\.|Fr\.|Mr\.|Ms\.|Mrs\.)\s+/gi, "")
    .replace(/,\s*(S\.J\.|Ph\.D\.|MSW|M\.Phil\.).*$/gi, "")
    .trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : cleanName.slice(0, 2).toUpperCase() || "SX";

  if (cleanUrl && !hasError) {
    const optimized = optimizeCloudinaryUrl(cleanUrl, 300);
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimized}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-800 to-slate-900 border border-teal-700/50 flex items-center justify-center text-teal-100 font-black text-xs shrink-0 select-none">
      <span>{initials}</span>
    </div>
  );
}

export default function FacultyTab() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
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
    const q = query(collection(db, "faculty"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setFaculty(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FacultyMember)));
      },
      (err) => {
        console.error("Faculty subscription error:", err);
      }
    );
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

  const openEditModal = (item: FacultyMember) => {
    setEditingId(item.id || null);
    setCategoryTier(
      item.categoryTier === "College Leadership" ? "College Leadership" : "Department Faculty"
    );
    setName(item.name || "");
    setDesignation(item.designation || "");
    setSpecialization(item.specialization || "");
    setEmail(item.email || "");
    setImageUrl(item.imageUrl || item.photoUrl || "");
    setQualification(item.qualification || (item as any).qualifications || "");
    setSupervisoryRole((item as { supervisoryRole?: string }).supervisoryRole || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      setToast({ message: "Please provide the full name and designation.", type: "error" });
      return;
    }
    setIsSubmitting(true);

    try {
      let cleanImg = imageUrl.trim();
      if (cleanImg.startsWith("http://")) {
        cleanImg = cleanImg.replace("http://", "https://");
      }
      const payload = {
        name: name.trim(),
        categoryTier: categoryTier || "Department Faculty",
        designation: designation.trim(),
        specialization: specialization.trim() || "Social Work",
        email: (email || "").trim().toLowerCase(),
        imageUrl: cleanImg,
        photoUrl: cleanImg,
        qualification: (qualification || "").trim(),
        supervisoryRole: (supervisoryRole || "").trim(),
      };

      if (editingId) {
        await updateDoc(doc(db, "faculty", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        setToast({ message: "Faculty profile updated successfully.", type: "success" });
      } else {
        await addDoc(collection(db, "faculty"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setToast({ message: "New faculty profile created successfully.", type: "success" });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Faculty save failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to save faculty profile.";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, "faculty", deleteConfirmId));
      setToast({ message: "Profile deleted successfully.", type: "success" });
    } catch (err: unknown) {
      console.error("Faculty delete failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: `Failed to delete profile: ${msg}`, type: "error" });
    } finally {
      setDeleteConfirmId(null);
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
                    <div className="flex items-center gap-3">
                      <AdminFacultyAvatar name={f.name} imageUrl={f.imageUrl || f.photoUrl} />
                      <div>
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
                      </div>
                    </div>
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
                        onClick={() => f.id && setDeleteConfirmId(f.id)}
                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Delete Profile"
                        aria-label={`Delete profile: ${f.name}`}
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
                aria-label="Close modal"
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
                    onChange={(e) =>
                      setCategoryTier(
                        e.target.value as "Department Faculty" | "College Leadership"
                      )
                    }
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

              <div className="space-y-3">
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

                <CloudinaryUploadField
                  label="Profile Photo (Cloudinary / Web URL)"
                  value={imageUrl}
                  onChange={setImageUrl}
                  placeholder="https://res.cloudinary.com/... or paste image URL"
                  folder="st_xavier_faculty"
                />
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Faculty Profile"
        message="Are you sure you want to permanently delete this faculty member from the directory? This action cannot be undone."
        confirmText="Delete Profile"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
