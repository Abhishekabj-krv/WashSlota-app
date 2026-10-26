import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  CheckCircle, 
  Calendar, 
  Car, 
  Bike, 
  Sparkles, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  User, 
  Lock, 
  MessageSquare, 
  CheckCircle2, 
  Navigation,
  X,
  Crown,
  KeyRound,
  ExternalLink,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    centers, 
    bookings, 
    currentUser, 
    addBooking, 
    addCenterReview, 
    registerCustomer 
  } = useApp();

  // Find center by id from dynamic centers list
  const center = useMemo(() => {
    return centers.find((c) => c.id === id) || centers[0];
  }, [centers, id]);

  // Dynamic booking state
  const [selectedServiceId, setSelectedServiceId] = useState(
    center.services[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(
    center.timeSlots[0]?.time || '10:00 AM'
  );

  // Customer vehicle & contact info (pre-fill from currentUser if available)
  const [customerName, setCustomerName] = useState(
    currentUser?.role === 'customer' ? (currentUser.name || '') : ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    currentUser?.role === 'customer' ? (currentUser.phone || '') : ''
  );
  const [vehicleNumber, setVehicleNumber] = useState('KA 01 MQ 7842');
  const [vehicleModel, setVehicleModel] = useState('Hyundai Creta 1.5');
  const [formError, setFormError] = useState('');

  // Lazy Customer Checkout Modal state (Requirement #1)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [lazyName, setLazyName] = useState(customerName || 'Rahul Sharma');
  const [lazyPhone, setLazyPhone] = useState(customerPhone || '+91 98450 78219');
  const [otpStep, setOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Verified review form state
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState('');

  // Filter service category tab (All / Car / Bike)
  const [serviceFilter, setServiceFilter] = useState('all');

  const selectedService = useMemo(() => {
    return center.services.find((s) => s.id === selectedServiceId) || center.services[0];
  }, [center, selectedServiceId]);

  // Filtered services
  const visibleServices = useMemo(() => {
    if (serviceFilter === 'all') return center.services;
    if (serviceFilter === 'car') return center.services.filter(s => s.vehicleType === 'Car' || s.vehicleType === 'Both');
    if (serviceFilter === 'bike') return center.services.filter(s => s.vehicleType === 'Bike' || s.vehicleType === 'Both');
    return center.services;
  }, [center, serviceFilter]);

  // Days tab data
  const dateOptions = [
    { label: 'Today', subText: 'Oct 22' },
    { label: 'Tomorrow', subText: 'Oct 23' },
    { label: 'Friday', subText: 'Oct 24' }
  ];

  // Check if logged-in customer has a completed booking at this center (Verified Review Guardrail)
  const hasCompletedBooking = useMemo(() => {
    if (!currentUser || currentUser.role !== 'customer') return false;
    return bookings.some((b) => {
      const matchCenter = b.centerId === center.id;
      const matchStatus = b.status === 'completed';
      const matchPhone = currentUser.phone ? b.customerPhone === currentUser.phone : false;
      const matchName = currentUser.name ? b.customerName?.toLowerCase() === currentUser.name?.toLowerCase() : false;
      return matchCenter && matchStatus && (matchPhone || matchName);
    });
  }, [bookings, center.id, currentUser]);

  // Handle Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addCenterReview({
      centerId: center.id,
      rating: userRating,
      comment: reviewComment.trim(),
      vehicleModel: vehicleModel || 'Verified Customer'
    });

    setReviewComment('');
    setReviewSubmittedNotice('Thank you! Your verified review has been published.');
    setTimeout(() => setReviewSubmittedNotice(''), 3000);
  };

  // Direct Booking Execution helper
  const executeBooking = (finalName, finalPhone) => {
    const bookingResult = addBooking({
      centerId: center.id,
      centerName: center.name,
      locality: center.locality,
      customerName: finalName.trim(),
      customerPhone: finalPhone.trim(),
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleModel: vehicleModel.trim() || 'Standard Vehicle',
      vehicleType: selectedService.vehicleType,
      serviceName: selectedService.title,
      price: selectedService.price,
      bookingDate: selectedDate,
      slotTime: selectedSlot,
      status: 'pending'
    });

    if (bookingResult && bookingResult.error) {
      setFormError(bookingResult.error);
      return false;
    }

    setIsCheckoutModalOpen(false);
    navigate('/my-bookings');
    return true;
  };

  // Main Booking Button Trigger (Handles Lazy Registration Flow)
  const handleBookSlot = (e) => {
    if (e) e.preventDefault();

    if (!vehicleNumber.trim()) {
      setFormError('Please enter your vehicle registration number (e.g. KA 01 AB 1234)');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    if (!selectedSlot) {
      setFormError('Please select an available time slot');
      return;
    }

    // Dynamic anti-double-booking check: verify slot capacity for selected date & time
    const activeCount = bookings.filter(
      (b) =>
        b.centerId === center.id &&
        b.bookingDate === selectedDate &&
        b.slotTime === selectedSlot &&
        (b.status === 'pending' || b.status === 'accepted')
    ).length;

    const maxCapacity = center.maxCapacityPerSlot || 2;
    if (activeCount >= maxCapacity) {
      setFormError(`Slot "${selectedSlot}" on ${selectedDate} is full / locked (${activeCount}/${maxCapacity} bays reserved). Please pick an available slot.`);
      return;
    }

    setFormError('');

    // Requirement #1: If customer is NOT logged in, open the frictionless Lazy Checkout Modal!
    if (!currentUser || currentUser.role !== 'customer') {
      const demoOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(demoOtp);
      setLazyName(customerName );
      setLazyPhone(customerPhone);
      setOtpStep(false);
      setOtpError('');
      setIsCheckoutModalOpen(true);
      return;
    }

    // Already logged in as customer: proceed directly
    executeBooking(currentUser.name, currentUser.phone || customerPhone );
  };

  // Send simulated SMS OTP in modal
  const handleSendLazyOtp = (e) => {
    e.preventDefault();
    if (!lazyName.trim()) {
      setOtpError('Please enter your full name');
      return;
    }
    if (!lazyPhone.trim() || lazyPhone.length < 8) {
      setOtpError('Please enter a valid mobile number');
      return;
    }

    setOtpError('');
    const demoOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(demoOtp);
    setOtpStep(true);
  };

  // Confirm OTP & Complete Lazy Registration + Booking
  const handleVerifyLazyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '1234') {
      setOtpError(`Invalid code. Please enter the demo SMS code: ${generatedOtp}`);
      return;
    }

    setOtpError('');
    setIsBookingSubmitting(true);

    // Save profile instantly to context & localStorage
    registerCustomer({
      name: lazyName.trim(),
      phone: lazyPhone.trim()
    });

    setTimeout(() => {
      setIsBookingSubmitting(false);
      executeBooking(lazyName, lazyPhone);
    }, 600);
  };

  // Instant 1-click verify shortcut for maximum UX speed
  const handleInstantAutoVerify = () => {
    setEnteredOtp(generatedOtp);
    setIsBookingSubmitting(true);
    registerCustomer({
      name: lazyName.trim(),
      phone: lazyPhone.trim() 
    });
    setTimeout(() => {
      setIsBookingSubmitting(false);
      executeBooking(lazyName, lazyPhone);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Link & Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-600 transition p-1.5 -ml-1.5 rounded-xl hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bengaluru Studios</span>
          </Link>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Hyperlocal Studio Profile
          </span>
        </div>

        {/* Founder / Super Admin Operations View (Requirement #2) */}
        {currentUser?.role === 'superadmin' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-yellow-300 shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-400/30">
                    Founder Ops Control
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    PIN: {center.vendorPin || '1234'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Owner Contact: <strong className="text-white font-mono">{center.adminContactNumber || center.phone}</strong></span>
                  <span>•</span>
                  <span>Customer Support: <strong className="text-slate-300 font-mono">{center.phone}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <a
                href={`tel:${center.adminContactNumber || center.phone}`}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Owner</span>
              </a>
              <Link
                to="/admin/dashboard"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Admin Directory
              </Link>
            </div>
          </div>
        )}

        {/* Hero Studio Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl min-h-[220px] sm:min-h-[280px] flex flex-col justify-end p-6 sm:p-8">
          <img
            src={center.coverImage || center.image}
            alt={center.name}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500 text-white">
                Verified Studio
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md">
                {center.locality}, Bengaluru
              </span>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>{center.rating} ({center.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {center.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
              {center.tagline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="truncate max-w-xs">{center.address}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>{center.timings}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>{center.phone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* Left Column (8 cols): Service, Slot, Vehicle Info */}
          <div className="lg:col-span-8 space-y-6">

            {/* Step 1: Services Selection */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Step 1 of 3
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    Select Washing Service
                  </h2>
                </div>

                {/* Service Filter Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setServiceFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      serviceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    All Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceFilter('car')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      serviceFilter === 'car' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Cars
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceFilter('bike')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      serviceFilter === 'bike' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Bikes
                  </button>
                </div>
              </div>

              {/* Service Cards List */}
              <div className="space-y-3">
                {visibleServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              service.vehicleType === 'Bike'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}>
                              {service.vehicleType}
                            </span>
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {service.duration}
                            </span>
                            {/* {service.popular && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                                Most Popular
                              </span>
                            )} */}
                          </div>

                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {service.description}
                          </p>

                          {/* {service.includes && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {service.includes.map((inc, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                                >
                                  ✓ {inc}
                                </span>
                              ))}
                            </div>
                          )} */}
                        </div>

                        {/* Price & Selection Indicator */}
                        <div className="text-right shrink-0">
                          <div className="flex items-baseline justify-end gap-1.5">
                            <span className="text-xl sm:text-2xl font-black text-slate-900">
                              ₹{service.price}
                            </span>
                            {service.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{service.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex justify-end">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                                isSelected
                                  ? 'border-brand-600 bg-brand-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Hydraulic Bay Slot Capacity Management */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Step 2 of 3
                  </span>
                  {/* <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Max {center.maxCapacityPerSlot || 2} bays/slot
                  </span> */}
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Pick Guaranteed Bay Time Slot
                </h2>
                {/* <p className="text-xs text-slate-500 mt-1">
                  Active bookings strictly consume bay capacity. Full slots are automatically locked.
                </p> */}
              </div>

              {/* Date Selection Tabs */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5">
                {dateOptions.map((opt) => {
                  const isDateActive = selectedDate === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedDate(opt.label)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        isDateActive
                          ? 'border-brand-600 bg-brand-50/60 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className={`block text-xs font-bold ${isDateActive ? 'text-brand-700' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {opt.subText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Time Slots Grid with Capacity Check */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Bay Availability for {selectedDate}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                  {center.timeSlots.map((slot, idx) => {
                    const maxCapacity = center.maxCapacityPerSlot || 2;
                    
                    // Count active bookings ('pending' | 'accepted')
                    const activeCount = bookings.filter(
                      (b) =>
                        b.centerId === center.id &&
                        b.bookingDate === selectedDate &&
                        b.slotTime === slot.time &&
                        (b.status === 'pending' || b.status === 'accepted')
                    ).length;

                    const isSlotFull = activeCount >= maxCapacity;
                    const remainingBays = Math.max(0, maxCapacity - activeCount);
                    const isSelected = selectedSlot === slot.time;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isSlotFull}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3 rounded-xl border text-center transition relative font-semibold text-xs ${
                          isSlotFull
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-brand-400 hover:bg-slate-50'
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 mx-auto mb-1 ${isSlotFull ? 'text-slate-300' : isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{slot.time}</span>
                        
                        {isSlotFull ? (
                          <span className="block text-[9px] font-black uppercase mt-1 px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 tracking-wider">
                            SLOT FULL / LOCKED
                          </span>
                        ) : (
                          <span className={`block text-[9px] uppercase font-bold mt-1 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            {remainingBays} bay{remainingBays > 1 ? 's' : ''} left
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Vehicle Information Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
              <div className="mb-5">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 3 of 3
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Vehicle Registration Details
                </h2>
                {/* <p className="text-xs text-slate-500 mt-1">
                  Required by the washing bay team to verify your vehicle on the hydraulic ramp.
                </p> */}
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Registration Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="KA 01 AB 1234"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm font-mono font-bold tracking-wider uppercase text-slate-900"
                    required
                  />
                  {/* <span className="text-[10px] text-slate-400 mt-1 block">
                    e.g. KA-01 (Koramangala), KA-03 (Indiranagar), KA-05 (Jayanagar)
                  </span> */}
                </div>

                {/* Vehicle Model */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Hyundai Creta / RE Hunter 350"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Verified-Only Customer Reviews */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      Customer Reviews & Bay Ratings
                    </h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{center.rating}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    100% verified feedback from completed vehicle washes
                  </p>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {center.reviews?.length || 0} reviews verified
                </span>
              </div>

              {/* Review Form or Locked Notice */}
              <div className="rounded-2xl p-4 sm:p-5 border transition-all">
                {hasCompletedBooking ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Customer Access: You completed a wash at this center!</span>
                    </div>

                    {reviewSubmittedNotice && (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>{reviewSubmittedNotice}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Rate Your Experience (1 - 5 Stars):
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-hidden"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                (hoverRating || userRating) >= star
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Feedback / Comments:
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others about the water quality, wash time, and staff behavior..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-xs text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Publish Verified Review
                    </button>
                  </form>
                ) : (
                  <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-700">
                      Review Submission Locked
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Only verified customers who have completed a wash service at this center can leave a review.
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-3 pt-2">
                {center.reviews && center.reviews.length > 0 ? (
                  center.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {rev.customerName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Wash</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200 fill-slate-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Vehicle: {rev.vehicleModel || 'Standard Vehicle'}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No customer reviews yet. Be the first verified customer to complete a wash!
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Sticky Order Summary & Booking Trigger */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg shadow-slate-100">
              <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Booking Summary</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  Instant Bay Lock
                </span>
              </h3>

              <div className="py-4 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Center</span>
                  <span className="font-bold text-slate-900 block">{center.name}</span>
                  <span className="text-xs text-slate-500">{center.locality}, Bengaluru</span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Service</span>
                  <div className="flex justify-between items-start mt-0.5">
                    <div>
                      <span className="font-bold text-slate-900">{selectedService.title}</span>
                      <span className="text-xs text-slate-500 block">Est. Duration: {selectedService.duration}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">₹{selectedService.price}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                    <span className="font-bold text-slate-800">{selectedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Slot</span>
                    <span className="font-bold text-slate-800">{selectedSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehicle</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {vehicleNumber || 'Enter reg number'}
                  </span>
                  {vehicleModel && (
                    <span className="text-xs text-slate-500 block">({vehicleModel})</span>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Service Price:</span>
                    <span>₹{selectedService.price}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Bengaluru Zero-Wait Fee:</span>
                    <span>FREE (₹0)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-black text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-xl text-brand-600">₹{selectedService.price}</span>
                  </div>
                </div>
              </div>

              {/* Requirement: Clicking "Confirm & Book Slot" triggers checkout & redirects */}
              <button
                type="button"
                onClick={handleBookSlot}
                className="w-full mt-2 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Confirm & Book Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-3">
                No upfront payment required. Pay upon completion at bay.
              </p>
            </div>

            {/* Zero-Wait Guarantee Banner */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">100% Guaranteed Bay Allocation</span>
                <span className="text-emerald-700 text-[11px]">
                  Your private verification code unlocks once accepted. Zero queue guaranteed.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Bottom Floating Bar (Mobile-First Polish) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
            {selectedService.title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">₹{selectedService.price}</span>
            <span className="text-[11px] text-brand-600 font-semibold">• {selectedSlot}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBookSlot}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
        >
          <span>Confirm Slot</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lazy Customer Registration & Fast Checkout Modal (Requirement #1) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-700 via-sky-700 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-hidden"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-cyan-300">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                    Fast Checkout • No Prior Login Needed
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    Confirm Your Wash Slot
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Order Quick Summary Pill */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{center.name}</span>
                  <span className="font-mono font-bold text-brand-700">{vehicleNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{selectedService.title}</span>
                  <span className="font-black text-slate-900">₹{selectedService.price}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Schedule: <strong>{selectedDate}, {selectedSlot}</strong></span>
                  <span className="text-emerald-600 font-bold">Bay Guaranteed</span>
                </div>
              </div>

              {otpError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {!otpStep ? (
                /* Step 1: Name and Phone Number Input */
                <form onSubmit={handleSendLazyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={lazyName}
                        onChange={(e) => setLazyName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm font-semibold text-slate-900"
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
                        value={lazyPhone}
                        onChange={(e) => setLazyPhone(e.target.value)}
                        placeholder="PH No"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm font-semibold text-slate-900 font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      We will send your slot verification code and bay status updates here.
                    </span>
                  </div>

                  {/* Submit / Verification Trigger */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Quick Mobile Verification</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Instant 1-Click Fast Track Option */}
                    <button
                      type="button"
                      onClick={handleInstantAutoVerify}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant 1-Click Verification & Book</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Simulated SMS OTP Verification */
                <form onSubmit={handleVerifyLazyOtp} className="space-y-4">
                  {/* Demo Simulated SMS Toast */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block">Simulated SMS Verification</span>
                      <span className="text-amber-800 text-[11px] block mt-0.5">
                        Code sent to <strong>{lazyPhone}</strong>: <span className="font-mono font-black text-slate-900 bg-amber-200 px-1.5 py-0.2 rounded">OTP: {generatedOtp}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="px-2 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[10px] rounded-lg shrink-0 transition"
                    >
                      Auto-Fill
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 4-Digit SMS Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder={generatedOtp}
                      className="w-full px-3.5 py-3 rounded-xl border border-brand-300 bg-brand-50/30 text-center font-mono font-black text-xl tracking-widest text-slate-900 focus:bg-white focus:outline-hidden focus:border-brand-600"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={isBookingSubmitting}
                      className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      {isBookingSubmitting ? (
                        <span>Reserving Bay...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Booking & View OTP Card</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 py-1"
                    >
                      ← Change Phone Number / Name
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}