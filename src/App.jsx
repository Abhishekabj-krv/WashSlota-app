import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthGate from './components/AuthGate';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import PartnerLogin from './pages/PartnerLogin';
import FounderPortal from './pages/FounderPortal';
import CenterDetail from './pages/CenterDetail';
import MyBookings from './pages/MyBookings';
import VendorOrders from './pages/VendorOrders';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        {/* Customer Auth Gate intercepts unauthenticated visitors browsing studios */}
        <AuthGate />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* 1. Customer Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              
              {/* Dedicated Customer-Only Auth URL (Requirement #1) */}
              <Route path="/login" element={<Login />} />

              {/* 2. Separate Standalone Vendor Partner Portal URL (Requirement #2) */}
              <Route path="/partner-login" element={<PartnerLogin />} />
              <Route path="/vendor-portal" element={<Navigate to="/partner-login" replace />} />
              <Route path="/vendor" element={<Navigate to="/partner-login" replace />} />

              {/* 3. Separate Secret Super Admin URL (Requirement #3) */}
              <Route path="/founder-portal" element={<FounderPortal />} />
              <Route path="/admin-login" element={<Navigate to="/founder-portal" replace />} />
              <Route path="/secret-admin-login" element={<Navigate to="/founder-portal" replace />} />
              <Route path="/admin" element={<Navigate to="/founder-portal" replace />} />

              {/* Dynamic Center Detail Page with Service & Slot Picker */}
              <Route path="/center/:id" element={<CenterDetail />} />

              {/* Customer Bookings Live Tracking */}
              <Route path="/my-bookings" element={<MyBookings />} />

              {/* Protected Vendor Orders Terminal (Strict RBAC: Vendor Role) */}
              <Route
                path="/vendor/orders"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorOrders />
                  </ProtectedRoute>
                }
              />

              {/* Protected Super Admin Dashboard (Strict RBAC: Super Admin Role) */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
