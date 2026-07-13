import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Eurosoft Innovations | Software Development",
  description: "High-end software architecture and development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Background set to match the deep midnight navy of the logo */}
      <body className="bg-[#060B13] text-gray-200 min-h-screen font-sans selection:bg-[#C89B3C] selection:text-[#060B13] flex flex-col">
        
        {/* Navigation Bar */}
        <nav className="border-b border-[#C89B3C]/15 sticky top-0 bg-[#04080F]/95 backdrop-blur-md z-50 shadow-xl shadow-black/40">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            
            {/* Corrected Full Logo Container */}
            <Link href="/" className="relative w-52 h-16 transition-opacity duration-300 hover:opacity-90">
              <Image 
                src="/IMG_4856.jpg" 
                alt="Eurosoft Innovations Full Logo" 
                fill 
                className="object-contain"
                priority
              />
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex gap-10 text-xs font-medium tracking-[0.2em] text-gray-300 uppercase">
              <Link href="/about" className="hover:text-[#C89B3C] transition-colors duration-300">About</Link>
              <Link href="/services" className="hover:text-[#C89B3C] transition-colors duration-300">Services</Link>
            </div>

            {/* Call to Action */}
            <Link 
              href="/contact" 
              className="border border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#060B13] transition-all duration-500 px-6 py-3 text-xs tracking-[0.15em] font-medium uppercase"
            >
              Consultation
            </Link>
          </div>
        </nav>

        {/* Page Yield */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Cohesive Footer */}
        <footer className="bg-[#030509] border-t border-[#C89B3C]/10 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <p className="text-xs text-[#C89B3C]/60 font-light tracking-[0.25em] uppercase mb-3">
              Eurosoft Innovations
            </p>
            <p className="text-[11px] text-gray-600 font-light tracking-wide">
              © {new Date().getFullYear()} Vikram Singh. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}