"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/loading";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { setUrl } from "@/utils/setUrl";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";
import CustomModal from "@/components/modal/custom-modal";

const apiUrl = `${setUrl}`;

const InterviewFeedbackDetailPage = () => {
  const { questionRequest } = useQuestionRequest();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [interviewId, setInterviewId] = useState("");

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
  }, [questionRequest.interviewId, router]);

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
