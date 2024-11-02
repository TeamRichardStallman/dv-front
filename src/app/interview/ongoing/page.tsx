"use client";
import { useCallback, useEffect, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { formatTime } from "@/utils/format";

const InterviewOngoingPage = () => {
  const questions = QUESTIONS.questions;
  const [answers, setAnswers] = useState<
    {
      question_id: number;
      answer_text: string;
      answer_time: number;
    }[]
  >([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  const handleNextQuestion = useCallback(() => {
    const newAnswers = [
      ...answers,
      {
        question_id: questions[currentQuestionIndex].question_id,
        answer_text: answerText,
        answer_time: 180 - timeLeft,
      },
    ];
    setAnswers(newAnswers);
    setTimeLeft(180);

    if (currentQuestionIndex === questions.length - 1) {
      console.log("Submit answers to backend:", newAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText("");
    }
  }, [questions, answers, currentQuestionIndex, answerText, timeLeft]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          handleNextQuestion();
          return 180;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  return (
    <div className="h-[65vh] flex flex-col items-center">
      <div className="flex gap-4 items-center mb-12">
        <h1 className="text-3xl">OOO님의 실전/기술 면접</h1>
        <div className="text-xl rounded-md px-4 py-3 bg-[#BDC3C7] text-white w-35 h-15">
          OO 직무
        </div>
      </div>

      <div className="flex flex-col w-[900px] gap-6">
        <div className="flex w-full bg-primary text-white rounded-md items-center justify-center p-3 text-lg">
          Q{currentQuestionIndex + 1}.{" "}
          {questions[currentQuestionIndex].question_text}
        </div>
        <textarea
          className="w-full h-72 border-2 rounded-md p-3"
          placeholder="답변을 작성해주세요."
          value={answerText}
          onChange={handleAnswerChange}
        />
      </div>

      <div className="flex w-full justify-end py-6 items-center gap-4">
        <div className="flex gap-1 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"></path>
          </svg>
          <span className="text-xl font-semibold">{formatTime(timeLeft)}</span>
        </div>

        <button
          className="px-6 py-3 bg-secondary text-white rounded text-xl"
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex === questions.length - 1 ? "제출" : "다음"}
        </button>
      </div>
    </div>
  );
};

export default InterviewOngoingPage;
