"use client";
import React, { useState } from "react";
import { mockInterviewData } from "@/data/mockInterviewData";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const InterviewFeedbackPage = () => {
  const [selectedInterview, setSelectedInterview] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleInterviewChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInterview(event.target.value);
    setSelectedQuestion(null);
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestion(questionId);
  };

  const getEvaluationCriteria = () => {
    if (selectedInterview) {
      return mockInterviewData.data.evaluationCriteria;
    }
    return [];
  };

  const evaluationCriteria = getEvaluationCriteria();

  const calculateTotalScore = () => {
    const totalScore = evaluationCriteria.reduce(
      (total, criteria) => total + criteria.score,
      0
    );
    const maxScore = evaluationCriteria.length * 10;
    return (totalScore / maxScore) * 100;
  };

  const totalScore = calculateTotalScore();

  const criteriaMap: Record<string, { label: string }> = {
    GROWTH_POTENTIAL: { label: "성장 가능성" },
    JOB_FIT: { label: "문제 해결 능력" },
    WORK_ATTITUDE: { label: "협업 능력" },
    TECHNICAL_DEPTH: { label: "기술 이해도" },
  };

  const selectedAnswerEvaluation =
    mockInterviewData.data.answerEvaluations.find(
      (evaluation) => evaluation.answerEvaluationId === selectedQuestion
    );

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <div className="mb-4">
        <select
          id="interviewSelect"
          className="border rounded-lg p-2 w-[500px]"
          value={selectedInterview}
          onChange={handleInterviewChange}
        >
          <option value="">면접을 선택하세요</option>
          <option value="interview1">
            241101_백엔드_모의_실전_채팅 (2024.11.01.09:20)
          </option>
          <option value="interview2">
            241103_프론트엔드_실전_기술_채팅(2024.11.03.15:15)
          </option>
          <option value="interview3">
            241104_클라우드_실전_인성_채팅(2024.11.04.12:20)
          </option>
        </select>
      </div>

      {selectedInterview && (
        <div className="w-[900px]">
          <h3 className="text-xl font-bold mt-8 mb-2">
            이다은님의 면접 평가 점수는 {totalScore.toFixed(0)}점입니다.
          </h3>
          <div className="mt-4">
            <div className="relative h-6 bg-gray-200 rounded">
              <div
                className="absolute h-full bg-primary rounded"
                style={{ width: `${totalScore}%` }}
              />
            </div>
            <div className="flex font-normal justify-between text-s mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          <div className="mt-4">
            <ul className="border-2 border-gray-300 rounded-xl p-6">
              {evaluationCriteria.map((criteria) => {
                const criteriaLabel =
                  criteriaMap[criteria.evaluationCriteria]?.label || "Unknown";

                let color;
                if (criteria.score >= 7) {
                  color = "#4CAF50";
                } else if (criteria.score >= 4) {
                  color = "#FFC107";
                } else {
                  color = "#F44336";
                }

                return (
                  <li
                    key={criteria.evaluationCriteriaId}
                    className="mt-6 mb-6 flex items-center"
                  >
                    <div className="w-32 h-32 mr-4 font-semibold flex-shrink-0">
                      <CircularProgressbar
                        value={criteria.score}
                        maxValue={10}
                        text={`${criteria.score}/10`}
                        styles={{
                          path: { stroke: color },
                          text: { fill: color },
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-primary mb-2">
                        {criteriaLabel}
                      </h4>
                      <p className="font-semibold">{criteria.feedbackText}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex w-full mt-8">
            <div className="w-1/3 border-r border-gray-300 pr-4">
              <h3 className="text-lg font-bold mb-4">질문 리스트</h3>
              <ul>
                {mockInterviewData.data.answerEvaluations.map(
                  (evaluation, index) => (
                    <li
                      key={evaluation.answerEvaluationId}
                      className={`cursor-pointer p-2 mb-2 font-medium rounded-lg flex items-center ${
                        selectedQuestion === evaluation.answerEvaluationId
                          ? "bg-primary text-white font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        handleQuestionSelect(evaluation.answerEvaluationId)
                      }
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full text-black bg-secondary text-xs mr-2 aspect-square font-black">
                        {index + 1}
                      </span>
                      {evaluation.questionText}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="w-3/4 pl-4">
              {selectedAnswerEvaluation ? (
                <>
                  <div className="border-2 border-gray-300 rounded-lg p-4 mb-4">
                    <h3 className="text-xl font-bold mb-2 text-primary">
                      Q. {selectedAnswerEvaluation.questionText}
                    </h3>
                    <p className="text-md font-semibold">
                      A. {selectedAnswerEvaluation.answerText}
                    </p>
                  </div>

                  <h4 className="text-lg font-semibold mb-2">평가 점수</h4>
                  <ul className="mb-4">
                    {selectedAnswerEvaluation.answerEvaluationScores.map(
                      (score) => (
                        <li
                          key={score.answerEvaluationScoreId}
                          className="mb-2"
                        >
                          <strong>{score.answerEvaluationScoreName}:</strong>{" "}
                          {score.score}점 - <em>{score.rationale}</em>
                        </li>
                      )
                    )}
                  </ul>

                  <h4 className="text-lg font-semibold mb-2">피드백</h4>
                  <p className="mb-2">
                    <strong>잘한점:</strong>{" "}
                    {selectedAnswerEvaluation.answerFeedbackStrength}
                  </p>
                  <p className="mb-2">
                    <strong>개선점:</strong>{" "}
                    {selectedAnswerEvaluation.answerFeedbackImprovement}
                  </p>
                  <p>
                    <strong>제안:</strong>{" "}
                    {selectedAnswerEvaluation.answerFeedbackSuggestion}
                  </p>
                </>
              ) : (
                <p>질문을 선택하세요.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewFeedbackPage;
