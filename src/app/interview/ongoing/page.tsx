"use client";
import { useState } from "react";

const QUESTIONS: { questions: Question[] } = {
  questions: [
    {
      question_id: 1,
      question_excerpt: "할 수 있다는 믿음으로 달성한 첫 수상",
      question_text:
        "이전에 수상을 목표로 한 대회에 참가하면서 부딪혔던 어려움과 그것을 극복하기 위한 노력에 대해 설명해주세요.",
      question_intent:
        "지원자가 높은 목표를 달성하기 위해 어떻게 노력하고 어려움을 극복했는지에 대해 알아봅니다.",
      key_terms: ["목표 설정", "노력", "어려움 극복", "자기 믿음"],
    },
    {
      question_id: 2,
      question_excerpt:
        "가장 단순한 해결 방법을 통해 효율적인 결과를 도출하다.",
      question_text:
        "전선 탐지 알고리즘 프로젝트에서 새로운 방식을 도입하여 문제를 해결한 경험에 대해 이야기해주세요.",
      question_intent:
        "지원자가 어떻게 창의적인 방법으로 문제를 해결하였는지에 대해 알아봅니다.",
      key_terms: ["창의적 해결", "문제 해결 방법", "새로운 방식", "성과"],
    },
    {
      question_id: 3,
      question_excerpt: "소통의 오류를 문화의 이해로 해결하다",
      question_text:
        "일본인 교환학생과의 활동을 통해 문화적 차이를 극복하고 함께 성장한 경험에 대해 이야기해주세요.",
      question_intent:
        "지원자가 다양한 문화 간 소통에서 어떻게 어려움을 극복하고 상호 이해를 이루었는지에 대해 알아봅니다.",
      key_terms: ["다문화 경험", "문화 이해", "의사소통", "문화 간 이해"],
    },
    {
      question_id: 4,
      question_excerpt: "자동화 프로그램을 활용한 효율적인 데이터 수집",
      question_text:
        "안구 추적 데이터 수집 프로젝트에서 Digital Transformation을 통해 어떻게 자동화 시스템을 구축하였는지에 대해 상세히 설명해주세요.",
      question_intent:
        "지원자가 어떻게 기존의 비효율적인 방식을 개선하고 자동화를 통해 효율성을 증대시켰는지에 대해 알아봅니다.",
      key_terms: [
        "Digital Transformation",
        "자동화 시스템",
        "효율성 증대",
        "시스템 구축",
      ],
    },
  ],
};

interface Question {
  question_id: number;
  question_excerpt: string;
  question_text: string;
  question_intent: string;
  key_terms: string[];
}

interface InterviewOngoingPageProps {
  questions: Question[];
}

const InterviewOngoingPage = ({
  questions = QUESTIONS.questions,
}: InterviewOngoingPageProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answerText, setAnswerText] = useState("");

  const handleNextQuestion = () => {
    // 현재 질문의 답변을 저장
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].question_id]: answerText,
    }));

    // 마지막 질문이면 백엔드로 답변 전송
    if (currentQuestionIndex === questions.length - 1) {
      // 예시: 백엔드로 답변 전송
      console.log("Submit answers to backend:", answers);
      // 추가: 백엔드로 POST 요청하는 로직
    } else {
      // 다음 질문으로 이동
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText(""); // 답변 입력 초기화
    }
  };

  return (
    <div className="h-[65vh] flex flex-col items-center">
      <div className="flex gap-4 items-center mb-12">
        <h1 className="text-3xl">OOO님의 실전/기술 면접</h1>
        <div className="text-xl border rounded-md px-4 py-3">OO 직무</div>
      </div>

      <div className="flex flex-col w-[900px] gap-6">
        <div className="flex w-full bg-primary text-white rounded-md items-center justify-center py-3 text-lg">
          Q. {questions[currentQuestionIndex].question_text}
        </div>
        <textarea
          className="w-full h-72 border-2 rounded-md p-3"
          placeholder="답변을 작성해주세요."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
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
          <span className="text-xl">1:35</span>
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
