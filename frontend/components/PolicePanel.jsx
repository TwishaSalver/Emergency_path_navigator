import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebase";
import "./PolicePanel.css";

export default function PolicePanel({ data }) {
  const [alert, setAlert] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!data) {
      setAlert(null);
      setConnected(false);
      return;
    }

    setConnected(true);
    
    try {
      const unsubscribe = onValue(
        ref(db, "ambulance"),
        (snapshot) => {
          const val = snapshot.val();
          if (val) {
            setAlert(val);
          }
        },
        (error) => {
          console.error("Firebase subscription error:", error);
          setConnected(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase error:", err);
      setConnected(false);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="police-panel">
        <h2>🚨 Live Traffic Alert</h2>
        <p className="no-alert">No active case</p>
      </div>
    );
  }

  return (
    <div className="police-panel">
      <h2>🚨 Live Traffic Alert</h2>
      
      <div className={`connection-status ${connected ? "connected" : "disconnected"}`}>
        {connected ? "🟢 Connected to Firebase" : "🔴 Disconnected"}
      </div>

      {data?.trafficAlert && (
        <div style={{
          backgroundColor: "#ef4444",
          color: "white",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "15px",
          textAlign: "center",
          fontWeight: "800",
          animation: "pulse 1s infinite",
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)"
        }}>
          ⚠️ HIGH TRAFFIC DETECTED<br/>
          <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>PLEASE CLEAR THE ROUTE IMMEDIATELY</span>
        </div>
      )}

      {alert ? (
        <div className="alert-content">
          <div className="alert-item">
            <span className="label">📍 Checkpoint:</span>
            <span className="value">{alert.checkpointId}</span>
          </div>
          <div className="alert-item">
            <span className="label">⏱️ ETA:</span>
            <span className="value">{alert.eta || "N/A"} mins</span>
          </div>
          <div className="alert-item">
            <span className="label">📡 Status:</span>
            <span className="value status-incoming">🚑 Ambulance Incoming</span>
          </div>
          <div className="alert-item">
            <span className="label">⌚ Updated:</span>
            <span className="value">{alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : "N/A"}</span>
          </div>
        </div>
      ) : (
        <p className="no-alert">Waiting for ambulance location...</p>
      )}
    </div>
  );
}