"use client";

import NavigationFooter from "@/components/navigation/NavigationFooter";
import NavigationHeader from "@/components/navigation/NavigationHeader";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <SessionProvider>
          {" "}
          {/* ✅ ครอบทั้งหมด */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavigationHeader />
            <main className="px-4 max-w-6xl mx-auto">{children}</main>
            <NavigationFooter />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
