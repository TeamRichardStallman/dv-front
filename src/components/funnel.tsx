"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FunnelProps {
  initialStep: number;
}

const Funnel = ({ initialStep }: FunnelProps) => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setCurrentStep(parseInt(step, 10) || initialStep);
    }
  }, [searchParams, initialStep]);

  // const handleNextStep = () => {
  //   const nextStep = currentStep + 1;
  //   router.push(`/interview?step=${nextStep}`);
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      default:
        return <StepOne />;
    }
  };

  return (
    <div>
      <h1>Funnel Step {currentStep}</h1>
      {renderStep()}
      {/* <button onClick={handleNextStep}>다음 단계</button> */}
    </div>
  );
};

const StepOne = () => <div>Step 1: 면접 유형</div>;
const StepTwo = () => <div>Step 2: 면접 방식</div>;
const StepThree = () => <div>Step 3: 직무 선택</div>;
const StepFour = () => <div>Step 4: 자기소개서 입력</div>;
const StepFive = () => <div>Step 5: 입력 정보 확인</div>;

export default Funnel;
