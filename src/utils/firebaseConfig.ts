import { initializeApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAA7NUuDJs768DT7SGB6OQmZHG-_-Ese7U",
  authDomain: "ikdk-55b6f.firebaseapp.com",
  projectId: "ikdk-55b6f",
  storageBucket: "ikdk-55b6f.firebasestorage.app",
  messagingSenderId: "802147604659",
  appId: "1:802147604659:web:b2c41ad2a9d237f919b8c6",
  measurementId: "G-RKMGTY2Y56",
};

const firebaseApp = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(firebaseApp);
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
    }
  });
}

export { firebaseApp, messaging };
