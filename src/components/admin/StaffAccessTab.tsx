"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Loader2,
  RefreshCw,
  User,
  Clock,
  Mail,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface AdminAccount {
  uid: string;
  email: string;
  displayName: string;
  lastSignInTime: string | null;
  creationTime: string | null;
  disabled?: boolean;
  isCurrentCaller?: boolean;
}

async function safeParseJson(res: Response): Promise<any> {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: `Server returned an invalid response (${res.status} ${res.statusText || ""}).` };
  }
}

function generateSecurePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const nums = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + nums + symbols;

  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += nums[Math.floor(Math.random() * nums.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < 14; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

export default function StaffAccessTab() {
  const { user } = useAuth();

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog & Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminAccount | null>(null);

  const fetchAdmins = useCallback(async (isSilent = false) => {
    if (!user) return;
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setConfigError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        if (res.status === 503 || data.error?.includes("Firebase Admin service account key")) {
          setConfigError(data.error);
        } else {
          setToast({ message: data.error || "Failed to load admin accounts.", type: "error" });
        }
        return;
      }

      setAdmins(data.admins || []);
    } catch (err: unknown) {
      console.error("Failed to fetch admin accounts:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: `Network error: ${msg}`, type: "error" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword();
    setPassword(generated);
    setShowPassword(true);
  };

  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password) {
      setToast({ message: "Please fill in all fields (Full Name, Email, Password).", type: "error" });
      return;
    }

    if (password.length < 8) {
      setToast({ message: "Password must be at least 8 characters.", type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) throw new Error("Current session expired. Please sign in again.");
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create administrator account.");
      }

      setToast({
        message: data.message || `Account for ${email.trim()} provisioned with Administrator privileges.`,
        type: "success",
      });

      // Clear form
      setDisplayName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);

      // Refresh accounts list
      await fetchAdmins(true);
    } catch (err: unknown) {
      console.error("Account creation failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDeleteAdmin = async () => {
    if (!deleteConfirm) return;
    const target = deleteConfirm;

    try {
      if (!user) throw new Error("Current session expired.");
      const token = await user.getIdToken();

      const res = await fetch(`/api/admin/staff?uid=${encodeURIComponent(target.uid)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete administrator account.");
      }

      setToast({
        message: `Administrator access for ${target.email} permanently revoked.`,
        type: "success",
      });

      setDeleteConfirm(null);
      await fetchAdmins(true);
    } catch (err: unknown) {
      console.error("Account deletion failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setToast({ message: msg, type: "error" });
    }
  };

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return "Never";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>Faculty Administrator Access Control</span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              {admins.length} Active {admins.length === 1 ? "Admin" : "Admins"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directly create and delete faculty login accounts with authoritative custom claims. No public registration or approval required.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAdmins(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-teal-700" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Configuration Alert Banner (if FIREBASE_SERVICE_ACCOUNT_KEY missing) */}
      {configError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Server Configuration Required</span>
          </div>
          <p className="leading-relaxed">
            {configError}
          </p>
          <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px] font-mono text-slate-700">
            <strong>Vercel Setup:</strong> In your Vercel Project Settings &rarr; Environment Variables, add <code>FIREBASE_SERVICE_ACCOUNT_KEY</code> with the full JSON content of your Firebase service account private key.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. DIRECT ACCOUNT CREATION FORM                           */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0f2042] via-[#142a55] to-slate-900 text-white shadow-xl border border-[#1e3a8a] space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Create New Faculty Administrator
            </h3>
            <p className="text-[11px] text-slate-300">
              Instantly create credentials in Firebase Authentication and grant authoritative custom claims ({`{ admin: true }`}).
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                Faculty Member Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Dr. K. Victor Maram"
                  className="w-full pl-3 pr-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                Faculty Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@college.edu or gmail.com"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition font-medium font-mono"
              />
            </div>

            {/* Password with generator & toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-200">
                  Initial Password *
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[10px] font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 cursor-pointer"
                  title="Generate strong random password"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate Strong</span>
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-3 pr-16 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition font-mono"
                />

                <div className="absolute right-1.5 flex items-center gap-1">
                  {password && (
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      aria-label="Copy password to clipboard"
                      className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title={copied ? "Copied!" : "Copy password"}
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              &bull; Once created, copy the initial password to give to the faculty member. They can change it at any time using the password recovery flow.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-md disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* 2. ACTIVE ADMINISTRATOR ACCOUNTS TABLE                    */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span>Active Department Administrators</span>
          <span className="text-[10px] text-slate-500 font-normal">
            (Accounts authorized to publish notices, manage faculty, and approve alumni)
          </span>
        </h3>

        {loading ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Querying active administrator accounts...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">No administrator accounts returned</h4>
            <p className="text-[11px] text-slate-500">
              Create an account using the form above to grant portal administration access.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Created On</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Access Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {admins.map((adm) => {
                  const isCurrent = adm.isCurrentCaller || adm.email === user?.email;
                  return (
                    <tr
                      key={adm.uid}
                      className={`hover:bg-slate-50/80 transition ${
                        isCurrent ? "bg-teal-50/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/30 shrink-0">
                            {adm.displayName?.slice(0, 2).toUpperCase() || "AD"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{adm.displayName}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                                  You - Active Session
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              UID: {adm.uid}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-middle font-mono text-slate-800 font-medium">
                        {adm.email}
                      </td>

                      <td className="py-3.5 px-4 align-middle text-slate-500 text-[11px]">
                        {formatDateTime(adm.creationTime)}
                      </td>

                      <td className="py-3.5 px-4 align-middle text-slate-500 text-[11px]">
                        {formatDateTime(adm.lastSignInTime)}
                      </td>

                      <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                        {isCurrent ? (
                          <span
                            className="text-[11px] font-semibold text-slate-400 italic px-2 py-1"
                            title="You cannot remove your own active login session."
                          >
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(adm)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                            title={`Remove administrator credentials for ${adm.displayName}`}
                            aria-label={`Remove administrator account for ${adm.displayName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Account</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Revoke Administrator Access"
        message={`Are you sure you want to permanently delete the administrator account for "${deleteConfirm?.displayName}" (${deleteConfirm?.email})? All active login sessions will be immediately terminated and revoked.`}
        confirmText="Permanently Delete"
        onConfirm={executeDeleteAdmin}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
