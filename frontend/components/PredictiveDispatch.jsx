import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PredictiveDispatch() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/predictive-dispatch`);
      setPredictions(res.data.predictions || []);
    } catch (err) {
      console.error("Failed to fetch predictions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 300000); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: "20px",
      background: "var(--glass)",
      border: "1px solid var(--glass-border)",
      borderRadius: "1.5rem",
      marginTop: "20px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-main)" }}>🔮 Predictive Hot Zones</h3>
        <button 
          onClick={fetchPredictions} 
          disabled={loading}
          style={{ 
            background: "none", 
            border: "none", 
            color: "var(--primary)", 
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "600"
          }}
        >
          {loading ? "..." : "🔄 Refresh"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {predictions.map((p, i) => (
          <div key={i} style={{
            padding: "12px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "12px",
            borderLeft: `4px solid var(--primary)`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontWeight: "700", color: "var(--text-main)" }}>{p.area}</span>
              <span style={{ color: "var(--primary)", fontWeight: "800", fontSize: "0.8rem" }}>{p.probability} Prob.</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {p.reason}
            </div>
          </div>
        ))}
        {predictions.length === 0 && !loading && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>Analyzing city patterns...</p>
        )}
      </div>
    </div>
  );
}
