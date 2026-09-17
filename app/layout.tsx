import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "NEXA — Modern Transit & Journey Planning",
  description: "A modern, minimalist visual transit and journey-planning platform for riders and commuters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F7F8FA] text-[#000000]"
      >
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
