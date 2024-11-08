"use client";
import FileUploadButton from "@/components/file-upload-btn";
import { FILES } from "@/data/profileData";
import MultiFileUploadPanel from "@/components/multi-file-upload-panel";

const CoverLetterStep = ({ onNext }: StepProps) => {
  const handleSubmit = () => {
    onNext();
  };

  return (
    <>
      <MultiFileUploadPanel
        files={FILES}
        submitButtonText="다음"
        submitButtonColor="bg-[#fabe41]"
        onSubmitButtonClick={handleSubmit}
      />
      <FileUploadButton />
    </>
  );
};

export default CoverLetterStep;
