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

function saveToIndexedDB(dbName, storeName, value) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
        console.log(`Object Store "${storeName}" created.`);
      }
    };

    request.onerror = (event) => {
      console.error("IndexedDB Error:", event);
      reject(event);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        console.error(`Object Store "${storeName}" not found.`);
        reject(new Error(`Object Store "${storeName}" not found.`));
        return;
      }

      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const data = { id: "latestData", value };

      const saveRequest = store.put(data);
      saveRequest.onsuccess = () => {
        console.log("Data saved to IndexedDB:", data);
        resolve(data);
      };
      saveRequest.onerror = (err) => {
        console.error("Error saving data to IndexedDB:", err);
        reject(err);
      };
    };
  });
}

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  saveToIndexedDB("firebaseMessages", "messages", payload.notification.body)
    .then(() => {
      console.log("Payload saved to IndexedDB successfully");
    })
    .catch((err) => {
      console.error("Failed to save to IndexedDB:", err);
    });

  const notificationTitle = payload.notification.title || "알림";
  const notificationOptions = {
    body: payload.notification.body || "메시지가 도착했습니다.",
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
