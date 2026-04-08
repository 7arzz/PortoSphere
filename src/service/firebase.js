import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRResPgAxyhUJJtcmQGyJD6Ft0hLvdck4",
  authDomain: "portofoliotracker-e8a05.firebaseapp.com",
  projectId: "portofoliotracker-e8a05",
  storageBucket: "portofoliotracker-e8a05.firebasestorage.app",
  messagingSenderId: "207456247200",
  appId: "1:207456247200:web:a848a5c49e4bf87612d8c5",
};

const app = initializeApp(firebaseConfig);

// 🔥 INI YANG PENTING
export const db = getFirestore(app);
