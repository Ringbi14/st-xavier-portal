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
  setDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Check,
} from "lucide-react";
import { AlumniProfile, AlumniSector } from "@/lib/types";
import CloudinaryUploadField from "./CloudinaryUploadField";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { normalizeBatchYear } from "@/lib/utils";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

function AdminAlumniAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanUrl = photoUrl?.trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  if (cleanUrl && !hasError) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimizeCloudinaryUrl(cleanUrl, 300)}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const cleanName = (name || "")
    .replace(/^(Dr\.|Prof\.|Rev\.|Fr\.|Mr\.|Ms\.|Mrs\.)\s+/gi, "")
    .replace(/,\s*(S\.J\.|Ph\.D\.|MSW|M\.Phil\.).*$/gi, "")
    .trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : cleanName.slice(0, 2).toUpperCase() || "SX";

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f2042] via-[#142a55] to-slate-900 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 select-none">
      <span>{initials}</span>
    </div>
  );
}

export default function AlumniTab() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [batchYear, setBatchYear] = useState("2020-2023");
  const [currentRole, setCurrentRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [sector, setSector] = useState<AlumniSector>("Public Sector");
  const [location, setLocation] = useState("");
  const [higherStudies, setHigherStudies] = useState("");
  const [quote, setQuote] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    let rawPublic: AlumniProfile[] = [];
    let rawPrivate: Record<string, string> = {};

    const mergeAndSet = () => {
      const merged = rawPublic.map((item) => ({
        ...item,
        email: rawPrivate[item.id] || item.email || "",
      }));
      setAlumni(merged);
    };

    const pubCol = collection(db, "alumni");
    const privCol = collection(db, "alumni_private");

    let unsubPub: () => void = () => {};
    let unsubPriv: () => void = () => {};

    try {
      unsubPriv = onSnapshot(
        privCol,
        (snap) => {
          const pMap: Record<string, string> = {};
          snap.docs.forEach((d) => {
            const data = d.data();
            if (data.email) pMap[d.id] = data.email;
          });
          rawPrivate = pMap;
          mergeAndSet();
        },
        (err) => {
          console.warn("Snapshot warning for alumni_private:", err);
        }
      );
    } catch (err) {
      console.warn("Failed to listen to alumni_private:", err);
    }

    try {
      const q = query(pubCol, orderBy("createdAt", "desc"));
      unsubPub = onSnapshot(
        q,
        (snap) => {
          rawPublic = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AlumniProfile));
          mergeAndSet();
        },
        (err) => {
          console.warn("Ordered alumni snapshot error, falling back:", err);
          unsubPub = onSnapshot(pubCol, (snap) => {
            rawPublic = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AlumniProfile));
            mergeAndSet();
          });
        }
      );
    } catch {
      unsubPub = onSnapshot(pubCol, (snap) => {
        rawPublic = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AlumniProfile));
        mergeAndSet();
      });
    }

    return () => {
      unsubPub();
      unsubPriv();
    };
  }, []);

  const pendingList = alumni.filter((a) => a.status === "pending");
  const approvedList = alumni.filter((a) => a.status === "approved" || !a.status);

  const filteredApproved = approvedList.filter((a) => {
    const q = search.toLowerCase();
    return (
      search === "" ||
      a.fullName.toLowerCase().includes(q) ||
      a.organization.toLowerCase().includes(q) ||
      a.currentRole.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.batchYear?.toLowerCase().includes(q)
    );
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFullName("");
    setBatchYear("2020-2023");
    setCurrentRole("");
    setOrganization("");
    setSector("Public Sector");
    setLocation("");
    setHigherStudies("");
    setQuote("");
    setEmail("");
    setLinkedinUrl("");
    setPhotoUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: AlumniProfile) => {
    setEditingId(item.id);
    setFullName(item.fullName || "");
    setBatchYear(item.batchYear || "2020-2023");
    setCurrentRole(item.currentRole || "");
    setOrganization(item.organization || "");
    setSector(item.sector || "Public Sector");
    setLocation(item.location || "");
    setHigherStudies(item.higherStudies || "");
    setQuote(item.quote || "");
    setEmail(item.email || "");
    setLinkedinUrl(item.linkedinUrl || "");
    setPhotoUrl(item.photoUrl || "");
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      const item = alumni.find((a) => a.id === id);
      if (item?.email) {
        await setDoc(
          doc(db, "alumni_private", id),
          {
            email: item.email.trim().toLowerCase(),
            fullName: item.fullName?.trim() || name,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      await updateDoc(doc(db, "alumni", id), {
        status: "approved",
        email: deleteField(),
        updatedAt: serverTimestamp(),
      });
      setToast({ message: `Approved and published profile for ${name}.`, type: "success" });
    } catch (err: unknown) {
      console.error("Approve failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: `Failed to approve profile for ${name}: ${msg}`, type: "error" });
    }
  };

  const promptDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    try {
      await deleteDoc(doc(db, "alumni", id));
      try {
        await deleteDoc(doc(db, "alumni_private", id));
      } catch {
        // ignore if private record does not exist
      }
      setToast({ message: `Profile for "${name}" deleted permanently.`, type: "success" });
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: `Failed to delete alumni profile: ${msg}`, type: "error" });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !batchYear.trim() || !currentRole.trim() || !organization.trim() || !email.trim()) {
      setToast({ message: "Please provide the full name, graduating batch, current role, organization, and email.", type: "error" });
      return;
    }
    setIsSubmitting(true);

    try {
      let cleanPhoto = (photoUrl || "").trim();
      if (cleanPhoto.startsWith("http://")) {
        cleanPhoto = cleanPhoto.replace("http://", "https://");
      }
      let cleanLinkedin = (linkedinUrl || "").trim();
      if (cleanLinkedin && !cleanLinkedin.startsWith("http://") && !cleanLinkedin.startsWith("https://")) {
        cleanLinkedin = "https://" + cleanLinkedin;
      }

      const publicPayload = {
        fullName: fullName.trim(),
        batchYear: normalizeBatchYear(batchYear),
        currentRole: currentRole.trim(),
        organization: organization.trim(),
        sector: sector || "Public Sector",
        location: (location || "").trim(),
        higherStudies: (higherStudies || "").trim(),
        quote: (quote || "").trim(),
        photoUrl: cleanPhoto,
        linkedinUrl: cleanLinkedin,
        status: "approved" as const,
      };

      if (editingId) {
        // Save private email
        await setDoc(
          doc(db, "alumni_private", editingId),
          {
            email: email.trim().toLowerCase(),
            fullName: fullName.trim(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Update public document and strip email field
        await updateDoc(doc(db, "alumni", editingId), {
          ...publicPayload,
          email: deleteField(),
          updatedAt: serverTimestamp(),
        });
      } else {
        const newDocRef = doc(collection(db, "alumni"));

        await setDoc(
          doc(db, "alumni_private", newDocRef.id),
          {
            email: email.trim().toLowerCase(),
            fullName: fullName.trim(),
            createdAt: serverTimestamp(),
          }
        );

        await setDoc(newDocRef, {
          ...publicPayload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setToast({ message: "New alumni profile created successfully.", type: "success" });
      }

      if (editingId) {
        setToast({ message: "Alumni profile updated successfully.", type: "success" });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Failed to save alumni profile:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: `Failed to save alumni profile: ${msg}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>Alumni Showcase & Career Registry</span>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              {approvedList.length} Published
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review public submissions from BSW graduates and manage directory profiles on /alumni.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2042] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Alumni Directly</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. PENDING APPROVALS QUEUE                                */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Pending Approvals Queue
            </h3>
            {pendingList.length > 0 ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                {pendingList.length} New Submission{pendingList.length === 1 ? "" : "s"}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-400">
                (Queue is clear)
              </span>
            )}
          </div>
        </div>

        {pendingList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No pending alumni profile submissions requiring review.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-300 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AdminAlumniAvatar name={item.fullName} photoUrl={item.photoUrl} />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {item.fullName}
                        </div>
                        <div className="text-[11px] font-semibold text-amber-800 font-mono">
                          Batch {item.batchYear} • {item.sector}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-400">
                      Pending
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-amber-200/80">
                    <div>
                      <strong className="text-slate-800">{item.currentRole}</strong> at{" "}
                      <span className="text-slate-600">{item.organization}</span>
                    </div>
                    {item.location && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.higherStudies && (
                      <div className="text-[11px] text-slate-600 font-medium">
                        Masters: {item.higherStudies}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500 font-mono">
                      Email: {item.email}
                    </div>
                  </div>

                  {item.quote && (
                    <div className="p-3 rounded-xl bg-white/70 border border-amber-200 text-xs italic text-slate-700 leading-relaxed">
                      &quot;{item.quote}&quot;
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-amber-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => promptDelete(item.id, item.fullName)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                    aria-label={`Reject or delete profile for ${item.fullName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reject / Delete</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(item.id, item.fullName)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. PUBLISHED ALUMNI DIRECTORY TABLE                       */}
      {/* ========================================================= */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Approved Alumni Directory ({approvedList.length})
          </h3>
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approved alumni..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
            />
          </div>
        </div>

        {approvedList.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No approved profiles in Firestore yet</h3>
            <p className="text-xs text-slate-500">
              Profiles submitted by alumni or added via &quot;Add Alumni Directly&quot; will show here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Alumnus Name & Batch</th>
                  <th className="py-3 px-4">Role & Organization</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredApproved.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-center gap-3">
                        <AdminAlumniAvatar name={item.fullName} photoUrl={item.photoUrl} />
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.fullName}
                          </div>
                          <div className="text-[10px] font-mono text-amber-700 font-semibold mt-0.5">
                            Batch {item.batchYear}
                          </div>
                          {item.higherStudies && (
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">
                              {item.higherStudies}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 align-top">
                      <div className="font-bold text-slate-900">{item.currentRole}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.organization}</div>
                      {item.email && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{item.email}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 align-top">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.sector}
                      </span>
                    </td>

                    <td className="py-3 px-4 align-top text-slate-600">
                      {item.location || "Manipur"}
                    </td>

                    <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 transition cursor-pointer"
                          title="Edit Profile"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDelete(item.id, item.fullName)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                          title="Delete Profile"
                          aria-label={`Delete profile for ${item.fullName}`}
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
      </div>

      {/* ========================================================= */}
      {/* 3. ADD / EDIT ALUMNI MODAL (ADMIN DIRECT)                 */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="px-6 py-4 bg-[#0f2042] text-white flex items-center justify-between border-b border-[#1e3a8a]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">
                  {editingId ? "Edit Alumni Profile" : "Add Alumni Directly"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. K. Victor Maram"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Graduating Batch *
                  </label>
                  <input
                    type="text"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    onBlur={() => setBatchYear(normalizeBatchYear(batchYear))}
                    placeholder="e.g., 2021–2024 or 2024"
                    maxLength={20}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Current Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Child Protection Officer"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Organization / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. World Vision / DCPU"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sector / Domain *
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as AlumniSector)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20 font-semibold"
                  >
                    <option value="Public Sector">Public Sector / Government</option>
                    <option value="Child Welfare">Child Welfare & Protection</option>
                    <option value="Rural Development">Rural Development & Livelihood</option>
                    <option value="Higher Education">Higher Education & Research</option>
                    <option value="Healthcare & Mental Health">Healthcare & Psychiatric Social Work</option>
                    <option value="NGO & Advocacy">NGO & Grassroots Advocacy</option>
                    <option value="CSR & Corporate">Corporate Social Responsibility (CSR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Senapati, Manipur"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Higher Studies / Master&apos;s Degree
                </label>
                <input
                  type="text"
                  value={higherStudies}
                  onChange={(e) => setHigherStudies(e.target.value)}
                  placeholder="e.g. MSW from TISS Mumbai"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                />
              </div>

              <CloudinaryUploadField
                label="Portrait Photo (Cloudinary Direct Upload or URL)"
                value={photoUrl}
                onChange={setPhotoUrl}
                placeholder="https://res.cloudinary.com/... or paste image URL"
                folder="st_xavier_alumni"
              />

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Junior Advice / Reflection Quote
                </label>
                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Reflection for junior BSW batches..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alumnus@domain.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2042]/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0f2042] hover:bg-[#1e3a8a] text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Profile" : "Publish Alumni Profile"}
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
        isOpen={!!deleteConfirm}
        title="Delete Alumni Profile"
        message={`Are you sure you want to permanently delete the profile for "${deleteConfirm?.name || "this alumnus"}"? This action cannot be undone.`}
        confirmText="Delete Profile"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
