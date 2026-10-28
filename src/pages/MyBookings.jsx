import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Bike, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft,
  Store,
  ExternalLink,
  ChevronRight,
  Lock,
  KeyRound
} from 'lucide-react';

export default function MyBookings() {
  const { bookings, currentUser, loginUser } = useApp();
  const navigate = useNavigate();

  // Filter bookings for the logged-in customer
  const customerBookings = bookings.filter((b) => {
    if (!currentUser) return false;
    if (currentUser.phone && b.customerPhone === currentUser.phone) return true;
    if (currentUser.email && b.customerEmail === currentUser.email) return true;
    if (currentUser.name && b.customerName && b.customerName.toLowerCase() === currentUser.name.toLowerCase()) return true;
    return false;
  });

  // Helper for Status Badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Awaiting Center Approval</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Confirmed - Ready for Wash</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>Slot Unavailable</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>Wash Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  // Quick switcher to Vendor mode to test approval in 1 click
  const handleTestAsVendor = (centerId) => {
    loginUser({
      role: 'vendor',
      name: 'Center Bay Operator',
      vendorCenterId: centerId || 'greenspark-hsr'
    });
    navigate('/vendor/orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link to="/" className="hover:text-brand-600">Home</Link>
              <span>/</span>
              <span className="text-slate-700">My Bookings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Vehicle Wash Bookings
            </h1>
            {/* <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Customer verification codes and live status tracking for your scheduled washing bays
            </p> */}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Book Another Wash</span>
            </Link>
          </div>
        </div>

        {/* Customer-Held Security Banner */}
        {/* <div className="bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Customer-Held OTP Security Protocol
              </h3>
              <p className="text-xs text-sky-100 mt-0.5 leading-relaxed">
                Your 4-digit verification code is private and held solely on your card. It unlocks once the center accepts your slot. The vendor never sees this code until you state it at the bay.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleTestAsVendor('greenspark-hsr')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Simulate Vendor Approval</span>
          </button>
        </div> */}

        {/* Bookings List */}
        {customerBookings.length > 0 ? (
          <div className="space-y-4">
            {customerBookings.map((booking) => {
              const isPending = booking.status === 'pending';
              const isAccepted = booking.status === 'accepted';
              const isRejected = booking.status === 'rejected';
              const isCompleted = booking.status === 'completed';

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-3xl border-2 p-5 sm:p-6 shadow-xs transition-all ${
                    isPending
                      ? 'border-amber-300 hover:border-amber-400'
                      : isAccepted
                      ? 'border-emerald-300 hover:border-emerald-400'
                      : isRejected
                      ? 'border-rose-200 opacity-80'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left: Vehicle and Booking Details */}
                    <div className="space-y-3 flex-1">
                      
                      {/* Top Row: Center Name & Status Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                          <h3 className="font-black text-base sm:text-lg text-slate-900">
                            {booking.centerName}
                          </h3>
                          <span className="text-xs text-slate-400">({booking.locality})</span>
                        </div>

                        {/* High-Contrast Status Badge */}
                        <div>
                          {renderStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Middle: Service, Vehicle & Schedule info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                        
                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {booking.vehicleType === 'Bike' ? (
                            <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Car className="w-4 h-4 text-brand-600 shrink-0" />
                          )}
                          <div>
                            {/* <span className="text-[10px] text-slate-400 block uppercase font-bold">Vehicle</span> */}
                            <span className="font-mono font-bold text-slate-900">{booking.vehicleNumber}</span>
                            <span className="text-[11px] text-slate-500 block truncate">{booking.vehicleModel}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                          <div>
                            {/* <span className="text-[10px] text-slate-400 block uppercase font-bold">Schedule</span> */}
                            <span className="font-bold text-slate-900">{booking.bookingDate}, {booking.slotTime}</span>
                            <span className="text-[11px] text-slate-500 block">Ref: {booking.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            {/* <span className="text-[10px] text-slate-400 block uppercase font-bold">Service & Amount</span> */}
                            <span className="font-bold text-slate-900 truncate block">{booking.serviceName}</span>
                            <span className="font-black text-brand-600">₹{booking.price}</span>
                          </div>
                        </div>

                      </div>

                      {/* Status Explanatory Notices */}
                      {isPending && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-ping"></span>
                          <div>
                            <strong>Awaiting Center Approval:</strong> The operator is checking bay slot availability. Your 4-digit verification code will unlock the moment they accept!
                          </div>
                        </div>
                      )}

                      {isAccepted && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <strong>Confirmed & Ready!</strong> Please show your unlocked 4-digit code below to the bay operator when driving in.
                          </div>
                        </div>
                      )}

                      {isRejected && (
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                          <div>
                            <strong>Slot Full :</strong> The center is experiencing high bay traffic or maintenance. Please select another slot.
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            <span>Service Completed & Delivered</span>
                          </span>
                          <Link
                            to={`/center/${booking.centerId}`}
                            className="font-bold text-brand-600 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Leave a Review ★</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Right: Customer-Held OTP Verification Lifecycle (Requirement #2) */}
                    <div className="lg:border-l lg:border-slate-200 lg:pl-6 text-center shrink-0 min-w-[210px] flex flex-col justify-center items-center">
                      
                      {/* Case 1: Booking is ACCEPTED - Display high-contrast badge */}
                      {isAccepted && (
                        <div className="w-full bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-300 p-3.5 rounded-2xl border-2 border-amber-500 shadow-md text-slate-600">
                          <span className="text-[10px] font-black uppercase tracking-wider block text-slate-900 mb-1">
                            Wash Verification Code
                          </span>

                          <div className="bg-slate-900 text-amber-300 font-mono font-black text-2xl py-2 px-3 rounded-xl tracking-widest shadow-inner my-1.5 border border-amber-400">
                            OTP: {booking.otp}
                          </div>

                          <span className="text-[10px] font-bold text-slate-800 block mt-1">
                            Show this to operator at bay gate
                          </span>
                        </div>
                      )}

                      {/* Case 2: Booking is PENDING - Locked notice */}
                      {isPending && (
                        <div className="w-full bg-slate-100 p-3.5 rounded-2xl border border-slate-200 text-slate-500">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-1.5 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Code Locked
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                            Unlocks once center confirms your bay
                          </span>
                        </div>
                      )}

                      {/* Case 3: Completed */}
                      {isCompleted && (
                        <div className="w-full bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-900">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                          <span className="text-xs font-black block">Code Verified</span>
                          <span className="text-[10px] text-emerald-700 block">Job Completed</span>
                        </div>
                      )}

                      {/* Case 4: Rejected */}
                      {isRejected && (
                        <div className="w-full bg-rose-50 p-3 rounded-2xl border border-rose-200 text-rose-800">
                          <XCircle className="w-6 h-6 text-rose-500 mx-auto mb-1" />
                          <span className="text-xs font-bold block">No Code</span>
                          <span className="text-[10px] text-rose-600 block">Slot Declined</span>
                        </div>
                      )}

                      {/* Quick link to test vendor terminal */}
                      {/* <button
                        type="button"
                        onClick={() => handleTestAsVendor(booking.centerId)}
                        className="mt-3 text-[11px] font-bold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
                      >
                        <span>Open in Vendor View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button> */}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              No Bookings Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              You haven't scheduled any vehicle washes yet. Explore top Bengaluru centers in HSR Layout, Indiranagar, and Koramangala.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Washing Centers</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
