require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Routes
app.use("/api", routes);

// Serve static files from the React app build directory
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

// Catch-all handler: send back React's index.html file for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);
  res.status(500).json({ 
    error: "Server error", 
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong" 
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 ClearPath Backend running on port ${PORT}`);
});


