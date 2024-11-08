"use client";
import { useRouter } from "next/navigation";
import TypeStep from "./step/type-step";
import MethodStep from "./step/method-step";
import JobStep from "./step/job-step";
import CoverLetterStep from "./step/cover-letter-step";
import CheckInfoStep from "./step/check-info-step";
import { Funnel } from "../funnel";
import { useState } from "react";

type StepType = "type" | "method" | "job" | "cover-letter" | "check-info";

interface SetupFunnelProps {
  step: StepType;
  setStep: (step: StepType, data?: any) => void;
  interviewMode: "GENERAL" | "REAL";
  onFinalSubmit: () => void;
}

const SetupFunnel = ({ step, setStep, interviewMode, onFinalSubmit }: SetupFunnelProps) => {
  const router = useRouter();

  const steps =
    interviewMode === "GENERAL"
      ? (["type", "method", "job", "check-info"] as const)
      : (["type", "method", "job", "cover-letter", "check-info"] as const);

    const [interviewData, setInterviewData] = useState({
      interviewTitle: "",
    interviewType: "",
    interviewMethod: "",
    interviewMode: interviewMode,
    jobId: 0,
    files: [] as FileProps[],
    });
      interface FileProps {
        type: string;
        filePath: string;
      }

      const handleNextStep = (nextStep: StepType, data?: any) => {
        setInterviewData((prev) => ({ ...prev, ...data }));
        setStep(nextStep);
      };

  return (
    <Funnel steps={steps} step={step}>
      <Funnel.Step name="type">
        <TypeStep
          onPrev={() => {
            setStep("type");
            router.push("/interview");
          }}
          onNext={(data) => {
            alert(JSON.stringify(data));
            handleNextStep("method", {interviewType: data.interviewType})
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="method">
        <MethodStep
          onPrev={() => {
            setStep("type");
          }}
          onNext={(data) => {
            handleNextStep("job", {interviewMethod: data.interviewMethod})
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="job">
        <JobStep
          onPrev={() => {
            setStep("method");
          }}
          onNext={(data) => {
            handleNextStep(interviewMode === "GENERAL" ? "check-info" : "cover-letter", { jobId: data.jobId })
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="cover-letter">
        <CoverLetterStep
          onPrev={() => {
            setStep("job");
          }}
          onNext={(data) => {
            handleNextStep("check-info", { files: data.files })
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="check-info">
        <CheckInfoStep
          onPrev={() => {
            setStep(interviewMode === "GENERAL" ? "job" : "cover-letter");
          }}
          onNext={(data) => {
            setStep("check-info", data);
            onFinalSubmit();
          }}
          interviewData={interviewData}
        />
      </Funnel.Step>
    </Funnel>
  );
};

export default SetupFunnel;
