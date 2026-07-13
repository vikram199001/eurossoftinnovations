import React from 'react';
import Image from 'next/image';
import { Layers, CheckCircle2, Award, Code2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 animate-in fade-in duration-700">
      
      {/* Header Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
        
        {/* Sharp Portrait Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[3/4] shadow-2xl shadow-black/80 rounded-sm overflow-hidden border border-[#C89B3C]/30 bg-[#04080F] group">
            <Image 
              src="/0D095967-59D5-4306-A7CA-342E7F5AE206.JPG" 
              alt="Vikram Singh - Founder & Lead Engineer" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transform hover:scale-[1.02] transition-all duration-1000 ease-out"
              priority
            />
          </div>
        </div>

        {/* Written Dossier Column */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C89B3C] font-medium block">The Architect</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">Vikram Singh</h1>
          <p className="text-base text-[#C89B3C] tracking-widest uppercase font-light">Founder & Principal Full-Stack Engineer</p>
          
          <div className="h-[1px] w-20 bg-[#C89B3C]/40 my-4"></div>

          <p className="text-gray-300 font-light text-base leading-relaxed">
            With over seven years of deep full-stack engineering expertise, I anchor the technical execution at Eurosoft Innovations. I specialize in translating complex architectural demands into highly responsive, scalable, and secure production environments. 
          </p>
          <p className="text-gray-400 font-light text-sm leading-relaxed">
            My engineering philosophy centers around strict code accountability, modular design principles, and an uncompromised standard for runtime optimization. By taking absolute ownership of the entire lifecycle—from layout conceptualization to deployment pipeline strategy—I strip out system overhead to deliver high-performance applications tailored precisely to your operational goals.
          </p>
        </div>
      </div>

      {/* Expertise Ecosystem Grid */}
      <div className="border-t border-[#C89B3C]/10 pt-20 mb-20">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C89B3C] block mb-2">Capabilities Matrix</span>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">Core Pillars of Expertise</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#04080F] border border-white/5 p-6 hover:border-[#C89B3C]/20 transition-all duration-300">
            <div className="flex items-center gap-3 text-white font-medium mb-3">
              <Code2 size={18} className="text-[#C89B3C]" />
              <h3>Advanced Front-End Architecture</h3>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Crafting fluid, deterministic client-side states using React, Next.js, and TypeScript. Expert in semantic UI composition, customized rendering layers, and optimizing Core Web Vitals.
            </p>
          </div>

          <div className="bg-[#04080F] border border-white/5 p-6 hover:border-[#C89B3C]/20 transition-all duration-300">
            <div className="flex items-center gap-3 text-white font-medium mb-3">
              <Layers size={18} className="text-[#C89B3C]" />
              <h3>Full-Stack Systems Architecture</h3>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Designing modular microservices and web apps using the MERN stack and clean server platforms. Engineering type-safe REST/GraphQL data layers with secure authentication channels.
            </p>
          </div>

          <div className="bg-[#04080F] border border-white/5 p-6 hover:border-[#C89B3C]/20 transition-all duration-300">
            <div className="flex items-center gap-3 text-white font-medium mb-3">
              <Award size={18} className="text-[#C89B3C]" />
              <h3>Interactive Immersive Environments</h3>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Bridging advanced web environments with creative capabilities, including real-time mathematical layouts and complex 3D interactive application modules.
            </p>
          </div>

          <div className="bg-[#04080F] border border-white/5 p-6 hover:border-[#C89B3C]/20 transition-all duration-300">
            <div className="flex items-center gap-3 text-white font-medium mb-3">
              <CheckCircle2 size={18} className="text-[#C89B3C]" />
              <h3>System Delivery & Ownership</h3>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Enforcing absolute engineering clarity and precision execution from proof-of-concept wireframing to custom CI/CD build deployment.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}