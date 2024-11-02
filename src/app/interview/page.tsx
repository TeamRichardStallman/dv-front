"use client";
import { useState } from "react";
import Link from "next/link";
import SettingBtn from "@/components/settingbtn";

const InterviewPage = () => {
  const [mode, setMode] = useState("mock");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <SettingBtn
          label="모의면접"
          description="선택한 관심 직무를 기반으로 가상면접을 진행합니다."
          selected={mode === "mock"}
          onClick={() => setMode("mock")}
        />
        <SettingBtn
          label="실전면접"
          description="선택한 직무와 자소서, 이력서 등을 기반으로 개인 맞춤화 가상면접을 진행합니다."
          selected={mode === "real"}
          onClick={() => setMode("real")}
        />
      </div>
      <div className="flex gap-4 mt-8 font-semibold">
        <Link href="/">
          <button className="bg-secondary text-white py-2 px-6 rounded-md">
            홈으로
          </button>
        </Link>
        <Link href={`/interview/setup?type=${mode}`}>
          <button className="bg-secondary text-white py-2 px-6 rounded-md">
            다음
          </button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewPage;
