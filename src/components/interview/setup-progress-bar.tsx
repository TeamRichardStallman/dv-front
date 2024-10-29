interface SetupProgressBarProps {
  steps: StepType[];
  currentStep: StepType;
}

export default function SetupProgressBar({
  steps,
  currentStep,
}: SetupProgressBarProps) {
  const currentStepIndex = steps.indexOf(currentStep);

  const getStepLabel = (step: StepType): StepLabel<typeof step> => {
    const labels: StepLabels = {
      type: "면접 유형",
      method: "면접 방식",
      job: "직무 선택",
      "cover-letter": "자기소개서 입력",
      "check-info": "입력 정보 확인",
    };
    return labels[step];
  };

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="flex items-center">
            <div className="relative">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  index <= currentStepIndex
                    ? "bg-secondary text-white"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-28 text-center">
                {getStepLabel(step)}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-1 w-20 ${
                  index < currentStepIndex ? "bg-secondary" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
