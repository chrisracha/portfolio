import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chris Samuel Salcedo | Frontend Developer",
  description: "Premium dark UI portfolio featuring projects, skills, and experience.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.NODE_ENV === "production" ? "/portfolio" : "";
  
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href={`${basePath}/favicon.svg`} type="image/svg+xml" />
      </head>
      <body className={`${inter.className} bg-midnight text-white antialiased`}>{children}</body>
    </html>
  );
}
