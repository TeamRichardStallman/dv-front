"use client";
import { useRef, useState } from "react";
import { FILES } from "@/data/profileData";
import useInterviewStore from "@/stores/useInterviewStore";
import NavButtons from "./nav-button";
import FileUploadPanel from "@/components/fileupload/file-upload-panel";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  const { interview, updateInterviewField } = useInterviewStore();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const daum = useRef(() => {});

  const handleSubmit = (files: string[]) => {
    updateInterviewField("files", files);
    setIsFileSelected(files.length > 0);
  };

  daum.current = () => {};

  const onNextNeo = () => {
    daum.current();
    onNext();
  };

  return (
    <>
      <FileUploadPanel
        interviewId={
          interview.interviewId === undefined ? 0 : interview.interviewId
        }
        files={FILES}
        onSubmitButtonClick={handleSubmit}
        setIsFileSelected={setIsFileSelected}
        onNextButtonClick={daum}
      />

      <NavButtons
        onPrev={onPrev}
        onNext={onNextNeo}
        prevButtonText="이전"
        nextButtonText="다음"
        disabled={!isFileSelected}
        tooltipMessage="자료를 입력해주세요"
      />
    </>
  );
};

export default CoverLetterStep;
