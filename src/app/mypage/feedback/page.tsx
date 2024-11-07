"use client";
import React, { useState } from "react";
import { mockInterviewData } from "@/data/mockInterviewData";

const InterviewFeedbackPage = () => {
  const [selectedInterview, setSelectedInterview] = useState<string>("");

  const handleInterviewChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInterview(event.target.value);
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
          <h3 className="text-lg font-semibold mt-2">
            이다은님의 면접 평가 점수는 {totalScore.toFixed(0)}점입니다.
          </h3>
          <div className="mt-2">
            <div className="relative h-6 bg-gray-200 rounded">
              <div
                className="absolute h-full bg-primary rounded"
                style={{ width: `${totalScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">평가 기준</h3>
            <ul>
              {evaluationCriteria.map((criteria) => (
                <li key={criteria.evaluationCriteriaId} className="mb-2">
                  <p>{criteria.evaluationCriteria}</p>
                  <p>점수: {criteria.score}</p>
                  <p>피드백: {criteria.feedbackText}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewFeedbackPage;
