"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Upload, X, CheckCircle2, AlertCircle, Camera, Sparkles } from "lucide-react";
import { uploadToCloudinary, openCloudinaryWidget } from "@/lib/cloudinary";

export default function CloudinaryUploadField({
  label,
  value,
  onChange,
  required = false,
  placeholder = "https://res.cloudinary.com/... or paste image URL",
  folder = "st_xavier_portal",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  placeholder?: string;
  folder?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasPreviewError, setHasPreviewError] = useState(false);

  useEffect(() => {
    setHasPreviewError(false);
    setUploadError(null);
  }, [value]);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const secureUrl = await uploadToCloudinary(file, folder);
      onChange(secureUrl);
    } catch (err: any) {
      console.error("Cloudinary direct upload failed:", err);
      setUploadError(err.message || "Failed to upload to Cloudinary. You can still paste an image URL directly.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleOpenWidget = () => {
    openCloudinaryWidget({
      folder,
      resourceType: "image",
      onSuccess: (secureUrl) => {
        onChange(secureUrl);
      },
      onError: (err) => {
        setUploadError(err.message);
      },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-[11px] font-bold text-slate-700">
          {label} {required && "*"}
        </label>
        <div className="flex items-center gap-1.5">
          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 cursor-pointer transition">
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload File</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleDirectUpload}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={handleOpenWidget}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition cursor-pointer"
            title="Open Cloudinary Media Library / Camera Widget"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Cloudinary Widget</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="url"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer shrink-0"
            title="Clear Photo URL"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {uploadError && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Live Preview Box */}
      {value && (
        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative flex items-center justify-center">
            {!hasPreviewError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Preview"
                onError={() => setHasPreviewError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {!hasPreviewError ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Image Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Image Failed to Load (Fallback active)
                </span>
              )}
              {value.includes("res.cloudinary.com") && (
                <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  Cloudinary HTTPS
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-slate-500 truncate mt-1">
              {value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
