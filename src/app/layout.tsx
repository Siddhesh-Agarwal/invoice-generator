import "@/styles/globals.css";

import type {Metadata} from "next";
import {Geist} from "next/font/google";

import Header from "@/components/Header";
import {Toaster} from "@/components/ui/sonner";
import {TRPCReactProvider} from "@/trpc/react";
import {Suspense} from "react";

export const metadata: Metadata = {
  title: "Simple Invoice Generator",
  description: "A simple no-nonsense invoice generator",
  keywords: ["invoice", "generator", "simple"],
  icons: [{rel: "icon", url: "/favicon.ico"}],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <main className="min-h-screen bg-background">
            <Header />
            <Suspense>{children}</Suspense>
            <Toaster richColors />
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
