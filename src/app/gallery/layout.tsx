import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase & Media Gallery | Department of Social Work",
  description:
    "Visual documentation of community interventions, rural camps, social awareness campaigns, and departmental milestones at St. Xavier College (Autonomous), Maram Khunou.",
  openGraph: {
    title: "Showcase & Media Gallery | Department of Social Work",
    description:
      "Visual documentation of community interventions, rural camps, and departmental milestones at St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
