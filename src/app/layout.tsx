import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "InvoicePal",
  description: "A simple no-nonsense invoice generator",
  keywords: ["invoice", "generator", "simple", "InvoicePal"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
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
