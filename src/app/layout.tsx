import type { Metadata } from "next";
import "./globals.css";
import LeadCapturePopup from "../components/LeadCapturePopup";

export const metadata: Metadata = {
  title: "College Chalo - College Discovery & Admissions Platform",
  description: "Discover, compare, and apply to colleges with College Chalo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen overflow-x-hidden">
        {children}
        <LeadCapturePopup />
      </body>
    </html>
  );
}
