import { useState } from "react";
import NavButtons from "./nav-button";
import useInterviewStore from "@/app/stores/useInterviewStore";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  const { addFile } = useInterviewStore();
  const [coverLetter, setCoverLetter] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoverLetter(e.target.value);
  };

  const handleNext = () => {
    addFile({
      type: "COVER_LETTER",
      filePath: "filePath",
    });
    onNext();
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
      <NavButtons
        onPrev={onPrev}
        onNext={handleNext}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </>
  );
};

export default CoverLetterStep;
