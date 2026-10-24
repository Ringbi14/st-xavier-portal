"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardRedirectGate() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/admin");
      }
    }
  }, [user, isAdmin, loading, router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Redirecting to designated portal...</p>
      </div>
    </div>
  );
}