"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { 
  Bell, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Download, 
  Loader2,
  Calendar,
  Image as ImageIcon
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
    if (user) {
      loadNotices();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        Loading account details...
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

        {/* Private Notices */}
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