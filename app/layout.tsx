import "./globals.css";

import type { Metadata } from "next";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
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
  title: "Flow Stack",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
