"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/staff" },
    { name: "Events", href: "/events" },
    { name: "Notices", href: "/notices" },
    { name: "Gallery", href: "/gallery" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Header with Department Logo Only */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/95 p-1.5 shadow-sm border border-slate-700/60 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-amber-500/50 transition">
              <Image
                src="/dept-logo.jpg"
                alt="Department of Social Work Logo"
                fill
                sizes="(max-width: 640px) 44px, 48px"
                className="object-contain p-0.5"
                priority
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-400 group-hover:text-amber-300 transition-colors line-clamp-1">
                St. Xavier College, Maram Khunou
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-slate-100 transition-colors leading-tight">
                Department of Social Work
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link.href)
                    ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Portal Action Buttons */}
            <div className="ml-3 pl-3 border-l border-slate-800 flex items-center gap-2">
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Admin
                </Link>
              )}

              <Link
                href={user ? "/dashboard" : "/login"}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md hover:shadow-amber-500/10"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {user ? "Dashboard" : "Student Login"}
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow"
            >
              {user ? "Dashboard" : "Login"}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                isActive(link.href)
                  ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {profile?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/20 text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Center
            </Link>
          )}

          <Link
            href={user ? "/dashboard" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow mt-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            {user ? "Go to Dashboard" : "Student Login"}
          </Link>
        </div>
      )}
    </nav>
  );
}