interface StepProgressBarProps {
  steps: string[];
  currentStep: number;
}

export default function StepProgressBar({
  steps,
  currentStep,
}: StepProgressBarProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Step indicator */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index < currentStep ? "bg-primary text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>
          {/* Progress line */}
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-16 ${
                index < currentStep - 1 ? "bg-primary" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
