"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  Home,
  Info,
  Users,
  Briefcase,
  Bell,
  Calendar,
  Camera,
  GraduationCap,
  FileText,
  ShieldCheck,
  LogIn,
  LogOut,
  LayoutDashboard,
  BookOpen,
  ExternalLink,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Strictly manage body scroll lock when mobile navigation is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "BSW Programme", href: "/programmes", icon: BookOpen },
    { name: "Faculty", href: "/faculty", icon: Users },
    { name: "Fieldwork", href: "/agencies", icon: Briefcase },
    { name: "Notices", href: "/notices", icon: Bell },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: Camera },
    { name: "Resources", href: "/resources", icon: FileText },
    { name: "Alumni", href: "/alumni", icon: GraduationCap },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* 1. Dignified Institutional Top Bar */}
      <div className="bg-[#0f2042] text-slate-200 text-[11px] py-1.5 px-4 border-b border-[#1e3a8a]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white tracking-wide">
              St. Xavier College, Maram Khunou
            </span>
            <span className="hidden sm:inline text-amber-400 font-bold">•</span>
            <span className="hidden sm:inline text-slate-300">
              Affiliated to Manipur University
            </span>
            <span className="hidden md:inline text-amber-400 font-bold">•</span>
            <span className="hidden md:inline text-amber-300 font-medium">
              Department of Social Work
            </span>
            <span className="hidden lg:inline text-slate-400">|</span>
            <span className="hidden lg:inline text-amber-200/90 italic font-serif">
              &quot;Education for Service&quot;
            </span>
          </div>
          <a
            href="https://stxaviercollegespt.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition shrink-0 group text-[11px]"
          >
            <span>Main College Portal</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-[#0f2042]/20 p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:border-amber-500 transition">
                <Image src="/dept-logo.png" alt="Department Crest" width={32} height={32} className="object-contain" priority />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-[#0f2042] tracking-tight group-hover:text-[#1e3a8a] transition">
                    SOCIAL WORK
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    SXC
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 font-medium">
                  St. Xavier College, Maram Khunou
                </span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      active
                        ? "bg-[#0f2042] text-white shadow-xs"
                        : "text-slate-700 hover:text-[#0f2042] hover:bg-slate-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2042] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0f2042]" />
                  <span>Staff Portal</span>
                </Link>
              )}
            </div>

            <div className="flex xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  active ? "bg-[#0f2042] text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-amber-300" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0f2042] text-white text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Console</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
              >
                <LogIn className="w-4 h-4 text-teal-700" />
                <span>Staff Portal Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}