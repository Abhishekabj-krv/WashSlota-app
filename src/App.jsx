import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import CenterDetail from './pages/CenterDetail';
import MyBookings from './pages/MyBookings';
import VendorOrders from './pages/VendorOrders';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Root path (/) now loads the Login page by default */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />

              {/* Home & Search Page is now accessible at /home */}
              <Route path="/home" element={<Home />} />

              {/* Dynamic Center Detail Page with Service & Slot Picker */}
              <Route path="/center/:id" element={<CenterDetail />} />

              {/* Customer Bookings Live Tracking */}
              <Route path="/my-bookings" element={<MyBookings />} />

              {/* Protected Vendor Orders Dashboard (Strict RBAC: Vendor Role) */}
              <Route
                path="/vendor/orders"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorOrders />
                  </ProtectedRoute>
                }
              />

              {/* Protected Super Admin Portal (Strict RBAC: Super Admin Role) */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Convenience redirects */}
              <Route path="/vendor" element={<Navigate to="/vendor/orders" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}