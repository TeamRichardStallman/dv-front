"use client";
import Funnel from "@/components/funnel";
import StepProgressBar from "@/components/step-progressbar";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const InterviewSelectPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const step = searchParams.get("step");
    if (!step) {
      router.replace(`/interview/select?step=1`);
    } else {
      setCurrentStep(parseInt(step, 10));
    }
  }, [searchParams, router]);

  const handleCurrentStep = (num: number) => {
    const newStep = currentStep + num;
    if (newStep > 5) {
      router.push("/interview/ongoing");
    } else if (newStep < 1) {
      router.push("/");
    } else {
      setCurrentStep(newStep);
      router.push(`/interview/select?step=${newStep}`);
    }
  };

  return (
    <>
      <div>
        <StepProgressBar
          steps={[
            "면접 유형",
            "면접 방식",
            "직무 선택",
            "자기소개서 입력",
            "입력 정보 확인",
          ]}
          currentStep={currentStep}
        />
        <Funnel initialStep={currentStep} />
      </div>
      <button
        onClick={() => handleCurrentStep(-1)}
        className="absolute bottom-14 left-1/2 transform -translate-x-20 px-6 py-3 bg-primary text-white rounded text-xl"
      >
        이전
      </button>
      <button
        onClick={() => handleCurrentStep(1)}
        className="absolute bottom-14 left-1/2 transform -translate-x-[-1rem] px-6 py-3 bg-primary text-white rounded text-xl"
      >
        다음
      </button>
    </>
  );
};

export default InterviewSelectPage;
