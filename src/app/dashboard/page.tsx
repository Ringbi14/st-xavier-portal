"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
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
  Clock,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  BookOpen
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  category: string;
  content: string;
  isPublic: boolean;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  resourcePerson?: string;
}

interface StudentSubmission {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  status: "pending" | "approved";
  uploadedAt?: any;
}

export default function DashboardPage() {
  const { user, profile, loading, logOut } = useAuth();
  const router = useRouter();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [mySubmissions, setMySubmissions] = useState<StudentSubmission[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

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
    async function loadDashboardData() {
      if (!user || profile?.status !== "approved") return;

      try {
        // 1. Fetch Notices
        const qNotices = query(collection(db, "notices"), orderBy("publishedAt", "desc"), limit(5));
        const snapNotices = await getDocs(qNotices);
        setNotices(snapNotices.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notice[]);

        // 2. Fetch Events
        const qEvents = query(collection(db, "events"), orderBy("date", "asc"), limit(4));
        const snapEvents = await getDocs(qEvents);
        setEvents(snapEvents.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EventItem[]);

        // 3. Fetch Student's own submissions
        if (user.email) {
          const qSubs = query(collection(db, "gallery"), where("authorEmail", "==", user.email));
          const snapSubs = await getDocs(qSubs);
          setMySubmissions(snapSubs.docs.map(doc => ({ id: doc.id, ...doc.data() })) as StudentSubmission[]);
        }
      } catch (err) {
        console.error("Error loading dashboard content:", err);
      } finally {
        setFetchingData(false);
      }
    }

    if (user && profile?.status === "approved") {
      loadDashboardData();
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
      const initialStatus = profile?.role === "admin" ? "approved" : "pending";

      const docRef = await addDoc(collection(db, "gallery"), {
        title: photoTitle,
        category: photoCategory,
        imageUrl: uploadResult.secure_url,
        uploadedAt: serverTimestamp(),
        authorEmail: user?.email,
        authorName: profile?.name || user?.displayName || user?.email?.split("@")[0] || "Student",
        status: initialStatus,
      });

      // Update local submissions list
      setMySubmissions(prev => [
        {
          id: docRef.id,
          title: photoTitle,
          category: photoCategory,
          imageUrl: uploadResult.secure_url,
          status: initialStatus as "pending" | "approved",
        },
        ...prev,
      ]);

      setStatusMsg({
        type: "success",
        text: profile?.role === "admin"
          ? "Photo published directly to public gallery."
          : "Photo submitted! It will appear on the public gallery once reviewed by faculty.",
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
        Loading student portal...
      </div>
    );
  }

  // --- GATE: PENDING APPROVAL SCREEN ---
  if (profile && profile.role !== "admin" && profile.status === "pending") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Account Pending Verification</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hello <span className="text-slate-200 font-semibold">{profile.name || user.email}</span>, your registration is awaiting verification. Once approved by a faculty administrator, you will gain access to field materials, syllabus downloads, and activity submission tools.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 text-left">
            <div><span className="text-slate-500">Registered Email:</span> {user.email}</div>
            {profile.rollNumber && <div><span className="text-slate-500">Student Roll No:</span> {profile.rollNumber}</div>}
            <div><span className="text-slate-500">Status:</span> <span className="text-amber-400 font-medium">Under Faculty Review</span></div>
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

  const userName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "Student Member";

  // Academic Resource Guides
  const academicResources = [
    {
      title: "Concurrent Fieldwork Diary Format",
      description: "Standard reporting format for weekly fieldwork logs, agency visits, and supervisor signatures.",
      tag: "Fieldwork",
      fileUrl: "#", // Replace with your cloud or static PDF URL
    },
    {
      title: "Social Casework Recording Template",
      description: "Intake sheet, psychosocial assessment structure, diagnostic summary, and intervention plan.",
      tag: "Method",
      fileUrl: "#",
    },
    {
      title: "Social Group Work Process Guide",
      description: "Phase-wise group work documentation, sociogram template, and group evaluation matrix.",
      tag: "Method",
      fileUrl: "#",
    },
    {
      title: "Rural Exposure Camp Handbook",
      description: "Participatory Rural Appraisal (PRA) methodology, camp code of conduct, and documentation guidelines.",
      tag: "Rural Camp",
      fileUrl: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile / Welcome Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                {profile?.role === "admin" ? "Faculty Administrator" : "Verified Student"}
              </span>
              {profile?.rollNumber && (
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Roll: {profile.rollNumber}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome, {userName}
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

        {/* Global Feedback Message */}
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

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Main Column (2/3 width): Upload Form & Submissions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Field Photo Contribution Form */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Upload Fieldwork / Activity Photo</h2>
                  <p className="text-xs text-slate-400">
                    Contribute photos from fieldwork visits, rural camps, or seminars to the college archive.
                  </p>
                </div>
              </div>

              <form onSubmit={handleStudentUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Caption or Title</label>
                  <input
                    type="text"
                    required
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="e.g., PRA Social Mapping session at Maram Khunou"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activity Category</label>
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
                      Uploading to Archive...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Submit for Moderation
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Submissions Status Tracker */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <h2>My Photo Submissions ({mySubmissions.length})</h2>
                </div>
                <Link href="/gallery" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                  View Public Gallery <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {mySubmissions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  You haven't submitted any photos yet. Use the form above to share your fieldwork documentation!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mySubmissions.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3 items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                        <img src={sub.imageUrl} alt={sub.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-semibold text-white truncate">{sub.title}</h4>
                        <p className="text-[10px] text-slate-500">{sub.category}</p>
                        <div>
                          {sub.status === "approved" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Approved & Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Academic Downloads Section */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileText className="w-4 h-4 text-amber-500" />
                <h2>Academic & Fieldwork Formats</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {academicResources.map((res, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-800">
                          {res.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{res.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{res.description}</p>
                    </div>

                    <a
                      href={res.fileUrl}
                      onClick={(e) => {
                        if (res.fileUrl === "#") {
                          e.preventDefault();
                          alert("Official document PDF is currently being finalized by the department office.");
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Format
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (1/3 width): Notices & Upcoming Calendar */}
          <div className="space-y-8">
            
            {/* Notices Box */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <h3>Department Notices</h3>
                </div>
                <Link href="/notices" className="text-[11px] text-amber-400 hover:underline">
                  All Notices
                </Link>
              </div>

              {fetchingData ? (
                <div className="flex items-center justify-center p-6 text-xs text-slate-400 gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  Loading notices...
                </div>
              ) : notices.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  No active notices.
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-medium">
                          {n.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-3 whitespace-pre-wrap">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Department Dates / Events */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <h3>Upcoming Dates</h3>
                </div>
                <Link href="/events" className="text-[11px] text-amber-400 hover:underline">
                  View Calendar
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  No upcoming department events scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] font-medium text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {ev.date} {ev.time && `• ${ev.time}`}
                      </div>
                      <h4 className="text-xs font-semibold text-white">{ev.title}</h4>
                      {ev.venue && <p className="text-[11px] text-slate-500">Venue: {ev.venue}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}