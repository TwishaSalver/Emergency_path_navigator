import React from "react";

export default function HospitalPanel({ data }) {
  if (!data || !data.hospitalNotified) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "20px",
      borderRadius: "1.5rem",
      marginTop: "20px",
      animation: "slideIn 0.3s ease-out",
      boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>🏥 Hospital Admission</h2>
        <span style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.2)", 
          padding: "4px 8px", 
          borderRadius: "8px", 
          fontSize: "0.7rem",
          fontWeight: "600"
        }}>
          NOTIFIED
        </span>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: "15px", borderRadius: "12px", backdropFilter: "blur(10px)" }}>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.8, display: "block" }}>Incoming From:</span>
          <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{data.origin_address}</span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "10px" }}>
          <div>
            <span style={{ fontSize: "0.7rem", opacity: 0.8, display: "block" }}>Priority:</span>
            <span style={{ fontWeight: "700", color: "#fef3c7" }}>🔴 CRITICAL</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.7rem", opacity: 0.8, display: "block" }}>ETA to ER:</span>
            <span style={{ fontWeight: "700" }}>{data.checkpoints ? data.checkpoints[data.checkpoints.length - 1].eta : "--"} mins</span>
          </div>
        </div>
      </div>

      <p style={{ margin: "15px 0 0 0", fontSize: "0.75rem", textAlign: "center", opacity: 0.9 }}>
        Medical staff have been alerted. ER pre-registration complete.
      </p>
    </div>
  );
}
