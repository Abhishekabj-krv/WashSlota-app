import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BENGALURU_LOCALITIES } from '../data/mockData';
import { BENGALURU_AREA_COORDINATES, resolveCoordinates, DEFAULT_BENGALURU_COORDS } from '../utils/distance';
import { 
  X, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  KeyRound, 
  IndianRupee, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Compass,
  Navigation
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    label: 'Modern Detailing Bay',
    url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'High-Pressure Foam Ramp',
    url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Luxury Auto Studio',
    url: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Steam & Eco Wash Hub',
    url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function AddCenterModal({ isOpen, onClose, onCenterAdded }) {
  const { addCenter } = useApp();

  const [name, setName] = useState('');
  const [localityMode, setLocalityMode] = useState('preset'); // 'preset' | 'custom'
  const [locality, setLocality] = useState('HSR Layout');
  const [customLocality, setCustomLocality] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('+91 98450 ');
  const [timings, setTimings] = useState('08:00 AM - 08:30 PM');
  const [vendorPin, setVendorPin] = useState('1234');
  const [startingPrice, setStartingPrice] = useState(249);
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter center name');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter street address');
      return;
    }
    if (localityMode === 'custom' && !customLocality.trim()) {
      setErrorMsg('Please enter custom area name or switch to predefined zone');
      return;
    }

    setErrorMsg('');

    const finalLocality = localityMode === 'custom' ? customLocality.trim() : locality;
    const coords = resolveCoordinates(finalLocality, customLat, customLon);

    const newCenter = addCenter({
      name: name.trim(),
      locality: finalLocality,
      latitude: coords.latitude,
      longitude: coords.longitude,
      maxCapacityPerSlot: 2,
      address: address.trim(),
      landmark: landmark.trim() || 'Near Main Junction',
      phone: phone.trim() || '+91 98450 00000',
      timings: timings.trim() || '08:00 AM - 08:30 PM',
      vendorPin: vendorPin.trim() || '1234',
      startingPrice: Number(startingPrice) || 249,
      image: selectedImage,
      coverImage: selectedImage
    });

    setSuccessMsg(`"${newCenter.name}" onboarded successfully!`);

    setTimeout(() => {
      setSuccessMsg('');
      if (onCenterAdded) onCenterAdded(newCenter);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-yellow-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Super Admin Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Onboard New Washing Center
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Center Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Washing Center Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ApexAuto Hydro Detailing Studio"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-semibold text-slate-900"
              />
            </div>

            {/* Locality Selector / Custom Area Mode (Requirement #2) */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Bengaluru Locality / Area <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setLocalityMode('preset')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      localityMode === 'preset'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Predefined Zone
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalityMode('custom')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      localityMode === 'custom'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Custom Area
                  </button>
                </div>
              </div>

              {localityMode === 'preset' ? (
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-xs sm:text-sm font-semibold text-slate-900 cursor-pointer"
                >
                  {BENGALURU_LOCALITIES.filter(l => l !== 'All Bengaluru' && l !== 'All Localities').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  placeholder="e.g. Sarjapur Road, Kalyan Nagar, Bannerghatta..."
                  required={localityMode === 'custom'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 bg-purple-50/30 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-semibold text-slate-900"
                />
              )}
            </div>

            {/* Latitude & Longitude Inputs (Requirement #2) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GPS Latitude (°N)
              </label>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder={localityMode === 'preset' ? (BENGALURU_AREA_COORDINATES[locality]?.latitude || '12.9716').toString() : '12.9716'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-mono text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Auto-defaults to Central BLR ({DEFAULT_BENGALURU_COORDS.latitude}° N) if blank
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GPS Longitude (°E)
              </label>
              <input
                type="number"
                step="0.0001"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                placeholder={localityMode === 'preset' ? (BENGALURU_AREA_COORDINATES[locality]?.longitude || '77.5946').toString() : '77.5946'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-mono text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Auto-defaults to Central BLR ({DEFAULT_BENGALURU_COORDS.longitude}° E) if blank
              </span>
            </div>

            {/* Starting Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Starting Wash Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="99"
                step="10"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-semibold text-slate-900"
              />
            </div>

            {/* Street Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. #78, 17th Cross, Sector 6, HSR Layout, Bengaluru - 560102"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm text-slate-900"
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite BDA Complex"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm text-slate-900"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Center Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm text-slate-900"
              />
            </div>

            {/* Operating Hours */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operating Timings
              </label>
              <input
                type="text"
                value={timings}
                onChange={(e) => setTimings(e.target.value)}
                placeholder="08:00 AM - 08:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm text-slate-900"
              />
            </div>

            {/* Vendor Access Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vendor Access PIN / Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={vendorPin}
                onChange={(e) => setVendorPin(e.target.value)}
                placeholder="1234"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/40 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-mono font-bold text-purple-900 tracking-wider"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Used by the studio operator to log in.
              </span>
            </div>

            {/* Image Selection Presets */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Studio Photo Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition relative ${
                      selectedImage === img.url ? 'border-purple-600 shadow-md' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-16 object-cover" />
                    <span className="text-[10px] font-bold text-center block py-1 bg-white truncate px-1">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish & Activate Center</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
