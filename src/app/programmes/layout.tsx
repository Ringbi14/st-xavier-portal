import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Programmes | Department of Social Work",
  description:
    "Explore the Bachelor of Social Work (BSW) curriculum, fieldwork practicum, rural camps, and academic structure at St. Xavier College (Autonomous), Maram Khunou.",
  openGraph: {
    title: "Academic Programmes | Department of Social Work",
    description:
      "Bachelor of Social Work (BSW) curriculum, field education, and clinical block placements at St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function ProgrammesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
