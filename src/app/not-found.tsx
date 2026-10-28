import Link from "next/link";
import { Compass, Home, Bell, GraduationCap, MapPin, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Department Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f2042] text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/20 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>St. Xavier College, Maram Khunou</span>
        </div>

        {/* 404 Heading & Description */}
        <div className="space-y-3">
          <div className="text-7xl sm:text-8xl font-black text-[#0f2042] tracking-tighter">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
            The circular, academic page, or departmental resource you are looking for does not exist or may have been relocated.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0f2042] hover:bg-[#1a365d] text-amber-300 hover:text-white font-bold text-sm transition-all shadow-sm"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Department Home</span>
          </Link>
          <Link
            href="/notices"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-xs"
          >
            <Bell className="w-4 h-4 text-teal-700" />
            <span>View Active Notices</span>
          </Link>
        </div>

        {/* Quick Links Directory */}
        <div className="pt-6 border-t border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Helpful Portals &amp; Desks
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Link
              href="/programmes"
              className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-semibold hover:text-[#0f2042] transition flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
              <span>BSW Curriculum</span>
            </Link>
            <Link
              href="/agencies"
              className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-semibold hover:text-[#0f2042] transition flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>Fieldwork Settings</span>
            </Link>
            <Link
              href="/contact"
              className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-semibold hover:text-[#0f2042] transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-700 rotate-180" />
              <span>Contact Desk</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
