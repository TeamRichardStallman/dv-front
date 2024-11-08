type StepType = "type" | "method" | "job" | "cover-letter" | "check-info";

type StepLabels = {
  type: "면접 유형";
  method: "면접 방식";
  job: "직무 선택";
  "cover-letter": "자기소개서 입력";
  "check-info": "입력 정보 확인";
};

type StepLabel<T extends StepType> = StepLabels[T];

interface StepProps {
  onPrev: () => void;
  onNext: (data?: any) => void;
}

interface ButtonsProps {
  prevButtonText: string;
  nextButtonText: string;
}
