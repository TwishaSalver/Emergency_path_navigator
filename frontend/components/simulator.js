import { db, ref, set } from "../firebase";

export function startSimulation(checkpoints) {
  if (!checkpoints || checkpoints.length === 0) return;
  
  let index = 0;

  const interval = setInterval(() => {
    if (index >= checkpoints.length) {
      clearInterval(interval);
      return;
    }

    const current = checkpoints[index];

    // Push live location to Firebase if available
    if (db) {
      try {
        set(ref(db, "ambulance"), {
          lat: current.lat,
          lng: current.lng,
          checkpointId: current.id,
          eta: current.eta
        }).catch(() => {});
      } catch (err) {
        // Silently fail - Firebase is optional for demo
      }
    }

    index++;
  }, 3000);
}