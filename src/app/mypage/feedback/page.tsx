"use client";
import React, { useState } from "react";

const InterviewFeedbackPage = () => {
  const [selectedInterview, setSelectedInterview] = useState<string>("");

  const handleInterviewChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInterview(event.target.value);
  };

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
        <div>
          <h2 className="text-xl">선택한 면접: {selectedInterview}</h2>
        </div>
      )}
    </div>
  );
};

export default InterviewFeedbackPage;
