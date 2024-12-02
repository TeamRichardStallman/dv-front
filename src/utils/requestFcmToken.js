import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "./firebaseConfig";
import { setUrl } from "./setUrl";
import { setFcmKey } from "./setFcmKey";

const apiUrl = `${setUrl}`;
const fcmKey = `${setFcmKey}`;

export const requestPermissionAndGetToken = async () => {
  console.log("Requesting notification permission...");

  if (typeof window === "undefined") {
    console.warn("Firebase Messaging can only be used in the browser.");
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }
    console.log("Notfication permission granted.");

    const supported = await isSupported();
    if (!supported) {
      console.error("Firebase Messaging is not supported in this browser.");
      return null;
    }

    const existingToken = localStorage.getItem("fcmToken");
    const tokenTimestamp = localStorage.getItem("fcmTokenTimestamp");
    if (existingToken && tokenTimestamp) {
      const tokenAge = (Date.now() - parseInt(tokenTimestamp, 10)) / (1000 * 60 * 60 * 24);
      if (tokenAge < 7) {
        console.log("Existing FCM token found: ", existingToken);
        sendTokenToServer(existingToken);
        return existingToken;
      } else {
        console.log("FCM token is older than 7 days. Requesting a new one...");
      }
    }

    const token = await getToken(messaging, {
      vapidKey: fcmKey,
    });

    if (!token) {
      console.warn("No registration token available. Request permission to generate one.")
      return null;
    }
    console.log("New FCM registration token: ", token);

    localStorage.setItem("fcmToken", token);
    localStorage.setItem("fcmTokenTimestamp", Date.now().toString());
    await sendTokenToServer(token);

    return token;
  } catch (error) {
    console.error("An error occurred while getting FCM token:", error);
    return null;
  }
};

const sendTokenToServer = async (token) => {
  try {
    await fetch(`${apiUrl}/fcm/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    console.log("Token sent to server successfully.");
  } catch (error) {
    console.error("Failed to send token to server:", error);
  }
};

export const refreshTokenIfNeeded = async () => {
  console.log("Checking FCM token status...");

  const localToken = localStorage.getItem("fcmToken");
  const tokenTimestamp = localStorage.getItem("fcmTokenTimestamp");
  if (localToken && tokenTimestamp) {
    const tokenAge = (Date.now() - parseInt(tokenTimestamp, 10)) / (1000 * 60 * 60 * 24);
    if (tokenAge < 7) {
      console.log("FCM token is still valid. Using existing token:", localToken);
      return localToken;
    } else {
      console.log("FCM token is older than 7 days. Requesting a new one...");
    }
  }
  console.log("No valid token found. Requesting a new one...");
  return await requestPermissionAndGetToken();
};

export const clearFcmToken = async () => {
  console.log("Clearing FCM token...");
  const localToken = localStorage.getItem("fcmToken");

  if (localToken) {
    try {
      await fetch(`${apiUrl}/fcm/token`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localToken }),
      });
      console.log("FCM token removed from server.");
    } catch (error) {
      console.error("Failed to remove token from server:", error);
    }
  }

  localStorage.removeItem("fcmToken");
  localStorage.removeItem("fcmTokenTimestamp");
};
