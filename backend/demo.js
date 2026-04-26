// Mock data for demo - no API key needed
const DEMO_ROUTES = {
  "times square, new york, ny": {
    "central park, new york, ny": {
      polyline: "yvxwFzfgbMd@j@|Cx@|Cv@j@z@v@v@v@~AvCzAvB~Ax@~@v@j@n@j@r@f@z@d@|@`@b@\\f@\\j@\\j@\\",
      checkpoints: [
        { id: 0, lat: 40.758, lng: -73.985, eta: 2 },
        { id: 1, lat: 40.761, lng: -73.978, eta: 3 },
        { id: 2, lat: 40.766, lng: -73.972, eta: 5 },
        { id: 3, lat: 40.772, lng: -73.965, eta: 8 },
        { id: 4, lat: 40.779, lng: -73.955, eta: 10 },
        { id: 5, lat: 40.785, lng: -73.948, eta: 12 }
      ]
    }
  }
};

// Generate demo route for any location pair
function generateDemoRoute(origin, destination) {
  const key = `${origin.toLowerCase()}, ${destination.toLowerCase()}`;
  
  if (DEMO_ROUTES[key]) {
    return DEMO_ROUTES[key];
  }

  // Return generic demo route for any location
  return {
    polyline: "yvxwFzfgbMd@j@|Cx@|Cv@j@z@v@v@v@~AvCzAvB~Ax@~@v@j@n@j@r@f@z@d@|@`@b@\\f@\\j@\\j@\\",
    checkpoints: [
      { id: 0, lat: 40.75, lng: -73.99, eta: 2 },
      { id: 1, lat: 40.76, lng: -73.98, eta: 3 },
      { id: 2, lat: 40.77, lng: -73.97, eta: 5 },
      { id: 3, lat: 40.78, lng: -73.96, eta: 8 },
      { id: 4, lat: 40.79, lng: -73.95, eta: 10 },
      { id: 5, lat: 40.80, lng: -73.94, eta: 12 }
    ]
  };
}

module.exports = { generateDemoRoute, DEMO_ROUTES };
