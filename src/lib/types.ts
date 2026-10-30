export type UserRole = "faculty" | "admin";
export type UserStatus = "active" | "inactive";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole | string;
  status?: UserStatus | string;
  phone?: string;
  designation?: string;
  avatarUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MediaDocument {
  id: string;
  fileName: string;
  title: string;
  description?: string;
  storagePath: string;
  downloadUrl?: string;
  fileType: "photo" | "video" | "document" | "other";
  mimeType: string;
  fileSizeBytes: number;
  uploaderUid: string;
  uploaderName: string;
  uploaderRole: UserRole;
  storagePartition: "private" | "shared";
  accessState: "private" | "shared";
  isPublishedToGallery: boolean;
  galleryData?: {
    title: string;
    description?: string;
    category: string;
    location?: string;
    year?: string;
    publicUrl: string;
    publishedAt: any;
    publishedByUid: string;
  };
  moderation?: {
    reviewedAt?: any;
    reviewedByUid?: string;
    status: "pending" | "approved" | "rejected";
    notes?: string;
  };
  createdAt: any;
  updatedAt: any;
  updatedByUid?: string;
}

export interface ResourceDocument {
  id: string;
  title: string;
  category: "Fieldwork" | "Syllabus" | "Templates" | "Guidelines" | "General";
  description: string;
  fileType: string;
  fileSize: string;
  isPublic: boolean;
  storagePath?: string;
  downloadUrl: string;
  updatedDate: string;
  createdAt: any;
  createdByUid: string;
}

export type NoticeCategory = "Fieldwork" | "Exam" | "Rural Camp" | "General";

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  description?: string; // Legacy fallback field
  fileUrl?: string;
  attachmentUrl?: string; // Legacy fallback field
  category: NoticeCategory | string;
  publishedAt: any;
  updatedAt?: any;
  author?: string;
  date?: string; // Kept as optional for backwards compatibility
  isPinned?: boolean;
  isArchived?: boolean;
}

export type NoticeDocument = NoticeItem;

export type DownloadCategory = "Fieldwork Forms" | "Syllabus" | "Camp Manuals" | "General Guidelines";
export type DownloadProgram = "All" | "BSW";

export interface DownloadItem {
  id: string;
  title: string;
  category: DownloadCategory | string;
  targetProgram: DownloadProgram | string;
  url: string;
  note?: string;
  fileName?: string;
  fileSizeBytes?: number;
  academicYear?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type ShowcaseCategory =
  | "Rural Camp"
  | "Community Awareness"
  | "Agency Visit"
  | "Department Event";

export interface ShowcaseItem {
  id?: string;
  title: string;
  category: ShowcaseCategory | string;
  academicYear: string;
  year?: string;
  location: string;
  impactSummary?: string;
  description?: string;
  imageUrl: string;
  photoUrl?: string;
  publicUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  galleryData?: any;
}

export interface FacultyMember {
  id?: string;
  name: string;
  designation: string;
  specialization: string;
  email: string;
  categoryTier?: "Department Faculty" | "College Leadership" | string;
  officeExtension?: string;
  qualification?: string;
  qualifications?: string;
  supervisoryRole?: string;
  affiliation?: string;
  bio?: string;
  imageUrl?: string;
  photoUrl?: string;
  publicUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type AgencyDomain =
  | "Community Development"
  | "Child & Youth Welfare"
  | "Healthcare & Mental Health"
  | "Women & Family"
  | "Environment & Livelihood"
  | "Medical & Psychiatric"
  | "Human Resources"
  | string;

export interface AgencyItem {
  id?: string;
  name: string;
  domain: AgencyDomain | string;
  location: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type AlumniSector =
  | "Higher Education"
  | "Child Welfare"
  | "Rural Development"
  | "Public Sector"
  | "Healthcare & Mental Health"
  | "NGO & Advocacy"
  | "CSR & Corporate"
  | string;

export interface AlumniProfile {
  id: string;
  fullName: string;
  batchYear: string;
  currentRole: string;
  organization: string;
  sector: AlumniSector;
  location: string;
  higherStudies?: string;
  quote?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  email?: string;
  status: "approved" | "pending";
  createdAt: any;
  updatedAt?: any;
}

