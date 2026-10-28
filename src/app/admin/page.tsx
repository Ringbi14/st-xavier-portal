"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  FileText,
  Camera,
  Building2,
  GraduationCap,
  LogOut,
  ExternalLink,
  Loader2,
  Users,
} from "lucide-react";

import NoticesTab from "@/components/admin/NoticesTab";
import ResourcesTab from "@/components/admin/ResourcesTab";
import GalleryTab from "@/components/admin/GalleryTab";
import AgenciesTab from "@/components/admin/AgenciesTab";
import FacultyTab from "@/components/admin/FacultyTab";
import AlumniTab from "@/components/admin/AlumniTab";

type AdminTab = "notices" | "resources" | "showcase" | "agencies" | "faculty" | "alumni";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("notices");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* ========================================================= */}
      {/* ADMIN HEADER & CONTROL BAR                                */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Department Content Management System
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">St. Xavier College, Maram Khunou</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Portal Control &amp; Governance Console
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Authenticated Admin: <span className="font-bold text-teal-900">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6-TAB NAVIGATION BAR                                      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <TabButton
          active={activeTab === "notices"}
          onClick={() => setActiveTab("notices")}
          icon={<Bell className="w-4 h-4" />}
          label="1. Notices & Circulars"
        />
        <TabButton
          active={activeTab === "resources"}
          onClick={() => setActiveTab("resources")}
          icon={<FileText className="w-4 h-4" />}
          label="2. BSW Resource Desk"
        />
        <TabButton
          active={activeTab === "showcase"}
          onClick={() => setActiveTab("showcase")}
          icon={<Camera className="w-4 h-4" />}
          label="3. Fieldwork & Camp Showcase"
        />
        <TabButton
          active={activeTab === "agencies"}
          onClick={() => setActiveTab("agencies")}
          icon={<Building2 className="w-4 h-4" />}
          label="4. Placement Directory"
        />
        <TabButton
          active={activeTab === "faculty"}
          onClick={() => setActiveTab("faculty")}
          icon={<GraduationCap className="w-4 h-4" />}
          label="5. Faculty & Leadership"
        />
        <TabButton
          active={activeTab === "alumni"}
          onClick={() => setActiveTab("alumni")}
          icon={<Users className="w-4 h-4" />}
          label="6. Alumni Network"
        />
      </div>

      {/* ========================================================= */}
      {/* ACTIVE TAB CONTENT VIEW                                   */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {activeTab === "notices" && <NoticesTab />}
        {activeTab === "resources" && <ResourcesTab />}
        {activeTab === "showcase" && <GalleryTab />}
        {activeTab === "agencies" && <AgenciesTab />}
        {activeTab === "faculty" && <FacultyTab />}
        {activeTab === "alumni" && <AlumniTab />}
      </div>

    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
        active
          ? "bg-teal-700 text-white shadow-xs"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}