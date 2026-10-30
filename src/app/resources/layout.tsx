import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Resources & Fieldwork Documents | Department of Social Work",
  description:
    "Download fieldwork logbooks, syllabus documents, ICSSR research guides, and departmental guidelines from St. Xavier College (Autonomous), Maram Khunou.",
  openGraph: {
    title: "Academic Resources & Fieldwork Documents | Department of Social Work",
    description:
      "Download syllabus, fieldwork manuals, logbooks, and academic documents from the Department of Social Work, St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
