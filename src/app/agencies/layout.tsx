import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fieldwork Partner Agencies | Department of Social Work",
  description:
    "Institutional partners, NGOs, healthcare institutions, and government bodies collaborating with St. Xavier College (Autonomous), Maram Khunou for concurrent field work practicum.",
  openGraph: {
    title: "Fieldwork Partner Agencies | Department of Social Work",
    description:
      "Fieldwork partner organizations and training agencies collaborating with the Department of Social Work at St. Xavier College (Autonomous), Maram Khunou.",
    siteName: "Department of Social Work | St. Xavier College (Autonomous), Maram Khunou",
  },
};

export default function AgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
