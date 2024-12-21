"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";
import CustomModal from "@/components/modal/custom-modal";

const InterviewFeedbackDetailPage = () => {
  const { questionRequest } = useQuestionRequest();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [interviewId, setInterviewId] = useState<string | undefined>(undefined);

  const showNotification = (title: string, body: string, url: string) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/logo.png",
      });
      notification.onclick = () => {
        window.focus();
        router.push(url);
      };
    }
  };

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
          const { title, body } = payload.notification || {};

          if (!body) {
            console.warn("알림 메시지가 없습니다.");
            return;
          }

          setInterviewId(body);

          showNotification(
            title ?? "평가 완료",
            body ?? "평가 조회로 이동합니다.",
            `/mypage/feedback/${body}`
          );
          setModalMessage("평가가 완료되었습니다. 평가 조회로 이동합니다.");
          setIsModalVisible(true);
        });
      } catch (error) {
        console.error("Firebase Messaging 초기화 중 에러: ", error);
      }
    };
    initializeFirebaseMessaging();
  }, [questionRequest.interviewId, router]);

  useEffect(() => {
    function readFromIndexedDB<T>(
      dbName: string,
      storeName: string,
      key: string
    ): Promise<T | null> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onerror = (event) => {
          console.error("IndexedDB Error:", event);
          reject(event);
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(storeName)) {
            console.warn(`Object Store "${storeName}" does not exist.`);
            resolve(null);
            return;
          }

          const transaction = db.transaction(storeName, "readonly");
          const store = transaction.objectStore(storeName);

          const getRequest = store.get(key);
          getRequest.onsuccess = () => {
            if (getRequest.result) {
              resolve(getRequest.result.value);
            } else {
              console.warn(
                `No data found for key "${key}" in store "${storeName}".`
              );
              resolve(null);
            }
          };
          getRequest.onerror = () => {
            console.warn(`Failed to read data for key "${key}".`);
            resolve(null);
          };
        };
      });
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("탭 복귀 확인");
        readFromIndexedDB<string>("firebaseMessages", "messages", "latestData")
          .then((data) => {
            if (data) {
              console.log("Retrieved data from IndexedDB:", data);
              setInterviewId(data);
              setModalMessage(
                "면접 준비가 완료되었습니다. '면접 시작'을 누르면 면접이 시작됩니다."
              );
              setIsModalVisible(true);
            } else {
              console.log("IndexedDB에 데이터가 없습니다.");
            }
          })
          .catch((err) => console.error("Unexpected error:", err));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
  return (
    <div>
      <Loading title="피드백 준비중" description="고생하셨습니다." />
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="평가 조회"
        cancelButton="홈으로"
        onClose={() => {
          setIsModalVisible(false);
          router.push(`/`);
        }}
        onConfirm={() => router.push(`/mypage/feedback/${interviewId}`)}
      />
    </div>
  );
};

export default InterviewFeedbackDetailPage;
