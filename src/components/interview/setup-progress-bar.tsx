import { FaCheck } from "react-icons/fa"; // 체크 아이콘을 위한 import

interface SetupProgressBarProps {
  steps: StepType[];
  currentStep: StepType;
}

export default function SetupProgressBar({
  steps,
  currentStep,
}: SetupProgressBarProps) {
  const currentStepIndex = steps.indexOf(currentStep);

  const getStepLabel = (step: StepType) => {
    const labels = {
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
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  index < currentStepIndex
                    ? "bg-secondary text-white"
                    : index === currentStepIndex
                    ? "bg-white border-4 border-secondary"
                    : "border-4 border-gray-300 text-gray-500"
                }`}
              >
                {index < currentStepIndex ? (
                  <FaCheck size={12} />
                ) : index === currentStepIndex ? (
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                ) : null}{" "}
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-28 text-center text-sm font-bold">
                {getStepLabel(step)}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="relative w-48 h-1">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-300"></div>
                <div
                  className={`absolute top-0 left-0 h-full bg-secondary transition-all duration-500 ease-out`}
                  style={{
                    width: index < currentStepIndex ? "100%" : "0%",
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
