"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  HeartHandshake,
  BookOpen
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Institutional Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-amber-500/30">
                <Image
                  src="/dept-logo.png"
                  alt="Department Crest"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="text-xs font-black text-white tracking-tight block">
                  DEPARTMENT OF SOCIAL WORK
                </span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wide">
                  &quot;Education for Service&quot;
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Forming reflective social work professionals grounded in Jesuit educational excellence, tribal empowerment, and grassroots community immersion.
            </p>
            <div className="pt-1">
              <a
                href="https://stxaviercollegespt.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2042] hover:bg-[#1e3a8a] text-amber-300 hover:text-white border border-amber-500/30 text-[11px] font-bold transition shadow-xs group"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Visit Main College Portal</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Column 2: Academic Desks */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Department Portals</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition">
                  About & Institutional Heritage
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="hover:text-amber-300 transition font-semibold text-amber-400">
                  BSW Programme & Practicum
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-amber-300 transition">
                  Faculty & Leadership Directory
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="hover:text-amber-300 transition">
                  Fieldwork & Placement Partners
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-300 transition">
                  Academic Calendar & Rural Camps
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-300 transition">
                  Fieldwork & Camp Showcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student & Field Practicum */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>Practicum & Downloads</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/resources" className="hover:text-amber-300 transition font-semibold text-white">
                  Fieldwork Log Sheets & Templates
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-amber-300 transition">
                  Circulars & Official Bulletins
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-amber-300 transition">
                  BSW Syllabi & Guidelines
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-amber-300 transition">
                  Alumni Practitioner Network
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-300 transition text-slate-400">
                  Staff & Supervisor Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Campus Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus & Affiliation</span>
            </h4>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  St. Xavier College, Maram Khunou, Senapati District, Manipur - 795106
                </span>
              </div>
              <div className="text-[10px] text-amber-300/90 font-medium pl-5.5">
                Affiliated to Manipur University
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:socialwork@stxaviercollegespt.ac.in" className="hover:text-white transition truncate">
                  socialwork@stxaviercollegespt.ac.in
                </a>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://stxaviercollegespt.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-white transition font-medium"
                >
                  <span>stxaviercollegespt.ac.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-600">•</span>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Department of Social Work, St. Xavier College, Maram Khunou. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">&quot;Education for Service&quot;</span>
            <span>•</span>
            <span>Affiliated to Manipur University</span>
            <span>•</span>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition font-medium"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}