importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAA7NUuDJs768DT7SGB6OQmZHG-_-Ese7U",
  authDomain: "ikdk-55b6f.firebaseapp.com",
  projectId: "ikdk-55b6f",
  storageBucket: "ikdk-55b6f.firebasestorage.app",
  messagingSenderId: "802147604659",
  appId: "1:802147604659:web:b2c41ad2a9d237f919b8c6",
  measurementId: "G-RKMGTY2Y56",
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
