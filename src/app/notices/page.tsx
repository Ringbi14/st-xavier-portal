import React from "react";
import { Bell, FileText, Lock } from "lucide-react";
import Link from "next/link";

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Official Circulars
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Notices & Announcements
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Academic updates, field schedules, and departmental circulars.
          </p>
        </div>

        {/* Public Notice List */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                General Notice
              </span>
              <span className="text-xs text-slate-500">[ADD DATE]</span>
            </div>
            <h3 className="text-base font-bold text-white">[ADD OFFICIAL CIRCULAR TITLE]</h3>
            <p className="text-sm text-slate-300 leading-relaxed">[ADD OFFICIAL CIRCULAR TEXT AND INSTRUCTIONS]</p>
          </div>
        </div>

        {/* Private Notices Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-slate-900/60 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Looking for Student-Only Circulars?</h4>
              <p className="text-xs text-slate-400">Fieldwork internal guides and exam rosters require student login.</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all whitespace-nowrap"
          >
            Login to Access
          </Link>
        </div>
      </div>
    </div>
  );
}