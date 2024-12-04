"use client";
import React, { useCallback, useEffect, useState } from "react";
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
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    sendInitialQuestion();
  }, [questionRequest.interviewId]);

  const sendNextQuestion = useCallback(async () => {
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
          s3AudioUrl: "",
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
        if (shouldRedirect) {
          return;
        }
        setQuestionResponse(response.data);
        setCount((prev) => prev + 1);
        setTimeLeft(MAX_TIME);
        setAnswerText("");

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
  }, [questionRequest.interviewId, questionResponse, answerText]);

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
      sendNextQuestion();
    }
  }, [timeLeft, sendNextQuestion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          return MAX_TIME;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionResponse]);

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
              {user?.nickname}님의{" "}
              {questionRequest.interviewMode &&
                removeInterview(
                  interviewInfoMap[questionRequest.interviewMode].label
                )}
              /
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
            <textarea
              className="w-full h-72 border-2 font-medium rounded-md p-3"
              placeholder="답변을 작성해주세요."
              value={answerText}
              onChange={handleAnswerChange}
            />
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
              className="px-6 py-3 bg-secondary text-white rounded font-semibold text-xl"
              onClick={handleNextClick}
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
