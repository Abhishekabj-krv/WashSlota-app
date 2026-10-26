import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AddCenterModal from '../components/AddCenterModal';
import { BENGALURU_LOCALITIES } from '../data/mockData';
import { BENGALURU_AREA_COORDINATES, resolveCoordinates, DEFAULT_BENGALURU_COORDS } from '../utils/distance';
import { 
  Crown, 
  Store, 
  Calendar, 
  IndianRupee, 
  Clock, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink, 
  LogOut, 
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Eye,
  Phone,
  MapPin,
  KeyRound,
  Check
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    centers, 
    bookings, 
    addCenter, 
    toggleCenterStatus, 
    currentUser, 
    logoutUser, 
    resetToInitialData,
    loginUser
  } = useApp();

  const navigate = useNavigate();

  // Active dashboard tab: 'overview' | 'add_center' | 'directory'
  const [activeTab, setActiveTab] = useState('overview');
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryLocality, setDirectoryLocality] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for Tab 2 (Inline Add Center Form)
  const [formName, setFormName] = useState('');
  const [formLocalityMode, setFormLocalityMode] = useState('preset'); // 'preset' | 'custom'
  const [formLocality, setFormLocality] = useState('Koramangala');
  const [formCustomLocality, setFormCustomLocality] = useState('');
  const [formCustomLat, setFormCustomLat] = useState('');
  const [formCustomLon, setFormCustomLon] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formPhone, setFormPhone] = useState('+91 98450 33211');
  const [formAdminContact, setFormAdminContact] = useState('+91 98860 12345');
  const [formTimings, setFormTimings] = useState('08:00 AM - 08:30 PM');
  const [formStartingPrice, setFormStartingPrice] = useState(249);
  const [formVendorPin, setFormVendorPin] = useState('1234');
  const [formSuccessNotice, setFormSuccessNotice] = useState('');

  // Platform Metrics
  const totalCentersCount = centers.length;
  const activeCentersCount = centers.filter(c => c.status !== 'inactive').length;
  const totalBookingsCount = bookings.length;
  const activeBookingsCount = bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
  const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  // Directory Filtered Centers
  const filteredCenters = centers.filter((c) => {
    if (directoryLocality !== 'All' && c.locality.toLowerCase() !== directoryLocality.toLowerCase()) {
      return false;
    }
    if (directorySearch.trim() !== '') {
      const q = directorySearch.toLowerCase().trim();
      const matchName = c.name.toLowerCase().includes(q);
      const matchLocality = c.locality.toLowerCase().includes(q);
      const matchAddress = c.address.toLowerCase().includes(q);
      if (!matchName && !matchLocality && !matchAddress) return false;
    }
    return true;
  });

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Inline Form Submit with custom zone and coordinates resolution
  const handleInlineFormSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) return;
    if (formLocalityMode === 'custom' && !formCustomLocality.trim()) return;

    const finalLocality = formLocalityMode === 'custom' ? formCustomLocality.trim() : formLocality;
    const coords = resolveCoordinates(finalLocality, formCustomLat, formCustomLon);

    const created = addCenter({
      name: formName.trim(),
      locality: finalLocality,
      latitude: coords.latitude,
      longitude: coords.longitude,
      maxCapacityPerSlot: 2,
      address: formAddress.trim(),
      landmark: formLandmark.trim() || 'Near Main Road',
      phone: formPhone.trim(),
      adminContactNumber: formAdminContact.trim() || formPhone.trim() || '+91 98860 00000',
      timings: formTimings.trim(),
      vendorPin: formVendorPin.trim() || '1234',
      startingPrice: Number(formStartingPrice) || 249
    });

    setFormSuccessNotice(`"${created.name}" onboarded & live for customers!`);
    setFormName('');
    setFormAddress('');
    setFormLandmark('');
    setFormCustomLocality('');
    setFormCustomLat('');
    setFormCustomLon('');

    setTimeout(() => {
      setFormSuccessNotice('');
      setActiveTab('directory');
    }, 1500);
  };

  // Quick switch into vendor mode for a selected center
  const handleSimulateVendorLogin = (center) => {
    loginUser({
      role: 'vendor',
      name: `${center.name} (Manager)`,
      vendorCenterId: center.id
    });
    navigate('/vendor/orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shadow-xs shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  WashSlot Super Admin Portal
                </h1>
                {/* <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white uppercase tracking-wider shadow-xs">
                  Platform Founder Tier
                </span> */}
              </div>
              {/* <p className="text-xs text-slate-500 mt-0.5">
                Bengaluru Hyperlocal Ecosystem Operations • Founder: <strong className="text-slate-800">{currentUser?.name}</strong>
              </p> */}
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span> Quick Add Center</span>
            </button> */}

            <Link
              to="/"
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-600" />
              <span>Customer Home</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 3 Main Tabs Navigation */}
        <div className="flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300 self-start text-xs sm:text-sm font-bold w-full sm:w-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add_center')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'add_center'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Center</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vendor Directory ({centers.length})</span>
          </button>
        </div>

        {/* TAB 1: PLATFORM OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Core Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Centers</span>
                  <Store className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">{totalCentersCount}</span>
                  <span className="text-xs text-emerald-600 font-bold">({activeCentersCount} active)</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Bengaluru Bay Studios</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
                  <Calendar className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">{totalBookingsCount}</span>
                  <span className="text-xs text-slate-500">all time</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Vehicles washed or queued</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-amber-700 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Bookings</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-amber-600">{activeBookingsCount}</span>
                  <span className="text-xs text-slate-500">pending/accepted</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Live bay slots reserved</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-emerald-700 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Gross Platform GMV</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600">₹{totalRevenue}</span>
                  <span className="text-xs text-slate-500">cleared</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">{completedBookingsCount} completed washes</span>
              </div>

            </div>

            {/* Platform Recent Activity & Center Performance Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Recent Platform Bookings */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Live Platform Bookings Feed
                  </h3>
                  <span className="text-xs text-slate-500">
                    Latest {bookings.slice(0, 5).length} events
                  </span>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 tracking-wider">
                            {b.vehicleNumber}
                          </span>
                          <span className="text-slate-500">({b.customerName})</span>
                        </div>
                        <span className="text-slate-600 block mt-0.5">
                          {b.centerName} • {b.serviceName}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                            b.status === 'completed'
                              ? 'bg-cyan-100 text-cyan-800'
                              : b.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-slate-900 block font-bold mt-0.5">₹{b.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Bengaluru Coverage Hubs & Status */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">
                  Centers Coverage by Locality
                </h3>
                
                <div className="space-y-2.5">
                  {BENGALURU_LOCALITIES.filter(l => l !== 'All Bengaluru' && l !== 'All Localities').map((loc) => {
                    const count = centers.filter(c => c.locality.toLowerCase() === loc.toLowerCase()).length;
                    return (
                      <div
                        key={loc}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-xs"
                      >
                        <span className="font-semibold text-slate-700">{loc}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-700">{count} studios</span>
                          <span className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ADD NEW CENTER FORM */}
        {activeTab === 'add_center' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-sm animate-in fade-in duration-200">
            <div>
              {/* <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Founder Studio Onboarding
              </span> */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Onboard New Bengaluru Washing Studio
              </h2>
              {/* <p className="text-xs text-slate-500 mt-0.5">
                On submission, this studio is dynamically published to the Customer Home page and available for immediate slot reservations.
              </p> */}
            </div>

            {formSuccessNotice && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{formSuccessNotice}</span>
              </div>
            )}

            <form onSubmit={handleInlineFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Center Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Center Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. ApexAuto Hydro Detailing Studio"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-semibold text-slate-900 shadow-xs"
                  />
                </div>

                {/* Locality Selector / Custom Area Mode */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Bengaluru Locality / Area <span className="text-rose-600">*</span>
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormLocalityMode('preset')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition shadow-xs ${
                          formLocalityMode === 'preset'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Predefined Zone
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormLocalityMode('custom')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition shadow-xs ${
                          formLocalityMode === 'custom'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Custom Area
                      </button>
                    </div>
                  </div>

                  {formLocalityMode === 'preset' ? (
                    <select
                      value={formLocality}
                      onChange={(e) => setFormLocality(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-xs sm:text-sm font-semibold text-slate-900 cursor-pointer shadow-xs"
                    >
                      {BENGALURU_LOCALITIES.filter(l => l !== 'All Bengaluru' && l !== 'All Localities').map((loc) => (
                        <option key={loc} value={loc} className="bg-white text-slate-900">
                          {loc}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formCustomLocality}
                      onChange={(e) => setFormCustomLocality(e.target.value)}
                      placeholder="e.g. Sarjapur Road, Kalyan Nagar, Bannerghatta..."
                      required={formLocalityMode === 'custom'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-semibold text-slate-900 shadow-xs"
                    />
                  )}
                </div>

                {/* Latitude & Longitude Inputs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GPS Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formCustomLat}
                    onChange={(e) => setFormCustomLat(e.target.value)}
                    placeholder={formLocalityMode === 'preset' ? (BENGALURU_AREA_COORDINATES[formLocality]?.latitude || '12.9716').toString() : '12.9716'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-mono text-slate-900 shadow-xs"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
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
                    value={formCustomLon}
                    onChange={(e) => setFormCustomLon(e.target.value)}
                    placeholder={formLocalityMode === 'preset' ? (BENGALURU_AREA_COORDINATES[formLocality]?.longitude || '77.5946').toString() : '77.5946'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-mono text-slate-900 shadow-xs"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Auto-defaults to Central BLR ({DEFAULT_BENGALURU_COORDS.longitude}° E) if blank
                  </span>
                </div>

                {/* Starting Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Starting Wash Price (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="99"
                    step="10"
                    value={formStartingPrice}
                    onChange={(e) => setFormStartingPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-semibold text-slate-900 shadow-xs"
                  />
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Street Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. #92, 100ft Inner Ring Road, Koramangala 4th Block, Bengaluru"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm text-slate-900 shadow-xs"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={formLandmark}
                    onChange={(e) => setFormLandmark(e.target.value)}
                    placeholder="e.g. Near Sony Signal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm text-slate-900 shadow-xs"
                  />
                </div>

                {/* Customer Helpline Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm text-slate-900 shadow-xs"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Public number for customer inquiries
                  </span>
                </div>

                {/* Admin / Operations Contact */}
                <div>
                  <label className="block text-xs font-bold text-purple-700 mb-1">
                    Admin / Operations Contact <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formAdminContact}
                    onChange={(e) => setFormAdminContact(e.target.value)}
                    placeholder="+91 98860 12345"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 bg-purple-50/50 focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-semibold text-slate-900 shadow-xs"
                  />
                  <span className="text-[10px] text-purple-700 mt-0.5 block">
                    Direct mobile of owner/manager for founder escalations
                  </span>
                </div>

                {/* Operating Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={formTimings}
                    onChange={(e) => setFormTimings(e.target.value)}
                    placeholder="08:00 AM - 08:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm text-slate-900 shadow-xs"
                  />
                </div>

                {/* Vendor Access Code */}
                <div>
                  <label className="block text-xs font-bold text-purple-700 mb-1">
                    Vendor Partner Access Code (PIN) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formVendorPin}
                    onChange={(e) => setFormVendorPin(e.target.value)}
                    placeholder="1234"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 bg-purple-50/50 focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-sm font-mono font-bold text-purple-700 tracking-wider shadow-xs"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Operator logs into `/login` with this passcode to verify OTPs.
                  </span>
                </div>

              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish & Add to Customer Network</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: VENDOR & CENTER DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Vendor Studios Directory ({centers.length})
                </h2>
                {/* <p className="text-xs text-slate-500 mt-0.5">
                  Manage active listings, access credentials, and live availability toggles.
                </p> */}
              </div>

              {/* Search & Area Filter Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs shadow-xs">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search studio..."
                    className="bg-transparent text-slate-900 focus:outline-hidden placeholder-slate-400 w-32 sm:w-40"
                  />
                </div>

                <select
                  value={directoryLocality}
                  onChange={(e) => setDirectoryLocality(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-400 cursor-pointer shadow-xs"
                >
                  <option value="All">All Localities</option>
                  {BENGALURU_LOCALITIES.filter(l => l !== 'All Bengaluru' && l !== 'All Localities').map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Studio</span>
                </button>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-3">
              {filteredCenters.map((center) => {
                const isActive = center.status !== 'inactive';
                const centerBookingsCount = bookings.filter((b) => b.centerId === center.id).length;

                return (
                  <div
                    key={center.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={center.image}
                        alt={center.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {center.name}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span>{isActive ? 'Live' : 'Hidden'}</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">{center.locality}</span>
                        </span>
                      </div>
                    </div>

                    {/* Operational Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-purple-700 uppercase font-bold block">
                          Ops / Owner Phone
                        </span>
                        <a
                          href={`tel:${center.adminContactNumber || center.phone}`}
                          className="font-mono font-bold text-slate-900 hover:text-purple-700 flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">{center.adminContactNumber || center.phone}</span>
                        </a>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-amber-700 uppercase font-bold block">
                          Access PIN & Washes
                        </span>
                        <span className="font-mono font-bold text-amber-700 text-xs block mt-0.5">
                          PIN: {center.vendorPin || '1234'} • {centerBookingsCount} booked
                        </span>
                      </div>
                    </div>

                    {/* Actions on Mobile */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleCenterStatus(center.id)}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition text-center shadow-xs ${
                          isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateVendorLogin(center)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs transition shadow-xs"
                      >
                        Bay Terminal
                      </button>

                      <Link
                        to={`/center/${center.id}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 shadow-xs"
                        title="View Studio"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centers Table (Desktop) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-3">Studio Name & Location</th>
                    <th className="py-3 px-3">Admin / Ops Contact</th>
                    <th className="py-3 px-3">Operator Access</th>
                    {/* <th className="py-3 px-3">Starting Price</th> */}
                    <th className="py-3 px-3">Bookings</th>
                    <th className="py-3 px-3">Platform Status</th>
                    <th className="py-3 px-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCenters.map((center) => {
                    const isActive = center.status !== 'inactive';
                    const centerBookingsCount = bookings.filter((b) => b.centerId === center.id).length;

                    return (
                      <tr key={center.id} className="hover:bg-slate-50/80 transition">
                        {/* Name & Location */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={center.image}
                              alt={center.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                            />
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">
                                {center.name}
                              </span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-purple-600" />
                                {center.locality} • {center.address}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Admin / Owner Contact */}
                        <td className="py-4 px-3">
                          <a
                            href={`tel:${center.adminContactNumber || center.phone}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-mono font-bold text-xs hover:bg-purple-100 transition shadow-xs"
                            title="Direct call to Studio Owner"
                          >
                            <Phone className="w-3 h-3 text-purple-600 shrink-0" />
                            <span>{center.adminContactNumber || center.phone}</span>
                          </a>
                          {/* <span className="block text-[10px] text-slate-400 mt-0.5">
                            Helpline: {center.phone}
                          </span> */}
                        </td>

                        {/* Vendor Access PIN */}
                        <td className="py-4 px-3">
                          <div className="font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block shadow-xs">
                            <span className="text-[10px] text-slate-400 mr-1.5">PIN:</span>
                            <span className="font-bold text-amber-700">{center.vendorPin || '1234'}</span>
                          </div>
                        </td>

                        {/* Starting Price
                        <td className="py-4 px-3">
                          <span className="font-black text-cyan-700 text-sm">
                            ₹{center.startingPrice}
                          </span>
                          <span className="text-[10px] text-slate-400 block">/wash</span>
                        </td> */}

                        {/* Allocated Bookings */}
                        <td className="py-4 px-3">
                          <span className="font-bold text-slate-800">
                            {centerBookingsCount}
                          </span>
                          <span className="text-[10px] text-slate-400 block">allocated</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span>{isActive ? 'Active (Live)' : 'Inactive (Hidden)'}</span>
                          </span>
                        </td>

                        {/* Actions: Toggle Active/Inactive & View Page */}
                        <td className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Toggle Status Button */}
                            <button
                              type="button"
                              onClick={() => toggleCenterStatus(center.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs ${
                                isActive
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                              title={isActive ? 'Deactivate from public search' : 'Activate in public search'}
                            >
                              <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                            </button>

                            {/* Simulate Vendor Login */}
                            <button
                              type="button"
                              onClick={() => handleSimulateVendorLogin(center)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs transition shadow-xs"
                              title="Enter Vendor Terminal for this studio"
                            >
                              Manage Bay
                            </button>

                            {/* View Customer Page */}
                            <Link
                              to={`/center/${center.id}`}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition shadow-xs"
                              title="View Customer Booking Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Helper notice */}
            {/* <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Dynamic state synchronized: Centers added or deactivated reflect immediately.</span>
              <button
                type="button"
                onClick={resetToInitialData}
                className="text-slate-600 hover:text-slate-900 transition inline-flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default System Data</span>
              </button>
            </div> */}

          </div>
        )}

      </div>

      {/* Add Center Modal */}
      <AddCenterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCenterAdded={() => setActiveTab('directory')}
      />

    </div>
  );
}