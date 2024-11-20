"use client";
import { useState } from "react";
import { FILES } from "@/data/profileData";
import MultiFileUploadPanel from "@/components/multi-file-upload-panel";
import useInterviewStore from "@/stores/useInterviewStore";
import NavButtons from "./nav-button";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  const { updateInterviewField } = useInterviewStore();
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleSubmit = (files: string[]) => {
    updateInterviewField("files", files);
    setIsFileSelected(files.length > 0);
  };

  return (
    <>
      <MultiFileUploadPanel files={FILES} onSubmitButtonClick={handleSubmit} />

      <NavButtons
        onPrev={onPrev}
        onNext={onNext}
        prevButtonText="이전"
        nextButtonText="다음"
        disabled={!isFileSelected}
        tooltipMessage="자료를 입력해주세요"
      />
    </>
  );
};

export default CoverLetterStep;
