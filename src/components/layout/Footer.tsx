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
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Institutional Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/dept-logo.png"
                  alt="Department Crest"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="text-xs font-black text-slate-900 tracking-tight block">
                  DEPARTMENT OF SOCIAL WORK
                </span>
                <span className="text-[10px] text-teal-800 font-semibold">
                  Hope in Action • Est. 2019
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Committed to ethical, reflective, and community-centered social work practice, grassroots rural camps, and supervised field immersion.
            </p>
            <a
              href="https://www.stxaviercollegespt.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:text-teal-900 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>St. Xavier College, Maram Khunou</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Column 2: Academic Desks */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Department Portals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/about" className="hover:text-teal-700 transition">
                  About & Department History
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-teal-700 transition">
                  Faculty & Field Supervisors
                </Link>
              </li>
              <li>
                <Link href="/organizations" className="hover:text-teal-700 transition">
                  Fieldwork & NGO Directory
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-teal-700 transition">
                  Academic Calendar & Rural Camps
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-teal-700 transition">
                  Fieldwork Photographic Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student & Field Practicum */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Resources
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/notices" className="hover:text-teal-700 transition">
                  Departmental Circulars & Notices
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-700 transition">
                  Process Record Templates & Syllabi
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-teal-700 transition">
                  Alumni & Practitioner Network
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-700 transition flex items-center gap-1">
                  <span>Authorized Portal Access</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Campus Desk */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Campus Location
            </h4>
            <div className="space-y-2 text-[11px] text-slate-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  St. Xavier College Campus, Maram Khunou, Senapati District, Manipur — 795105
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="truncate">socialwork@stxaviercollegespt.ac.in</span>
              </div>
              <div className="pt-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition"
                >
                  <ShieldCheck className="w-3 h-3 text-teal-700" />
                  <span>Admin Gate</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Department of Social Work, St. Xavier College, Maram Khunou. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span>Affiliated with Manipur University</span>
          </div>
        </div>
      </div>
    </footer>
  );
}