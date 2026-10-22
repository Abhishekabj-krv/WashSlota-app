import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  Car, 
  Bike, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  PlusCircle, 
  Check, 
  AlertCircle,
  Filter,
  ArrowRight,
  LogOut,
  ChevronDown,
  KeyRound,
  Lock
} from 'lucide-react';

export default function VendorOrders() {
  const { 
    bookings, 
    currentUser, 
    updateBookingStatus, 
    logoutUser, 
    addBooking, 
    setSelectedVendorCenter,
    verifyBookingOtp,
    verifyOtp,
    loginUser,
    resetToInitialData,
    centers
  } = useApp();

  const navigate = useNavigate();

  // Active status filter tab: 'all' | 'pending' | 'accepted' | 'completed' | 'rejected'
  const [activeFilter, setActiveFilter] = useState('all');

  // Per-order OTP inputs and error messages state
  const [orderOtpInputs, setOrderOtpInputs] = useState({});
  const [orderErrors, setOrderErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState({});

  // Global gate OTP check
  const [globalOtpInput, setGlobalOtpInput] = useState('');
  const [globalOtpMessage, setGlobalOtpMessage] = useState(null);

  // Vendor Center info
  const centerId = currentUser?.vendorCenterId || 'greenspark-hsr';
  const currentCenter = centers.find((c) => c.id === centerId) || centers[0];

  // Core requirement: Display bookings matching ONLY the logged-in vendor's center ID
  const centerOrders = bookings.filter((b) => b.centerId === centerId);

  // Status-based counts
  const pendingOrders = centerOrders.filter((b) => b.status === 'pending');
  const acceptedOrders = centerOrders.filter((b) => b.status === 'accepted');
  const completedOrders = centerOrders.filter((b) => b.status === 'completed');
  const rejectedOrders = centerOrders.filter((b) => b.status === 'rejected');

  // Filtered orders based on selected tab
  const displayedOrders = centerOrders.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  // Action handlers
  const handleAcceptOrder = (orderId) => {
    updateBookingStatus(orderId, 'accepted');
  };

  const handleRejectOrder = (orderId) => {
    updateBookingStatus(orderId, 'rejected');
  };

  // Secure Customer-Held OTP Verification (Requirement #2)
  const handleVerifyOrderOtp = (orderId) => {
    const entered = orderOtpInputs[orderId] || '';
    const res = verifyBookingOtp(orderId, entered);

    if (res.success) {
      setOrderSuccess((prev) => ({ ...prev, [orderId]: res.message }));
      setOrderErrors((prev) => ({ ...prev, [orderId]: '' }));
    } else {
      setOrderErrors((prev) => ({ ...prev, [orderId]: res.message }));
      setOrderSuccess((prev) => ({ ...prev, [orderId]: '' }));
    }
  };

  const handleOtpInputChange = (orderId, val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setOrderOtpInputs((prev) => ({ ...prev, [orderId]: cleaned }));
    if (orderErrors[orderId]) {
      setOrderErrors((prev) => ({ ...prev, [orderId]: '' }));
    }
  };

  // Quick Switch Center for demoing multiple studios
  const handleSwitchCenter = (newCenterId) => {
    const newCenter = centers.find((c) => c.id === newCenterId);
    loginUser({
      role: 'vendor',
      name: `${newCenter?.name || 'Center'} (Manager)`,
      vendorCenterId: newCenterId
    });
    setSelectedVendorCenter(newCenterId);
  };

  // Add demo customer booking directly for rapid live testing
  const handleAddDemoBooking = () => {
    const demoVehicles = [
      { name: 'Kavya Raman', phone: '+91 98455 10293', num: 'KA 03 NA 4109', model: 'Kia Seltos GTX', type: 'Car' },
      { name: 'Aditya Menon', phone: '+91 97410 44812', num: 'KA 05 MN 2291', model: 'TVS Apache RR310', type: 'Bike' },
      { name: 'Manoj Patel', phone: '+91 99002 91823', num: 'KA 51 EQ 8801', model: 'Skoda Kushaq', type: 'Car' }
    ];
    const pick = demoVehicles[Math.floor(Math.random() * demoVehicles.length)];
    const srv = currentCenter.services[0];

    addBooking({
      centerId: currentCenter.id,
      centerName: currentCenter.name,
      locality: currentCenter.locality,
      customerName: pick.name,
      customerPhone: pick.phone,
      vehicleNumber: pick.num,
      vehicleModel: pick.model,
      vehicleType: pick.type,
      serviceName: srv.title,
      price: srv.price,
      bookingDate: 'Today',
      slotTime: '02:30 PM',
      status: 'pending'
    });
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Status Badge Helper with high contrast
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-slate-950"></span>
            <span>Awaiting Approval</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Accepted - Bay Ready</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected / Full</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-400 text-slate-950 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wash Completed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-white">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Role Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentCenter.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Vendor Partner Terminal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentCenter.locality}, Bengaluru • Bay Capacity: <strong>{currentCenter.maxCapacityPerSlot || 2} bays/slot</strong> • Operator: <strong className="text-slate-200">{currentUser?.name}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Center Switcher */}
            <div className="relative">
              <select
                value={centerId}
                onChange={(e) => handleSwitchCenter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-hidden cursor-pointer"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.locality})
                  </option>
                ))}
              </select>
            </div>

            {/* Switch to Customer View */}
            <Link
              to="/my-bookings"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition inline-flex items-center gap-1.5"
            >
              <span>Customer Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Counts KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveFilter('pending')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
              activeFilter === 'pending'
                ? 'bg-amber-500/20 border-amber-400 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              🟡 Pending Approval
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-400">{pendingOrders.length}</span>
              <span className="text-xs text-slate-400">awaiting review</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('accepted')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
              activeFilter === 'accepted'
                ? 'bg-emerald-500/20 border-emerald-400 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              🟢 Accepted & In-Bay
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-400">{acceptedOrders.length}</span>
              <span className="text-xs text-slate-400">ready for OTP</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('completed')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
              activeFilter === 'completed'
                ? 'bg-cyan-500/20 border-cyan-400 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
              🔵 Completed Washes
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-cyan-400">{completedOrders.length}</span>
              <span className="text-xs text-slate-400">jobs done</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('rejected')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
              activeFilter === 'rejected'
                ? 'bg-rose-500/20 border-rose-400 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              🔴 Rejected / Full
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-rose-400">{rejectedOrders.length}</span>
              <span className="text-xs text-slate-400">declined</span>
            </div>
          </div>
        </div>

        {/* Security Rule Notice: Customer-Held OTP Protocol */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-300 font-bold mb-0.5">
              Secure Customer-Held OTP Protocol Active
            </strong>
            <span>
              Customer verification codes are kept private with the vehicle owner and are <strong>never displayed on your vendor screen</strong>. When the customer arrives at your bay, ask for their 4-digit code shown on their booking card, enter it below, and click <strong>[ Verify & Mark Complete ]</strong>.
            </span>
          </div>
        </div>

        {/* Order Management Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">
                Orders for {currentCenter.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {displayedOrders.length} bookings matching this washing studio
              </p>
            </div>

            {/* Filter Tabs & Test Helper */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  All ({centerOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'pending' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  Pending ({pendingOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('accepted')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'accepted' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  Accepted ({acceptedOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'completed' ? 'bg-cyan-400 text-slate-950 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  Completed ({completedOrders.length})
                </button>
              </div>

              {/* Demo button to inject a new pending customer booking */}
              <button
                type="button"
                onClick={handleAddDemoBooking}
                className="px-3.5 py-2 bg-brand-600/30 hover:bg-brand-600/50 text-brand-300 border border-brand-500/40 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
                title="Create a pending booking to test live acceptance/rejection"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Simulate New Request</span>
              </button>
            </div>
          </div>

          {/* Orders Card Feed with Secure Customer-Held OTP Verification (Requirement #2) */}
          {displayedOrders.length > 0 ? (
            <div className="space-y-4">
              {displayedOrders.map((order) => {
                const isPending = order.status === 'pending';
                const isAccepted = order.status === 'accepted';
                const isCompleted = order.status === 'completed';
                const isRejected = order.status === 'rejected';

                const orderInputVal = orderOtpInputs[order.id] || '';
                const orderError = orderErrors[order.id];
                const orderSuccessMsg = orderSuccess[order.id];

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl p-5 sm:p-6 border-2 transition-all ${
                      isPending
                        ? 'bg-slate-900 border-amber-400/80 shadow-lg shadow-amber-500/5'
                        : isAccepted
                        ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/5'
                        : isCompleted
                        ? 'bg-slate-900/60 border-slate-800 opacity-80'
                        : 'bg-slate-900/40 border-rose-900/50 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Customer Name, Vehicle Type & Details, Service, Slot */}
                      <div className="space-y-3 flex-1">
                        
                        {/* Top Row: Customer Name, Vehicle Reg Number, & Status Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                order.vehicleType === 'Bike'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                              }`}
                            >
                              {order.vehicleType === 'Bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-mono font-bold text-base sm:text-lg text-white tracking-wider">
                                  {order.vehicleNumber}
                                </h3>
                                <span className="text-xs text-slate-400">
                                  ({order.vehicleModel})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="text-slate-200 font-medium flex items-center gap-1">
                                  <User className="w-3.5 h-3.5 text-slate-400" />
                                  {order.customerName}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  {order.customerPhone}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* High-contrast status badge */}
                          <div>
                            {renderStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Middle Row: Service Name, Slot Time, and Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                          
                          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Service Selected</span>
                            <span className="font-bold text-amber-300 truncate block mt-0.5">{order.serviceName}</span>
                          </div>

                          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Bay Schedule</span>
                            <span className="font-bold text-white block mt-0.5">{order.bookingDate}, {order.slotTime}</span>
                          </div>

                          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Payable</span>
                            <span className="font-black text-cyan-400 text-sm block mt-0.5">₹{order.price}</span>
                          </div>

                        </div>

                      </div>

                      {/* Right: ACTION BUTTONS & SECURE CUSTOMER-HELD OTP INPUT (Requirement #2) */}
                      <div className="lg:border-l lg:border-slate-800 lg:pl-6 shrink-0 flex flex-col justify-center items-end sm:items-center min-w-[240px]">
                        
                        {/* 1. If Pending: [ Accept Booking ] and [ Reject / Slot Full ] */}
                        {isPending && (
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => handleAcceptOrder(order.id)}
                              className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              <span>Accept Booking</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectOrder(order.id)}
                              className="w-full px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 active:scale-95 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject / Slot Full</span>
                            </button>
                          </div>
                        )}

                        {/* 2. If Accepted: SECURE CUSTOMER-HELD OTP INPUT & [ Verify & Mark Complete ] (Requirement #2) */}
                        {isAccepted && (
                          <div className="w-full space-y-2">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider text-center">
                              Enter Customer-Held OTP
                            </span>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={4}
                                value={orderInputVal}
                                onChange={(e) => handleOtpInputChange(order.id, e.target.value)}
                                placeholder="4-digit code"
                                className="w-28 px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-center text-sm font-mono font-bold text-amber-300 focus:outline-hidden focus:border-amber-400"
                              />

                              <button
                                type="button"
                                onClick={() => handleVerifyOrderOtp(order.id)}
                                disabled={orderInputVal.length < 4}
                                className="flex-1 px-3 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span>Verify & Complete</span>
                              </button>
                            </div>

                            {/* Verification Error Feedback (Requirement #2) */}
                            {orderError && (
                              <div className="p-2 bg-rose-950/80 border border-rose-500/60 rounded-xl text-[11px] font-bold text-rose-300 flex items-start gap-1.5 animate-shake">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                                <span>{orderError}</span>
                              </div>
                            )}

                            {orderSuccessMsg && (
                              <div className="p-2 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                                <span>{orderSuccessMsg}</span>
                              </div>
                            )}

                            <span className="text-[10px] text-slate-500 block text-center">
                              Customer presents code upon bay entry
                            </span>
                          </div>
                        )}

                        {/* 3. If Completed */}
                        {isCompleted && (
                          <div className="text-center py-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60">
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Wash Finished & Delivered</span>
                            </span>
                          </div>
                        )}

                        {/* 4. If Rejected */}
                        {isRejected && (
                          <div className="text-center py-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800/60">
                              <XCircle className="w-4 h-4" />
                              <span>Declined by Studio</span>
                            </span>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
              No orders found under "{activeFilter}" status.
            </div>
          )}

          {/* Reset Helper */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Bengaluru Center Bay Node: {currentCenter.id}</span>
            <button
              type="button"
              onClick={resetToInitialData}
              className="text-slate-400 hover:text-slate-200 transition inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Initial Mock Data</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
