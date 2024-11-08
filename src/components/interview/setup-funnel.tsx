"use client";
import { useRouter } from "next/navigation";
import TypeStep from "./step/type-step";
import MethodStep from "./step/method-step";
import JobStep from "./step/job-step";
import CoverLetterStep from "./step/cover-letter-step";
import CheckInfoStep from "./step/check-info-step";
import { Funnel } from "../funnel";

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

  return (
    <Funnel steps={steps} step={step}>
      <Funnel.Step name="type">
        <TypeStep
          onPrev={() => {
            setStep("type");
            router.push("/interview");
          }}
          onNext={(data) => {
            setStep("method", data);
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="method">
        <MethodStep
          onPrev={() => {
            setStep("type");
          }}
          onNext={(data) => {
            setStep("job", data);
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="job">
        <JobStep
          onPrev={() => {
            setStep("method");
          }}
          onNext={(data) => {
            setStep(interviewMode === "GENERAL" ? "check-info" : "cover-letter", data);
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="cover-letter">
        <CoverLetterStep
          onPrev={() => {
            setStep("job");
          }}
          onNext={(data) => {
            setStep("check-info", data);
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="check-info">
        <CheckInfoStep
          onPrev={() => {
            setStep(interviewMode === "GENERAL" ? "job" : "cover-letter");
          }}
          onNext={() => {
            setStep("check-info");
            onFinalSubmit();
          }}
        />
      </Funnel.Step>
    </Funnel>
  );
};

export default SetupFunnel;
