"use client";
import { FILES } from "@/data/profileData";
import MultiFileUploadPanel from "@/components/multi-file-upload-panel";
import useInterviewStore from "@/stores/useInterviewStore";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  const { updateInterviewField } = useInterviewStore();

  const handleSubmit = (files: string[]) => {
    onNext();
    updateInterviewField("files", files);
  };

  const handleBackClick = () => {
    if (onPrev) {
      onPrev();
    }
  };

  return (
    <>
      <MultiFileUploadPanel
        files={FILES}
        submitButtonText="다음"
        submitButtonColor="bg-[#fabe41]"
        showBackButton
        onSubmitButtonClick={handleSubmit}
        onBackButtonClick={handleBackClick}
      />
    </>
  );
};

export default CoverLetterStep;
