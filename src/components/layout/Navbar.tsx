"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Department Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white p-1 shadow-sm border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/dept-logo.png"
                alt="Department Logo"
                className="w-full h-full object-contain"
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

          {/* Desktop Links */}
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

            <div className="ml-3 pl-3 border-l border-slate-800 flex items-center gap-2">
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/30 text-xs font-semibold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Admin
                </Link>
              )}

              <Link
                href={user ? "/dashboard" : "/login"}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {user ? "Dashboard" : "Login"}
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
              aria-label="Toggle Menu"
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}