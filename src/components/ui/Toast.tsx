"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "info",
  onClose,
  duration = 4500,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      bg: "bg-[#0f2042] text-white border-emerald-500/40",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: "bg-[#0f2042] text-white border-rose-500/40",
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    },
    info: {
      bg: "bg-[#0f2042] text-white border-amber-500/40",
      icon: <Info className="w-4 h-4 text-amber-400 shrink-0" />,
    },
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 max-w-md flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${config.bg}`}
    >
      {config.icon}
      <p className="text-xs font-medium leading-relaxed flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export interface InlineBannerProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

export function InlineBanner({
  message,
  type = "info",
  onClose,
}: InlineBannerProps) {
  const config = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-amber-50 text-amber-800 border-amber-200",
  }[type];

  const icon = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-amber-600 shrink-0" />,
  }[type];

  return (
    <div
      role="status"
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium ${config}`}
    >
      {icon}
      <span className="flex-1 leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert banner"
          className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
