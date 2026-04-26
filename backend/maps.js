const axios = require("axios");

const GOOGLE_API = process.env.GOOGLE_MAPS_KEY;

if (!GOOGLE_API) {
  console.warn("⚠️ WARNING: GOOGLE_MAPS_KEY not set in environment variables!");
  console.warn("Please set GOOGLE_MAPS_KEY in your .env file to use Google Maps API.");
}

async function geocodeLocation(location) {
  if (!GOOGLE_API) {
    throw new Error("GOOGLE_MAPS_KEY is not configured.");
  }

  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: location,
          key: GOOGLE_API
        }
      }
    );

    if (!res.data.results || res.data.results.length === 0) {
      throw new Error(`Location "${location}" not found. Please check the spelling and try again.`);
    }

    const result = res.data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address
    };
  } catch (err) {
    if (err.message.includes("not found")) throw err;
    throw new Error(`Could not find location "${location}". Please use a more specific address.`);
  }
}

async function getRoute(origin, destination) {
  if (!GOOGLE_API) {
    throw new Error("GOOGLE_MAPS_KEY is not configured. Please set it in your .env file.");
  }
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin,
          destination,
          departure_time: "now",
          traffic_model: "best_guess",
          key: GOOGLE_API
        }
      }
    );

    // Check for API errors
    if (res.data.status === "ZERO_RESULTS") {
      throw new Error(`No route found. Please verify locations: "${origin}" → "${destination}"`);
    }

    if (res.data.status !== "OK") {
      throw new Error(`Google Maps error: ${res.data.status}`);
    }

    if (!res.data.routes || !res.data.routes.length) {
      throw new Error(`No route available between "${origin}" and "${destination}"`);
    }

    return res.data.routes[0];
  } catch (err) {
    if (err.response?.status === 403) {
      throw new Error("Google Maps API key invalid or insufficient permissions.");
    }
    if (err.response?.data?.error_message) {
      throw new Error(`Google Maps: ${err.response.data.error_message}`);
    }
    throw err;
  }
}

function extractCheckpoints(route) {
  if (!route.legs || !route.legs[0] || !route.legs[0].steps) {
    throw new Error("Invalid route data");
  }

  const steps = route.legs[0].steps;
  const numCheckpoints = 6;
  
  // If we have very few steps, just use them all
  if (steps.length <= numCheckpoints) {
    return steps.map((step, i) => ({
      id: i,
      lat: step.end_location.lat,
      lng: step.end_location.lng,
      eta: Math.round(step.duration.value / 60)
    }));
  }

  // Otherwise, pick steps at regular intervals to cover the whole route
  const interval = Math.floor(steps.length / numCheckpoints);
  const checkpoints = [];
  
  for (let i = 0; i < numCheckpoints; i++) {
    const stepIndex = Math.min(i * interval, steps.length - 1);
    const step = steps[stepIndex];
    const duration = step.duration_in_traffic || step.duration;
    const standardDuration = step.duration;
    
    // Calculate if this step is significantly delayed (more than 30% or 2 mins)
    const isTrafficked = duration.value > standardDuration.value * 1.3 || (duration.value - standardDuration.value) > 120;

    checkpoints.push({
      id: i,
      lat: step.end_location.lat,
      lng: step.end_location.lng,
      eta: Math.round(duration.value / 60),
      isTrafficked
    });
  }

  return checkpoints;
}

module.exports = { getRoute, extractCheckpoints, geocodeLocation };