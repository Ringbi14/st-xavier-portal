"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert, LogOut, ArrowLeft } from "lucide-react";

export default function DashboardRedirectGate() {
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (isAdmin) {
        router.replace("/admin");
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-[#0f2042] animate-spin" />
          <p className="text-xs font-semibold text-slate-500">
            Verifying account permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-900">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-600">
            This account does not have Department Administrator privileges.
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Signed in as: {user.email}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2042] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to Department Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}