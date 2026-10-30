import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Institutional Desk | Department of Social Work",
  description:
    "Get in touch with the Department of Social Work, St. Xavier College (Autonomous), Maram Khunou for admissions, agency partnerships, and student inquiries.",
  openGraph: {
    title: "Contact & Institutional Desk | Department of Social Work",
    description:
      "Official contact directory, department office hours, and address for St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
