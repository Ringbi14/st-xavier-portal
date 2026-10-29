"use client";

import React from "react";
import { Building2, Mail, MapPin, Clock, ExternalLink } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Institutional Communications
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Department Contact & Location Desk</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            St. Xavier College, Maram Khunou — Department of Social Work faculty office and field coordination contacts.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-black text-slate-900">Campus Postal Address</h3>
          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Department of Social Work</strong>
                <span>St. Xavier College, Maram Khunou</span>
                <span className="block text-slate-500">Senapati District, Manipur – 795106</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Office Hours: Monday – Friday, 09:00 AM – 04:00 PM IST</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed">
              Official departmental phone and email contacts are being updated in consultation with the Department Office. Please visit the department desk during working hours.
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Institutional Affiliation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Affiliated with <strong>Manipur University</strong>. Established under the aegis of the Kohima Jesuit Educational Society.
          </p>
          <div className="pt-2">
            <a
              href="https://www.stxaviercollegespt.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold hover:bg-teal-100 transition"
            >
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>Visit Main College Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}