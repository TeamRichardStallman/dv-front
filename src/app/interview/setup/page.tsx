"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SetupFunnel from "@/components/interview/setup-funnel";
import SetupProgressBar from "@/components/interview/setup-progress-bar";

const InterviewSetupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<StepType>("type");

  useEffect(() => {
    const step = searchParams.get("step") as StepType;
    if (!step) {
      router.replace(`/interview/setup?step=type`);
    } else {
      setCurrentStep(step);
    }
  }, [searchParams, router]);

  const updateStep = (newStep: StepType) => {
    setCurrentStep(newStep);
    router.push(`/interview/setup?step=${newStep}`);
  };

  return (
    <>
      <div className="pb-10 px-8">
        <SetupProgressBar
          steps={["type", "method", "job", "cover-letter", "check-info"]}
          currentStep={currentStep}
        />
      </div>
      <div className="relative w-[200px] h-[200px]">
        <SetupFunnel step={currentStep} setStep={updateStep} />
      </div>
    </>
  );
};

export default InterviewSetupPage;
