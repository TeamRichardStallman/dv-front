"use client";
import React, { useEffect } from "react";
import axios from "axios";
import Loading from "@/components/loading";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { setUrl } from "@/utils/setUrl";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";

const apiUrl = `${setUrl}`;

const InterviewFeedbackDetailPage = () => {
  const { questionRequest } = useQuestionRequest();
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
            const { title, body } = payload.notification as {
              title?: string;
              body?: string;
            };
            if (title === "평가가 완료되었습니다.") {
              if (confirm(title + " 평가 조회로 이동합니다.")) {
                router.push(`/mypage/feedback/${body}`);
              } else {
                router.push("/");
              }
            }
          }
        });
      } catch (error) {
        console.error("Firebase Messaging 초기화 중 에러: ", error);
      }
    };
    const sendEvaluation = async () => {
      try {
        const evalResponse = await axios.post(
          `${apiUrl}/evaluation`,
          { interviewId: questionRequest.interviewId },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log(evalResponse);
      } catch (error) {
        console.error("Error fetching data Evaluation:", error);
      }
    };
    initializeFirebaseMessaging();
    sendEvaluation();
  }, []);

  return (
    <div>
      <Loading title="피드백 준비중" description="고생하셨습니다." />
    </div>
  );
};

export default InterviewFeedbackDetailPage;
