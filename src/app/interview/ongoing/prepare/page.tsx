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
import VideoTest from "@/components/video-test-2";

const apiUrl = `${setUrl}`;

const TIMEOUT_DURATION = 180000;
const InterviewOngoingPreparePage = () => {
  const { interview } = useInterviewStore();
  const { questionRequest } = useQuestionRequest();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isQuestionReceived, setIsQuestionReceived] = useState(false);

  useEffect(() => {
    let hasFetched = false;

    const requestQuestionList = async () => {
      console.log("questionRequest: ", questionRequest);
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
        console.warn("Firebase Messaging is not supported in this browser.");
        return;
      }

      try {
        const messaging = getMessaging(firebaseApp);

        onMessage(messaging, (payload) => {
          console.log("[포그라운드 메시지 수신]:", payload);
          setIsQuestionReceived(true);

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

            switch (interview.interviewMethod) {
              case "CHAT":
                if (
                  confirm(
                    "면접 준비가 완료되었습니다. 확인을 누르면 면접이 시작됩니다."
                  )
                ) {
                  router.push(
                    `/interview/ongoing/${payload.notification.body}`
                  );
                }
                break;
              case "VOICE":
                if (isReady) {
                  if (
                    confirm(
                      "면접 준비가 완료되었습니다. 확인을 누르면 면접이 시작됩니다."
                    )
                  ) {
                    router.push(
                      `/interview/ongoing/${payload.notification.body}`
                    );
                  }
                }
                break;
              default:
                break;
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

    return () => clearTimeout(timeoutId);
  }, [router, interview.interviewMethod, isReady, isQuestionReceived]);

  const handleSetReady = (isReady: boolean) => {
    setIsReady(isReady);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {interview.interviewMethod === "CHAT" && (
        <Loading title="질문 생성 중" description="잠시만 기다려주세요." />
      )}
      {interview.interviewMethod === "VOICE" && isReady && (
        <Loading title="질문 생성 중" description="잠시만 기다려주세요." />
      )}
      {interview.interviewMethod === "VOICE" && !isReady && (
        <MicTest handleSetReady={handleSetReady} />
      )}
      {interview.interviewMethod === "VIDEO" && isReady && (
        <Loading title="질문 생성 중" description="잠시만 기다려주세요." />
      )}
      {interview.interviewMethod === "VIDEO" && !isReady && (
        <VideoTest handleSetReady={handleSetReady} />
      )}
    </div>
  );
};

export default InterviewOngoingPreparePage;
