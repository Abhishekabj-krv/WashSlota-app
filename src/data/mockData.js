/**
 * WashSlot Mock Data - Tailored for Bengaluru Hyperlocal Car & Bike Wash Booking
 * Includes GPS coordinates for Haversine distance calculations & capacity rules
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

export const WASHING_CENTERS = [
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
    reviewsCount: 524,
    startingPrice: 199,
    maxCapacityPerSlot: 2, // Maximum bays per timeslot
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
      },
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
    reviews: [
      {
        id: "rev-gs-1",
        customerName: "Rahul Sharma",
        rating: 5,
        date: "Oct 20, 2026",
        comment: "Excellent high-pressure underbody rinse and zero wait time. Used the AC lounge while my Creta was getting foam-washed.",
        verified: true,
        vehicleModel: "Hyundai Creta"
      },

    ]
  },
  {
    id: "speedyglow-indiranagar",
    name: "SpeedyGlow Auto Spa & Detailing",
    tagline: "Bengaluru's top-rated express wash bay with rapid 20-minute lanes",
    locality: "Indiranagar",
    latitude: 12.9784,
    longitude: 77.6408,
    address: "#88, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    landmark: "Opposite Toit Brewpub, near Metro Pillar 42",
    rating: 4.8,
    reviewsCount: 680,
    startingPrice: 249,
    maxCapacityPerSlot: 2,
    vendorPin: "1234",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 97412 45678",
    adminContactNumber: "+91 97412 88319",
    timings: "07:30 AM - 09:30 PM",
    distance: "3.4 km away",
    slotsAvailableToday: 8,
    facilities: ["Express 20-min Lane", "Specialty Ceramic Bay", "Espresso Bar Lounge", "UPI & Fastag Payment"],
    services: [
      {
        id: "sg-superbike",
        title: "Superbike Precision Detailing",
        vehicleType: "Bike",
        category: "bike",
        price: 349,
        originalPrice: 449,
        duration: "35 mins",
        popular: true,
        description: "Specialized care for high-capacity bikes: radiator cleaning, engine degreasing, fairing gloss coat and chain tension check.",
        includes: ["Engine bay degreasing", "Radiator fin cleanse", "Dry chain lube", "Matte/Gloss wax polish"]
      },
      {
        id: "sg-express-car",
        title: "20-Min Rapid Tunnel Wash",
        vehicleType: "Car",
        category: "car",
        price: 299,
        originalPrice: 399,
        duration: "20 mins",
        popular: true,
        description: "High-speed multi-jet automated pressure wash followed by hand towel drying and rim shine.",
        includes: ["Pre-wash rinse", "Active pH shampoo", "Underbody rinse", "Air-jet & micro-fiber dry"]
      },
    
    ],
    timeSlots: [
      { time: "09:30 AM", available: true },
      { time: "10:30 AM", available: true },
      { time: "11:30 AM", available: true },
      { time: "01:00 PM", available: true },
      { time: "02:30 PM", available: true },
      { time: "04:00 PM", available: true },
      { time: "05:30 PM", available: true },
      { time: "07:00 PM", available: true }
    ],
    reviews: [
      {
        id: "rev-sg-1",
        customerName: "Karthik Subramanian",
        rating: 5,
        date: "Oct 19, 2026",
        comment: "Great express lane right on 100 Feet Road. Superbike bay has Motul chemicals and stands.",
        verified: true,
        vehicleModel: "KTM Duke 390"
      }
    ]
  },
  {
    id: "urbanwash-bellandur",
    name: "UrbanWash 24/7 Hub",
    tagline: "Always-open quick turn-around wash center near Outer Ring Road",
    locality: "Bellandur",
    latitude: 12.9260,
    longitude: 77.6762,
    address: "#12, Green Glen Layout, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
    landmark: "Opposite Ecospace Tech Park",
    rating: 4.6,
    reviewsCount: 489,
    startingPrice: 199,
    maxCapacityPerSlot: 2,
    vendorPin: "1234",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 99882 11223",
    adminContactNumber: "+91 99882 44321",
    timings: "Open 24 Hours",
    distance: "3.9 km away",
    slotsAvailableToday: 18,
    facilities: ["24/7 Operations", "Rapid 15-min Bay", "Contactless QR Payment", "Tech Park Shuttle Stop"],
    services: [
      {
        id: "uw-bike-wash",
        title: "Express Bike Power Wash",
        vehicleType: "Bike",
        category: "bike",
        price: 199,
        originalPrice: 250,
        duration: "20 mins",
        popular: true,
        description: "Fast water-conserving jet wash, tyre polish and quick chain spray.",
        includes: ["High pressure wash", "Wheel scrub", "Quick dry", "Tyre shine"]
      },
      {
        id: "uw-car-foam",
        title: "Urban Car Foam Express",
        vehicleType: "Car",
        category: "car",
        price: 349,
        originalPrice: 420,
        duration: "30 mins",
        popular: true,
        description: "Active snow foam wash, underbody rinse, window wipe and tyre black dressing.",
        includes: ["Snow foam soak", "Underbody jet rinse", "Hand towel dry", "Tyre shine"]
      },
      {
        id: "uw-deep-clean",
        title: "Complete Urban Revive (Interior + Exterior)",
        vehicleType: "Car",
        category: "foam",
        price: 749,
        originalPrice: 999,
        duration: "55 mins",
        popular: false,
        description: "Full exterior foam treatment combined with deep floor vacuuming, glass polish, and perfume treatment.",
        includes: ["Exterior foam wash", "Interior deep vacuum", "Glass polish", "Aroma air freshener"]
      }
    ],
    timeSlots: [
      { time: "08:00 AM", available: true },
      { time: "09:30 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "01:00 PM", available: true },
      { time: "03:00 PM", available: true },
      { time: "05:00 PM", available: true },
      { time: "07:00 PM", available: true },
      { time: "09:00 PM", available: true }
    ],
    reviews: []
  },
  {
    id: "northgate-hebbal",
    name: "NorthGate Aerotown Detailing Hub",
    tagline: "North Bengaluru's premier quick-turnaround car & superbike wash bay",
    locality: "Hebbal",
    latitude: 13.0358,
    longitude: 77.5970,
    address: "#22, Airport Road Service Rd, Hebbal, Bengaluru, Karnataka 560024",
    landmark: "Near Hebbal Flyover & Esteem Mall",
    rating: 4.8,
    reviewsCount: 460,
    startingPrice: 219,
    maxCapacityPerSlot: 2,
    vendorPin: "1234",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 96118 77221",
    adminContactNumber: "+91 96118 44102",
    timings: "08:00 AM - 09:00 PM",
    distance: "9.3 km away",
    slotsAvailableToday: 11,
    facilities: ["Airport Expressway Express Bay", "Automated Underbody Spray", "Air Conditioned Lounge", "UPI / Card Accepted"],
    services: [
      {
        id: "ng-bike-express",
        title: "Express Superbike & Commuter Wash",
        vehicleType: "Bike",
        category: "bike",
        price: 219,
        originalPrice: 279,
        duration: "25 mins",
        popular: true,
        description: "Snow foam cleaning, radiator fin brush, microfiber dry and dry wax polish.",
        includes: ["Snow foam blast", "Radiator brush clean", "Microfiber dry", "Chain lube"]
      },
      {
        id: "ng-car-foam",
        title: "NorthGate Highway Express Foam Wash",
        vehicleType: "Car",
        category: "car",
        price: 379,
        originalPrice: 479,
        duration: "35 mins",
        popular: true,
        description: "High-pressure mud removal, snow foam soak, undercarriage rinse and tire shine.",
        includes: ["High pressure pre-rinse", "Snow foam soak", "Underbody jet rinse", "Tire dressing"]
      },
      {
        id: "ng-interior-deep",
        title: "Cabin Decontamination & Deep Vacuum",
        vehicleType: "Car",
        category: "foam",
        price: 729,
        originalPrice: 949,
        duration: "55 mins",
        popular: false,
        description: "Ozone bacterial treatment, deep floor vacuuming, boot clean and dashboard gloss coat.",
        includes: ["Cabin vacuum", "Trunk vacuum", "Ozone treatment", "Dashboard UV gloss"]
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
    id: "centralcbd-mgroad",
    name: "Central CBD Auto Spa & Detailers",
    tagline: "Bengaluru downtown luxury car detailing & water-saving steam studio",
    locality: "MG Road",
    latitude: 12.9756,
    longitude: 77.6097,
    address: "#44, Brigade Road Cross, off MG Road, Bengaluru, Karnataka 560001",
    landmark: "Behind MG Road Metro Station & Church Street",
    rating: 4.9,
    reviewsCount: 512,
    startingPrice: 299,
    maxCapacityPerSlot: 2,
    vendorPin: "1234",
    status: "active",
    categories: ["car", "bike", "foam"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 98459 22100",
    adminContactNumber: "+91 98459 66318",
    timings: "08:30 AM - 09:30 PM",
    distance: "1.8 km away",
    slotsAvailableToday: 7,
    facilities: ["Central Bengaluru CBD Location", "Water-Saving Steam Bay", "VIP Lounge with Cafe", "Fastag & UPI Payment"],
    services: [
      {
        id: "cbd-bike-steam",
        title: "Downtown Steam Wash & Chain Lube",
        vehicleType: "Bike",
        category: "bike",
        price: 299,
        originalPrice: 399,
        duration: "30 mins",
        popular: true,
        description: "Zero-water-runoff dry steam cleaning, engine degrease, Motul chain lube & ceramic gloss spray.",
        includes: ["Dry steam wash", "Engine degreasing", "Chain lube", "Ceramic gloss spray"]
      },
      {
        id: "cbd-car-deluxe",
        title: "CBD Executive Foam & Steam Exterior",
        vehicleType: "Car",
        category: "foam",
        price: 499,
        originalPrice: 650,
        duration: "45 mins",
        popular: true,
        description: "Thick snow foam wash, undercarriage pressure clean, rim detail and hydrophobic windshield polish.",
        includes: ["Thick snow foam", "Undercarriage clean", "Rim detailing", "Hydrophobic glass"]
      },
      {
        id: "cbd-interior-luxury",
        title: "Luxury Leather & AC Steam Detailing",
        vehicleType: "Car",
        category: "foam",
        price: 899,
        originalPrice: 1199,
        duration: "65 mins",
        popular: false,
        description: "Full interior hot steam extraction, leather seat nourishment, carpet shampoo and germ-kill sanitization.",
        includes: ["Hot steam extraction", "Leather nourishment", "Carpet shampoo", "Germ-kill sanitization"]
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
  }
];

// Sample default bookings for today in Bengaluru
export const INITIAL_MOCK_BOOKINGS = [
  {
    id: "BK-BLR-1092",
    centerId: "greenspark-hsr",
    centerName: "GreenSpark Eco Wash & Spa",
    locality: "HSR Layout",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98450 78219",
    vehicleNumber: "KA 01 MJ 4210",
    vehicleModel: "Hyundai Creta (White)",
    vehicleType: "Car",
    serviceName: "Foam Wash & Underbody Blast",
    price: 399,
    bookingDate: "Today",
    slotTime: "10:00 AM",
    otp: "4821",
    status: "pending", // 'pending' | 'accepted' | 'rejected' | 'completed'
    createdAt: "2026-10-22T08:30:00.000Z",
    completedAt: null
  },
  {
    id: "BK-BLR-1094",
    centerId: "speedyglow-indiranagar",
    centerName: "SpeedyGlow Auto Spa & Detailing",
    locality: "Indiranagar",
    customerName: "Karthik Subramanian",
    customerPhone: "+91 98801 92837",
    vehicleNumber: "KA 03 NA 3312",
    vehicleModel: "KTM Duke 390",
    vehicleType: "Bike",
    serviceName: "Superbike Precision Detailing",
    price: 349,
    bookingDate: "Today",
    slotTime: "01:00 PM",
    otp: "6640",
    status: "pending",
    createdAt: "2026-10-22T09:10:00.000Z",
    completedAt: null
  }
];
