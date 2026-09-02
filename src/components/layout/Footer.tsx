import React from "react";
import Link from "next/link";
import { GraduationCap, MapPin, Mail, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <GraduationCap className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-base font-bold text-white">
                Department of Social Work
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              St. Xavier College, Maram Khunou, Senapati, Manipur. Dedicated to excellence in social work education, community engagement, professional ethics, and transformative field practice.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About the Department</Link></li>
              <li><Link href="/staff" className="hover:text-amber-400 transition-colors">Faculty Directory</Link></li>
              <li><Link href="/events" className="hover:text-amber-400 transition-colors">Department Events</Link></li>
              <li><Link href="/notices" className="hover:text-amber-400 transition-colors">Notices & Circulars</Link></li>
              <li><Link href="/gallery" className="hover:text-amber-400 transition-colors">Department Gallery</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Campus Location
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                <span>St. Xavier College, Maram Khunou, Senapati District, Manipur - 795105</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>[ADD OFFICIAL DEPARTMENT EMAIL]</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>[ADD OFFICIAL CONTACT NUMBER]</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Department of Social Work, St. Xavier College. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Digital Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}