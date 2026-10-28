import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Store, 
  User, 
  Menu, 
  X, 
  LogOut,
  CalendarCheck,
  ChevronRight,
  Crown,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logoutUser, bookings, centers } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const isCustomer = currentUser?.role === 'customer';
  const isVendor = currentUser?.role === 'vendor';
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Vendor shop name lookup
  const vendorCenter = centers.find((c) => c.id === currentUser?.vendorCenterId);
  const vendorShopName = vendorCenter ? vendorCenter.name : (currentUser?.name || 'Partner Studio');

  // Vendor pending orders count
  const vendorPendingCount = bookings.filter((b) => {
    if (!currentUser?.vendorCenterId) return false;
    return b.centerId === currentUser.vendorCenterId && b.status === 'pending';
  }).length;

  // Customer active bookings count
  const customerActiveCount = bookings.filter((b) => {
    return b.status === 'pending' || b.status === 'accepted';
  }).length;

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setRoleMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close role menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const role = currentUser?.role;
    await logoutUser();
    if (role === 'vendor') {
      navigate('/partner-login');
    } else if (role === 'superadmin') {
      navigate('/founder-portal');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand Identity & Location Tag */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus:outline-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Wash<span className="text-brand-600">Slot</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1 hidden sm:block">
                  Bengaluru
                </span>
              </div>
            </Link>

            {/* Subtle City Tag */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200/60 ml-1">
              <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
              <span>Bengaluru, KA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          {/* Center Navigation Links (Clean, Uncluttered Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition ${
                location.pathname === '/' 
                  ? 'text-brand-600 bg-brand-50/80 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explore Studios
            </Link>

            {/* My Bookings link (for customers or when logged in) */}
            {currentUser && (
              <Link
                to="/my-bookings"
                className={`px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition inline-flex items-center gap-1.5 ${
                  location.pathname === '/my-bookings'
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-brand-600" />
                <span>My Bookings</span>
                {customerActiveCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-100 text-brand-700 font-black">
                    {customerActiveCount}
                  </span>
                )}
              </Link>
            )}

            {/* Vendor Orders link (ONLY if logged in as vendor) */}
            {isVendor && (
              <Link
                to="/vendor/orders"
                className={`px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition inline-flex items-center gap-1.5 ${
                  location.pathname.startsWith('/vendor')
                    ? 'text-amber-800 bg-amber-50 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4 text-amber-500" />
                <span>Studio Orders</span>
                {vendorPendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black animate-pulse">
                    {vendorPendingCount}
                  </span>
                )}
              </Link>
            )}

            {/* Super Admin Dashboard Link (ONLY if logged in as Super Admin) */}
            {isSuperAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition inline-flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-purple-700 bg-purple-50 font-bold' 
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
                }`}
              >
                <Crown className="w-4 h-4 text-purple-600" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action: Clean Profile Dropdown Trigger */}
          <div className="hidden md:flex items-center gap-3" ref={profileMenuRef}>
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl border text-xs font-bold transition shadow-2xs cursor-pointer ${
                    roleMenuOpen
                      ? 'bg-slate-100 border-slate-300'
                      : isSuperAdmin
                      ? 'bg-purple-50/70 border-purple-200 hover:border-purple-300 text-purple-950'
                      : isVendor
                      ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300 text-amber-950'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSuperAdmin
                      ? 'bg-purple-600 text-white'
                      : isVendor
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-brand-600 text-white'
                  }`}>
                    {isSuperAdmin ? (
                      <Crown className="w-3.5 h-3.5" />
                    ) : isVendor ? (
                      <Store className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="truncate max-w-[120px] text-xs font-black text-slate-900 leading-tight">
                      {isSuperAdmin ? 'Founder Admin' : isVendor ? vendorShopName : currentUser.name}
                    </span>
                    <span className={`text-[9px] uppercase font-bold tracking-wider leading-none ${
                      isSuperAdmin ? 'text-purple-600' : isVendor ? 'text-amber-700' : 'text-brand-600'
                    }`}>
                      {isSuperAdmin ? 'Platform Admin' : isVendor ? 'Partner Studio' : 'Customer'}
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform duration-200 ${
                    roleMenuOpen ? 'rotate-180 text-slate-700' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 text-xs font-medium animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* Persona Header Card */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                          isSuperAdmin ? 'bg-purple-600' : isVendor ? 'bg-slate-900 text-amber-400' : 'bg-brand-600'
                        }`}>
                          {isSuperAdmin ? <Crown className="w-4 h-4" /> : isVendor ? <Store className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {isSuperAdmin ? 'Platform Founder' : isVendor ? vendorShopName : currentUser.name}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {currentUser.email || currentUser.phone || 'Authenticated User'}
                          </span>
                        </div>
                      </div>

                      {/* Direct Destination Shortcut */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80">
                        {isSuperAdmin ? (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setRoleMenuOpen(false)}
                            className="flex items-center justify-between text-xs font-black text-purple-700 hover:text-purple-800"
                          >
                            <span>Open Founder Dashboard</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : isVendor ? (
                          <Link
                            to="/vendor/orders"
                            onClick={() => setRoleMenuOpen(false)}
                            className="flex items-center justify-between text-xs font-black text-amber-800 hover:text-amber-900"
                          >
                            <span>Open Bay Orders Terminal</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            to="/my-bookings"
                            onClick={() => setRoleMenuOpen(false)}
                            className="flex items-center justify-between text-xs font-black text-brand-600 hover:text-brand-700"
                          >
                            <span>View My Active Bookings</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Logout Option */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out of Session</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>

          {/* Mobile 3-Bar Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          
          {currentUser ? (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
                  isSuperAdmin ? 'bg-purple-600' : isVendor ? 'bg-slate-900 text-amber-400' : 'bg-brand-600'
                }`}>
                  {isSuperAdmin ? <Crown className="w-4 h-4" /> : isVendor ? <Store className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">
                    {isSuperAdmin ? 'Founder Admin' : isVendor ? vendorShopName : currentUser.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Link>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                location.pathname === '/' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Explore Studios</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {currentUser && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  location.pathname === '/my-bookings' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-brand-600" />
                  <span>My Bookings</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {customerActiveCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-brand-100 text-brand-700 font-bold">
                      {customerActiveCount}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            )}

            {isVendor && (
              <Link
                to="/vendor/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  location.pathname.startsWith('/vendor') ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-amber-500" />
                  <span>Studio Orders Terminal</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {vendorPendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-400 text-slate-950 font-bold">
                      {vendorPendingCount}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            )}

            {isSuperAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  location.pathname.startsWith('/admin') ? 'bg-purple-50 text-purple-800' : 'text-purple-700 hover:bg-purple-50/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-purple-600" />
                  <span>Admin Dashboard</span>
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </Link>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
