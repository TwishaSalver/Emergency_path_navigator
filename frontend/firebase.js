import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "YOUR_GOOGLE_MAPS_KEY",
  authDomain: "clearpath-demo.firebaseapp.com",
  databaseURL: "https://clearpath-demo.firebaseio.com",
  projectId: "clearpath-demo"
};

let db = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (err) {
  console.warn("Firebase not available - real-time updates disabled");
}

export { db, ref, set, onValue };