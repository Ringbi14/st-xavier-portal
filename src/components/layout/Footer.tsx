import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Calendar, 
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About Department", href: "/about" },
    { label: "Faculty Directory", href: "/staff" },
    { label: "Organizations Directory", href: "/organizations" },
    { label: "Notice Board", href: "/notices" },
    { label: "Events & Schedules", href: "/events" },
    { label: "Fieldwork Gallery", href: "/gallery" },
    { label: "Alumni Network", href: "/alumni" },
    { label: "Student Dashboard", href: "/dashboard" },
  ];

  const resources = [
    { label: "Concurrent Log Sheets", href: "/dashboard" },
    { label: "Casework Process Records", href: "/dashboard" },
    { label: "Rural Camp Rubric", href: "/dashboard" },
    { label: "Academic Syllabus", href: "/dashboard" },
    { label: "Faculty Portal Login", href: "/login" },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-amber-500/40 p-1 flex items-center justify-center shrink-0 shadow-sm">
                <Image
                  src="/dept-logo.png"
                  alt="Department Emblem"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Department of Social Work
                </h3>
                <p className="text-[11px] text-amber-400 font-semibold">
                  St. Xavier College, Maram Khunou
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Fostering transformational social work practitioners through intensive fieldwork immersion, community action, participatory research, and ethical praxis across Northeast India.
            </p>

            <div className="flex items-center gap-2 pt-2 text-slate-400">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-medium text-slate-300">
                Affiliated to Manipur University
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-amber-400 transition inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practicum Desk */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Field Practicum Desk
            </h4>
            <ul className="space-y-2">
              {resources.map((res) => (
                <li key={res.label}>
                  <Link
                    href={res.href}
                    className="hover:text-amber-400 transition inline-flex items-center gap-1 group"
                  >
                    <span>{res.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Department Office
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  St. Xavier College, Maram Khunou, Senapati District, Manipur – 795105
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:socialwork@stxaviers.edu.in" className="hover:text-amber-400 transition">
                  socialwork@stxaviers.edu.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Office: Mon – Fri (9:00 AM – 4:00 PM)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Faculty Administration Access</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {currentYear} Department of Social Work, St. Xavier College, Maram Khunou. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400 transition">Institutional Profile</Link>
            <span>•</span>
            <Link href="/staff" className="hover:text-slate-400 transition">Faculty Directory</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-slate-400 transition">Student Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}