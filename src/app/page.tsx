"use client";

import { motion } from "framer-motion";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { isLogined } from "@/utils/isLogined";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeFirebaseMessaging = async () => {
      if (typeof window === "undefined") {
        console.warn(
          "Firebase Messaging can only be initialized in the browser."
        );
        return;
      }

      const supported = await isSupported();
      if (!supported) {
        console.warn("Firebase Messaging is not supported in this browser.");
        return;
      }

      try {
        const messaging = getMessaging(firebaseApp);

        onMessage(messaging, (payload) => {
          console.log("[포그라운드 메시지 수신]:", payload);

          if (payload.notification) {
            const { title, body, icon } = payload.notification as {
              title?: string;
              body?: string;
              icon?: string;
            };
            if (Notification.permission === "granted") {
              new Notification(title ?? "알림", {
                body: body ?? "메시지가 도착했습니다.",
                icon: icon ?? "/logo.png",
              });
            }
          } else {
            console.warn("Notification payload is undefined:", payload);
          }
        });
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
              console.log("Service Worker 등록 성공:", registration);
            })
            .catch((error) => {
              console.error("Service Worker 등록 실패:", error);
            });
        } else {
          console.warn("Service Worker is not supported in this browser.");
        }
      } catch (error) {
        console.error("Firebase Messaging 초기화 중 에러:", error);
      }
    };
    initializeFirebaseMessaging();
    setLoggedIn(isLogined());
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header loggedIn={loggedIn} />

        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4"
          >
            Interview King Dev Kim
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-xl md:text-2xl whitespace-nowrap font-medium mb-12 text-gray-700 max-w-lg leading-relaxed"
          >
            면접, 그 이상의 기록과 성장을 위한 당신의 가상 면접 파트너
          </motion.p>

          <motion.div
              initial={{scale: 0.9}}
              animate={{scale: 1}}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8,
              }}
          >
            <button
                onClick={() => {
                  if (!loggedIn) {
                    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                    router.push("/login");
                  } else {
                    router.push("/interview");
                  }
                }}
                className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              시작하기
            </button>
          </motion.div>
        </main>

        <Footer/>
      </div>

      <motion.div
          initial={{opacity: 0, x: -100}}
          animate={{opacity: 0.1, x: 100}}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
          className="absolute top-1/3 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10"
      />
      <motion.div
          initial={{opacity: 0, x: 100}}
          animate={{opacity: 0.1, x: -100}}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          repeatType: "mirror",
        }}
        className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-10"
      />
    </div>
  );
}
