import React from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Car, 
  Bike, 
  ShieldCheck, 
  X,
  Clock,
  Droplets,
  CalendarCheck,
  Navigation,
  Compass
} from 'lucide-react';
import { CATEGORIES, BENGALURU_LOCALITIES } from '../data/mockData';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocality,
  setSelectedLocality,
  userLocation,
  onRequestGpsLocation,
  gpsLoading
}) {
  return (
    <div className="relative bg-gradient-to-b from-brand-800 via-slate-900 to-slate-900 text-white pt-8 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-6 overflow-hidden">
      
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Top Badges: Haversine GPS location indicator */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-cyan-300 shadow-xs">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bengaluru Auto Wash Booking</span>
          </div> */}

          {/* Interactive GPS Button / Pill (Requirement #1) */}
          <button
            type="button"
            onClick={onRequestGpsLocation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-xs font-bold text-emerald-300 shadow-xs transition cursor-pointer"
            title="Recalculate Haversine distances based on your coordinates"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>
              {gpsLoading 
                ? 'Acquiring GPS...' 
                : userLocation?.label 
                ? `Near: ${userLocation.label}` 
                : 'Detect My Location'}
            </span>
          </button>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6 leading-tight">
          Book Guaranteed Slots for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-brand-400 bg-clip-text text-transparent">
            Car & Bike Washes in Bengaluru
          </span>
        </h1>

        {/* Subtitle */}
        {/* <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8 sm:mb-10 font-normal">
          Skip weekend bay queues in HSR, Indiranagar, and Koramangala. Pre-book vetted water-recycling detailing studios with real-time GPS distances.
        </p> */}

        {/* Integrated Search Box */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xl shadow-brand-950/50 border border-white/20 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
            
            {/* Search Input: Name or Location */}
            <div className="md:col-span-7 flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/80">
              <Search className="w-5 h-5 text-brand-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search center name (e.g. GreenSpark) or area..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bengaluru Locality Selector Dropdown */}
            <div className="md:col-span-5 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/80">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {BENGALURU_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc} className="text-slate-800">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Quick Category Filter Pills */}
        

        {/* Trust Points Counter */}
        <div className="mt-3 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap- text-xs font-medium text-slate-500">
          {/* <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Haversine GPS Distances</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Dynamic Bay Slot Capacity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Customer-Held OTP Lock</span>
          </div> */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                {cat.id === 'car' && <Car className="w-4 h-4" />}
                {cat.id === 'bike' && <Bike className="w-4 h-4" />}
                {cat.id === 'foam' && <ShieldCheck className="w-4 h-4" />}
                {cat.id === 'all' && <Sparkles className="w-4 h-4" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
        </div>

      </div>
    </div>
  );
}
