"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SetupFunnel from "@/components/interview/setup-funnel";
import SetupProgressBar from "@/components/interview/setup-progress-bar";

type StepType = "type" | "method" | "job" | "cover-letter" | "check-info";

const getStepLabel = (step: StepType) => {
  const labels: Record<StepType, string> = {
    type: "면접 유형 선택",
    method: "면접 방식 선택",
    job: "직무 선택",
    "cover-letter": "자기소개서 입력",
    "check-info": "입력 정보 확인",
  };
  return labels[step];
};

const InterviewSetupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewMode =
    (searchParams.get("type") as "GENERAL" | "REAL") || "REAL";
  const [currentStep, setCurrentStep] = useState<StepType>("type");

  const steps: StepType[] =
    interviewMode === "GENERAL"
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
      <div className="text-center text-[50px] font-bold mb-16">
        {getStepLabel(currentStep)}
      </div>
      <div className="pb-10 px-8 mb-8">
        <SetupProgressBar steps={steps} currentStep={currentStep} />
      </div>
      <div className="flex flex-col items-center gap-8">
        <SetupFunnel
          step={currentStep}
          setStep={updateStep}
          interviewMode={interviewMode}
        />
      </div>
    </>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewSetupPage />
    </Suspense>
  );
}
