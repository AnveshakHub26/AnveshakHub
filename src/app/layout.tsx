import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnveshakHub | Enterprise Collaboration Platform",
  description: "Connecting Industries, Experts & Innovation Through One Enterprise Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
