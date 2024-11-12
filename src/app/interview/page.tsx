"use client";
import { useState } from "react";
import Link from "next/link";
import SettingBtn from "@/components/settingbtn";
import useInterviewStore, { InterviewMode } from "@/stores/useInterviewStore";

const InterviewPage = () => {
  const [mode, setMode] = useState<InterviewMode>();
  const { updateInterviewField } = useInterviewStore();

  const handleClick = () => {
    if (mode) {
      updateInterviewField("interviewMode", mode);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center text-[50px] font-bold mb-16">
        면접 모드 선택
      </div>

      <div className="flex gap-16">
        <SettingBtn
          label="모의면접"
          description="선택한 관심 직무를 기반으로 가상면접을 진행합니다."
          selected={mode === "GENERAL"}
          onClick={() => setMode("GENERAL")}
        />
        <SettingBtn
          label="실전면접"
          description="선택한 직무와 자소서, 이력서 등을 기반으로 개인 맞춤화 가상면접을 진행합니다."
          selected={mode === "REAL"}
          onClick={() => setMode("REAL")}
        />
      </div>

      <div className="flex gap-4 mt-8 font-semibold relative">
        <Link href="/">
          <button className="bg-secondary w-24 text-white py-2 px-6 rounded-md">
            홈으로
          </button>
        </Link>
        <div className="relative group">
          <Link href={mode ? `/interview/setup?type=${mode}` : "#"}>
            <button
              className={`w-24 py-2 px-6 rounded-md text-white ${
                mode ? "bg-secondary" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!mode}
              onClick={handleClick}
            >
              다음
            </button>
          </Link>
          {!mode && (
            <div
              className="absolute invisible group-hover:visible -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-md shadow-md z-10"
              style={{ whiteSpace: "nowrap" }}
            >
              버튼을 클릭해주세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
