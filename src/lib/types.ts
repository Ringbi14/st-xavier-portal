export type UserRole = "visitor" | "student" | "faculty" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  batch?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "academic" | "fieldwork" | "examination" | "general";
  priority: "normal" | "important" | "urgent";
  isPublic: boolean;
  publishedAt: string;
  attachmentUrl?: string;
}

export interface DepartmentEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  organizer: string;
  resourcePerson?: string;
  isUpcoming: boolean;
  coverImage?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  bio: string;
  photoUrl?: string;
  email?: string;
}