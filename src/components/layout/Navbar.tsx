"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/staff" },
    { name: "Notices", href: "/notices" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Student Portal", href: "/dashboard" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Department Name */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-amber-500/40 p-1 flex items-center justify-center shadow-sm group-hover:border-amber-400 transition">
              <Image
                src="/dept-logo.png"
                alt="Department Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-wide group-hover:text-amber-400 transition-colors uppercase leading-none">
                Department of Social Work
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight mt-1">
                St. Xavier College, Maram Khunou
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    pathname.startsWith("/admin")
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/10"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  active
                    ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel Control</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 text-rose-400 border border-slate-800 text-xs font-semibold hover:bg-slate-850"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10"
              >
                <LogIn className="w-4 h-4" />
                <span>Faculty & Student Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}