import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BrandPreloader } from "@/components/brand/BrandPreloader";
import "./globals.css";

// Inter per PRD §18, loaded via next/font (self-hosted at build, no runtime CDN).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PeoplePulse — Turn assumptions into evidence",
  description:
    "PeoplePulse is a human evidence platform that turns uncertainty about people into structured human evidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-paper font-sans text-ink antialiased">
        <BrandPreloader />
        {children}
      </body>
    </html>
  );
}
