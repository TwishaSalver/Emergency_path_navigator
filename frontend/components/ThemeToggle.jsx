import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "var(--glass)",
        border: "1px solid var(--glass-border)",
        color: "var(--text-main)",
        padding: "8px 16px",
        borderRadius: "20px",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "600",
        transition: "all 0.3s ease",
        position: "absolute",
        top: "20px",
        right: "20px"
      }}
    >
      {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
