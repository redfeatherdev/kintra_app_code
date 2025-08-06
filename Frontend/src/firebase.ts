// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";

// Replace the placeholders below with the values from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDxK9yv-gd2ceI97pbEiduZDuefa-HNMY4",
  authDomain: "chatbot-cc19e.firebaseapp.com",
  databaseURL: "https://chatbot-cc19e-default-rtdb.firebaseio.com",
  projectId: "chatbot-cc19e",
  storageBucket: "chatbot-cc19e.appspot.com",
  messagingSenderId: "254260581022",
  appId: "1:254260581022:web:7aaf62491cabafcd13e18f",
  measurementId: "G-171N80W4WH"        // optional for analytics
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, push };
