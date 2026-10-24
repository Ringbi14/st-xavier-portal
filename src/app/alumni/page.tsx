"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  Users,
  Briefcase,
  Award,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AlumniComingSoonPage() {
  const [email, setEmail] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setRegistered(true);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Department Home</span>
          </Link>
        </div>

        {/* Feature Teaser Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>COMING SOON • COHORT REGISTRY</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-teal-800 text-white flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Social Work Alumni Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              We are building a collaborative registry to reconnect past BSW graduates, 
              foster student mentorship, share CSR/NGO job openings, and track alumni impact worldwide.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Directory & Cohorts</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Search and connect with classmates across graduating batches and specializations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Career & Placements</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Alumni-led job referrals, NGO vacancies, and fieldwork opportunities for seniors.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Mentorship Desk</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                One-on-one field guidance for current students conducting research or rural camp projects.
              </p>
            </div>
          </div>

          {/* Development Status Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center gap-2 text-xs font-semibold text-amber-900">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Currently under active development for upcoming departmental rollouts.</span>
          </div>

          {/* Interest / Pre-registration Input */}
          <div className="pt-2 border-t border-slate-100">
            {registered ? (
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                <span>Thank you! We'll notify you once alumni registration opens.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifyMe} className="max-w-md mx-auto space-y-2">
                <p className="text-xs font-bold text-slate-700">Are you an alumnus or graduating senior?</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to receive early access"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}