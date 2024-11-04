"use client";
import { useState } from "react";
import NavButtons from "./nav-button";
import FileUploadButton from "@/components/file-upload-btn";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  const [coverLetter, setCoverLetter] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoverLetter(e.target.value);
  };

  return (
    <>
      <div className="flex justify-center w-screen">
        <textarea
          value={coverLetter}
          onChange={handleTextChange}
          placeholder="자기소개서를 입력하세요."
          className="w-[900px] h-[350px] p-3 border rounded-md resize-none"
        />
      </div>
      <FileUploadButton />
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
