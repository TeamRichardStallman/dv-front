"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import Loading from "@/components/loading";
import { ToastContainer } from "react-toastify";
import { formatTime } from "@/utils/format";

const apiUrl = `${setUrl}`;

interface JobDetails {
  jobId: number;
  jobName: string;
  jobNameKorean: string;
  jobDescription: string;
}

interface InterviewDetails {
  interviewId: number;
  interviewTitle: string;
  interviewStatus: "IN_PROGRESS" | "FILE_UPLOADED" | "COMPLETED" | "CANCELLED";
  interviewType: "TECHNICAL" | "BEHAVIORAL" | "OTHER_TYPE";
  interviewMethod: "CHAT" | "VIDEO" | "IN_PERSON";
  interviewMode: "REAL" | "MOCK";
  job: JobDetails;
}

interface Answer {
  answerText: string;
  s3AudioUrl: string;
  s3VideoUrl: string;
}

interface InterviewAnswerRequest {
  interviewId: number;
  questionId: number;
  answer: Answer;
}

interface QuestionResponseData {
  interview: InterviewDetails;
  questionText: string;
  nextQuestionId: number;
  hasNext: boolean;
}

interface QuestionResponse {
  code: number;
  message: string;
  data: QuestionResponseData;
}

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
  const [currentQuestionId, setCurrentQuestionId] = useState<
    number | undefined
  >();

  useEffect(() => {
    let hasFetched = false;

    const sendInitialQuestion = async () => {
      if (!hasFetched) {
        hasFetched = true;
        setLoading(true);
        try {
          const response = await axios.post<QuestionResponse>(
            `${apiUrl}/question/initial-question`,
            questionRequest,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setQuestionResponse(response.data);
          setCurrentQuestionId(response.data.data.nextQuestionId - 1);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    sendInitialQuestion();
  }, []);

  const sendNextQuestion = async () => {
    if (questionRequest.interviewId && currentQuestionId !== undefined) {
      const interviewAnswerRequest: InterviewAnswerRequest = {
        interviewId: questionRequest.interviewId,
        questionId: currentQuestionId,
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
        setQuestionResponse(response.data);
        setTimeLeft(MAX_TIME);
        setAnswerText("");

        if (response.data.data.hasNext) {
          setCurrentQuestionId(response.data.data.nextQuestionId);
        } else {
          router.push(`/interview/feedback/${questionRequest.interviewId}`);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <Loading
          title="질문 리스트 생성중"
          description="잠시만 기다려주세요."
        />
      ) : (
        <div className="h-[65vh] flex flex-col items-center">
          <ToastContainer />
          <div className="flex gap-4 items-center mb-12 font-bold">
            <h1 className="text-3xl">OOO님의 실전/기술 면접</h1>
            <div className="text-xl rounded-md px-4 py-3 bg-[#BDC3C7] text-white w-35 h-15">
              OO 직무
            </div>
          </div>

          <div className="flex flex-col w-[900px] gap-6">
            <div className="flex w-full bg-primary font-semibold text-white rounded-md items-center justify-center p-3 text-lg">
              Q. {questionResponse?.data.questionText}
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
              onClick={sendNextQuestion}
            >
              {questionResponse?.data.hasNext ? "다음" : "제출"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewOngoingDetailPage;
