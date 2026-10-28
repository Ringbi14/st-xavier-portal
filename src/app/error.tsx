"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client boundary exception for diagnosis
    console.error("Unhandled Route Boundary Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center space-y-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
        
        {/* Warning Icon Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Error Context */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Network / Application Alert
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            Unable to Load Page Content
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            A temporary network interruption or data synchronization issue occurred while loading this section.
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0f2042] hover:bg-[#1a365d] text-amber-300 hover:text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Retry Connection</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
          >
            <Home className="w-4 h-4 text-slate-600" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Error Diagnostic Digest (Sanitized) */}
        {error?.digest && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-mono text-slate-400">
              Reference Code: <span className="text-slate-600 font-semibold">{error.digest}</span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
