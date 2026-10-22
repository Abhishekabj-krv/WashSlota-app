# WashSlot 🚗 🏍️ 👑
### Hyperlocal Car & Bike Wash Booking Platform (Bengaluru)
**Production-Grade Architecture: Haversine GPS Distance • Customer-Held OTP • Verified Reviews • Dynamic Slot Capacity • 3-Tier RBAC**

---

## 🌟 Key Feature Implementations

### 1. Haversine Location & Distance Engine ([`src/utils/distance.js`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/utils/distance.js))
- **Haversine Formula**: Computes straight-line distance in kilometers: `getDistanceInKm(lat1, lon1, lat2, lon2)`.
- **Browser Geolocation**: `Home.jsx` calls `navigator.geolocation.getCurrentPosition` on mount.
- **Graceful Fallback**: Automatically falls back to Central Bengaluru (MG Road: `12.9716, 77.5946`) if location access is denied.
- **Dynamic Sorting**: Centers can be sorted by *"Nearest First (Haversine GPS)"* and display formatted distances (e.g., `1.4 km away`).

### 2. Customer-Held OTP Verification Lifecycle
- **Customer View ([`MyBookings.jsx`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/pages/MyBookings.jsx))**:
  - Once booking status transitions to `'accepted'`, displays high-contrast badge: `Wash Verification Code: [ OTP: 4892 ]`.
  - When still `'pending'`, shows code locked until center approval.
- **Vendor View ([`VendorOrders.jsx`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/pages/VendorOrders.jsx))**:
  - **Zero Vendor Exposure**: The OTP is **NEVER** displayed on the vendor screen.
  - Accepted orders feature an inline OTP input box with `[ Verify & Mark Complete ]`.
  - **Verification Error Handling**: Invalid code displays `"Invalid Code. Ask customer for code shown on their booking card"`.

### 3. Verified-Only Customer Reviews ([`CenterDetail.jsx`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/pages/CenterDetail.jsx))
- Customers can **ONLY** submit a review/rating if they have a booking at that center with `status === 'completed'`.
- If completed: Renders interactive 1-5 Star Rating picker + feedback form.
- If not: Displays locked state: *"Only verified customers who have completed a wash service at this center can leave a review."*

### 4. Robust Slot-Locking & Anti-Double-Booking Engine ([`CenterDetail.jsx`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/pages/CenterDetail.jsx) & [`AppContext.jsx`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/context/AppContext.jsx))
- **Strict Capacity Tracking**: Each center defines `maxCapacityPerSlot` (default: 2 bays).
- **Status Filter**: Only active bookings (`'pending'` or `'accepted'`) consume bay capacity. Rejected or cancelled bookings immediately release the slot capacity back to available.
- **Dynamic Real-Time UI Check**: When `activeBookings >= maxCapacityPerSlot`, the button is disabled, styled in grey, and renders **`SLOT FULL / LOCKED`**.
- **Backend-Style Context Guardrail**: `AppContext.jsx` validates slot capacity inside `addBooking()` to prevent race condition double-booking.

### 5. Comprehensive Bengaluru Location Coverage ([`mockData.js`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/data/mockData.js) & [`AdminDashboard.jsx`](file:///C:/Users/abhis/.gemini/antigravity/scratch/washslot/src/pages/AdminDashboard.jsx))
- **11 Major High-Density Bengaluru Hubs**:
  - *HSR Layout, Koramangala, Indiranagar, Electronic City, Whitefield, Marathahalli, Bellandur, Jayanagar, JP Nagar, Hebbal, and MG Road.*
- **User Discovery**: "All Bengaluru" radius option ensures customers can explore across the entire city without being blocked.
- **Admin Flexibility**: Super Admin onboarding allows selecting from predefined zones OR typing custom area names with optional custom GPS coordinates (auto-defaulting to Central Bengaluru `12.9716° N, 77.5946° E` if omitted).

---

## 🔑 Login & Demo Personas

| Role | Name / Center | Credentials | Direct URL |
| :--- | :--- | :--- | :--- |
| **Customer** | Rahul Sharma | Phone: `+91 98450 78219` | [`/`](http://localhost:5173/) & [`/my-bookings`](http://localhost:5173/my-bookings) |
| **Vendor** | GreenSpark Eco Wash (HSR) | PIN: `1234` | [`/vendor/orders`](http://localhost:5173/vendor/orders) |
| **Super Admin** | Platform Founder | Master Passcode: `admin123` | [`/admin/dashboard`](http://localhost:5173/admin/dashboard) |

---

## 🚀 How to Run Locally

```cmd
cd "C:\Users\abhis\.gemini\antigravity\scratch\washslot"
start.bat
```
*(Or run `npm run dev`)*
Production local server:
```cmd
start-prod.bat
```
*(Runs at `http://localhost:3000`)*
