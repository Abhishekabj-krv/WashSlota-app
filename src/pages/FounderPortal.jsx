import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Crown, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Sparkles,
  KeyRound
} from 'lucide-react';

export default function FounderPortal() {
  const navigate = useNavigate();
  const { signInSuperAdmin, currentUser, logoutUser } = useApp();

  const [adminEmail, setAdminEmail] = useState('founder@washslot.blr');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadySuperAdmin = currentUser?.role === 'superadmin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter the Master Passcode');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await signInSuperAdmin({
        email: adminEmail.trim(),
        passcode: passcode.trim(),
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Access denied');
        return;
      }

      // Successfully authenticated as Super Admin -> redirect to /admin/dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Discreet Founder Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/20 border border-purple-400/30">
            <Crown className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800">
              Internal Platform Console
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-2.5">
              Founder & Super Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted management portal for WashSlot founders and operators
            </p>
          </div>
        </div>

        {/* Console Box */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          
          {isAlreadySuperAdmin ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-purple-950/60 border border-purple-800 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">Active Super Admin Session</h3>
                <p className="text-xs text-slate-300 mt-1">
                  You are logged in as <strong>{currentUser.name}</strong> ({currentUser.email}).
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={logoutUser}
                className="text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Log Out of Founder Session
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Founder Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Founder Master Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="founder@washslot.blr"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 text-sm font-semibold focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Master Passcode */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Master Passcode / Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                    placeholder="Enter Master Passcode"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 text-sm font-mono font-semibold focus:outline-hidden focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Master developer passcode is <code className="text-purple-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">admin123</code>.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <span>Authenticating Founder...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Master Access</span>
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
