"use client";
import { FILES } from "@/data/profileData";
import MultiFileUploadPanel from "@/components/multi-file-upload-panel";
import useInterviewStore from "@/stores/useInterviewStore";
import NavButtons from "./nav-button";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  const { updateInterviewField } = useInterviewStore();

  const handleSubmit = (files: string[]) => {
    updateInterviewField("files", files);
  };

  return (
    <>
      <MultiFileUploadPanel files={FILES} onSubmitButtonClick={handleSubmit} />

      <NavButtons
        onPrev={onPrev}
        onNext={onNext}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </>
  );
};

export default CoverLetterStep;
