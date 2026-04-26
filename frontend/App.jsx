import React, { useState } from "react";
import Dispatch from "./components/Dispatch";
import MapView from "./components/MapView";
import PolicePanel from "./components/PolicePanel";
import ThemeToggle from "./components/ThemeToggle";
import AIInsights from "./components/AIInsights";
import PredictiveDispatch from "./components/PredictiveDispatch";
import HospitalPanel from "./components/HospitalPanel";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);

  return (
    <div className="app-container">
      <ThemeToggle />
      <header className="app-header">
        <h1>🚑 ClearPath</h1>
        <p>Emergency Response Dispatch & Tracking System</p>
      </header>
      
      <main className="app-main">
        <div className="grid-container">
          <aside className="sidebar">
            <Dispatch setData={setData} />
            {data && <AIInsights insights={data.aiInsights} />}
            {data && <HospitalPanel data={data} />}
            {data && <PolicePanel data={data} />}
            <PredictiveDispatch />
          </aside>
          
          <section className="map-section">
            {data ? (
              <MapView data={data} />
            ) : (
              <div className="no-data">
                <p>📍 Create a case to see the route on the map</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 ClearPath - Optimizing Emergency Response</p>
      </footer>
    </div>
  );
}