/**
 * WashSlot Data Configuration - Bengaluru Hyperlocal Car & Bike Wash Booking
 * Clean State: All mock users and mock bookings have been purged.
 * Real data is populated dynamically from Supabase database upon user registration and admin onboarding.
 */

export const BENGALURU_LOCALITIES = [
  "All Bengaluru",
  "HSR Layout",
  "Koramangala",
  "Indiranagar",
  "Electronic City",
  "Whitefield",
  "Marathahalli",
  "Bellandur",
  "Jayanagar",
  "JP Nagar",
  "Hebbal",
  "MG Road"
];

export const CATEGORIES = [
  { id: "all", label: "All Washes", icon: "Sparkles" },
  { id: "car", label: "Car Wash", icon: "Car" },
  { id: "bike", label: "Bike Wash", icon: "Bike" },
  { id: "foam", label: "Foam & Interior", icon: "ShieldCheck" }
];

// Default Clean State: Centers list starts empty until onboarded dynamically by Super Admin
export const WASHING_CENTERS = [];

// Default Clean State: Zero bookings until customers book live bays
export const INITIAL_MOCK_BOOKINGS = [];

/**
 * Bengaluru Starter Centers Seed Template
 * Available to Super Admin founders to quickly populate verified Bengaluru studios with 1 click
 */
export const BENGALURU_STARTER_CENTERS_SEED = [
  {
    id: "greenspark-hsr",
    name: "GreenSpark Eco Wash & Spa",
    tagline: "Eco-friendly zero-wastewater car & bike detailing studio",
    locality: "HSR Layout",
    latitude: 12.9121,
    longitude: 77.6446,
    address: "#412, 14th Main Rd, Sector 4, HSR Layout, Bengaluru, Karnataka 560102",
    landmark: "Near BDA Complex & Agara Lake Junction",
    rating: 4.9,
    reviewsCount: 1,
    startingPrice: 199,
    maxCapacityPerSlot: 2,
    vendorPin: "1234",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 98450 12890",
    adminContactNumber: "+91 98860 14280",
    timings: "08:00 AM - 08:30 PM",
    distance: "1.2 km away",
    slotsAvailableToday: 11,
    facilities: ["Recycled Water Eco-Tech", "Air Conditioned Lounge", "Free High-Speed Wi-Fi", "Live Bay CCTV View", "Card / UPI Accepted"],
    services: [
      {
        id: "gs-bike-foam",
        title: "Express Bike Foam Wash & Lube",
        vehicleType: "Bike",
        category: "bike",
        price: 199,
        originalPrice: 249,
        duration: "25 mins",
        popular: true,
        description: "High-pressure touchless snow foam wash, degreasing, microfiber dry, tire polish & chain lubrication.",
        includes: ["Snow foam blast", "Under-chassis wash", "Motul chain lube", "Tire shine coating"]
      },
      {
        id: "gs-car-interior",
        title: "Deep Vacuum & Steam Interior Detail",
        vehicleType: "Car",
        category: "foam",
        price: 699,
        originalPrice: 899,
        duration: "55 mins",
        popular: false,
        description: "Industrial 360-degree vacuuming of floor carpets, boot, upholstery shampooing, and AC vent bacterial steam sanitization.",
        includes: ["Carpet & boot deep vacuum", "Fabric/Leather seat scrub", "Steam sanitize AC vents", "Odor neutralizer spray"]
      }
    ],
    timeSlots: [
      { time: "09:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "01:30 PM", available: true },
      { time: "03:00 PM", available: true },
      { time: "04:30 PM", available: true },
      { time: "06:00 PM", available: true },
      { time: "07:00 PM", available: true }
    ],
    reviews: []
  },
  {
    id: "speedyglow-indiranagar",
    name: "SpeedyGlow Auto Spa & Detailing",
    tagline: "Precision 3-stage foam wash and paint decontamination",
    locality: "Indiranagar",
    latitude: 12.9784,
    longitude: 77.6408,
    address: "742, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    landmark: "Opposite Toit Brewpub, near Metro Pillar 42",
    rating: 4.8,
    reviewsCount: 1,
    startingPrice: 249,
    maxCapacityPerSlot: 2,
    vendorPin: "2345",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 98801 92837",
    adminContactNumber: "+91 98860 19280",
    timings: "08:30 AM - 09:00 PM",
    distance: "3.4 km away",
    slotsAvailableToday: 8,
    facilities: ["High-Gloss Ceramic Spray", "Customer Espresso Bar", "Dedicated Bike Hydraulic Ramp", "UPI & Fastag Payment"],
    services: [
      {
        id: "sg-bike-precision",
        title: "Superbike Precision Detailing",
        vehicleType: "Bike",
        category: "bike",
        price: 349,
        originalPrice: 450,
        duration: "35 mins",
        popular: true,
        description: "Specialized for superbikes and premium commuters. Safe for matte paint, chrome and exhaust manifolds.",
        includes: ["Ph-neutral foam", "Chain degrease & wax", "Silicone body polish", "Tire dressing"]
      },
      {
        id: "sg-car-complete",
        title: "Complete Body Foam + Underchassis Blast",
        vehicleType: "Car",
        category: "car",
        price: 499,
        originalPrice: 650,
        duration: "40 mins",
        popular: true,
        description: "Intense 3-stage Meguiar snow wash with dual underchassis rotating water nozzles and tire dressing.",
        includes: ["3-Stage Snow Foam", "Underchassis high pressure", "Microfiber hand dry", "All-glass streakless clean"]
      }
    ],
    timeSlots: [
      { time: "09:00 AM", available: true },
      { time: "10:30 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "01:30 PM", available: true },
      { time: "03:00 PM", available: true },
      { time: "04:30 PM", available: true },
      { time: "06:00 PM", available: true },
      { time: "07:30 PM", available: true }
    ],
    reviews: []
  },
  {
    id: "aquaglide-whitefield",
    name: "AquaGlide Detailing Studio",
    tagline: "European touchless jet-wash tech for IT corridor commuters",
    locality: "Whitefield",
    latitude: 12.9698,
    longitude: 77.7499,
    address: "ITPL Main Rd, near Pattandur Agrahara, Whitefield, Bengaluru, Karnataka 560066",
    landmark: "Close to ITPL Back Gate & Hope Farm Junction",
    rating: 4.7,
    reviewsCount: 1,
    startingPrice: 299,
    maxCapacityPerSlot: 3,
    vendorPin: "3456",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 97420 55123",
    adminContactNumber: "+91 98860 33440",
    timings: "08:00 AM - 09:30 PM",
    distance: "6.8 km away",
    slotsAvailableToday: 15,
    facilities: ["Multi-bay Simultaneous Wash", "Zero Swirl Guarantee", "Workstation Desk with Wi-Fi", "Zero-Water Eco Option"],
    services: [
      {
        id: "ag-touchless-express",
        title: "Touchless High-Pressure Hydro Wash",
        vehicleType: "Car",
        category: "foam",
        price: 399,
        originalPrice: 499,
        duration: "30 mins",
        popular: true,
        description: "100% touchless European jet nozzle system ensuring zero paint swirl marks.",
        includes: ["Pre-wash rinse", "Active snow coat", "Wheel arch jet clean", "Reverse osmosis final rinse"]
      }
    ],
    timeSlots: [
      { time: "09:00 AM", available: true },
      { time: "10:30 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "01:30 PM", available: true },
      { time: "03:00 PM", available: true },
      { time: "04:30 PM", available: true },
      { time: "06:00 PM", available: true }
    ],
    reviews: []
  }
];
