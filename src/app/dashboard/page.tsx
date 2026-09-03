"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { 
  Bell, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Download, 
  Loader2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  category: string;
  content: string;
  isPublic: boolean;
}

export default function DashboardPage() {
  const { user, profile, loading, logOut } = useAuth();
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [fetchingNotices, setFetchingNotices] = useState(true);

  // Student Photo Upload State
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCategory, setPhotoCategory] = useState("Fieldwork");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadNotices() {
      try {
        const q = query(collection(db, "notices"), orderBy("publishedAt", "desc"), limit(5));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notice[];
        setNotices(data);
      } catch (err) {
        console.error("Error loading notices:", err);
      } finally {
        setFetchingNotices(false);
      }
    }
    if (user && profile?.status === "approved") {
      loadNotices();
    }
  }, [user, profile]);

  const handleStudentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      setStatusMsg({ type: "error", text: "Please select an image to upload." });
      return;
    }

    setUploading(true);
    setStatusMsg(null);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ixvakf7c";
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "st_xavier_preset";

      const formData = new FormData();
      formData.append("file", photoFile);
      formData.append("upload_preset", preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image file.");
      }

      const uploadResult = await res.json();

      await addDoc(collection(db, "gallery"), {
        title: photoTitle,
        category: photoCategory,
        imageUrl: uploadResult.secure_url,
        uploadedAt: serverTimestamp(),
        authorEmail: user?.email,
        authorName: profile?.name || user?.email?.split("@")[0] || "Student",
        status: profile?.role === "admin" ? "approved" : "pending",
      });

      setStatusMsg({
        type: "success",
        text: profile?.role === "admin"
          ? "Photo published directly to public gallery."
          : "Photo submitted! It will appear on the public gallery once approved by faculty.",
      });

      setPhotoTitle("");
      setPhotoFile(null);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to submit photo." });
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        Loading account details...
      </div>
    );
  }

  // --- CHECK IF ACCOUNT IS PENDING APPROVAL ---
  if (profile && profile.role !== "admin" && profile.status === "pending") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Account Pending Approval</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hello <span className="text-slate-200 font-semibold">{profile.name || user.email}</span>, your registration has been submitted. For institutional verification, an administrator must approve your student account before you can access internal resources.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 text-left">
            <div><span className="text-slate-500">Email:</span> {user.email}</div>
            {profile.rollNumber && <div><span className="text-slate-500">Roll No:</span> {profile.rollNumber}</div>}
            <div><span className="text-slate-500">Status:</span> <span className="text-amber-400 font-medium">Pending Review</span></div>
          </div>

          <button
            onClick={() => logOut()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const userName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "Member";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {profile?.role === "admin" ? "Admin Portal" : "Student Portal"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {userName}
            </h1>
            <p className="text-xs text-slate-400">
              Department of Social Work | St. Xavier College, Maram Khunou
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Center
              </Link>
            )}
            <button
              onClick={() => logOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {statusMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {statusMsg.text}
          </div>
        )}

        {/* Student Submission Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Contribute Fieldwork / Activity Photo</h2>
            <p className="text-xs text-slate-400">
              Share photos from rural camps, agency visits, or workshops. Submissions are reviewed before appearing on the public gallery.
            </p>
          </div>

          <form onSubmit={handleStudentUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Photo Title or Caption</label>
              <input
                type="text"
                required
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="e.g., PRA Exercise in Maram Khunou Village"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none"
                >
                  <option value="Fieldwork">Fieldwork & Rural Camp</option>
                  <option value="Workshops">Workshops & Seminars</option>
                  <option value="Cultural">Cultural & Celebrations</option>
                  <option value="Campus">Campus Life</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Image</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting for Review...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Submit Photo
                </>
              )}
            </button>
          </form>
        </div>

        {/* Notices */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2>Department Notices</h2>
          </div>

          {fetchingNotices ? (
            <div className="flex items-center justify-center p-8 text-xs text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              Loading notices...
            </div>
          ) : notices.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
              No recent departmental announcements.
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{n.title}</h3>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Resources */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2>Academic Resources</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Fieldwork Diary Format</div>
                <div className="text-xs text-slate-500">Document Guide</div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">MSW / BSW Syllabus</div>
                <div className="text-xs text-slate-500">Curriculum Structure</div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}