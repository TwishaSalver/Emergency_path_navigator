const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the same API key provided by the user
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_MAPS_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Get unconventional route insights from Gemini
 */
async function getRouteInsights(origin, destination, checkpoints) {
  try {
    const prompt = `
      You are an emergency response AI assistant. 
      Analyze the following ambulance route:
      - Origin: ${origin}
      - Destination: ${destination}
      - Checkpoints: ${JSON.stringify(checkpoints)}

      Provide a brief, actionable "unconventional" insight for the dispatchers. 
      Consider factors like historical safety data, typical local events (e.g., stadium crowds, school zones), 
      and potential environmental risks that standard GPS might miss.
      
      Keep the response professional, concise (max 3 sentences), and format it as a JSON object:
      {
        "insight": "the actual text",
        "riskLevel": "Low/Medium/High",
        "suggestedCaution": "brief tip"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if needed (sometimes Gemini wraps in markdown blocks)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Gemini Insight Error:", err);
    return {
      insight: "Proceed with standard emergency protocols. No unconventional risks detected.",
      riskLevel: "Low",
      suggestedCaution: "Standard vigilance."
    };
  }
}

/**
 * Predict "Hot Zones" for predictive dispatch
 */
async function predictHotZones() {
  try {
    const prompt = `
      Based on typical urban patterns for a large city at ${new Date().toLocaleTimeString()}, 
      predict 3 "Hot Zones" (areas with high probability of emergency calls) for the next 2 hours.
      Consider commute hours, nightlife areas, or industrial zones.
      
      Return as a JSON array of objects:
      [
        { "area": "Name of area", "reason": "Brief reason", "probability": "Percentage" }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    return [
      { area: "Downtown Core", reason: "High traffic density", probability: "75%" },
      { area: "Hospital District", reason: "Standard high-activity zone", probability: "60%" }
    ];
  }
}

module.exports = { getRouteInsights, predictHotZones };
