import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni Directory & Career Network | Department of Social Work",
  description:
    "Connect with graduates of the Department of Social Work, St. Xavier College (Autonomous), Maram Khunou making impacts across public sector, child protection, and civil society.",
  openGraph: {
    title: "Alumni Directory & Career Network | Department of Social Work",
    description:
      "Celebrating graduates of the Department of Social Work at St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
