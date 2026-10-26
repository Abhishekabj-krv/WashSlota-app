import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Store, 
  Sparkles, 
  Phone, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  KeyRound,
  Mail
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, currentUser, centers } = useApp();

  // Active tab: 'customer' | 'vendor' | 'superadmin'
  const [activeTab, setActiveTab] = useState(
    location.state?.tab ||
    (currentUser?.role === 'superadmin' ? 'superadmin' : currentUser?.role === 'vendor' ? 'vendor' : 'customer')
  );

  // Customer Form state (Cleaned to empty strings so no old/boolean values appear)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Vendor Form state
  const [selectedCenterId, setSelectedCenterId] = useState(
    centers[0]?.id || 'greenspark-hsr'
  );
  const [vendorPasscode, setVendorPasscode] = useState('');

  // Super Admin Form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  // Destination after login
  const from = location.state?.from?.pathname;

  // Handle Customer Login
  const handleCustomerLogin = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Please enter your mobile phone number');
      return;
    }

    setErrorMsg('');
    loginUser({
      role: 'customer',
      name: customerName.trim(),
      phone: customerPhone.trim(),
      vendorCenterId: null
    });

    // If 'from' is undefined, or points back to login/root, force '/home'
    const targetPath = (!from || from === '/' || from === '/login') ? '/home' : from;
    
    navigate(targetPath, { replace: true });
  };

  // Handle Vendor Login
  const handleVendorLogin = (e) => {
    e.preventDefault();
    if (!selectedCenterId) {
      setErrorMsg('Please select your washing center studio');
      return;
    }
    if (!vendorPasscode.trim()) {
      setErrorMsg('Please enter your 4-digit partner passcode');
      return;
    }

    const matchedCenter = centers.find((c) => c.id === selectedCenterId);
    const centerTitle = matchedCenter ? matchedCenter.name : 'Center Manager';

    setErrorMsg('');
    loginUser({
      role: 'vendor',
      name: `${centerTitle} (Manager)`,
      phone: matchedCenter?.phone || '',
      vendorCenterId: selectedCenterId
    });

    // Redirect Vendors directly to /vendor/orders
    navigate('/vendor/orders', { replace: true });
  };

  // Handle Super Admin Login
  const handleSuperAdminLogin = (e) => {
    e.preventDefault();
    if (!adminPasscode.trim()) {
      setErrorMsg('Please enter the Master Passcode');
      return;
    }

    // Master credential verification (e.g. 'admin123')
    if (adminPasscode.trim() !== 'admin123') {
      setErrorMsg('Invalid Master Passcode. Use "admin123" for demo founder access.');
      return;
    }

    setErrorMsg('');
    loginUser({
      role: 'superadmin',
      name: 'Platform Founder (Super Admin)',
      phone: '+91 80 4912 3400',
      vendorCenterId: null
    });

    // Redirect Super Admin upon login directly to /admin/dashboard
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Wash<span className="text-brand-600">Slot</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Welcome to WashSlot Bengaluru
          </h1>
        </div>

        {/* 3-Tab Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Tab Selector with 3 Roles */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 border-b border-slate-200 text-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setErrorMsg('');
              }}
              className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all ${
                activeTab === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${activeTab === 'customer' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('vendor');
                setErrorMsg('');
              }}
              className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all ${
                activeTab === 'vendor'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className={`w-3.5 h-3.5 ${activeTab === 'vendor' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('superadmin');
                setErrorMsg('');
              }}
              className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all ${
                activeTab === 'superadmin'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-400 text-white shadow-sm'
                  : 'text-violet-600 hover:text-indigo-200'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${activeTab === 'superadmin' ? 'text-yellow-300' : 'text-purple-500'}`} />
              <span>Super Admin</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: CUSTOMER LOGIN */}
            {activeTab === 'customer' && (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="PH No"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Login as Customer & Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: VENDOR LOGIN */}
            {activeTab === 'vendor' && (
              <form onSubmit={handleVendorLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Your Washing Center <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedCenterId}
                      onChange={(e) => setSelectedCenterId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-xs sm:text-sm font-semibold text-slate-900 cursor-pointer"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.locality}) {c.status === 'inactive' ? '— (Inactive)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bay Manager Passcode (PIN) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      maxLength={6}
                      value={vendorPasscode}
                      onChange={(e) => setVendorPasscode(e.target.value)}
                      placeholder="Enter 4-digit PIN"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm font-mono font-bold tracking-widest text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Access Vendor Orders Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 3: SUPER ADMIN ACCESS */}
            {activeTab === 'superadmin' && (
              <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Master Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Master Passcode <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Master Passcode"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/30 focus:bg-white focus:outline-hidden focus:border-purple-600 text-sm font-mono font-bold tracking-wider text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:opacity-95 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>Access Super Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}