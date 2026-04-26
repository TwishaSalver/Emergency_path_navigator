import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { startSimulation } from "./simulator";

export default function Dispatch({ setData }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const options = {
          fields: ["formatted_address", "geometry", "name"],
          strictBounds: false,
        };

        const originAutocomplete = new window.google.maps.places.Autocomplete(originRef.current, options);
        originAutocomplete.addListener("place_changed", () => {
          const place = originAutocomplete.getPlace();
          setOrigin(place.formatted_address || place.name || "");
        });

        const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationRef.current, options);
        destinationAutocomplete.addListener("place_changed", () => {
          const place = destinationAutocomplete.getPlace();
          setDestination(place.formatted_address || place.name || "");
        });
        return true;
      }
      return false;
    };

    if (!initAutocomplete()) {
      const interval = setInterval(() => {
        if (initAutocomplete()) clearInterval(interval);
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-case`,
        { origin, destination }
      );

      setData(res.data);
      setDemoMode(res.data.demo || false);

      // 🚑 START SIMULATION
      startSimulation(res.data.checkpoints);
      
      setOrigin("");
      setDestination("");
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error("Route fetch error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "24px", 
      background: "var(--glass)", 
      border: "1px solid var(--glass-border)", 
      borderRadius: "1.5rem", 
      backdropFilter: "blur(12px)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px" 
    }}>
      
      {error && (
        <div style={{ 
          padding: "12px", 
          marginBottom: "15px", 
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          border: "1px solid rgba(239, 68, 68, 0.2)", 
          borderRadius: "0.75rem",
          color: "#f87171",
          fontSize: "0.9rem"
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {demoMode && (
        <div style={{ 
          padding: "12px", 
          marginBottom: "15px", 
          backgroundColor: "rgba(245, 158, 11, 0.1)", 
          border: "1px solid rgba(245, 158, 11, 0.2)", 
          borderRadius: "0.75rem",
          color: "#fbbf24",
          fontSize: "0.9rem"
        }}>
          <strong>📋 Demo Mode:</strong> Using sample route data
        </div>
      )}
      
      <h2 style={{ marginTop: 0, fontSize: "1.5rem", fontWeight: "700", color: "white" }}>📍 Dispatch Center</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-muted)", fontSize: "0.875rem" }}>Origin:</label>
          <input
            ref={originRef}
            type="text"
            placeholder="Search starting location..."
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              boxSizing: "border-box", 
              borderRadius: "0.75rem", 
              border: "1px solid var(--glass-border)", 
              background: "rgba(0, 0, 0, 0.2)",
              color: "white",
              outline: "none",
              transition: "border-color 0.2s"
            }}
          />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-muted)", fontSize: "0.875rem" }}>Destination:</label>
          <input
            ref={destinationRef}
            type="text"
            placeholder="Search destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              boxSizing: "border-box", 
              borderRadius: "0.75rem", 
              border: "1px solid var(--glass-border)", 
              background: "rgba(0, 0, 0, 0.2)",
              color: "white",
              outline: "none"
            }}
          />
        </div>
        <p style={{ margin: "0.5rem 0", color: "var(--text-muted)", fontSize: "0.75rem" }}>
          💡 Tip: Select a location from the dropdown for better precision.
        </p>
        <button type="submit" disabled={loading} style={{ 
          marginTop: "1rem", 
          width: "100%",
          padding: "14px 20px", 
          cursor: loading ? "not-allowed" : "pointer", 
          backgroundColor: loading ? "#475569" : "var(--primary)", 
          backgroundImage: "linear-gradient(to right, #2563eb, #3b82f6)",
          color: "white", 
          border: "none", 
          borderRadius: "0.75rem", 
          fontSize: "1rem",
          fontWeight: "600",
          boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}>
          {loading ? "⏳ Finding route..." : "🚑 Create Case"}
        </button>
      </form>
    </div>
  );
}