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
  const [isMicrophoneChecked, setIsMicrophoneChecked] = useState(false);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

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

          if (scaledVolume > 20) {
            setIsMicrophoneChecked(true);
          }

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

  const playTestSound = () => {
    const audio = new Audio("/audiotest.mp3");
    setIsPlaying(true);
    setAudioProgress(0);

    const interval = setInterval(() => {
      if (audio.ended) {
        clearInterval(interval);
        setAudioProgress(100);
        setIsPlaying(false);
      } else {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    }, 100);

    audio.play();

    audio.onended = () => {
      clearInterval(interval);
      setAudioProgress(100);
      setIsPlaying(false);
    };

    audio.onerror = () => {
      clearInterval(interval);
      setAudioProgress(0);
      setIsPlaying(false);
      alert("오디오 파일 재생에 실패했습니다.");
    };
  };

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
          <h2 className="text-2xl font-bold mb-4">음성 및 오디오 테스트</h2>
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
              <button
                className={`mt-4 px-4 py-2 rounded-lg text-white font-bold ${
                  isMicrophoneChecked
                    ? "bg-green-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isMicrophoneChecked}
              >
                {isMicrophoneChecked ? "음성 인식 완료 ✓" : "테스트 완료"}
              </button>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={playTestSound}
              className={`relative w-48 h-8 rounded-lg text-white font-bold ${
                isPlaying ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <>
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                  <span className="relative z-10">재생 중...</span>
                </>
              ) : (
                "오디오 재생"
              )}
            </button>
            <button
              onClick={() => setIsAudioChecked(true)}
              className={`mt-4 px-4 py-2 rounded-lg text-white font-bold ${
                isAudioChecked ? "bg-green-500" : "bg-gray-400"
              }`}
              disabled={!isPlaying && !isAudioChecked}
            >
              {isAudioChecked ? "오디오 체크 완료 ✓" : "확인완료"}
            </button>
          </div>

          <button
            onClick={() => router.push(`/interview/ongoing`)}
            className={`mt-6 px-4 py-2 rounded-lg text-white font-bold ${
              isMicrophoneChecked && isAudioChecked
                ? "bg-secondary"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isMicrophoneChecked || !isAudioChecked}
          >
            면접 시작
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewOngoingPreparePage;
