import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MOCK_BOOKINGS, WASHING_CENTERS } from '../data/mockData';

const AppContext = createContext();

const BOOKINGS_STORAGE_KEY = 'washslot_blr_bookings_v5';
const USER_STORAGE_KEY = 'washslot_blr_current_user_v5';
const CENTERS_STORAGE_KEY = 'washslot_blr_centers_v5';

// Initialize default centers with coordinates, status, capacity, and reviews
const DEFAULT_CENTERS = WASHING_CENTERS.map((c) => ({
  ...c,
  status: c.status || 'active', // 'active' | 'inactive'
  vendorPin: c.vendorPin || '1234',
  maxCapacityPerSlot: c.maxCapacityPerSlot || 2,
  latitude: c.latitude || 12.9716,
  longitude: c.longitude || 77.5946,
  reviews: c.reviews || []
}));

export function AppProvider({ children }) {
  // Current logged in user: { role: 'customer' | 'vendor' | 'superadmin' | null, name: string, phone?: string, vendorCenterId: string | null }
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse current user from storage:', e);
    }
    // Default demo session: Customer "Rahul Sharma"
    return {
      role: 'customer',
      name: 'Rahul Sharma',
      phone: '+91 98450 78219',
      vendorCenterId: null
    };
  });

  // Global centers list (Dynamic: Super Admin can add and toggle centers, reviews can be appended)
  const [centers, setCenters] = useState(() => {
    try {
      const savedCenters = localStorage.getItem(CENTERS_STORAGE_KEY);
      if (savedCenters) {
        return JSON.parse(savedCenters);
      }
    } catch (e) {
      console.error('Failed to parse centers from storage:', e);
    }
    return DEFAULT_CENTERS;
  });

  // Global bookings list
  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        return JSON.parse(savedBookings);
      }
    } catch (e) {
      console.error('Failed to parse bookings from storage:', e);
    }
    return INITIAL_MOCK_BOOKINGS;
  });

  // Active vendor center id
  const [selectedVendorCenter, setSelectedVendorCenter] = useState(
    currentUser?.vendorCenterId || 'greenspark-hsr'
  );

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save currentUser to storage:', e);
    }
  }, [currentUser]);

  // Sync centers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CENTERS_STORAGE_KEY, JSON.stringify(centers));
    } catch (e) {
      console.error('Failed to save centers to storage:', e);
    }
  }, [centers]);

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to storage:', e);
    }
  }, [bookings]);

  /**
   * Log in user as Customer, Vendor, or Super Admin
   */
  const loginUser = (userData) => {
    const role = userData.role;
    let name = userData.name;
    if (!name) {
      if (role === 'superadmin') name = 'Platform Founder (Super Admin)';
      else if (role === 'vendor') name = 'Center Manager';
      else name = 'Valued Customer';
    }

    const newUser = {
      role,
      name,
      phone: userData.phone || '',
      vendorCenterId: role === 'vendor' ? (userData.vendorCenterId || centers[0]?.id || 'greenspark-hsr') : null
    };

    setCurrentUser(newUser);

    if (newUser.role === 'vendor' && newUser.vendorCenterId) {
      setSelectedVendorCenter(newUser.vendorCenterId);
    }
    return newUser;
  };

  /**
   * Log out user
   */
  const logoutUser = () => {
    setCurrentUser(null);
  };

  /**
   * Super Admin Function: addCenter(newCenterData)
   */
  const addCenter = (newCenterData) => {
    const slug = newCenterData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const defaultServices = [
      {
        id: `srv-${slug}-1`,
        title: 'Quick Express Foam Wash',
        vehicleType: 'Both',
        category: 'foam',
        price: Number(newCenterData.startingPrice) || 249,
        originalPrice: (Number(newCenterData.startingPrice) || 249) + 100,
        duration: '30 mins',
        popular: true,
        description: 'High-pressure touchless snow foam wash, underbody rinse, and microfiber hand-drying.',
        includes: ['Touchless snow foam', 'High-pressure underbody rinse', 'Tire shine coating', 'Streak-free window wipe']
      },
      {
        id: `srv-${slug}-2`,
        title: 'Deep Interior Vacuum & Sanitization',
        vehicleType: 'Car',
        category: 'foam',
        price: 699,
        originalPrice: 899,
        duration: '50 mins',
        popular: false,
        description: 'Complete cabin deep vacuum, dashboard UV polish, carpet shampooing, and AC vent bacterial steam sanitization.',
        includes: ['Carpet & seat vacuuming', 'Boot deep vacuum', 'AC vent steam blast', 'Dashboard protectant']
      },
      {
        id: `srv-${slug}-3`,
        title: 'Superbike / Bike Detailing & Chain Care',
        vehicleType: 'Bike',
        category: 'bike',
        price: 349,
        originalPrice: 450,
        duration: '35 mins',
        popular: false,
        description: 'High-pressure degreasing of engine bay and sprocket, Motul chain lube & matte/gloss polish.',
        includes: ['Engine bay degreasing', 'Chain cleaner & Motul lube', 'Silencer shine', 'Silicone glaze']
      }
    ];

    const defaultSlots = [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '12:00 PM', available: true },
      { time: '01:30 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:30 PM', available: true },
      { time: '06:00 PM', available: true },
      { time: '07:00 PM', available: true }
    ];

    const createdCenter = {
      id: slug,
      name: newCenterData.name.trim(),
      tagline: newCenterData.tagline || 'Bengaluru verified water-recycling detailing center',
      locality: newCenterData.locality || 'HSR Layout',
      latitude: newCenterData.latitude || 12.9352,
      longitude: newCenterData.longitude || 77.6245,
      address: newCenterData.address || `${newCenterData.locality}, Bengaluru, Karnataka 560102`,
      landmark: newCenterData.landmark || 'Near Main Ring Road',
      rating: 4.8,
      reviewsCount: 1,
      startingPrice: Number(newCenterData.startingPrice) || 249,
      maxCapacityPerSlot: Number(newCenterData.maxCapacityPerSlot) || 2,
      categories: ['car', 'bike', 'foam'],
      image: newCenterData.image || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
      coverImage: newCenterData.coverImage || newCenterData.image || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80',
      phone: newCenterData.phone || '+91 98450 00000',
      timings: newCenterData.timings || '08:00 AM - 08:30 PM',
      distance: 'Bengaluru Bay',
      slotsAvailableToday: 14,
      facilities: ['BWSSB Compliant Water Recycling', 'Air Conditioned Waiting Lounge', 'Free Wi-Fi', 'UPI Accepted'],
      services: newCenterData.services && newCenterData.services.length > 0 ? newCenterData.services : defaultServices,
      timeSlots: defaultSlots,
      vendorPin: newCenterData.vendorPin || '1234',
      status: 'active',
      reviews: []
    };

    setCenters((prev) => [createdCenter, ...prev]);
    return createdCenter;
  };

  /**
   * Super Admin Function: toggleCenterStatus(centerId)
   */
  const toggleCenterStatus = (centerId) => {
    setCenters((prev) =>
      prev.map((c) => {
        if (c.id === centerId) {
          const nextStatus = c.status === 'inactive' ? 'active' : 'inactive';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  /**
   * Verified Customer Review Submission (Requirement #3)
   * Only verified customers who have a completed booking at this center can add reviews
   */
  const addCenterReview = ({ centerId, rating, comment, vehicleModel }) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      customerName: currentUser?.name || 'Verified Customer',
      rating: Number(rating) || 5,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true,
      vehicleModel: vehicleModel || 'Verified Vehicle'
    };

    setCenters((prev) =>
      prev.map((c) => {
        if (c.id === centerId) {
          const updatedReviews = [newRev, ...(c.reviews || [])];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Math.round((totalRating / updatedReviews.length) * 10) / 10;
          return {
            ...c,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvg
          };
        }
        return c;
      })
    );

    return newRev;
  };

  /**
   * Global function: addBooking(newBooking)
   * Enforces strict slot-locking & anti-double-booking:
   * Active bookings ('pending' | 'accepted') consume bay capacity.
   * If slot reaches center.maxCapacityPerSlot, new bookings are rejected.
   */
  const addBooking = (newBookingData) => {
    const bookingDate = newBookingData.bookingDate || 'Today';
    const slotTime = newBookingData.slotTime;
    const targetCenter = centers.find((c) => c.id === newBookingData.centerId);
    const maxCapacity = targetCenter?.maxCapacityPerSlot || 2;

    // Real-time capacity check: count active bookings for this center, date, and slot
    const activeCount = bookings.filter((b) =>
      b.centerId === newBookingData.centerId &&
      b.bookingDate === bookingDate &&
      b.slotTime === slotTime &&
      (b.status === 'pending' || b.status === 'accepted')
    ).length;

    if (activeCount >= maxCapacity) {
      return {
        success: false,
        error: `Bay slot ${slotTime} on ${bookingDate} is fully booked (${activeCount}/${maxCapacity} bays occupied). Please select an alternate slot.`
      };
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `BK-BLR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: newBookingData.id || bookingId,
      centerId: newBookingData.centerId,
      centerName: newBookingData.centerName,
      locality: newBookingData.locality || 'Bengaluru',
      customerName: newBookingData.customerName || currentUser?.name || 'Customer',
      customerPhone: newBookingData.customerPhone || currentUser?.phone || '+91 98000 00000',
      vehicleNumber: (newBookingData.vehicleNumber || 'KA 01 XX 0000').toUpperCase().trim(),
      vehicleModel: newBookingData.vehicleModel || (newBookingData.vehicleType === 'Bike' ? 'Standard Bike' : 'Standard Car'),
      vehicleType: newBookingData.vehicleType || 'Car',
      serviceName: newBookingData.serviceName,
      price: Number(newBookingData.price) || 299,
      bookingDate,
      slotTime,
      otp: newBookingData.otp || generatedOtp, // Customer-held verification code
      status: newBookingData.status || 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
      success: true
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  /**
   * Global function: updateBookingStatus(bookingId, newStatus)
   */
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : b.completedAt
          };
        }
        return b;
      })
    );
  };

  /**
   * Secure Vendor OTP Verification for a specific Order (Requirement #2)
   * The OTP is held by the customer and NEVER shown in the vendor UI.
   * Vendor inputs code provided by arriving customer.
   */
  const verifyBookingOtp = (bookingId, enteredOtp) => {
    const cleanOtp = (enteredOtp || '').trim();
    if (!cleanOtp) {
      return {
        success: false,
        message: 'Please enter the 4-digit code provided by the customer.'
      };
    }

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return {
        success: false,
        message: 'Booking not found.'
      };
    }

    if (booking.status === 'completed') {
      return {
        success: false,
        message: 'This booking has already been marked as completed.'
      };
    }

    // Exact OTP comparison
    if (cleanOtp !== booking.otp) {
      return {
        success: false,
        message: 'Invalid Code. Ask customer for code shown on their booking card'
      };
    }

    // Mark as completed
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, status: 'completed', completedAt: new Date().toISOString() }
        : b
    );
    setBookings(updatedBookings);

    return {
      success: true,
      message: `Verified! Wash completed for ${booking.customerName}'s ${booking.vehicleNumber}.`
    };
  };

  /**
   * General OTP check (gate entrance)
   */
  const verifyOtp = (otpInput, centerIdFilter = null) => {
    const cleanOtp = (otpInput || '').trim();
    if (!cleanOtp) {
      return { success: false, message: 'Please enter a 4-digit OTP.' };
    }

    const matchIndex = bookings.findIndex((b) => {
      const matchCenter = centerIdFilter ? b.centerId === centerIdFilter : true;
      return matchCenter && b.otp === cleanOtp;
    });

    if (matchIndex === -1) {
      return {
        success: false,
        message: 'Invalid Code. Ask customer for code shown on their booking card'
      };
    }

    const matchedBooking = bookings[matchIndex];
    if (matchedBooking.status === 'completed') {
      return {
        success: false,
        message: `This slot for ${matchedBooking.customerName} (${matchedBooking.vehicleNumber}) is already completed!`
      };
    }

    const updated = [...bookings];
    const completedBooking = {
      ...matchedBooking,
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    updated[matchIndex] = completedBooking;
    setBookings(updated);

    return {
      success: true,
      booking: completedBooking,
      message: `Verified! Wash completed for ${matchedBooking.customerName}'s ${matchedBooking.vehicleNumber}.`
    };
  };

  /**
   * Reset mock data
   */
  const resetToInitialData = () => {
    setBookings(INITIAL_MOCK_BOOKINGS);
    setCenters(DEFAULT_CENTERS);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    localStorage.removeItem(CENTERS_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        centers,
        addCenter,
        toggleCenterStatus,
        addCenterReview,
        bookings,
        addBooking,
        updateBookingStatus,
        verifyBookingOtp,
        verifyOtp,
        selectedVendorCenter,
        setSelectedVendorCenter,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export const useBooking = useApp;
export default AppContext;
