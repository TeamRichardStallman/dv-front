import React, { useState } from "react";
import NavButtons from "./nav-button";
import PositionBtn from "@/components/positionbtn";

const JobStep = ({ onPrev, onNext }: StepProps) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const jobs = [
    { label: "프론트엔드", imageSrc: "/images/frontend.png" },
    { label: "백엔드", imageSrc: "/images/backend.png" },
    { label: "클라우드", imageSrc: "/images/cloud.png" },
    { label: "인공지능", imageSrc: "/images/ai.png" },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4 justify-center">
        {jobs.map((job) => (
          <PositionBtn
            key={job.label}
            label={job.label}
            imageSrc={job.imageSrc}
            selected={selectedJob === job.label}
            onClick={() => setSelectedJob(job.label)}
          />
        ))}
      </div>
      <NavButtons
        onPrev={onPrev}
        onNext={onNext}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </div>
  );
};

export default JobStep;
