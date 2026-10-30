import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty & Academic Mentors | Department of Social Work",
  description:
    "Meet the distinguished faculty members, educators, and field supervisors of the Department of Social Work at St. Xavier College (Autonomous), Maram Khunou.",
  openGraph: {
    title: "Faculty & Academic Mentors | Department of Social Work",
    description:
      "Distinguished faculty and field work supervisors driving professional social work education at St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
