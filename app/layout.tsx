import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Optimizer - AI-Powered Resume Analysis",
  description:
    "Get instant feedback on your resume's ATS compatibility. Optimize for job descriptions with AI-powered analysis.",
  keywords:
    "resume, ATS, optimization, job application, AI, job search, resume tips",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
