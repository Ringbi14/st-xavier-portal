"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  X,
  Loader2,
  ArrowLeft,
  Building2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isResetOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsResetOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isResetOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await signInWithEmail(email.trim(), password);
      router.push("/admin");
    } catch (err: unknown) {
      console.error("Auth error:", err);
      const authErr = err as { code?: string; message?: string };

      if (
        authErr.code === "auth/invalid-credential" ||
        authErr.code === "auth/user-not-found" ||
        authErr.code === "auth/wrong-password"
      ) {
        setErrorMsg("Invalid credentials. Please verify your faculty email and password.");
      } else {
        setErrorMsg(authErr.message || "Authentication failed. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg(null);
    setResetSuccessMsg(null);
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSuccessMsg(
        `Password recovery link dispatched to ${resetEmail.trim()}. Please check your email inbox.`
      );
    } catch (err: unknown) {
      setResetErrorMsg("Failed to dispatch reset email. Verify your address and try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block group mb-3">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 mx-auto flex items-center justify-center shadow-xs group-hover:border-teal-400 transition">
            <Image
              src="/dept-logo.png"
              alt="Department Crest"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Faculty & Staff Administration
        </span>

        <h1 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
          Department of Social Work
        </h1>
        <p className="mt-1 text-xs font-semibold text-slate-600">
          Faculty & Staff Portal
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          St. Xavier College, Maram Khunou, Senapati District
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Authorized Faculty Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@stxaviercollegespt.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="text-xs font-bold text-teal-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Institutional Note & Back Link */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-teal-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portal</span>
            </Link>

            <span className="text-[11px] text-slate-400">
              Department Portal v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-800" />
                <h3 className="text-sm font-black text-slate-900">
                  Reset Faculty Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResetOpen(false)}
                aria-label="Close modal"
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccessMsg ? (
              <div className="p-3 bg-teal-50 text-teal-900 text-xs rounded-xl border border-teal-200">
                {resetSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                {resetErrorMsg && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                    {resetErrorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Registered Faculty Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter institutional email"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                  >
                    {resetLoading ? "Sending..." : "Dispatch Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}