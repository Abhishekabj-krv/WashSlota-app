import React, { createContext, useContext, useState, useEffect } from 'react';
import { BENGALURU_STARTER_CENTERS_SEED } from '../data/mockData';
import {
  isSupabaseConfigured,
  supabase,
  signUpWithSupabase,
  signInWithSupabase,
  signInVendorWithPin,
  signInSuperAdmin,
  signOutWithSupabase,
  fetchCentersFromSupabase,
  syncCenterToSupabase,
  fetchBookingsFromSupabase,
  syncBookingToSupabase,
  updateBookingInSupabase,
  syncReviewToSupabase,
} from '../lib/supabase';

const AppContext = createContext();

const BOOKINGS_STORAGE_KEY = 'washslot_blr_bookings_v7';
const USER_STORAGE_KEY = 'washslot_blr_current_user_v7';
const CENTERS_STORAGE_KEY = 'washslot_blr_centers_v7';

export function AppProvider({ children }) {
  // Current user state (defaults to null for unauthenticated visitors)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse current user from storage:', e);
    }
    return null;
  });

  // Centers list: starts clean (empty), fetched dynamically from Supabase
  const [centers, setCenters] = useState(() => {
    try {
      const savedCenters = localStorage.getItem(CENTERS_STORAGE_KEY);
      if (savedCenters) {
        return JSON.parse(savedCenters);
      }
    } catch (e) {
      console.error('Failed to parse centers from storage:', e);
    }
    return [];
  });

  // Bookings list: starts clean (empty), fetched dynamically from Supabase
  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        return JSON.parse(savedBookings);
      }
    } catch (e) {
      console.error('Failed to parse bookings from storage:', e);
    }
    return [];
  });

  // Active vendor center id
  const [selectedVendorCenter, setSelectedVendorCenter] = useState(
    currentUser?.vendorCenterId || null
  );

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // 1. Listen for real Supabase Auth State Changes & Sync Session
  useEffect(() => {
    let subscription = null;

    if (isSupabaseConfigured && supabase) {
      // Fetch initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSessionUser(session.user);
        } else if (!currentUser || currentUser.role === 'customer') {
          // If no active Supabase session and user was a customer, clear
          if (!localStorage.getItem(USER_STORAGE_KEY)) {
            setCurrentUser(null);
          }
        }
        setIsLoadingAuth(false);
      });

      // Listen for auth state change
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await syncSessionUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      });

      subscription = data?.subscription;
    } else {
      setIsLoadingAuth(false);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Helper to load user profile from Supabase profiles table on sign in
  const syncSessionUser = async (authUser) => {
    try {
      let role = 'customer';
      let name = authUser.user_metadata?.name || 'Customer';
      let phone = authUser.user_metadata?.phone || '';
      let vendorCenterId = null;

      if (isSupabaseConfigured && supabase) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (prof) {
          name = prof.name || name;
          phone = prof.phone || phone;
          role = prof.role || role;
          vendorCenterId = prof.vendor_center_id || null;
        }
      }

      const userObj = {
        id: authUser.id,
        name,
        email: authUser.email,
        phone,
        role,
        vendorCenterId,
      };

      setCurrentUser(userObj);
      if (vendorCenterId) setSelectedVendorCenter(vendorCenterId);
    } catch (e) {
      console.warn('Session user sync error:', e);
    }
  };

  // 2. Fetch Centers dynamically from Supabase database on mount
  useEffect(() => {
    fetchCentersFromSupabase().then((data) => {
      if (Array.isArray(data)) {
        setCenters(data);
      }
    });
  }, []);

  // 3. Fetch Bookings dynamically from Supabase database on mount
  useEffect(() => {
    fetchBookingsFromSupabase().then((data) => {
      if (Array.isArray(data)) {
        setBookings(data);
      }
    });
  }, [currentUser]);

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
   * Real Supabase Customer Sign Up
   */
  const signUpCustomer = async ({ name, email, phone, password }) => {
    const res = await signUpWithSupabase({ name, email, phone, password });
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  /**
   * Real Supabase Customer Sign In
   */
  const signInCustomer = async ({ identifier, password }) => {
    const res = await signInWithSupabase({ identifier, password });
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  /**
   * Vendor Sign In
   */
  const signInVendor = async ({ centerId, pin }) => {
    const res = await signInVendorWithPin({ centerId, pin, centersList: centers });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSelectedVendorCenter(res.user.vendorCenterId);
    }
    return res;
  };

  /**
   * Super Admin Sign In (via hidden /founder-portal route)
   */
  const signInSuperAdminHandler = async ({ email, passcode }) => {
    const res = await signInSuperAdmin({ email, passcode });
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  /**
   * Generic loginUser helper for backward compatibility
   */
  const loginUser = (userData) => {
    const role = userData.role || 'customer';
    let name = userData.name;
    if (!name) {
      if (role === 'superadmin') name = 'Platform Founder (Super Admin)';
      else if (role === 'vendor') name = 'Center Manager';
      else name = 'Customer';
    }

    const newUser = {
      id: userData.id || `usr-${Date.now()}`,
      role,
      name,
      email: userData.email || '',
      phone: userData.phone || '',
      vendorCenterId: role === 'vendor' ? (userData.vendorCenterId || centers[0]?.id || null) : null,
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
  const logoutUser = async () => {
    await signOutWithSupabase();
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  /**
   * Lazy Customer Registration & Instant Session Creation (used during express checkout)
   */
  const registerCustomer = async (customerData) => {
    const name = customerData.name?.trim() || 'Valued Customer';
    const phone = customerData.phone?.trim() || '+91 98450 00000';
    const email = customerData.email?.trim() || `${phone.replace(/\D/g, '')}@washslot.blr`;

    const newCustomer = {
      id: `usr-${Date.now()}`,
      role: 'customer',
      name,
      email,
      phone,
      vendorCenterId: null,
    };

    setCurrentUser(newCustomer);
    return newCustomer;
  };

  /**
   * Super Admin Function: addCenter(newCenterData)
   * Dynamically adds a new washing studio to Supabase & local state
   */
  const addCenter = async (newCenterData) => {
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
        title: 'Complete Body Wash + Underchassis Blast',
        vehicleType: 'Car',
        category: 'car',
        price: (Number(newCenterData.startingPrice) || 249) + 200,
        originalPrice: (Number(newCenterData.startingPrice) || 249) + 350,
        duration: '45 mins',
        popular: true,
        description: '3-stage snow foam wash with dual underchassis rotating water nozzles and tire dressing.',
        includes: ['3-Stage Snow Foam', 'Underchassis high pressure', 'Microfiber hand dry', 'All-glass streakless clean']
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
      tagline: newCenterData.tagline || 'Bengaluru verified detailing studio',
      locality: newCenterData.locality || 'HSR Layout',
      latitude: Number(newCenterData.latitude) || 12.9352,
      longitude: Number(newCenterData.longitude) || 77.6245,
      address: newCenterData.address || `${newCenterData.locality}, Bengaluru, Karnataka 560102`,
      landmark: newCenterData.landmark || 'Near Main Ring Road',
      rating: 4.8,
      reviewsCount: 0,
      startingPrice: Number(newCenterData.startingPrice) || 249,
      maxCapacityPerSlot: Number(newCenterData.maxCapacityPerSlot) || 2,
      categories: ['car', 'bike', 'foam'],
      image: newCenterData.image || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
      coverImage: newCenterData.coverImage || newCenterData.image || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80',
      phone: newCenterData.phone || '+91 98450 00000',
      adminContactNumber: newCenterData.adminContactNumber?.trim() || newCenterData.phone?.trim() || '+91 98860 00000',
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

    // Sync to Supabase
    await syncCenterToSupabase(createdCenter);
    return createdCenter;
  };

  /**
   * Super Admin Function: Seed Starter Bengaluru Studios into clean database
   */
  const seedDefaultCenters = async () => {
    const starterCenters = BENGALURU_STARTER_CENTERS_SEED;
    setCenters(starterCenters);
    for (const c of starterCenters) {
      await syncCenterToSupabase(c);
    }
    return starterCenters;
  };

  /**
   * Super Admin Function: toggleCenterStatus(centerId)
   */
  const toggleCenterStatus = async (centerId) => {
    let targetCenter = null;
    setCenters((prev) =>
      prev.map((c) => {
        if (c.id === centerId) {
          const nextStatus = c.status === 'inactive' ? 'active' : 'inactive';
          targetCenter = { ...c, status: nextStatus };
          return targetCenter;
        }
        return c;
      })
    );

    if (targetCenter) {
      await syncCenterToSupabase(targetCenter);
    }
  };

  /**
   * Verified Customer Review Submission
   */
  const addCenterReview = async ({ centerId, rating, comment, vehicleModel }) => {
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

    await syncReviewToSupabase(newRev, centerId);
    return newRev;
  };

  /**
   * Slot-Locking & Booking Creation:
   * Active bookings ('pending' | 'accepted') consume bay capacity.
   */
  const addBooking = async (newBookingData) => {
    const bookingDate = newBookingData.bookingDate || 'Today';
    const slotTime = newBookingData.slotTime;
    const targetCenter = centers.find((c) => c.id === newBookingData.centerId);
    const maxCapacity = targetCenter?.maxCapacityPerSlot || 2;

    // Real-time slot conflict check
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
      customerEmail: newBookingData.customerEmail || currentUser?.email || '',
      vehicleNumber: (newBookingData.vehicleNumber || 'KA 01 XX 0000').toUpperCase().trim(),
      vehicleModel: newBookingData.vehicleModel || (newBookingData.vehicleType === 'Bike' ? 'Standard Bike' : 'Standard Car'),
      vehicleType: newBookingData.vehicleType || 'Car',
      serviceName: newBookingData.serviceName,
      price: Number(newBookingData.price) || 299,
      bookingDate,
      slotTime,
      otp: newBookingData.otp || generatedOtp,
      status: newBookingData.status || 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
      success: true
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Sync to Supabase
    await syncBookingToSupabase(newBooking);
    return newBooking;
  };

  /**
   * Update booking status
   */
  const updateBookingStatus = async (bookingId, newStatus) => {
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

    await updateBookingInSupabase(bookingId, newStatus);
  };

  /**
   * Customer-Held OTP Verification by Vendor
   */
  const verifyBookingOtp = async (bookingId, enteredOtp) => {
    const cleanOtp = (enteredOtp || '').trim();
    if (!cleanOtp) {
      return { success: false, message: 'Please enter the 4-digit code provided by the customer.' };
    }

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.status === 'completed') {
      return { success: false, message: 'This booking has already been marked as completed.' };
    }

    if (cleanOtp !== booking.otp) {
      return { success: false, message: 'Invalid Code. Ask customer for code shown on their booking card' };
    }

    const updatedBookings = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, status: 'completed', completedAt: new Date().toISOString() }
        : b
    );
    setBookings(updatedBookings);

    await updateBookingInSupabase(bookingId, 'completed');

    return {
      success: true,
      message: `Verified! Wash completed for ${booking.customerName}'s ${booking.vehicleNumber}.`
    };
  };

  /**
   * Reset mock data / clean state
   */
  const resetToInitialData = () => {
    setBookings([]);
    setCenters([]);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    localStorage.removeItem(CENTERS_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoadingAuth,
        signUpCustomer,
        signInCustomer,
        signInVendor,
        signInSuperAdmin: signInSuperAdminHandler,
        loginUser,
        logoutUser,
        registerCustomer,
        centers,
        setCenters,
        addCenter,
        seedDefaultCenters,
        toggleCenterStatus,
        addCenterReview,
        bookings,
        addBooking,
        updateBookingStatus,
        verifyBookingOtp,
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
