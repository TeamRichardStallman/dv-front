"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import Loading from "@/components/loading";
import { formatTime, removeInterview } from "@/utils/format";
import {
  interviewInfoMap,
  jobsMap,
} from "@/components/interview/interview-feedback-detail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MicRecorder from "mic-recorder-to-mp3";
import RecordingIndicator from "@/components/RecordingIndicator";
// import { audio } from "framer-motion/client";

const apiUrl = `${setUrl}`;

const MAX_TIME = 180;

const InterviewOngoingDetailPage = () => {
  const { questionRequest } = useQuestionRequest();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [questionResponse, setQuestionResponse] = useState<
    QuestionResponse | undefined
  >();
  const [count, setCount] = useState(1);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [user, setUser] = useState<GetUserProps>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MicRecorder>(new MicRecorder({ bitRate: 64 }));
  const audioRef = useRef<InstanceType<typeof Audio> | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (questionRequest.interviewMethod !== "VOICE") return;

    try {
      await recorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  }, [questionRequest.interviewMethod]);

  const stopRecording = useCallback(async () => {
    try {
      const [, blob] = await recorder.current.stop().getMp3();
      setIsRecording(false);
      return blob;
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let hasFetched = false;

    const sendInitialQuestion = async () => {
      if (!hasFetched) {
        hasFetched = true;
        setLoading(true);
        const userResponse = await axios.get<GetUserResponse>(
          `${apiUrl}/user/info`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setUser(userResponse.data.data);
        try {
          const response = await axios.post<QuestionResponse>(
            `${apiUrl}/question/initial-question`,
            { interviewId: questionRequest.interviewId },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setQuestionResponse(response.data);
          if (questionRequest.interviewMethod === "CHAT") {
            setIsTimerRunning(true);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    sendInitialQuestion();
  }, [questionRequest.interviewId, questionRequest.interviewMethod]);

  const sendNextQuestion = useCallback(async () => {
    setTimeLeft(MAX_TIME);
    setIsTimerRunning(false);

    // let audioUrl = "";
    let audioObjectKey = "";

    if (questionRequest.interviewMethod === "VOICE") {
      let newAudioBlob = null;
      try {
        newAudioBlob = await stopRecording();
      } catch (error) {
        console.error("Error in handleNextClick:", error);
      }

      if (newAudioBlob) {
        const formData = new FormData();
        formData.append(
          "file",
          newAudioBlob,
          `audio_question_${questionResponse?.data.currentQuestionId}.mp3`
        );

        try {
          const presignedResponse = await axios.get<GetPreSignedUrlResponse>(
            `${apiUrl}/file/audio/${questionRequest.interviewId}/${questionResponse?.data.currentQuestionId}/upload-url`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const presignedUrl = presignedResponse.data?.data?.preSignedUrl;
          const objectKey = presignedResponse.data?.data.objectKey;

          if (presignedUrl) {
            await fetch(presignedUrl, {
              method: "PUT",
              headers: { "Content-Type": "audio/mp3" },
              body: formData.get("file"),
            });

            // audioUrl = presignedUrl;
            audioObjectKey = objectKey;
          } else {
            toast.warn("Presigned URL이 없습니다. 업로드 건너뜁니다.");
          }
        } catch (error) {
          console.error(
            "Presigned URL 요청 또는 S3 업로드 중 오류 발생:",
            error
          );
          toast.error("녹음 파일 업로드에 실패했습니다.");
        }
      }
    }

    if (
      questionRequest.interviewId &&
      questionResponse?.data.currentQuestionId !== undefined
    ) {
      const interviewAnswerRequest: InterviewAnswerRequest = {
        interviewId: questionRequest.interviewId,
        answerQuestionId: questionResponse?.data.currentQuestionId,
        nextQuestionId: questionResponse?.data.nextQuestionId ?? undefined,
        answer: {
          answerText: answerText,
          s3AudioUrl: audioObjectKey,
          s3VideoUrl: "",
        },
      };

      try {
        const response = await axios.post<QuestionResponse>(
          `${apiUrl}/question/next-question`,
          interviewAnswerRequest,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (shouldRedirect) return;

        setQuestionResponse(response.data);
        setCount((prev) => prev + 1);
        setTimeLeft(MAX_TIME);
        setAnswerText("");

        if (questionRequest.interviewMethod === "CHAT") {
          setIsTimerRunning(true);
        }

        if (!response.data.data.hasNext) {
          setShouldRedirect(true);
        } else {
          setShouldRedirect(false);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [
    questionRequest.interviewId,
    questionRequest.interviewMethod,
    questionResponse,
    answerText,
    shouldRedirect,
    stopRecording,
  ]);

  useEffect(() => {
    if (timeLeft === 1) {
      toast.info("시간이 초과되어 다음 질문으로 넘어갑니다.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { fontWeight: "600", whiteSpace: "nowrap", width: "350px" },
      });
      if (shouldRedirect) {
        router.push(`/interview/feedback/${questionRequest.interviewId}`);
      } else {
        sendNextQuestion();
      }
    }
  }, [
    timeLeft,
    shouldRedirect,
    questionRequest.interviewId,
    sendNextQuestion,
    router,
  ]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          return MAX_TIME;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    if (questionResponse?.data.currentQuestionS3AudioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onplay = null;
      }

      const audio = new Audio(questionResponse.data.currentQuestionS3AudioUrl);
      audioRef.current = audio;
      setIsPlaying(true);

      setTimeout(() => {
        audio
          .play()
          .then(() => {
            audio.onplay = () => setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Audio playback error:", error);
            toast.warn("자동 재생이 지원되지 않습니다.");
            setIsPlaying(false);
          });

        audio.onended = () => {
          setIsPlaying(false);
          setIsTimerRunning(true);
          startRecording();
        };
      }, 2000);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onplay = null;
        }
      };
    }
  }, [questionResponse?.data.currentQuestionS3AudioUrl, startRecording]);

  const handleNextClick = () => {
    if (shouldRedirect) {
      sendNextQuestion();
      router.push(`/interview/feedback/${questionRequest.interviewId}`);
    } else {
      sendNextQuestion();
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <Loading title="질문 생성중" description="잠시만 기다려주세요." />
      ) : (
        <div className="h-[65vh] flex flex-col items-center">
          <ToastContainer />
          <div className="flex gap-4 items-center mb-12 font-bold">
            <h1 className="text-3xl">
              {user?.name}님의{" "}
              {questionRequest.interviewMode &&
                removeInterview(
                  interviewInfoMap[questionRequest.interviewMode].label
                )}
              /{" "}
              {questionRequest.interviewType &&
                removeInterview(
                  interviewInfoMap[questionRequest.interviewType].label
                )}{" "}
              면접
            </h1>
            <div className="text-xl rounded-md px-4 py-3 bg-[#BDC3C7] text-white w-35 h-15">
              {questionRequest.jobId && jobsMap[questionRequest.jobId].label}{" "}
            </div>
          </div>

          <div className="flex flex-col w-[900px] gap-6">
            <div className="flex w-full bg-primary font-semibold text-white rounded-md items-center justify-center p-3 text-lg">
              Q{count}. {questionResponse?.data.currentQuestionText}
            </div>

            {questionRequest.interviewMethod === "CHAT" && (
              <textarea
                className="w-full h-72 border-2 font-medium rounded-md p-3"
                placeholder="답변을 작성해주세요."
                value={answerText}
                onChange={handleAnswerChange}
              />
            )}

            {questionRequest.interviewMethod === "VOICE" && (
              <div className="my-7 flex w-full justify-center">
                <RecordingIndicator isRecording={isRecording} />
              </div>
            )}
          </div>

          <div className="flex w-full justify-end py-6 items-center gap-4">
            <div className="flex items-center gap-2 w-[100px] justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill={timeLeft <= 30 ? "#FF0000" : "#000000"}
                viewBox="0 0 256 256"
              >
                <path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"></path>
              </svg>
              <span
                className={`text-xl w-[50px] font-semibold text-center ${
                  timeLeft <= 30 ? "text-red-500" : "text-black"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              className={`px-6 py-3 ${
                isPlaying ? "bg-gray-400 cursor-not-allowed" : "bg-secondary"
              } text-white rounded font-semibold text-xl`}
              onClick={handleNextClick}
              disabled={isPlaying}
            >
              {shouldRedirect ? "제출" : "다음"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewOngoingDetailPage;
