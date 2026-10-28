import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Auth from './Auth';

export default function AuthGate() {
  const location = useLocation();
  const { currentUser } = useApp();

  // If user is already authenticated, don't show the gate
  if (currentUser) return null;

  // If user is on the hidden Super Admin direct route or the dedicated login page, don't overlay
  if (
    location.pathname.startsWith('/founder') ||
    location.pathname.startsWith('/secret-admin') ||
    location.pathname === '/login'
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md my-8 animate-in zoom-in-95 duration-200">
        <Auth showBrandHeader={true} />
      </div>
    </div>
  );
}
