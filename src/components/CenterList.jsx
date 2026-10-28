import React, { useState, useMemo } from 'react';
import CenterCard from './CenterCard';
import { SlidersHorizontal, AlertCircle, RotateCcw, Navigation } from 'lucide-react';

export default function CenterList({
  centers,
  searchQuery,
  selectedCategory,
  selectedLocality,
  userLocation,
  onResetFilters
}) {
  const [sortBy, setSortBy] = useState('nearest'); // default to 'nearest' for GPS-driven hyperlocal experience

  // Filter centers based on search query, locality, and category
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      // 1. Locality Filter (Supports 'All Bengaluru' and individual hubs)
      if (selectedLocality && selectedLocality !== 'All Bengaluru' && selectedLocality !== 'All Localities') {
        if (center.locality.toLowerCase() !== selectedLocality.toLowerCase()) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory && selectedCategory !== 'all') {
        if (!center.categories.includes(selectedCategory)) {
          return false;
        }
      }

      // 3. Search Query Filter (Name or Location / Area)
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchName = center.name.toLowerCase().includes(query);
        const matchLocality = center.locality.toLowerCase().includes(query);
        const matchAddress = center.address.toLowerCase().includes(query);
        const matchService = center.services && Array.isArray(center.services) ? center.services.some((s) =>
          s.title.toLowerCase().includes(query)
        ) : false;

        if (!matchName && !matchLocality && !matchAddress && !matchService) {
          return false;
        }
      }

      return true;
    });
  }, [centers, searchQuery, selectedCategory, selectedLocality]);

  // Sort filtered results
  const sortedCenters = useMemo(() => {
    const list = [...filteredCenters];
    if (sortBy === 'nearest') {
      return list.sort((a, b) => {
        const distA = a.calculatedDistance !== undefined && a.calculatedDistance !== null ? a.calculatedDistance : 999;
        const distB = b.calculatedDistance !== undefined && b.calculatedDistance !== null ? b.calculatedDistance : 999;
        return distA - distB;
      });
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.startingPrice - b.startingPrice);
    }
    // Recommended / default order
    return list;
  }, [filteredCenters, sortBy]);

  return (
    <section id="centers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Header bar with results count and sort selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Washing Centers Near You
            </h2>
            {userLocation && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <Navigation className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>GPS</span>{/*Distance Active*/}
              </span>
            )}
          </div>
          {/* <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-900">{sortedCenters.length}</span> verified washing studios
            {selectedLocality !== 'All Bengaluru' && selectedLocality !== 'All Localities' && (
              <span> in <strong className="text-brand-600">{selectedLocality}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-brand-600">{searchQuery}</strong>"</span>
            )}
          </p> */}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-brand-500 shadow-2xs"
          >
            <option value="nearest">Nearest First (GPS)</option>
            <option value="rating">Highest Rated (★ 4.8+)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="recommended">Recommended</option>
          </select>
        </div>
      </div>

      {/* Grid of Washing Centers */}
      {sortedCenters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {sortedCenters.map((center) => (
            <CenterCard key={center.id} center={center} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 text-center max-w-lg mx-auto my-12 shadow-xs">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          {centers.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No washing studios onboarded yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
                The database is in clean production state. Platform administrators can onboard Bengaluru washing studios via the Founder Portal.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No centers match your filters</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                We couldn't find any centers matching your filters. Try switching locality to "All Localities" or clear your search term.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </>
          )}
        </div>
      )}

    </section>
  );
}
