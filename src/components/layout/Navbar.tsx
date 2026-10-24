"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
              <Image src="/dept-logo.png" alt="Department Crest" width={32} height={32} className="object-contain" priority />
            </div>
            <div className="leading-tight">
              <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight group-hover:text-teal-700 transition">
                SOCIAL WORK
              </span>
              <span className="block text-[10px] text-slate-500 font-medium">St. Xavier College, Senapati</span>
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
                      ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-700" />
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
                  active ? "bg-teal-50 text-teal-800 border border-teal-200" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-teal-700" : "text-slate-400"}`} />
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
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
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