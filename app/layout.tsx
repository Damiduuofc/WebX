import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/auth";
import GlobalSplash from "./components/GlobalSplash";

// Primary font: geistMono for high legibility, clean futuristic modern UI, and accessibility
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Univa — One platform. Every journey.",
  description: "A futuristic, accessible, and intelligent transportation platform connecting autonomous buses, SkyRail, and smart roads into one seamless journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistMono.variable} ${geistMono.className} h-full antialiased`}>
      <body
        suppressHydrationWarning
        className={`${geistMono.className} min-h-full flex flex-col bg-[#F7F9FC] text-[#0F172A]`}
      >
        <GlobalSplash />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

