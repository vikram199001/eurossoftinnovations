"use client";

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    
    try {
      // Free endpoint from web3forms.com or formspree.io
      // Replace 'YOUR_ACCESS_KEY_HERE' with your free key from their website
      formData.append("access_key", "YOUR_ACCESS_KEY_HERE"); 
      formData.append("subject", "New Eurosoft Innovations Inquiry");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-in fade-in duration-700">
      
      {/* Title Header */}
      <div className="mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C89B3C] block mb-3">Get in Touch</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">Initiate a Consultation</h1>
        <p className="text-gray-400 font-light mt-4 max-w-xl text-sm md:text-base">
          Connect directly for business opportunities, full-stack architectural strategies, or long-term contract alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Communication Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp Card */}
          <a 
            href="https://wa.me/31644805658" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-6 bg-[#04080F] border border-white/5 hover:border-[#C89B3C]/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#060B13] border border-[#C89B3C]/20 text-[#C89B3C]">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#C89B3C]/70">WhatsApp Business</p>
                <p className="text-gray-200 font-mono text-sm tracking-wide mt-1">+31 6 44805658</p>
              </div>
              <ArrowRight size={16} className="text-gray-500 ml-auto group-hover:translate-x-1 transition-transform group-hover:text-[#C89B3C]" />
            </div>
          </a>

          {/* Email Card */}
          <a 
            href="mailto:info@eurosoftvision.com" 
            className="block p-6 bg-[#04080F] border border-white/5 hover:border-[#C89B3C]/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#060B13] border border-[#C89B3C]/20 text-[#C89B3C]">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#C89B3C]/70">Corporate Email</p>
                <p className="text-gray-200 text-sm mt-1">info@eurosoftvision.com</p>
              </div>
              <ArrowRight size={16} className="text-gray-500 ml-auto group-hover:translate-x-1 transition-transform group-hover:text-[#C89B3C]" />
            </div>
          </a>

        </div>

        {/* Right Column: Premium Secured Contact Form */}
        <div className="lg:col-span-7 bg-[#04080F] border border-white/5 p-8 shadow-xl shadow-black/40">
          <h2 className="text-lg font-medium text-white mb-6 tracking-wide">Transmission Portal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-light">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-[#060B13] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C89B3C] font-light transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-light">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-[#060B13] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C89B3C] font-light transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-400 font-light">Subject / Project Scope</label>
              <input 
                type="text" 
                name="project_subject" 
                required 
                className="w-full bg-[#060B13] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C89B3C] font-light transition-colors"
                placeholder="Full-Stack Web Development Consultation"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-400 font-light">Message Detail</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                className="w-full bg-[#060B13] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C89B3C] font-light transition-colors resize-none"
                placeholder="Outline your layout requirements or operational needs..."
              ></textarea>
            </div>

            {/* Notification Messaging Alerts */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-3 text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 p-4 text-sm font-light">
                <CheckCircle2 size={16} /> Data sent successfully. We will follow up soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-3 text-rose-400 bg-rose-950/20 border border-rose-500/20 p-4 text-sm font-light">
                <AlertCircle size={16} /> Error deploying message. Please try WhatsApp.
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#C89B3C] text-[#060B13] hover:bg-white hover:text-[#060B13] disabled:bg-gray-700 disabled:text-gray-400 transition-all duration-500 py-4 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Transmitting Data...' : 'Dispatch Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}