import React from "react";

export default function AIInsights({ insights }) {
  if (!insights) return null;

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      default: return "#10b981";
    }
  };

  return (
    <div style={{
      padding: "20px",
      background: "var(--glass)",
      border: `1px solid ${getRiskColor(insights.riskLevel)}44`,
      borderRadius: "1.5rem",
      marginTop: "20px",
      animation: "fadeIn 0.5s ease-out"
    }}>
      <h3 style={{ margin: "0 0 10px 0", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
        🤖 Gemini Route Insight
      </h3>
      <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 15px 0" }}>
        {insights.insight}
      </p>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: "700",
          backgroundColor: `${getRiskColor(insights.riskLevel)}22`,
          color: getRiskColor(insights.riskLevel),
          border: `1px solid ${getRiskColor(insights.riskLevel)}44`
        }}>
          Risk: {insights.riskLevel}
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          💡 {insights.suggestedCaution}
        </span>
      </div>
    </div>
  );
}
