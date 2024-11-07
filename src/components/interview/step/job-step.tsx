import React, { useEffect, useState } from "react";
import NavButtons from "./nav-button";
import PositionBtn from "@/components/positionbtn";
import useInterviewStore from "@/app/stores/useInterviewStore";

const JobStep = ({ onPrev, onNext }: StepProps) => {
  const { interview, updateInterviewField } = useInterviewStore();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(
    interview.jobId ?? null
  );

  const jobs = [
    { id: 1, label: "프론트엔드", imageSrc: "/frontend.png" },
    { id: 2, label: "백엔드", imageSrc: "/backend.png" },
    { id: 3, label: "클라우드", imageSrc: "/cloud.png" },
    { id: 4, label: "인공지능", imageSrc: "/ai.png" },
  ];

  useEffect(() => {
    if (selectedJobId) {
      updateInterviewField("jobId", selectedJobId);
    }
  }, [selectedJobId, updateInterviewField]);

  return (
    <>
      <div className="flex gap-4 justify-center">
        {jobs.map((job) => (
          <PositionBtn
            key={job.label}
            label={job.label}
            imageSrc={job.imageSrc}
            selected={selectedJobId === job.id}
            onClick={() => setSelectedJobId(job.id)}
          />
        ))}
      </div>
      <NavButtons
        onPrev={onPrev}
        onNext={onNext}
        prevButtonText="이전"
        nextButtonText="다음"
        disabled={!selectedJobId}
        disabledToolTipText="직무를 선택해주세요."
      />
    </>
  );
};

export default JobStep;
