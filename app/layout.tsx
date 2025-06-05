import "./globals.css";

import type { Metadata } from "next";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import React from "react";

import Navbar from "@/components/navigation/navbar";
import ThemeProvider from "@/context/Theme";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
});

const spaceGrotesk = SpaceGrotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
