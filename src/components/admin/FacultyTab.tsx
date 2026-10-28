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
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cleanUrl}
          alt={name}
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
    setImageUrl(item.imageUrl || item.photoUrl || "");
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
      let cleanImg = imageUrl.trim();
      if (cleanImg.startsWith("http://")) {
        cleanImg = cleanImg.replace("http://", "https://");
      }
      const payload = {
        name: name.trim(),
        categoryTier,
        designation: designation.trim(),
        specialization: specialization.trim() || "Social Work",
        email: email.trim().toLowerCase(),
        imageUrl: cleanImg,
        photoUrl: cleanImg,
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
    } catch (err: any) {
      console.error("Faculty delete failed:", err);
      alert(`Failed to delete faculty profile: ${err?.message || err}`);
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
    </div>
  );
}
