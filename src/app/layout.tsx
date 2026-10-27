import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClariVisit — AI After-Visit Summary Health Companion",
  description:
    "Transform dense hospital and clinic After-Visit Summaries into reassuring plain English, vitals spectrum gauges, actionable meal & habit plans, and preventive care reminders.",
  keywords: [
    "After Visit Summary",
    "Epic MyChart alternative",
    "Health literacy",
    "Medical AI translation",
    "Vitals tracker",
    "Patient discharge companion",
  ],
  authors: [{ name: "ClariVisit Health" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
