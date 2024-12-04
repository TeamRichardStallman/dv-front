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

const apiUrl = `${setUrl}`;

const InterviewOngoingPreparePage = () => {
  const { interview } = useInterviewStore();
  const { questionRequest } = useQuestionRequest();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

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
            if (
              confirm(
                "면접 준비가 완료되었습니다. 확인을 누르면 면접이 시작됩니다."
              )
            ) {
              router.push(`/interview/ongoing/${payload.notification.body}`);
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
    let hasFetched = false;
    const requestQuestionList = async () => {
      if (!hasFetched) {
        hasFetched = true;
        setLoading(true);
        await axios.post(`${apiUrl}/question`, questionRequest, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setLoading(false);
    };

    const requestMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicrophonePermission(true);

        const audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          const scaledVolume = Math.min(100, volume * 1.5);
          setVolumeLevel(Math.floor(scaledVolume));

          requestAnimationFrame(updateVolume);
        };

        source.connect(analyser);
        updateVolume();
      } catch (error) {
        console.error("마이크 접근 오류:", error);
        setMicrophonePermission(false);
      }
    };

    initializeFirebaseMessaging();
    requestQuestionList();
    requestMicrophoneAccess();
  }, [questionRequest, router]);

  return (
    <div>
      {interview.interviewMethod === "CHAT" ? (
        loading ? (
          <Loading title="질문 생성 중" description="잠시만 기다려주세요." />
        ) : (
          <Loading title="면접 준비 중" description="잠시만 기다려주세요." />
        )
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">음성 테스트</h2>
          {!microphonePermission ? (
            <p className="text-red-500">
              마이크 접근 권한이 필요합니다. 설정을 확인해주세요.
            </p>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex flex-col-reverse items-center space-y-1 space-y-reverse">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-md transition-all duration-300 ${
                      volumeLevel >= (i + 1) * 10
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                    style={{
                      width: `${20 + i * 5}px`,
                    }}
                  ></div>
                ))}
              </div>
              <p className="text-gray-700 font-semibold mt-2">
                음성 입력 감지 중...
              </p>
            </div>
          )}
          <button
            onClick={() => router.push(`/interview/ongoing`)}
            className={`mt-4 px-4 py-2 rounded-lg bg-primary text-white font-bold ${
              !microphonePermission || volumeLevel === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            disabled={!microphonePermission || volumeLevel === 0}
          >
            테스트 완료
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewOngoingPreparePage;
