"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  FileText, 
  Download, 
  Search, 
  Tag, 
  FileCheck, 
  FolderArchive, 
  ExternalLink,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  category: string;
  fileType: string;
  fileSize?: string;
  description: string;
  downloadUrl: string;
  updatedDate?: string;
}

const DEFAULT_DOWNLOADS: DownloadItem[] = [
  {
    id: "dl-1",
    title: "Concurrent Fieldwork Log Sheet & Summary Report",
    category: "Fieldwork",
    fileType: "PDF",
    fileSize: "245 KB",
    description: "Official weekly attendance, supervisory conference log, and fieldwork activity tracking form.",
    downloadUrl: "#",
    updatedDate: "2026-01-15",
  },
  {
    id: "dl-2",
    title: "Social Casework Process Recording Format",
    category: "Templates",
    fileType: "DOCX",
    fileSize: "180 KB",
    description: "Standardized structural template for reporting individual casework intake, psychosocial diagnosis, and intervention phases.",
    downloadUrl: "#",
    updatedDate: "2026-01-20",
  },
  {
    id: "dl-3",
    title: "Social Group Work Session Recording Protocol",
    category: "Templates",
    fileType: "DOCX",
    fileSize: "195 KB",
    description: "Structured template covering group formation, sociometric observation, member dynamics, and evaluative summaries.",
    downloadUrl: "#",
    updatedDate: "2026-01-20",
  },
  {
    id: "dl-4",
    title: "Bachelor of Social Work (BSW) Detailed Syllabus",
    category: "Syllabus",
    fileType: "PDF",
    fileSize: "1.2 MB",
    description: "Complete course structure, semester-wise credit breakdown, core papers, and Manipur University examination schemes.",
    downloadUrl: "#",
    updatedDate: "2025-08-10",
  },
  {
    id: "dl-5",
    title: "Rural Educational Camp Manual & PRA Guidelines",
    category: "Manuals",
    fileType: "PDF",
    fileSize: "680 KB",
    description: "Operational handbook detailing village camp conduct, safety norms, Participatory Rural Appraisal tools, and documentation rubrics.",
    downloadUrl: "#",
    updatedDate: "2026-02-05",
  },
  {
    id: "dl-6",
    title: "Agency Fieldwork Supervisor Evaluation Form",
    category: "Evaluation",
    fileType: "PDF",
    fileSize: "310 KB",
    description: "Official departmental rubric for agency mentors to evaluate student professional conduct, punctuality, and field competence.",
    downloadUrl: "#",
    updatedDate: "2026-01-10",
  },
];

export default function DashboardPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(DEFAULT_DOWNLOADS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "downloads"), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as DownloadItem[];
          setDownloads(loaded);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn("Firestore downloads subscription:", err);
    }
  }, []);

  const categories = ["All", "Fieldwork", "Templates", "Syllabus", "Manuals", "Evaluation"];

  const filteredDownloads = downloads.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Academic Downloads & Practicum Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Student Resource Center
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Download official fieldwork documentation templates, casework log sheets, Manipur University BSW syllabi, and rural camp operational guidelines.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search downloads by document title, keyword, or format..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDownloads.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition shadow-xs flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    <span>{item.fileType}</span>
                    {item.fileSize && <span>• {item.fileSize}</span>}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {item.updatedDate && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Updated: {item.updatedDate}
                  </span>
                )}

                <a
                  href={item.downloadUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-200 hover:border-teal-700 text-xs font-bold transition shadow-xs group/btn ml-auto"
                >
                  <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDownloads.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No resources match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search bar or choosing &quot;All&quot; categories.</p>
          </div>
        )}

      </div>
    </div>
  );
}