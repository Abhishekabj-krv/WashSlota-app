import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Bike, 
  Store, 
  ArrowRight, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BookingConfirmationModal({ booking, onClose }) {
  const navigate = useNavigate();
  const { loginUser } = useApp();
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(booking.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToVendorOrders = () => {
    loginUser({
      role: 'vendor',
      name: `${booking.centerName} (Manager)`,
      vendorCenterId: booking.centerId
    });
    onClose();
    navigate('/vendor/orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Glow Banner */}
        <div className="bg-gradient-to-r from-brand-600 via-sky-600 to-cyan-500 text-white p-6 sm:p-7 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition focus:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-white animate-bounce" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/25 uppercase tracking-wider text-white mb-2">
            Slot Requested
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Booking Submitted!
          </h2>
          <p className="text-xs text-sky-100 mt-1">
            Reference ID: <span className="font-mono font-bold">{booking.id}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Highlighted 4-Digit OTP Display */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-center relative shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Customer Verification OTP</span>
            </div>
            <p className="text-[11px] text-amber-700 mb-3">
              Show this 4-digit OTP to the bay operator when you arrive:
            </p>

            {/* OTP Digits */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              {booking.otp.split('').map((digit, idx) => (
                <div
                  key={idx}
                  className="w-12 h-14 bg-white border-2 border-amber-400 rounded-xl flex items-center justify-center text-2xl font-black font-mono text-slate-900 shadow-sm"
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopyOtp}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-300 shadow-2xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Copy OTP Code</span>
                </>
              )}
            </button>
          </div>

          {/* Slot & Vehicle Info Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs sm:text-sm">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">{booking.centerName}</h4>
                  <p className="text-xs text-slate-500">{booking.locality}, Bengaluru</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                ₹{booking.price}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Schedule</span>
                  <span className="font-bold text-slate-900">{booking.bookingDate}, {booking.slotTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {booking.vehicleType === 'Bike' ? (
                  <Bike className="w-4 h-4 text-slate-400" />
                ) : (
                  <Car className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Vehicle</span>
                  <span className="font-bold text-slate-900">{booking.vehicleNumber}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 border-t border-slate-200 flex justify-between">
              <span>Service Selected:</span>
              <span className="font-bold text-slate-800">{booking.serviceName}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoToVendorOrders}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Simulate Vendor View (Accept/Reject Order)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/my-bookings');
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Go to My Bookings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
