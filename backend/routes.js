const express = require("express");
const router = express.Router();
const { getRoute, extractCheckpoints } = require("./maps");
const { generateDemoRoute } = require("./demo");
const { getRouteInsights, predictHotZones } = require("./gemini");

router.post("/create-case", async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ error: "Missing origin or destination" });
    }

    let route, checkpoints;
    let isDemo = false;

    // Try real API first
    try {
      route = await getRoute(origin, destination);
      checkpoints = extractCheckpoints(route);
    } catch (apiErr) {
      // Fall back to demo data only if it's a configuration or quota issue
      // If it's a "Zero Results" error, we should probably tell the user instead of showing NYC
      console.log("Using demo data fallback. Reason:", apiErr.message);
      const demoData = generateDemoRoute(origin, destination);
      route = { 
        overview_polyline: { points: demoData.polyline },
        bounds: demoData.bounds // Add bounds if available
      };
      checkpoints = demoData.checkpoints;
      isDemo = true;
    }

    // 🤖 Get Gemini AI Insights
    const aiInsights = await getRouteInsights(origin, destination, checkpoints);

    // 🚨 Traffic Alert Detection
    const hasTrafficDelay = checkpoints.some(cp => cp.isTrafficked);
    
    res.json({ 
      polyline: route.overview_polyline.points, 
      checkpoints,
      demo: isDemo,
      aiInsights,
      trafficAlert: hasTrafficDelay,
      hospitalNotified: true,
      origin_address: route.legs ? route.legs[0].start_address : origin,
      destination_address: route.legs ? route.legs[0].end_address : destination
    });
  } catch (err) {
    console.error("Fatal error creating case:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

router.get("/predictive-dispatch", async (req, res) => {
  try {
    const predictions = await predictHotZones();
    res.json({ predictions });
  } catch (err) {
    res.status(500).json({ error: "Failed to get predictions" });
  }
});

module.exports = router;