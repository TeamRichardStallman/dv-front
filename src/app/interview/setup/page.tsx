"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SetupFunnel from "@/components/interview/setup-funnel";
import SetupProgressBar from "@/components/interview/setup-progress-bar";

type StepType = "type" | "method" | "job" | "cover-letter" | "check-info";

const InterviewSetupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewMode = (searchParams.get("type") as "mock" | "real") || "real";
  const [currentStep, setCurrentStep] = useState<StepType>("type");

  const steps: StepType[] =
    interviewMode === "mock"
      ? ["type", "method", "job", "check-info"]
      : ["type", "method", "job", "cover-letter", "check-info"];

  useEffect(() => {
    const step = searchParams.get("step") as StepType;
    if (!step) {
      router.replace(`/interview/setup?type=${interviewMode}&step=type`);
    } else {
      setCurrentStep(step);
    }
  }, [searchParams, router, interviewMode]);

  const updateStep = (newStep: StepType) => {
    setCurrentStep(newStep);
    router.push(`/interview/setup?type=${interviewMode}&step=${newStep}`);
  };

  return (
    <>
      <div className="pb-10 px-8">
        <SetupProgressBar steps={steps} currentStep={currentStep} />
      </div>
      <div className="relative w-[200px] h-[200px]">
        <SetupFunnel
          step={currentStep}
          setStep={updateStep}
          interviewMode={interviewMode}
        />
      </div>
    </>
  );
};

export default InterviewSetupPage;
