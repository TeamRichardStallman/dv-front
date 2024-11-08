import { useState } from "react";
import NavButtons from "./nav-button";
import SettingBtn from "@/components/settingbtn";

const MethodStep = ({ onPrev, onNext }: StepProps) => {
  const [selectedMethod, setSelectedMethod] = useState("채팅");

  return (
    <>
      <div className="flex gap-8 justify-center mb-8 max-w-4xl mx-auto">
        <SettingBtn
          label="채팅"
          description="텍스트 기반의 채팅 면접을 진행합니다."
          selected={selectedMethod === "채팅"}
          onClick={() => setSelectedMethod("채팅")}
        />
        <SettingBtn
          label="음성"
          description="COMING SOON!"
          selected={selectedMethod === "음성"}
          onClick={() => setSelectedMethod("음성")}
          disabled={true}
        />
        <SettingBtn
          label="영상"
          description="COMING SOON!"
          selected={selectedMethod === "영상"}
          onClick={() => setSelectedMethod("영상")}
          disabled={true}
        />
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={() => {
          if(selectedMethod) {
            onNext({interviewMethod: selectedMethod==="채팅"?"CHAT":selectedMethod==="음성"?"VOICE":"VIDEO"})
          }
        }}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </>
  );
};

export default MethodStep;
