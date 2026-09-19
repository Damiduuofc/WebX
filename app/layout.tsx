import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/auth";

// Display face for headings and figures; body copy stays on the system font.
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

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
    <html lang="en" suppressHydrationWarning className={`${display.variable} h-full antialiased`}>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F7F9FC] text-[#0F172A]"
      >
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

