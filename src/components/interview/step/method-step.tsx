"use client";
import { useState } from "react";
import NavButtons from "./nav-button";
import SettingBtn from "@/components/settingbtn";
import useInterviewStore from "@/stores/useInterviewStore";

const MethodStep = ({ onPrev, onNext }: StepProps) => {
  const [selectedMethod, setSelectedMethod] = useState("CHAT");
  const { updateInterviewField } = useInterviewStore();

  const handleClick = () => {
    if (selectedMethod) {
      updateInterviewField("interviewMethod", selectedMethod);
    }
  };

  return (
    <>
      <div className="flex gap-8 justify-center mb-8 max-w-4xl mx-auto">
        <SettingBtn
          label="채팅"
          description="텍스트 기반의 채팅 면접을 진행합니다."
          selected={selectedMethod === "CHAT"}
          onClick={() => setSelectedMethod("CHAT")}
        />
        <SettingBtn
          label="음성"
          description="COMING SOON!"
          selected={selectedMethod === "VOICE"}
          onClick={() => setSelectedMethod("VOICE")}
          disabled={true}
        />
        <SettingBtn
          label="영상"
          description="COMING SOON!"
          selected={selectedMethod === "VIDEO"}
          onClick={() => setSelectedMethod("VIDEO")}
          disabled={true}
        />
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={() => {
          if (selectedMethod) {
            onNext();
            handleClick();
          }
        }}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </>
  );
};

export default MethodStep;
