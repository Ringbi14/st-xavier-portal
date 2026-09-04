import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Department of Social Work | St. Xavier College, Maram Khunou",
    template: "%s | Department of Social Work - St. Xavier College",
  },
  description:
    "Official academic portal for the Department of Social Work (BSW), St. Xavier College, Maram Khunou, Senapati, Manipur. Access fieldwork directories, notices, events, and student resources.",
  keywords: [
    "Department of Social Work",
    "St Xavier College Maram Khunou",
    "St Xavier College Senapati",
    "BSW Manipur",
    "Social Work Senapati",
    "Fieldwork Practicum Directory",
    "Social Work Rural Camp Maram",
    "Manipur Social Work College",
  ],
  authors: [{ name: "Department of Social Work" }],
  creator: "Department of Social Work, St. Xavier College",
  metadataBase: new URL("https://st-xavier-portal.vercel.app"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "6zrBnls67bnW7xdG7HckM9aiYf93dj6SmFVhWoPgjtk",
  },
  openGraph: {
    title: "Department of Social Work | St. Xavier College, Maram Khunou",
    description:
      "Fieldwork agency directory, notices, departmental calendar, and academic downloads for Social Work students.",
    url: "https://st-xavier-portal.vercel.app",
    siteName: "Department of Social Work Portal",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/dept-logo.png",
        width: 800,
        height: 800,
        alt: "Department of Social Work Emblem",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}