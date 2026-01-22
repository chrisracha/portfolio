import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chris Samuel Salcedo | Frontend Developer",
  description: "Premium dark UI portfolio featuring projects, skills, and experience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-midnight text-white antialiased`}>{children}</body>
    </html>
  );
}
