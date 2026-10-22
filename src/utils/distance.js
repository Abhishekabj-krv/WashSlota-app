/**
 * Haversine Location & Distance Calculation Engine
 * Calculates straight-line distance in kilometers between two GPS coordinates
 */

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates straight-line distance in kilometers between two coordinates
 * using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1 in degrees
 * @param {number} lon1 - Longitude of point 1 in degrees
 * @param {number} lat2 - Latitude of point 2 in degrees
 * @param {number} lon2 - Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers (rounded to 1 decimal place)
 */
export function getDistanceInKm(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lat1 === null ||
    lon1 === undefined || lon1 === null ||
    lat2 === undefined || lat2 === null ||
    lon2 === undefined || lon2 === null
  ) {
    return null;
  }

  // Convert degrees to radians
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Formats numeric distance into human-friendly string (e.g. "1.4 km away" or "800 m away")
 * @param {number} distanceInKm 
 * @returns {string}
 */
export function formatDistance(distanceInKm) {
  if (distanceInKm === null || distanceInKm === undefined || isNaN(distanceInKm)) {
    return 'Distance unavailable';
  }

  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m away`;
  }

  return `${distanceInKm.toFixed(1)} km away`;
}

// Fallback GPS coordinates for Bengaluru Central (MG Road / Vidhana Soudha)
export const DEFAULT_BENGALURU_COORDS = {
  latitude: 12.9716,
  longitude: 77.5946,
  locality: 'Central Bengaluru (MG Road)'
};

// Comprehensive coverage of major high-density Bengaluru tech and residential hubs
export const BENGALURU_AREA_COORDINATES = {
  'HSR Layout': { latitude: 12.9121, longitude: 77.6446 },
  'Koramangala': { latitude: 12.9352, longitude: 77.6245 },
  'Indiranagar': { latitude: 12.9784, longitude: 77.6408 },
  'Electronic City': { latitude: 12.8452, longitude: 77.6602 },
  'Whitefield': { latitude: 12.9698, longitude: 77.7500 },
  'Marathahalli': { latitude: 12.9591, longitude: 77.6974 },
  'Bellandur': { latitude: 12.9260, longitude: 77.6762 },
  'Jayanagar': { latitude: 12.9308, longitude: 77.5838 },
  'JP Nagar': { latitude: 12.9063, longitude: 77.5857 },
  'Hebbal': { latitude: 13.0358, longitude: 77.5970 },
  'MG Road': { latitude: 12.9756, longitude: 77.6097 }
};

/**
 * Helper to resolve coordinates given a locality name or optional custom coordinates
 */
export function resolveCoordinates(locality, customLat, customLon) {
  const parsedLat = parseFloat(customLat);
  const parsedLon = parseFloat(customLon);

  if (!isNaN(parsedLat) && !isNaN(parsedLon) && parsedLat !== 0 && parsedLon !== 0) {
    return { latitude: parsedLat, longitude: parsedLon };
  }

  if (locality && BENGALURU_AREA_COORDINATES[locality]) {
    return BENGALURU_AREA_COORDINATES[locality];
  }

  // Case-insensitive lookup
  if (locality) {
    const foundKey = Object.keys(BENGALURU_AREA_COORDINATES).find(
      k => k.toLowerCase() === locality.toLowerCase()
    );
    if (foundKey) {
      return BENGALURU_AREA_COORDINATES[foundKey];
    }
  }

  return { latitude: DEFAULT_BENGALURU_COORDS.latitude, longitude: DEFAULT_BENGALURU_COORDS.longitude };
}
