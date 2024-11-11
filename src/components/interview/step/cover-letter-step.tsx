"use client";
import { FILES } from "@/data/profileData";
import MultiFileUploadPanel from "@/components/multi-file-upload-panel";
import useInterviewStore from "@/stores/useInterviewStore";

const CoverLetterStep = ({ onNext }: StepProps) => {
  const { updateInterviewField } = useInterviewStore();

  const handleSubmit = (files: string[]) => {
    onNext();
    updateInterviewField("files", files);
  };

  return (
    <>
      <MultiFileUploadPanel
        files={FILES}
        submitButtonText="다음"
        submitButtonColor="bg-[#fabe41]"
        onSubmitButtonClick={handleSubmit}
      />
    </>
  );
};

export default CoverLetterStep;
