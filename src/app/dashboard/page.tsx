"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  FolderLock, 
  Calendar, 
  Bell, 
  FileText, 
  LogOut, 
  User, 
  ShieldCheck,
  BookOpen
} from "lucide-react";

export default function DashboardPage() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading Student Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Top Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {profile?.role.toUpperCase()} PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {profile?.displayName || user.email?.split("@")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Department of Social Work | St. Xavier College, Maram Khunou
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Center
            </button>
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 border border-slate-700 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Area: Internal Notices & Resources */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Private Notices Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold">
                <Bell className="w-5 h-5 text-amber-500" />
                <h2>Private Department Notices</h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400">Fieldwork Guideline</span>
                    <span className="text-[10px] text-slate-500">Internal</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">[ADD INTERNAL FIELDWORK LOG SUBMISSION SCHEDULE]</h4>
                  <p className="text-xs text-slate-400">Instructions on weekly casework record submissions.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400">Cohort Announcement</span>
                    <span className="text-[10px] text-slate-500">Internal</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">[ADD SEMESTER CLASS SCHEDULE UPDATE]</h4>
                  <p className="text-xs text-slate-400">Revised timetable for social casework and group work modules.</p>
                </div>
              </div>
            </div>

            {/* Academic Materials & Downloads */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold">
                <FolderLock className="w-5 h-5 text-amber-500" />
                <h2>Student Academic Resources</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Fieldwork Diary Format</h4>
                      <span className="text-[10px] text-slate-500">PDF Document</span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-500 font-semibold cursor-pointer hover:underline">Download</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">MSW/BSW Syllabus</h4>
                      <span className="text-[10px] text-slate-500">PDF Document</span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-500 font-semibold cursor-pointer hover:underline">Download</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Profile Summary & Internal Dates */}
          <div className="space-y-6">
            
            {/* User Badge */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Member Profile
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-medium">Active Member</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Role:</span>
                  <span className="text-slate-200 capitalize">{profile?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Institution:</span>
                  <span className="text-slate-200 text-right">St. Xavier College</span>
                </div>
              </div>
            </div>

            {/* Internal Important Dates */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                Key Internal Dates
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-semibold block">[ADD DATE]</span>
                  <span className="text-slate-300">Fieldwork Report Submission</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-semibold block">[ADD DATE]</span>
                  <span className="text-slate-300">Internal Viva Voce / Assessment</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}