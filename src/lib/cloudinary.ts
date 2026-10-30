/**
 * Shared Cloudinary Upload Utility for St. Xavier Portal
 * Handles Cloud Name & Upload Preset resolution, secure HTTPS conversion,
 * direct REST API uploads, and Cloudinary Media Widget interactions.
 */

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, any>,
        callback: (error: any, result: any) => void
      ) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}

export interface CloudinaryUploadOptions {
  folder?: string;
  resourceType?: "image" | "raw" | "auto";
  multiple?: boolean;
  onSuccess: (secureUrl: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Optimizes Cloudinary image delivery on low-bandwidth networks
 * by applying auto format, auto quality, and width bounds.
 */
export function optimizeCloudinaryUrl(url?: string, width: number = 600): string {
  if (!url || typeof url !== "string") return url || "";
  if (!url.includes("res.cloudinary.com")) return url;

  // If transformations (f_auto or q_auto) are already present, do not re-transform
  if (url.includes("/f_auto") || url.includes("/q_auto")) return url;

  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const prefix = url.slice(0, uploadIndex + "/upload/".length);
  const suffix = url.slice(uploadIndex + "/upload/".length);

  return `${prefix}f_auto,q_auto,c_limit,w_${width}/${suffix}`;
}

/**
 * Direct file upload to Cloudinary via REST API.
 * Returns the secure HTTPS URL on completion.
 */
export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Please verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.error?.message || `Cloudinary upload failed with HTTP status ${res.status}`
    );
  }

  const data = await res.json();
  let secureUrl = data.secure_url || data.url;

  if (!secureUrl) {
    throw new Error("No secure URL returned by Cloudinary service.");
  }

  // Force HTTPS if upstream returned non-secure scheme
  if (typeof secureUrl === "string" && secureUrl.startsWith("http://")) {
    secureUrl = secureUrl.replace("http://", "https://");
  }

  return secureUrl;
}

/**
 * Helper to dynamically load the Cloudinary upload widget script if not already present.
 */
function loadCloudinaryWidgetScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cloudinary widget can only be loaded in a browser environment."));
      return;
    }

    if (window.cloudinary) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("cloudinary-upload-widget");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Cloudinary widget script."))
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "cloudinary-upload-widget";
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load Cloudinary Upload Widget script."));
    document.body.appendChild(script);
  });
}

/**
 * Open Cloudinary Upload Widget with automatic script injection,
 * preset validation, and secure URL callback.
 */
export async function openCloudinaryWidget({
  folder = "st_xavier_portal",
  resourceType = "image",
  multiple = false,
  onSuccess,
  onError,
}: CloudinaryUploadOptions): Promise<void> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    const err = new Error(
      "Cloudinary configuration missing. Please verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
    console.error(err);
    if (onError) onError(err);
    else alert(err.message);
    return;
  }

  try {
    await loadCloudinaryWidgetScript();

    if (!window.cloudinary) {
      throw new Error("Cloudinary widget library is not available.");
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder,
        resourceType,
        multiple,
        clientAllowedFormats: ["png", "jpeg", "jpg", "webp", "pdf"],
        maxFileSize: 10485760, // 10MB
        sources: ["local", "url", "camera"],
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary Widget error:", error);
          if (onError) onError(new Error(error.message || "Cloudinary Widget error"));
          return;
        }

        if (result && result.event === "success") {
          let secureUrl = result.info?.secure_url || result.info?.url;
          if (secureUrl) {
            if (secureUrl.startsWith("http://")) {
              secureUrl = secureUrl.replace("http://", "https://");
            }
            onSuccess(secureUrl);
          }
        }
      }
    );

    widget.open();
  } catch (err: any) {
    console.error("Failed to open Cloudinary widget:", err);
    if (onError) {
      onError(err instanceof Error ? err : new Error(String(err)));
    } else {
      alert(err.message || "Failed to open upload widget.");
    }
  }
}
