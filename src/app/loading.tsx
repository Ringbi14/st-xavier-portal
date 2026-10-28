import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading departmental content..."
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Animated Spinner in College Colors */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0f2042] flex items-center justify-center shadow-md">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>
        </div>

        {/* Minimal Pulse Skeleton Blocks for Low Bandwidth */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded-full mx-auto animate-pulse" />
          <div className="h-3 w-64 bg-slate-100 rounded-full mx-auto animate-pulse" />
        </div>

        {/* Accessible Indicator */}
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Loading Department of Social Work Portal...
        </p>
      </div>
    </div>
  );
}
