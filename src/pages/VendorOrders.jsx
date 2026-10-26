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
    const demoVehicles = [];
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

  // Status Badge Helper with high contrast light-theme colors
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Awaiting Approval</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Accepted - Bay Ready</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected / Full</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wash Completed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Role Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentCenter.name}
                </h1>
                {/* <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white uppercase tracking-wider shadow-xs">
                  Vendor Partner Terminal
                </span> */}
              </div>
              {/* <p className="text-xs text-slate-500 mt-0.5">
                {currentCenter.locality}, Bengaluru • Bay Capacity: <strong className="text-slate-700">{currentCenter.maxCapacityPerSlot || 2} bays/slot</strong> • Operator: 
                <strong className="text-slate-800 ml-1">{currentUser?.name}</strong>
              </p> */}
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Center Switcher */}
            {/* <div className="relative">
              <select
                value={centerId}
                onChange={(e) => handleSwitchCenter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-xs"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white text-slate-800">
                    {c.name} ({c.locality})
                  </option>
                ))}
              </select>
            </div> */}

            {/* Switch to Customer View */}
            {/* <Link
              to="/my-bookings"
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition inline-flex items-center gap-1.5"
            >
              <span>Customer Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link> */}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
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
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition shadow-xs ${
              activeFilter === 'pending'
                ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              🟡 Pending Approval
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-600">{pendingOrders.length}</span>
              <span className="text-xs text-slate-500">awaiting review</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('accepted')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition shadow-xs ${
              activeFilter === 'accepted'
                ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              🟢 Accepted & In-Bay
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-600">{acceptedOrders.length}</span>
              <span className="text-xs text-slate-500">ready for OTP</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('completed')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition shadow-xs ${
              activeFilter === 'completed'
                ? 'bg-cyan-50 border-cyan-400 shadow-md ring-2 ring-cyan-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">
              🔵 Completed Washes
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-cyan-600">{completedOrders.length}</span>
              <span className="text-xs text-slate-500">jobs done</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('rejected')}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition shadow-xs ${
              activeFilter === 'rejected'
                ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              🔴 Rejected / Full
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-rose-600">{rejectedOrders.length}</span>
              <span className="text-xs text-slate-500">declined</span>
            </div>
          </div>
        </div>

        {/* Order Management Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Orders for {currentCenter.name}
              </h2>
              {/* <p className="text-xs text-slate-500 mt-0.5">
                Showing {displayedOrders.length} bookings matching this washing studio
              </p> */}
            </div>

            {/* Filter Tabs & Test Helper */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({centerOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'pending' ? 'bg-amber-500 text-white font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending ({pendingOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('accepted')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'accepted' ? 'bg-emerald-600 text-white font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Accepted ({acceptedOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeFilter === 'completed' ? 'bg-cyan-600 text-white font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Completed ({completedOrders.length})
                </button>
              </div>
            </div>
          </div>

          {/* Orders Card Feed with Secure Customer-Held OTP Verification */}
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
                    className={`rounded-2xl p-5 sm:p-6 border-2 transition-all shadow-xs ${
                      isPending
                        ? 'bg-white border-amber-300 ring-2 ring-amber-400/10'
                        : isAccepted
                        ? 'bg-white border-emerald-300 ring-2 ring-emerald-400/10'
                        : isCompleted
                        ? 'bg-slate-50 border-slate-200 opacity-90'
                        : 'bg-slate-50 border-rose-200 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Customer Name, Vehicle Type & Details, Service, Slot */}
                      <div className="space-y-3 flex-1">
                        
                        {/* Top Row: Customer Name, Vehicle Reg Number, & Status Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                order.vehicleType === 'Bike'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-sky-100 text-sky-700 border border-sky-200'
                              }`}
                            >
                              {order.vehicleType === 'Bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-mono font-bold text-base sm:text-lg text-slate-900 tracking-wider">
                                  {order.vehicleNumber}
                                </h3>
                                <span className="text-xs text-slate-500 font-medium">
                                  ({order.vehicleModel})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="text-slate-800 font-semibold flex items-center gap-1">
                                  <User className="w-3.5 h-3.5 text-slate-500" />
                                  {order.customerName}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-500" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-700">
                          
                          <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 shadow-xs">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Service Selected</span>
                            <span className="font-bold text-amber-700 truncate block mt-0.5">{order.serviceName}</span>
                          </div>

                          <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 shadow-xs">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Bay Schedule</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{order.bookingDate}, {order.slotTime}</span>
                          </div>

                          <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 shadow-xs">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Payable</span>
                            <span className="font-black text-cyan-700 text-sm block mt-0.5">₹{order.price}</span>
                          </div>

                        </div>

                      </div>

                      {/* Right: ACTION BUTTONS & SECURE CUSTOMER-HELD OTP INPUT */}
                      <div className="lg:border-l lg:border-slate-200 lg:pl-6 shrink-0 flex flex-col justify-center items-end sm:items-center min-w-[240px]">
                        
                        {/* 1. If Pending: [ Accept Booking ] and [ Reject / Slot Full ] */}
                        {isPending && (
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => handleAcceptOrder(order.id)}
                              className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              <span>Accept Booking</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectOrder(order.id)}
                              className="w-full px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject / Slot Full</span>
                            </button>
                          </div>
                        )}

                        {/* 2. If Accepted: SECURE CUSTOMER-HELD OTP INPUT & [ Verify & Mark Complete ] */}
                        {isAccepted && (
                          <div className="w-full space-y-2">
                            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider text-center">
                              Enter Customer-Held OTP
                            </span>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={4}
                                value={orderInputVal}
                                onChange={(e) => handleOtpInputChange(order.id, e.target.value)}
                                placeholder="4-digit code"
                                className="w-28 px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-center text-sm font-mono font-bold text-amber-600 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-xs"
                              />

                              <button
                                type="button"
                                onClick={() => handleVerifyOrderOtp(order.id)}
                                disabled={orderInputVal.length < 4}
                                className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span>Verify & Complete</span>
                              </button>
                            </div>

                            {/* Verification Error Feedback */}
                            {orderError && (
                              <div className="p-2 bg-rose-50 border border-rose-300 rounded-xl text-[11px] font-bold text-rose-700 flex items-start gap-1.5 shadow-xs">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                                <span>{orderError}</span>
                              </div>
                            )}

                            {orderSuccessMsg && (
                              <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 shadow-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                <span>{orderSuccessMsg}</span>
                              </div>
                            )}

                            <span className="text-[10px] text-slate-400 block text-center">
                              Customer presents code upon bay entry
                            </span>
                          </div>
                        )}

                        {/* 3. If Completed */}
                        {isCompleted && (
                          <div className="text-center py-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Wash Finished & Delivered</span>
                            </span>
                          </div>
                        )}

                        {/* 4. If Rejected */}
                        {isRejected && (
                          <div className="text-center py-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs">
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
            <div className="text-center py-12 text-slate-400 text-xs sm:text-sm">
              No orders found under "{activeFilter}" status.
            </div>
          )}

          {/* Reset Helper */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Bengaluru Center Bay Node: {currentCenter.id}</span>
            
          </div>

        </div>

      </div>
    </div>
  );
}