"use client";

import React, { useState, useEffect } from "react";
import { Bell, Lock, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface Notice {
  id: string;
  title: string;
  category: string;
  content: string;
  isPublic: boolean;
  publishedAt?: any;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const noticesRef = collection(db, "notices");
    const q = query(noticesRef, where("isPublic", "==", true));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notice[];

        // Sort descending by date locally to avoid requiring a composite Firestore index
        items.sort((a, b) => {
          const timeA = a.publishedAt?.toDate ? a.publishedAt.toDate().getTime() : 0;
          const timeB = b.publishedAt?.toDate ? b.publishedAt.toDate().getTime() : 0;
          return timeB - timeA;
        });

        setNotices(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notices:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recent";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
          {loading ? (
            <div className="flex items-center justify-center p-12 text-slate-400 text-xs gap-2 bg-slate-900/40 rounded-2xl border border-slate-800">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              Loading circulars from department database...
            </div>
          ) : notices.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              No public notices published at this time.
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {notice.category || "General Notice"}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(notice.publishedAt)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{notice.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            ))
          )}
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