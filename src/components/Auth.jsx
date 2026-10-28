import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Auth({ 
  initialMode = 'signin', 
  onSuccess, 
  showBrandHeader = true,
  className = '' 
}) {
  const { signInCustomer, signUpCustomer } = useApp();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState(initialMode);

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch between Sign In and Sign Up
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
  };

  // Robust Sign In Handler (Requirement #2)
  const handleSignIn = async (e) => {
    e.preventDefault();
    const cleanEmail = signInEmail.trim();
    const cleanPassword = signInPassword.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!cleanPassword) {
      setErrorMsg('Please enter your password');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      // Calls signInWithPassword under the hood, fetches profiles, and updates global state
      const res = await signInCustomer({
        identifier: cleanEmail,
        password: cleanPassword,
      });

      if (!res.success) {
        // Fallback for "Invalid login credentials"
        const errText = res.error || '';
        if (
          errText.toLowerCase().includes('invalid login credentials') ||
          errText.toLowerCase().includes('invalid credentials')
        ) {
          setErrorMsg('Incorrect email or password. Please check your credentials or create an account.');
        } else {
          setErrorMsg(errText);
        }
        return;
      }

      setSuccessMsg('Signed in successfully! Unlocking your session...');
      if (onSuccess) {
        setTimeout(() => onSuccess(res.user), 400);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect email or password. Please check your credentials or create an account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Robust Sign Up Handler (Requirement #1)
  const handleSignUp = async (e) => {
    e.preventDefault();
    const cleanName = signUpName.trim();
    const cleanEmail = signUpEmail.trim().toLowerCase();
    const cleanPhone = signUpPhone.trim();
    const cleanPassword = signUpPassword.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Please enter a valid mobile number (+91)');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      // Calls supabase.auth.signUp with metadata and upserts into public.profiles
      const res = await signUpCustomer({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPassword,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account. Please try again.');
        return;
      }

      if (res.needsEmailConfirmation) {
        setSuccessMsg('Account created successfully! Please check your email to verify, then sign in.');
        setMode('signin');
      } else {
        setSuccessMsg('Account registered successfully! Unlocking your session...');
        if (onSuccess) {
          setTimeout(() => onSuccess(res.user), 400);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-5 ${className}`}>
      
      {/* Brand Header (Optional) */}
      {showBrandHeader && (
        <div className="text-center space-y-1.5 pb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'signin' 
              ? 'Sign in to access your vehicle bookings and verified profile' 
              : 'Join WashSlot to book verified vehicle detailing bays in Bengaluru'}
          </p>
        </div>
      )}

      {/* Segmented Mode Toggle: Sign In vs Create Account */}
      <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => handleModeSwitch('signin')}
          className={`flex-1 py-2.5 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
            mode === 'signin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('signup')}
          className={`flex-1 py-2.5 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
            mode === 'signup'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Create Account</span>
        </button>
      </div>

      {/* Error Message Banner */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <span className="font-semibold leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* Success Message Banner */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span className="font-semibold leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* TAB 1: SIGN IN FORM */}
      {mode === 'signin' && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600 transition disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="Enter your account password"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600 transition disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button with Loading Spinner (Requirement #3) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to WashSlot</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 2: SIGN UP / REGISTER FORM */}
      {mode === 'signup' && (
        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600 transition disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="ramesh@gmail.com"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600 transition disabled:opacity-60"
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
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                placeholder="+91 98450 00000"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600 transition disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Choose Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600 transition disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Secured with Supabase Auth encryption
            </span>
          </div>

          {/* Submit Button with Loading Spinner (Requirement #3) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer Switch Prompt */}
      <div className="pt-2 border-t border-slate-100 text-center">
        {mode === 'signin' ? (
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className="font-bold text-brand-600 hover:underline"
            >
              Create Account
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => handleModeSwitch('signin')}
              className="font-bold text-brand-600 hover:underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>

    </div>
  );
}
