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
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { centers, bookings, currentUser, addBooking, addCenterReview } = useApp();

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
    currentUser?.name || 'Rahul Sharma'
  );
  const [customerPhone, setCustomerPhone] = useState(
    currentUser?.phone || '+91 98450 78219'
  );
  const [vehicleNumber, setVehicleNumber] = useState('KA 01 MQ 7842');
  const [vehicleModel, setVehicleModel] = useState('Hyundai Creta 1.5');
  const [formError, setFormError] = useState('');

  // Verified review form state (Requirement #3)
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

  // Requirement #3: Check if logged-in customer has a completed booking at this center
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

  const handleBookSlot = (e) => {
    e.preventDefault();

    if (!vehicleNumber.trim()) {
      setFormError('Please enter your vehicle registration number (e.g. KA 01 AB 1234)');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter your name');
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

    // Create the booking with status: 'pending'
    const bookingResult = addBooking({
      centerId: center.id,
      centerName: center.name,
      locality: center.locality,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleType: selectedService.vehicleType,
      serviceName: selectedService.title,
      price: selectedService.price,
      bookingDate: selectedDate,
      slotTime: selectedSlot,
      status: 'pending'
    });

    if (bookingResult && bookingResult.error) {
      setFormError(bookingResult.error);
      return;
    }

    // Automatically redirect customer to /my-bookings
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb & Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Centers</span>
          </Link>

          <span className="text-xs font-semibold text-slate-400">
            Bengaluru / {center.locality} / <span className="text-slate-700">{center.name}</span>
          </span>
        </div>

        {/* Center Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-8">
          <div className="relative h-60 sm:h-80 w-full bg-slate-900">
            <img
              src={center.coverImage || center.image}
              alt={center.name}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Banner Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-brand-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {center.locality}
                  </span>
                  <div className="bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{center.rating}</span>
                    <span className="text-slate-800 font-medium">({center.reviewsCount || (center.reviews?.length || 0)} reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {center.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {center.tagline}
                </p>
              </div>

              <div className="text-xs sm:text-sm bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 space-y-1 shrink-0">
                <div className="flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{center.timings}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{center.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & Address bar */}
          <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">{center.address}</span>
                <span className="text-slate-500 block text-xs">Landmark: {center.landmark}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-900 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Max {center.maxCapacityPerSlot || 2} Bays / Timeslot</span>
              </span>

              {center.facilities?.map((fac, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{fac}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: Left Column (Services, Slot Picker, Details, Reviews) & Right Column (Sticky Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Select Service */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Step 1 of 3
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    Select Your Wash Service
                  </h2>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setServiceFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      serviceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    All Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceFilter('car')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      serviceFilter === 'car' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Car Wash
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceFilter('bike')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      serviceFilter === 'bike' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Bike Wash
                  </button>
                </div>
              </div>

              {/* Service Cards List */}
              <div className="space-y-4">
                {visibleServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                service.vehicleType === 'Bike'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {service.vehicleType}
                            </span>
                            {service.popular && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                Most Popular
                              </span>
                            )}
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {service.duration}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {service.description}
                          </p>

                          {/* Checklist */}
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {service.includes?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
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

            {/* Step 2: DYNAMIC SLOT CAPACITY MANAGEMENT (Requirement #4) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Step 2 of 3
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Max {center.maxCapacityPerSlot || 2} vehicles per slot
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Pick Guaranteed Bay Time Slot
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time hydraulic bay allocation. Overcrowded slots are locked automatically.
                </p>
              </div>

              {/* Date Selection Tabs */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
                {dateOptions.map((opt) => {
                  const isDateActive = selectedDate === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedDate(opt.label)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        isDateActive
                          ? 'border-brand-600 bg-brand-50/50 shadow-2xs'
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

              {/* Dynamic Time Slots Grid with Capacity Check (Requirement #4) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Bay Availability for {selectedDate}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                  {center.timeSlots.map((slot, idx) => {
                    const maxCapacity = center.maxCapacityPerSlot || 2;
                    
                    // Dynamic capacity check: active bookings ('pending' | 'accepted') lock slot capacity
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
                        
                        {/* If activeCount >= maxCapacityPerSlot, label "SLOT FULL / LOCKED" */}
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

            {/* Step 3: Vehicle & Customer Information Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 3 of 3
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Vehicle & Contact Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Required by the wash operator to verify your vehicle on the hydraulic ramp.
                </p>
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
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    e.g. KA-01 (Koramangala), KA-03 (Indiranagar), KA-05 (Jayanagar)
                  </span>
                </div>

                {/* Vehicle Model */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Brand & Model
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Hyundai Creta / RE Hunter 350"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm text-slate-900 font-medium"
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm text-slate-900 font-medium"
                    required
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-sm text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* VERIFIED-ONLY CUSTOMER REVIEWS (Requirement #3) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              
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
                    100% Verified reviews from customers with completed bookings
                  </p>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {center.reviews?.length || 0} reviews verified
                </span>
              </div>

              {/* Review Submission Form / Locked Message (Requirement #3) */}
              <div className="rounded-2xl p-5 border transition-all">
                {hasCompletedBooking ? (
                  /* Verified Customer Form: Interactive Star Rating + Comment */
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

                    {/* Interactive Star Picker */}
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
                            className="p-1 focus:outline-hidden hover:scale-110 transition"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                (hoverRating || userRating) >= star
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-slate-700">
                          {userRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="How was the foam wash, waiting lounge, and bay speed? Share your experience with Bengaluru drivers..."
                        required
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-600 text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                ) : (
                  /* Locked Message for non-completed customers (Requirement #3) */
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-1">
                      <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Reviews Reserved for Verified Bay Visitors
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Only verified customers who have completed a wash service at this center can leave a review.
                    </p>
                    <span className="inline-block text-[11px] font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                      Tip: Book a slot above, get it completed in Vendor mode, and return here to unlock your review!
                    </span>
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
                  Awaiting Approval
                </span>
              </h3>

              {/* Summary Details */}
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
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST:</span>
                    <span>Inclusive</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-black text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-xl text-brand-600">₹{selectedService.price}</span>
                  </div>
                </div>
              </div>

              {/* Requirement: Clicking "Confirm & Book Slot" creates booking with initial status: 'pending' and redirects to /my-bookings */}
              <button
                type="button"
                onClick={handleBookSlot}
                className="w-full mt-2 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Confirm & Book Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-3">
                Booking sends an instant approval request to {center.name}.
              </p>
            </div>

            {/* Guaranteed Zero-Queue Banner */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">100% Zero-Wait Guarantee</span>
                <span className="text-emerald-700 text-[11px]">
                  Your slot request is verified directly by the washing bay team. Pay at center upon OTP entry.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
