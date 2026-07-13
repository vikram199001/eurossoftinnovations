import React from 'react';
import { Layers, Code2, Cpu, Smartphone } from 'lucide-react';

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C89B3C] block mb-3">Expertise</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">Core Capabilities</h1>
      </div>
      
      {/* Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        <div className="bg-[#04080F] border border-white/5 p-8 hover:border-[#C89B3C]/30 transition-all duration-300">
          <Layers className="text-[#C89B3C] mb-6" size={28} />
          <h3 className="text-xl font-medium text-white mb-3">Full-Stack Development</h3>
          <p className="text-gray-400 font-light leading-relaxed text-sm">
            Complete product architecture handling robust server-side logic, high-performance databases, and fluid client-side interfaces seamlessly.
          </p>
        </div>
        <div className="bg-[#04080F] border border-white/5 p-8 hover:border-[#C89B3C]/30 transition-all duration-300">
          <Code2 className="text-[#C89B3C] mb-6" size={28} />
          <h3 className="text-xl font-medium text-white mb-3">Front-End Engineering</h3>
          <p className="text-gray-400 font-light leading-relaxed text-sm">
            Crafting highly interactive, pixel-perfect, and ultra-responsive user interfaces using modern state-management frameworks.
          </p>
        </div>
        <div className="bg-[#04080F] border border-white/5 p-8 hover:border-[#C89B3C]/30 transition-all duration-300">
          <Cpu className="text-[#C89B3C] mb-6" size={28} />
          <h3 className="text-xl font-medium text-white mb-3">Custom Web Applications</h3>
          <p className="text-gray-400 font-light leading-relaxed text-sm">
            Tailored software built for specific business logic and scale requirements, including enterprise back-offices and modern platforms.
          </p>
        </div>
        <div className="bg-[#04080F] border border-white/5 p-8 hover:border-[#C89B3C]/30 transition-all duration-300">
          <Smartphone className="text-[#C89B3C] mb-6" size={28} />
          <h3 className="text-xl font-medium text-white mb-3">3D Integration & Web Experiences</h3>
          <p className="text-gray-400 font-light leading-relaxed text-sm">
            Merging traditional web systems with advanced immersive capabilities like real-time interactive 3D product configurators.
          </p>
        </div>
      </div>

      {/* Technical Ecosystem Grid with Icons */}
      <div className="border-t border-[#C89B3C]/10 pt-20">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C89B3C] text-center mb-12">The Technical Ecosystem</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          
          {/* React */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-[#61DAFB] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 115.3 100" fill="currentColor">
              <path d="M57.7 20c-15.6 0-31.5 3.7-44.4 10.3C1.6 36 0 41.5 0 45.4v9.1c0 3.9 1.6 9.4 13.3 15.2 12.9 6.6 28.8 10.3 44.4 10.3s31.5-3.7 44.4-10.3c11.7-5.8 13.3-11.3 13.3-15.2v-9.1c0-3.9-1.6-9.4-13.3-15.2C89.2 23.7 73.3 20 57.7 20zm0 65c-14.3 0-29.3-3.4-41.5-9.6C7.2 69.8 4 64.9 4 59.9v-4.9c0-5 3.2-9.9 12.2-14.5C28.4 37.4 43.4 34 57.7 34s29.3 3.4 41.5 9.6c9 4.6 12.2 9.5 12.2 14.5v4.9c0 5-3.2 9.9-12.2 14.5-12.2 6.2-27.2 9.6-41.5 9.6z"/>
              <circle cx="57.7" cy="50" r="10.8"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider">React</span>
          </div>

          {/* Next.js */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="currentColor">
              <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm31.7 101.4L44.8 38.4H36.4v51.1h8.2V49.9l46 57.6c3.2-2.1 6.1-4.6 9.1-6.1zM91.6 38.4h8.2v51.1h-8.2V38.4z"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider">Next.js</span>
          </div>

          {/* TypeScript */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-[#3178C6] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="currentColor">
              <path d="M0 0v128h128V0H0zm110.4 105.4H81.3V91.2h15.2V73.4H81.3V60.2h28.1V46.6H66.9v68.3h43.5v-9.5zm-55.8 0H31.1v-9.5h16.2v-24H35.8V60.2h11.5v-13.6h15.3v58.8H54.6z"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider">TypeScript</span>
          </div>

          {/* Vue.js */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-[#41B883] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="currentColor">
              <path d="M0 14.3h22.8l41.2 71.3L105.2 14.3H128L64 113.7 0 14.3z" fill="#41B883"/>
              <path d="M22.8 14.3L64 85.6 105.2 14.3H82.4L64 47.9 45.6 14.3H22.8z" fill="#35495E"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider">Vue.js</span>
          </div>

          {/* Angular */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-[#DD0031] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="currentColor">
              <path d="M64 0L3.3 21.6l9.6 74.8L64 128l51.1-31.6 9.6-74.8L64 0zm37.2 92.5L64 110.8 26.8 92.5l-7.9-61.9L64 16.3l45.1 14.3-7.9 61.9z" fill="#DD0031"/>
              <path d="M64 33.4L37 83.1h13.9l6.5-13.8h13.2l6.5 13.8h13.9L64 33.4zm7.2 28.5H56.8L64 46.8l7.2 15.1z" fill="white"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider">Angular</span>
          </div>

          {/* Node.js */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-[#5FA04E] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="currentColor">
              <path d="M64 4.8L121.6 38v64.1L64 135.3 6.4 102.1V38L64 4.8zm0 10.7L15.3 43.1v49.8L64 121.9l48.7-29V43.1L64 15.5zm4.8 26.5l35.8 20.7v23.9L68.8 93.3 33 72.6V48.7l35.8-20.7z"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider">Node.js</span>
          </div>

          {/* Tailwind & SCSS */}
          <div className="bg-[#04080F] border border-white/5 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#C89B3C]/30 transition-all duration-300 group">
            <svg className="w-8 h-8 text-[#38BDF8] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="currentColor">
              <path d="M64 32c-16 0-24 8-28 24 6-12 15-16 27-12 8 3 13.8 8.7 17 12 7.2 7.2 16.5 11.2 29 11.2 16 0 24-8 28-24-6 12-15 16-27 12-8-3-13.8-8.7-17-12-7.2-7.2-16.5-11.2-29-11.2zM36 56c-16 0-24 8-28 24 6-12 15-16 27-12 8 3 13.8 8.7 17 12 7.2 7.2 16.5 11.2 29 11.2 16 0 24-8 28-24-6 12-15 16-27 12-8-3-13.8-8.7-17-12-7.2-7.2-16.5-11.2-29-11.2z"/>
            </svg>
            <span className="text-[11px] font-light text-gray-300 tracking-wider text-center">Tailwind & SCSS</span>
          </div>

        </div>
      </div>

    </div>
  );
}