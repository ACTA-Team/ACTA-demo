import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/providers/wallet.provider";
import { DidProvider } from "@/providers/did.provider";
import { AppThemeProvider } from "@/providers/theme.provider";
import { SiteHeader } from "@/layouts/Header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACTA Demo",
  description: "Create Credential and Store in Vault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppThemeProvider>
          <WalletProvider>
            <DidProvider>
              <SiteHeader />
              <main className="min-h-screen">{children}</main>
              <Toaster position="bottom-right" />
            </DidProvider>
          </WalletProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
