import React, { useEffect, useState, useRef } from "react";
import { db, ref, onValue } from "../firebase";

export default function MapView({ data }) {
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const ambulanceMarkerRef = useRef(null);
  const checkpointsMarkersRef = useRef([]);

  useEffect(() => {
    if (!data) return;
    
    if (!import.meta.env.VITE_GOOGLE_MAPS_KEY) {
      setError("Google Maps API key not configured");
      return;
    }

    // Function to initialize or update the map
    const initOrUpdateMap = () => {
      if (!window.google) return;

      const bounds = new window.google.maps.LatLngBounds();

      // Initialize map if it doesn't exist
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });
      }

      // 1. Clear old checkpoints
      checkpointsMarkersRef.current.forEach(m => m.setMap(null));
      checkpointsMarkersRef.current = [];

      // 2. Draw new checkpoints
      if (data.checkpoints) {
        data.checkpoints.forEach(cp => {
          const pos = { lat: cp.lat, lng: cp.lng };
          const marker = new window.google.maps.Marker({
            position: pos,
            map: mapRef.current,
            label: {
              text: `${cp.id + 1}`,
              color: "white",
              fontWeight: "bold"
            },
            title: `Checkpoint ${cp.id + 1}`
          });
          checkpointsMarkersRef.current.push(marker);
          bounds.extend(pos);
        });
      }

      // 3. Draw Polyline
      if (polylineRef.current) polylineRef.current.setMap(null);
      
      if (data.polyline) {
        const path = window.google.maps.geometry.encoding.decodePath(data.polyline);
        polylineRef.current = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#2196F3",
          strokeOpacity: 0.8,
          strokeWeight: 5,
          map: mapRef.current
        });
        
        path.forEach(p => bounds.extend(p));
      }

      // 4. Ambulance marker
      if (!ambulanceMarkerRef.current) {
        ambulanceMarkerRef.current = new window.google.maps.Marker({
          map: mapRef.current,
          icon: {
            url: "https://maps.google.com/mapfiles/kml/shapes/ambulance.png",
            scaledSize: new window.google.maps.Size(40, 40)
          },
          zIndex: 1000
        });

        // Listen to Firebase for live tracking
        onValue(ref(db, "ambulance"), snapshot => {
          const val = snapshot.val();
          if (!val) return;
          const pos = { lat: val.lat, lng: val.lng };
          ambulanceMarkerRef.current.setPosition(pos);
        });
      }

      // 5. Fit bounds
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds);
        // Add some padding
        const padding = { top: 50, right: 50, bottom: 50, left: 50 };
        mapRef.current.setOptions({ padding });
      }
    };

    initOrUpdateMap();
  }, [data]);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f", textAlign: "center", backgroundColor: "#fff" }}>
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return <div id="map" style={{ width: "100%", height: "100%", borderRadius: "8px" }} />;
}