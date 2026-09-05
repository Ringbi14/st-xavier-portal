"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  X, 
  Loader2 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password Modal States
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          router.push("/admin");
          return;
        }
      }

      // Default route for students
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (
        err.code === "auth/invalid-credential" || 
        err.code === "auth/user-not-found" || 
        err.code === "auth/wrong-password"
      ) {
        setErrorMsg("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMsg("Account temporarily locked due to multiple failed attempts. Try again later or reset password.");
      } else {
        setErrorMsg("Authentication error. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg(null);
    setResetSuccessMsg(null);
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSuccessMsg(
        `A password recovery link has been dispatched to ${resetEmail.trim()}. Please inspect your inbox or spam folder.`
      );
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setResetErrorMsg("No registered account found with that email address.");
      } else if (err.code === "auth/invalid-email") {
        setResetErrorMsg("Please enter a valid email format.");
      } else {
        setResetErrorMsg("Failed to dispatch reset email. Please verify your email and try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        
        {/* Department Crest / Logo */}
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 p-2 mx-auto flex items-center justify-center shadow-xs">
          <Image
            src="/dept-logo.png"
            alt="Department Crest"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>

        <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
          Social Work Portal
        </h2>
        <p className="mt-1 text-xs text-teal-800 font-semibold">
          St. Xavier College, Maram Khunou
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Faculty, Administrator & Student Sign In
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetErrorMsg(null);
                    setResetSuccessMsg(null);
                    setIsResetOpen(true);
                  }}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 hover:underline transition"
                >
                  Forgot password?
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Institutional Note */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Protected academic network for enrolled BSW cohorts, field instructors, and department administrators.
            </p>
          </div>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL DRAWER --- */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Reset Account Password
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Department of Social Work Portal
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsResetOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feedback Alerts inside Modal */}
            {resetSuccessMsg && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            {resetErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetErrorMsg}</span>
              </div>
            )}

            {!resetSuccessMsg ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered account email address. We will generate and transmit a secure recovery link to update your credentials.
                </p>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition"
                >
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}