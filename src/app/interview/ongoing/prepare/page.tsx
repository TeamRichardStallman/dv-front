"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import Loading from "@/components/loading";
import "react-toastify/dist/ReactToastify.css";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/utils/firebaseConfig";
import useInterviewStore from "@/stores/useInterviewStore";
import MicTest from "@/components/mic-test";
import CustomModal from "@/components/modal/custom-modal";

const apiUrl = `${setUrl}`;
const TIMEOUT_DURATION = 180000;

const InterviewOngoingPreparePage = () => {
  const { interview } = useInterviewStore();
  const { questionRequest } = useQuestionRequest();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isQuestionReceived] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [interviewId, setInterviewId] = useState<string | undefined>(undefined);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

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
    let hasFetched = false;

    const requestQuestionList = async () => {
      if (!hasFetched) {
        hasFetched = true;
        await axios.post(`${apiUrl}/question`, questionRequest, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    };

    requestQuestionList();
  }, [questionRequest]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isQuestionReceived) {
        alert("질문 생성에 실패했습니다. 메인 화면으로 이동합니다.");
        router.push("/");
      }
    }, TIMEOUT_DURATION);

    const initializeFirebaseMessaging = async () => {
      if (typeof window === "undefined") {
        console.warn(
          "Firebase Messaging can only be initialized in the browser."
        );
        return;
      }

      const supported = await isSupported();
      if (!supported) {
        console.warn("Firebase Messaging이 지원되지 않는 브라우저입니다.");
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
            title ?? "면접 준비 완료",
            body ?? "면접이 시작됩니다.",
            `/interview/ongoing/${body}`
          );

          setModalMessage(
            "면접 준비가 완료되었습니다. '면접 시작'을 누르면 면접이 시작됩니다."
          );
          setConfirmModalMessage(
            "홈으로 이동하면 면접 서비스 이용이 취소되고 이용권 환불이 불가합니다. \n면접을 시작하려면 '면접 시작'을 눌러주세요."
          );
          setIsModalVisible(true);
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

    return () => clearTimeout(timeoutId);
  }, [router, interview.interviewMethod, isReady, isQuestionReceived]);

  const handleSetReady = (isReady: boolean) => {
    setIsReady(isReady);
  };

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

    function deleteFromIndexedDB(
      dbName: string,
      storeName: string,
      key: string
    ) {
      return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onerror = (event) => {
          console.error("IndexedDB Error:", event);
          reject(event);
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(storeName)) {
            console.warn(`Object Store "${storeName}" does not exist.`);
            resolve();
            return;
          }

          const transaction = db.transaction(storeName, "readwrite");
          const store = transaction.objectStore(storeName);

          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => {
            console.log(`Data with key "${key}" deleted successfully.`);
            resolve();
          };
          deleteRequest.onerror = () => {
            console.warn(`Failed to delete data for key "${key}".`);
            reject(deleteRequest.error);
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
              deleteFromIndexedDB("firebaseMessages", "messages", "latestData")
                .then(() => console.log("IndexedDB 데이터 삭제 완료"))
                .catch((err) =>
                  console.error("IndexedDB 데이터 삭제 중 오류:", err)
                );
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
    <div className="flex flex-col items-center">
      {interview.interviewMethod === "CHAT" ? (
        <Loading title="질문 생성 중" description="잠시만 기다려주세요." />
      ) : isReady ? (
        <Loading title="질문 생성 중" description="잠시만 기다려주세요." />
      ) : (
        <MicTest handleSetReady={handleSetReady} />
      )}
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="면접 시작"
        cancelButton="취소"
        onClose={() => {
          setIsModalVisible(false);
          setConfirmModalMessage(
            "홈으로 이동하면 면접 서비스 이용이 취소되고 이용권 환불이 불가합니다. \n면접을 시작하려면 '면접 시작'을 눌러주세요."
          );
          setIsConfirmModalVisible(true);
        }}
        onConfirm={() => router.push(`/interview/ongoing/${interviewId}`)}
      />
      <CustomModal
        isVisible={isConfirmModalVisible}
        message={confirmModalMessage}
        confirmButton="면접 시작"
        cancelButton="홈으로"
        onClose={() => {
          setIsConfirmModalVisible(false);
          router.push(`/`);
        }}
        onConfirm={() => router.push(`/interview/ongoing/${interviewId}`)}
      />
    </div>
  );
};

export default InterviewOngoingPreparePage;
