import React from 'react';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import { BENGALURU_LOCALITIES } from '../data/mockData';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* Top Banner with Why Bengaluru Chooses WashSlot */}
      <div id="how-it-works" className="border-b border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm">01</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Pick Bay & Slot</h4>
              <p className="text-xs text-slate-400">Choose from top Bengaluru studios in HSR, Indiranagar, or Koramangala.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm">02</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Get 4-Digit OTP</h4>
              <p className="text-xs text-slate-400">Instant reservation code locks your bay time. No waiting in traffic or queues.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm">03</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Drive In & Relax</h4>
              <p className="text-xs text-slate-400">Operator verifies your OTP, begins express eco-foam wash in air-conditioned lounge.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">
                Wash<span className="text-brand-400">Slot</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bengaluru's premier hyperlocal online booking platform for car washes, bike spa, and interior detailing.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BWSSB-compliant water recycling</span>
            </div>
          </div>

          {/* Bengaluru Coverage Hubs */}
          <div id="localities" className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Areas Covered Across Bengaluru
            </h5>
            <div className="flex flex-wrap gap-2">
              {BENGALURU_LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 rounded-lg border border-slate-700/60 inline-flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-brand-400" />
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Vendor Partnership */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Partner with Us
            </h5>
            <p className="text-xs text-slate-400">
              Own a washing studio or detailing garage in Bengaluru?
            </p>
            <div className="space-y-1 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                <span>+91 80 4912 3400</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>partner@washslot.blr</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} WashSlot Bengaluru. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted for Bengaluru car & bike enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
