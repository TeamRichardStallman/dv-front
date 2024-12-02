import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAUxvDVVY9Jna9MKbqLC33qGz7PCx2eGbA",
  authDomain: "ikdk-120f0.firebaseapp.com",
  projectId: "ikdk-120f0",
  storageBucket: "ikdk-120f0.firebasestorage.app",
  messagingSenderId: "179784048652",
  appId: "1:179784048652:web:5c245b16b9971685a4ce29",
  measurementId: "G-XTJM1D4TF1",
};

const firebaseApp = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(firebaseApp);
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
    }
  });

  try {
    analytics = getAnalytics(firebaseApp);
  } catch (error) {
    console.error("Error initializing Firebase Analytics: ", error);
  }
}

export { firebaseApp, messaging, analytics };
