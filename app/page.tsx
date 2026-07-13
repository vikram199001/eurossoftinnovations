import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Cpu, Terminal, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <header className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
        
        {/* Animated Hero Banner Display */}
        <div className="relative w-full max-w-4xl mx-auto mb-16 group">
          {/* Ambient Gold Glow Animation Behind the Banner */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#C89B3C]/30 via-[#C89B3C]/10 to-[#C89B3C]/30 rounded-sm blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
          
          {/* Main Banner Container with Floating Animation */}
          <div className="relative w-full shadow-2xl shadow-black/90 rounded-sm overflow-hidden border border-[#C89B3C]/30 bg-[#04080F] transition-transform duration-700 hover:scale-[1.01] animate-[bounce_6s_ease-in-out_infinite]">
            <Image 
              src="/IMG_4856.jpg" 
              alt="Eurosoft Innovations Banner" 
              width={1600} 
              height={900} 
              className="w-full h-auto object-cover transform transition-transform duration-700"
              priority
            />
          </div>
        </div>

        {/* Typography & Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-[#C89B3C]/30"></div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C89B3C]">Excellence in Engineering</span>
          <div className="h-[1px] w-12 bg-[#C89B3C]/30"></div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-light tracking-tight max-w-4xl leading-tight mb-8 text-gray-100">
          Architecting <span className="font-serif italic text-[#C89B3C]">Exclusive</span> Digital Ecosystems.
        </h1>
        
        <p className="text-gray-400 text-base md:text-lg max-w-2xl font-light mb-12 leading-relaxed">
          Delivering bespoke software development, highly structured codebases, and premium technical solutions tailored for the highest standards.
        </p>
        
        <div className="flex flex-wrap gap-6 justify-center mb-24">
          <Link 
            href="/services" 
            className="bg-[#C89B3C] text-[#060B13] hover:bg-white hover:text-[#060B13] transition-all duration-500 px-8 py-4 text-xs font-semibold tracking-widest uppercase"
          >
            Explore Capabilities
          </Link>
          <Link 
            href="/about" 
            className="bg-transparent border border-gray-700 text-gray-300 hover:border-[#C89B3C] hover:text-[#C89B3C] transition-all duration-500 px-8 py-4 text-xs font-semibold tracking-widest uppercase"
          >
            The Founder
          </Link>
        </div>
      </header>

      {/* Architectural Pillars */}
      <section className="w-full bg-[#04080F] border-y border-[#C89B3C]/10 py-20 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C89B3C] block mb-3">The Blueprint</span>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white">Our Engineering Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-white/5 p-8 bg-[#060B13]/60 hover:border-[#C89B3C]/30 transition-all duration-300">
              <Terminal className="text-[#C89B3C] mb-6" size={24} />
              <h3 className="text-lg font-medium text-gray-200 mb-3">Flawless Structural Integrity</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                We design clean, typed, and modular system layouts built strictly for maintainability. Codebases are organized logically so your application scales elegantly without technical debt.
              </p>
            </div>

            <div className="border border-white/5 p-8 bg-[#060B13]/60 hover:border-[#C89B3C]/30 transition-all duration-300">
              <Cpu className="text-[#C89B3C] mb-6" size={24} />
              <h3 className="text-lg font-medium text-gray-200 mb-3">Performance-First Engineering</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Minimizing load latency and maximizing server response cycles. Through aggressive caching, asset optimization, and lean dependencies, we ensure unmatched speed.
              </p>
            </div>

            <div className="border border-white/5 p-8 bg-[#060B13]/60 hover:border-[#C89B3C]/30 transition-all duration-300">
              <span className="text-[#C89B3C] mb-6 block"><Shield size={24} /></span>
              <h3 className="text-lg font-medium text-gray-200 mb-3">Premium UX Customization</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Your frontend architecture is your digital signature. Every transition, custom component, layout breakpoint, and interface layout is engineered to fit absolute premium standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Call to Action */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-6">
          Ready to build something exceptional?
        </h2>
        <p className="text-gray-400 font-light max-w-xl mx-auto mb-8 text-sm md:text-base">
          From robust multi-tier web platforms to highly custom dynamic client dashboards, Eurosoft Innovations turns complexity into flawless real-world applications.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-3 border border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#060B13] transition-all duration-500 px-8 py-4 text-xs font-semibold tracking-widest uppercase group"
        >
          Initiate Consultation
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer Copyright */}
      <footer className="w-full bg-[#030509] border-t border-[#C89B3C]/10 py-8 text-center text-xs text-gray-600 font-light">
        © {new Date().getFullYear()} Vikram Singh. All rights reserved.
      </footer>

    </div>
  );
}