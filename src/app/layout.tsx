import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnveshakHub — Enterprise R&D Innovation & Expertise Platform",
  description: "Connecting enterprise industries, accredited domain experts, and top academic researchers through a verified R&D ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF8F5] text-[#1C1F23] selection:bg-[#4338CA] selection:text-white dark:bg-[#0B0D10] dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
