import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function PartnerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInVendor, centers, currentUser, logoutUser } = useApp();

  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || '');
  const [vendorPin, setVendorPin] = useState('');
  const [vendorError, setVendorError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadyVendor = currentUser?.role === 'vendor';

  // Handle Vendor Partner Login
  const handleVendorLogin = async (e) => {
    e.preventDefault();
    if (!selectedCenterId) {
      setVendorError('Please select your washing studio location');
      return;
    }
    if (!vendorPin.trim()) {
      setVendorError('Please enter your 4-digit partner PIN');
      return;
    }

    setVendorError('');
    setIsSubmitting(true);

    try {
      const res = await signInVendor({
        centerId: selectedCenterId,
        pin: vendorPin.trim(),
      });

      if (!res.success) {
        setVendorError(res.error || 'Invalid partner credentials');
        return;
      }

      // Redirect directly to the Vendor Orders Terminal
      navigate('/vendor/orders', { replace: true });
    } catch (err) {
      setVendorError(err.message || 'Vendor authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Partner Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 border border-amber-300/30">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
              B2B Partner Terminal
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-2.5">
              Washing Studio Partner Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live bay order acceptance, OTP code validation, and queue management
            </p>
          </div>
        </div>

        {/* Portal Card */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          
          {isAlreadyVendor ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-amber-950/60 border border-amber-800 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">Active Studio Terminal Session</h3>
                <p className="text-xs text-slate-300 mt-1">
                  You are signed in as <strong>{currentUser.name}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/vendor/orders')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Bay Orders Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                Log Out of Studio Terminal
              </button>
            </div>
          ) : (
            <form onSubmit={handleVendorLogin} className="space-y-4">
              
              {vendorError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{vendorError}</span>
                </div>
              )}

              {/* Select Studio */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Select Washing Studio Location
                </label>
                {centers.length > 0 ? (
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedCenterId}
                      onChange={(e) => setSelectedCenterId(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-sm font-semibold focus:outline-hidden focus:border-amber-400 transition"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.locality})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300">
                    No studios onboarded yet. Once onboarded by platform admin, locations appear here.
                  </div>
                )}
              </div>

              {/* 4-Digit Partner PIN */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  4-Digit Studio Access Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    value={vendorPin}
                    onChange={(e) => setVendorPin(e.target.value)}
                    placeholder="Enter Studio PIN (Default 1234)"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 text-sm font-mono font-bold tracking-widest focus:outline-hidden focus:border-amber-400 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Studio operator PIN is configured by the founder upon onboarding (default: <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">1234</code>).
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || centers.length === 0}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Authorizing Studio...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Bay Orders Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link to="/" className="text-xs text-slate-400 hover:text-slate-200 transition">
                  ← Return to Public Marketplace
                </Link>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
