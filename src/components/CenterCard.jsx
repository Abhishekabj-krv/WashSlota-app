import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Car, 
  Bike,
  Sparkles,
  Navigation
} from 'lucide-react';
import { formatDistance } from '../utils/distance';

export default function CenterCard({ center }) {
  const displayDistance = center.calculatedDistance !== undefined && center.calculatedDistance !== null
    ? formatDistance(center.calculatedDistance)
    : (center.distance || 'Bengaluru');

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Center Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={center.image}
          alt={center.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span className="text-xs font-bold text-slate-800">{center.rating}</span>
          <span className="text-[11px] text-slate-500 font-medium">({center.reviewsCount})</span>
        </div>

        {/* Locality Tag */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>{center.locality}</span>
        </div>

        {/* Distance & Real-Time Availability Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span className="font-bold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10 text-cyan-200">
            <Navigation className="w-3 h-3 text-cyan-400" />
            <span>{displayDistance}</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 bg-emerald-950/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {center.slotsAvailableToday || 8} slots left today
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Tagline */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {center.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {center.tagline}
            </p>
          </div>

          {/* Address */}
          <p className="text-xs text-slate-500 flex items-start gap-1 mb-3 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{center.address}</span>
          </p>

          {/* Quick Service Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {center.services.slice(0, 3).map((srv) => (
              <span
                key={srv.id}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
              >
                {srv.vehicleType === 'Car' ? (
                  <Car className="w-3 h-3 text-brand-600" />
                ) : srv.vehicleType === 'Bike' ? (
                  <Bike className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-600" />
                )}
                <span className="truncate max-w-[120px]">{srv.title.split(' ')[0]}</span>
                <span className="font-bold text-slate-900">₹{srv.price}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Starting Price & Book Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Starts from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">₹{center.startingPrice}</span>
              <span className="text-xs text-slate-500">/wash</span>
            </div>
          </div>

          <Link
            to={`/center/${center.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all group-hover:translate-x-0.5"
          >
            <span>Book Slot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
