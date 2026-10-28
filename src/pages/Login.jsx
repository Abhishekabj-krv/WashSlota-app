import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Auth from '../components/Auth';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Destination after login
  const from = location.state?.from?.pathname;
  const targetPath = (!from || from === '/' || from === '/login') ? '/' : from;

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Pure Consumer App Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Wash<span className="text-brand-600">Slot</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Account Access
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to book detailing bays and track your vehicle wash live
          </p>
        </div>

        {/* Dedicated Customer Auth Card (Sign In & Sign Up) */}
        <Auth
          showBrandHeader={false}
          onSuccess={() => navigate(targetPath, { replace: true })}
        />

        {/* Subtle marketplace reassurance */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Bengaluru Studios Directory
          </Link>
        </div>

      </div>
    </div>
  );
}
