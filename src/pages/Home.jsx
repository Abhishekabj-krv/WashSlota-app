import React, { useState, useEffect, useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import CenterList from '../components/CenterList';
import { useApp } from '../context/AppContext';
import { getDistanceInKm, DEFAULT_BENGALURU_COORDS } from '../utils/distance';
import { 
  ShieldCheck, 
  Clock, 
  Droplet, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Zap,
  Navigation
} from 'lucide-react';

export default function Home() {
  const { centers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('All Bengaluru');

  // Haversine GPS Location State (Requirement #1)
  const [userLocation, setUserLocation] = useState(DEFAULT_BENGALURU_COORDS);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Default Central Bengaluru');

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState(0);

  // Request browser geolocation on mount
  useEffect(() => {
    requestBrowserLocation();
  }, []);

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation unsupported; using Central Bengaluru fallback');
      setUserLocation(DEFAULT_BENGALURU_COORDS);
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: 'Current GPS Location',
          isGps: true
        });
        setLocationStatus('GPS Coordinates active');
      },
      (error) => {
        setGpsLoading(false);
        console.warn('Geolocation permission denied or timed out:', error.message);
        // Fallback gracefully to default Bengaluru coordinates (Requirement #1)
        setUserLocation(DEFAULT_BENGALURU_COORDS);
        setLocationStatus('Location access denied; using Central Bengaluru fallback');
      },
      { timeout: 7000, maximumAge: 60000 }
    );
  };

  // Compute Haversine distance for each active center
  const centersWithDistance = useMemo(() => {
    return centers
      .filter((c) => c.status !== 'inactive')
      .map((center) => {
        const centerLat = center.latitude || 12.9716;
        const centerLon = center.longitude || 77.5946;

        const distanceInKm = getDistanceInKm(
          userLocation.latitude,
          userLocation.longitude,
          centerLat,
          centerLon
        );

        return {
          ...center,
          calculatedDistance: distanceInKm
        };
      });
  }, [centers, userLocation]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocality('All Bengaluru');
  };

  const faqs = [
    {
      q: "How does the Haversine distance calculation work?",
      a: "WashSlot calculates straight-line spherical distance between your GPS coordinates and each washing center's hydraulic bay in Bengaluru. When you sort by 'Nearest First', studios closest to you appear at the top."
    },
    {
      q: "How does the Customer-Held OTP Verification work?",
      a: "For maximum security, your 4-digit OTP is strictly customer-held and never visible to the vendor until you arrive. Once the center accepts your slot, your OTP is unlocked. Show this code to the bay operator to begin your wash."
    },
    {
      q: "Why are some bay slots marked 'SLOT FULL'?",
      a: "To guarantee zero queue and optimal water pressure, each washing center maintains a strict capacity (typically 2 vehicles per timeslot). Once all bays for a slot are booked, the system automatically locks it."
    },
    {
      q: "Who is allowed to write customer reviews?",
      a: "Only verified customers who have booked and completed a wash service at a center can submit reviews and star ratings. This prevents fake reviews and ensures 100% genuine feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Hero Section with GPS Location Integration */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocality={selectedLocality}
        setSelectedLocality={setSelectedLocality}
        userLocation={userLocation}
        onRequestGpsLocation={requestBrowserLocation}
        gpsLoading={gpsLoading}
      />

      {/* Main Washing Centers List with Haversine Distances */}
      <CenterList
        centers={centersWithDistance}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedLocality={selectedLocality}
        userLocation={userLocation}
        onResetFilters={handleResetFilters}
      />

      {/* Bengaluru Hyperlocal Features Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
              Enterprise Auto Detailing Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Guaranteed Bays, Real-Time Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Combining GPS proximity with bay slot capacity limits and customer-held OTP security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-brand-300 transition shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center mb-4">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Haversine GPS Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes straight-line distance to every bay in Bengaluru and dynamically sorts nearest studios first.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-brand-300 transition shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dynamic Slot Capacity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents bay overcrowding. Slots automatically lock as "SLOT FULL" once maximum bay capacity is reached.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-brand-300 transition shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Customer-Held OTP & Verified Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                OTPs remain private with the customer until arrival. Reviews can only be submitted following verified completed washes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-world booking rules and platform operations across Bengaluru
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-900 hover:text-brand-600 transition"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-brand-600 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
