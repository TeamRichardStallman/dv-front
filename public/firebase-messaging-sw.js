importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAUxvDVVY9Jna9MKbqLC33qGz7PCx2eGbA",
  authDomain: "ikdk-120f0.firebaseapp.com",
  projectId: "ikdk-120f0",
  storageBucket: "ikdk-120f0.firebasestorage.app",
  messagingSenderId: "179784048652",
  appId: "1:179784048652:web:5c245b16b9971685a4ce29",
  measurementId: "G-XTJM1D4TF1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const notificationTitle = payload.notification?.title || "Default Title";
  const notificationOptions = {
    body: payload.notification?.body || "Default Body",
    icon: payload.notification?.icon || "/default-icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
