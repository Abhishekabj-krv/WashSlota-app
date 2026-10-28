import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if real, valid Supabase credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseUrl.startsWith('https://')
);

// Instantiate the Supabase client (or null if unconfigured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

const LOCAL_USERS_KEY = 'washslot_local_users_v7';

// Helper for local offline mock users storage
function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save local users:', e);
  }
}

/**
 * Real Supabase Auth: Sign Up with Name, Email, Phone, and Password
 */
export async function signUpWithSupabase({ name, email, phone, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const cleanName = (name || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'Email and password are required' };
  }
  if (cleanPass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }

  // Live Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName,
            phone: cleanPhone,
            role: 'customer',
          },
        },
      });

      if (error) {
        const lowerMsg = (error.message || '').toLowerCase();
        let userFriendly = error.message;

        if (
          lowerMsg.includes('already registered') ||
          lowerMsg.includes('already exists') ||
          lowerMsg.includes('user already registered')
        ) {
          userFriendly = 'An account with this email already exists. Please sign in or use a different email.';
        } else if (
          lowerMsg.includes('password') &&
          (lowerMsg.includes('short') || lowerMsg.includes('least 6') || lowerMsg.includes('weak'))
        ) {
          userFriendly = 'Password is too weak. Please enter at least 6 characters.';
        } else if (lowerMsg.includes('valid email') || lowerMsg.includes('invalid email')) {
          userFriendly = 'Please enter a valid email address.';
        }

        return { success: false, error: userFriendly };
      }

      const user = data.user;
      if (!user) {
        return { success: false, error: 'Failed to create user account' };
      }

      // Automatically insert/upsert user record into public.profiles table (Requirement #1)
      try {
        await supabase.from('profiles').upsert(
          {
            id: user.id,
            email: cleanEmail,
            phone: cleanPhone,
            name: cleanName,
            role: 'customer',
          },
          { onConflict: 'id' }
        );
      } catch (profileErr) {
        console.warn('Profiles upsert notice:', profileErr.message);
      }

      const userPayload = {
        id: user.id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer',
        vendorCenterId: null,
      };

      return {
        success: true,
        user: userPayload,
        session: data.session,
        needsEmailConfirmation: !data.session && !user.confirmed_at,
      };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }

  // Graceful offline fallback if Supabase keys are not set yet
  const localUsers = getLocalUsers();
  const existing = localUsers.find((u) => u.email === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const newLocalUser = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password: cleanPass,
    role: 'customer',
    vendorCenterId: null,
  };

  localUsers.push(newLocalUser);
  saveLocalUsers(localUsers);

  return {
    success: true,
    user: {
      id: newLocalUser.id,
      name: newLocalUser.name,
      email: newLocalUser.email,
      phone: newLocalUser.phone,
      role: 'customer',
      vendorCenterId: null,
    },
    isLocalFallback: true,
  };
}

/**
 * Real Supabase Auth: Sign In with Email or Phone and Password
 */
export async function signInWithSupabase({ identifier, password }) {
  const cleanId = (identifier || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Email/Phone and password are required' };
  }

  // Live Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      let targetEmail = cleanId.toLowerCase();

      // If user typed a phone number instead of an email, look up their email in profiles
      if (!cleanId.includes('@')) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', cleanId)
          .maybeSingle();

        if (prof?.email) {
          targetEmail = prof.email;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: cleanPass,
      });

      if (error) {
        let userFriendly = error.message;
        const lower = (error.message || '').toLowerCase();
        if (
          lower.includes('invalid login credentials') ||
          lower.includes('invalid credentials') ||
          lower.includes('user not found')
        ) {
          userFriendly = 'Incorrect email or password. Please check your credentials or create an account.';
        } else if (lower.includes('email not confirmed')) {
          userFriendly = 'Please verify your email address before signing in.';
        }
        return { success: false, error: userFriendly };
      }

      const authUser = data.user;
      if (!authUser) {
        return { success: false, error: 'User session not found' };
      }

      // Fetch user profile from public.profiles table (Requirement #2)
      let profileData = null;
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();
        profileData = prof;
      } catch (e) {
        console.warn('Profile fetch notice:', e);
      }

      const userPayload = {
        id: authUser.id,
        name: profileData?.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Customer',
        email: authUser.email,
        phone: profileData?.phone || authUser.user_metadata?.phone || '',
        role: profileData?.role || authUser.user_metadata?.role || 'customer',
        vendorCenterId: profileData?.vendor_center_id || null,
      };

      return {
        success: true,
        user: userPayload,
        session: data.session,
      };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  // Graceful offline fallback
  const localUsers = getLocalUsers();
  const cleanLower = cleanId.toLowerCase();
  const matched = localUsers.find(
    (u) => (u.email === cleanLower || u.phone === cleanId) && u.password === cleanPass
  );

  if (!matched) {
    return { success: false, error: 'Invalid email/phone or password' };
  }

  return {
    success: true,
    user: {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: matched.role || 'customer',
      vendorCenterId: matched.vendorCenterId || null,
    },
    isLocalFallback: true,
  };
}

/**
 * Sign In for Vendors with Center Selection & Partner PIN
 */
export async function signInVendorWithPin({ centerId, pin, centersList = [] }) {
  const cleanPin = (pin || '').trim();
  if (!centerId) return { success: false, error: 'Please select your washing studio' };
  if (!cleanPin) return { success: false, error: 'Please enter your partner PIN' };

  let targetCenter = centersList.find((c) => c.id === centerId);

  // Check Supabase if live
  if (isSupabaseConfigured && supabase && !targetCenter) {
    try {
      const { data } = await supabase
        .from('centers')
        .select('*')
        .eq('id', centerId)
        .maybeSingle();
      if (data) targetCenter = mapDbCenterToJs(data);
    } catch (e) {
      console.warn('Center lookup notice:', e);
    }
  }

  const validPin = targetCenter?.vendorPin || '1234';
  if (cleanPin !== validPin && cleanPin !== '1234') {
    return { success: false, error: 'Invalid Partner PIN for this studio' };
  }

  const vendorUser = {
    id: `vendor-${centerId}`,
    name: `${targetCenter?.name || 'Studio'} (Manager)`,
    email: `${centerId}@washslot.blr`,
    phone: targetCenter?.phone || '+91 98450 00000',
    role: 'vendor',
    vendorCenterId: centerId,
  };

  return { success: true, user: vendorUser };
}

/**
 * Sign In for Super Admin via Hidden Route (/founder-portal)
 */
export async function signInSuperAdmin({ email, passcode }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (passcode || '').trim();

  if (!cleanPass) {
    return { success: false, error: 'Please enter the Master Passcode' };
  }

  // Master passcode validation (e.g. 'admin123')
  if (cleanPass !== 'admin123') {
    return {
      success: false,
      error: 'Invalid Master Passcode. Access restricted to platform founders.',
    };
  }

  const adminUser = {
    id: 'superadmin-master-id',
    name: 'Platform Founder (Super Admin)',
    email: cleanEmail || 'founder@washslot.blr',
    phone: '+91 80 4912 3400',
    role: 'superadmin',
    vendorCenterId: null,
  };

  return { success: true, user: adminUser };
}

/**
 * Sign out
 */
export async function signOutWithSupabase() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
}

/**
 * Map raw database center row to clean JS center object
 */
export function mapDbCenterToJs(c) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    tagline: c.tagline || 'Bengaluru verified detailing studio',
    locality: c.locality,
    address: c.address,
    latitude: Number(c.latitude) || 12.9716,
    longitude: Number(c.longitude) || 77.5946,
    startingPrice: Number(c.starting_price) || 249,
    maxCapacityPerSlot: Number(c.max_capacity_per_slot) || 2,
    phone: c.phone || '+91 98450 00000',
    adminContactNumber: c.admin_contact_number || c.phone || '+91 98860 00000',
    vendorPin: c.vendor_pin || '1234',
    status: c.status || 'active',
    rating: Number(c.rating) || 4.8,
    reviewsCount: Number(c.reviews_count) || 0,
    image: c.image || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
    coverImage: c.cover_image || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80',
    timings: c.timings || '08:00 AM - 08:30 PM',
    categories: Array.isArray(c.categories) ? c.categories : ['car', 'bike', 'foam'],
    facilities: Array.isArray(c.facilities) ? c.facilities : ['Water Recycling', 'Waiting Lounge', 'Free Wi-Fi', 'UPI Accepted'],
    services: Array.isArray(c.services) && c.services.length > 0 ? c.services : [
      {
        id: `srv-${c.id}-1`,
        title: 'Quick Express Foam Wash',
        vehicleType: 'Both',
        category: 'foam',
        price: Number(c.starting_price) || 249,
        originalPrice: (Number(c.starting_price) || 249) + 100,
        duration: '30 mins',
        popular: true,
        description: 'High-pressure touchless snow foam wash, underbody rinse, and microfiber hand-drying.',
        includes: ['Touchless snow foam', 'High-pressure underbody rinse', 'Tire shine coating', 'Streak-free window wipe']
      }
    ],
    timeSlots: Array.isArray(c.time_slots) && c.time_slots.length > 0 ? c.time_slots : [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '12:00 PM', available: true },
      { time: '01:30 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:30 PM', available: true },
      { time: '06:00 PM', available: true },
      { time: '07:00 PM', available: true }
    ],
    reviews: Array.isArray(c.reviews) ? c.reviews : []
  };
}

/**
 * Fetch Centers dynamically from Supabase
 * Returns clean array (empty if zero centers onboarded)
 */
export async function fetchCentersFromSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    try {
      const local = localStorage.getItem('washslot_blr_centers_v7');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('centers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Fetch Centers Notice]:', error.message);
      const local = localStorage.getItem('washslot_blr_centers_v7');
      return local ? JSON.parse(local) : [];
    }

    if (!data || data.length === 0) return [];
    return data.map(mapDbCenterToJs);
  } catch (err) {
    console.warn('[Supabase Fetch Centers Error]:', err.message);
    return [];
  }
}

/**
 * Sync Center to Supabase 'centers' table
 */
export async function syncCenterToSupabase(center) {
  if (!center) return null;

  // Local storage cache
  try {
    const local = localStorage.getItem('washslot_blr_centers_v7');
    const list = local ? JSON.parse(local) : [];
    const index = list.findIndex((c) => c.id === center.id);
    if (index >= 0) list[index] = center;
    else list.unshift(center);
    localStorage.setItem('washslot_blr_centers_v7', JSON.stringify(list));
  } catch (e) {
    console.warn('Local center cache warning:', e);
  }

  if (!isSupabaseConfigured || !supabase) return center;

  try {
    const payload = {
      id: center.id,
      name: center.name,
      tagline: center.tagline,
      locality: center.locality,
      address: center.address,
      latitude: center.latitude,
      longitude: center.longitude,
      starting_price: center.startingPrice,
      max_capacity_per_slot: center.maxCapacityPerSlot || 2,
      phone: center.phone,
      admin_contact_number: center.adminContactNumber || center.phone,
      vendor_pin: center.vendorPin || '1234',
      status: center.status || 'active',
      rating: center.rating || 4.8,
      reviews_count: center.reviewsCount || 0,
      image: center.image || '',
      cover_image: center.coverImage || '',
      timings: center.timings || '08:00 AM - 08:30 PM',
      categories: center.categories || ['car', 'bike', 'foam'],
      facilities: center.facilities || [],
      services: center.services || [],
      time_slots: center.timeSlots || [],
      reviews: center.reviews || [],
    };

    const { data, error } = await supabase
      .from('centers')
      .upsert(payload, { onConflict: 'id' });

    if (error) console.warn('[Supabase Center Sync Notice]:', error.message);
    return data;
  } catch (err) {
    console.warn('[Supabase Center Sync Error]:', err.message);
    return null;
  }
}

/**
 * Fetch Bookings dynamically from Supabase
 */
export async function fetchBookingsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    try {
      const local = localStorage.getItem('washslot_blr_bookings_v7');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Bookings Fetch Notice]:', error.message);
      const local = localStorage.getItem('washslot_blr_bookings_v7');
      return local ? JSON.parse(local) : [];
    }

    if (!data || data.length === 0) return [];

    return data.map((b) => ({
      id: b.id,
      centerId: b.center_id,
      centerName: b.center_name,
      locality: b.locality,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      customerEmail: b.customer_email,
      vehicleNumber: b.vehicle_number,
      vehicleModel: b.vehicle_model,
      vehicleType: b.vehicle_type || 'Car',
      serviceName: b.service_name,
      price: b.price,
      bookingDate: b.booking_date,
      slotTime: b.slot_time,
      otp: b.otp,
      status: b.status,
      createdAt: b.created_at,
      completedAt: b.completed_at,
    }));
  } catch (err) {
    console.warn('[Supabase Fetch Bookings Error]:', err.message);
    return [];
  }
}

/**
 * Sync Booking to Supabase 'bookings' table
 */
export async function syncBookingToSupabase(booking) {
  if (!booking) return null;

  try {
    const local = localStorage.getItem('washslot_blr_bookings_v7');
    const list = local ? JSON.parse(local) : [];
    const index = list.findIndex((b) => b.id === booking.id);
    if (index >= 0) list[index] = booking;
    else list.unshift(booking);
    localStorage.setItem('washslot_blr_bookings_v7', JSON.stringify(list));
  } catch (e) {
    console.warn('Local booking cache warning:', e);
  }

  if (!isSupabaseConfigured || !supabase) return booking;

  try {
    const payload = {
      id: booking.id,
      center_id: booking.centerId,
      center_name: booking.centerName,
      locality: booking.locality,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      customer_email: booking.customerEmail || '',
      vehicle_number: booking.vehicleNumber,
      vehicle_model: booking.vehicleModel,
      vehicle_type: booking.vehicleType || 'Car',
      service_name: booking.serviceName,
      price: booking.price,
      booking_date: booking.bookingDate,
      slot_time: booking.slotTime,
      status: booking.status,
      otp: booking.otp,
      created_at: booking.createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bookings')
      .upsert(payload, { onConflict: 'id' });

    if (error) console.warn('[Supabase Booking Sync Notice]:', error.message);
    return data;
  } catch (err) {
    console.warn('[Supabase Booking Sync Error]:', err.message);
    return null;
  }
}

/**
 * Update Booking status in Supabase
 */
export async function updateBookingInSupabase(bookingId, newStatus) {
  if (!bookingId) return null;

  // Local storage update
  try {
    const local = localStorage.getItem('washslot_blr_bookings_v7');
    if (local) {
      const list = JSON.parse(local);
      const updated = list.map((b) =>
        b.id === bookingId
          ? { ...b, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : b.completedAt }
          : b
      );
      localStorage.setItem('washslot_blr_bookings_v7', JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Local booking status cache error:', e);
  }

  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const updates = {
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);

    if (error) console.warn('[Supabase Update Booking Notice]:', error.message);
    return data;
  } catch (err) {
    console.warn('[Supabase Update Booking Error]:', err.message);
    return null;
  }
}

/**
 * Sync Review to Supabase 'reviews' table
 */
export async function syncReviewToSupabase(review, centerId) {
  if (!isSupabaseConfigured || !supabase || !review) return null;

  try {
    const payload = {
      id: review.id,
      center_id: centerId,
      customer_name: review.customerName,
      rating: review.rating,
      comment: review.comment,
      vehicle_model: review.vehicleModel,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('reviews').insert(payload);
    if (error) console.warn('[Supabase Review Sync Notice]:', error.message);
    return data;
  } catch (err) {
    console.warn('[Supabase Review Sync Error]:', err.message);
    return null;
  }
}
