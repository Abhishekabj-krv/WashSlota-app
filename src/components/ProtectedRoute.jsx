import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Store, User } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useApp();
  const location = useLocation();

  // If unauthenticated user tries to access superadmin area, redirect to hidden founder portal
  if (!currentUser) {
    if (allowedRoles && allowedRoles.includes('superadmin')) {
      return <Navigate to="/founder-portal" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super Admin has master access to all platform areas
  if (currentUser.role === 'superadmin') {
    return children;
  }

  // If specific roles are required and current user does not have permission
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            This area requires <strong className="text-slate-900 capitalize">{allowedRoles.join(' or ')}</strong> privileges.
            You are currently logged in as a{' '}
            <span className="font-bold text-brand-600 capitalize">{currentUser.role}</span> ({currentUser.name}).
          </p>

          <div className="space-y-2.5">
            {allowedRoles.includes('vendor') && (
              <Link
                to="/login"
                state={{ tab: 'vendor' }}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>Switch to Partner Studio Login</span>
              </Link>
            )}

            <Link
              to="/"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
