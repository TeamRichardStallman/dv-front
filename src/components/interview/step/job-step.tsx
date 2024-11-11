"use client";
import React, { useState } from "react";
import NavButtons from "./nav-button";
import PositionBtn from "@/components/positionbtn";
import useInterviewStore from "@/stores/useInterviewStore";

const JobStep = ({ onPrev, onNext }: StepProps) => {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const { updateInterviewField } = useInterviewStore();

  const handleClick = () => {
    if (selectedJobId) {
      updateInterviewField("jobId", selectedJobId);
    }
  };

  const jobs = [
    { label: "프론트엔드", imageSrc: "/frontend.png", id: 2 },
    { label: "백엔드", imageSrc: "/backend.png", id: 1 },
    { label: "클라우드", imageSrc: "/cloud.png", id: 3 },
    { label: "인공지능", imageSrc: "/ai.png", id: 4 },
  ];

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
        onNext={() => {
          if (selectedJobId) {
            onNext();
            handleClick();
          }
        }}
        prevButtonText="이전"
        nextButtonText="다음"
        disabled={!selectedJobId}
      />
    </>
  );
};

export default JobStep;
