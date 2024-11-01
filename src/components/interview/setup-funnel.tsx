"use client";
import { useRouter } from "next/navigation";
import TypeStep from "./step/\btype-step";
import MethodStep from "./step/method-step";
import JobStep from "./step/job-step";
import CoverLetterStep from "./step/cover-letter-step";
import CheckInfoStep from "./step/check-info-step";
import { Funnel } from "../funnel";

type StepType = "type" | "method" | "job" | "cover-letter" | "check-info";

interface SetupFunnelProps {
  step: StepType;
  setStep: (step: StepType) => void;
  interviewMode: "mock" | "real";
}

const SetupFunnel = ({ step, setStep, interviewMode }: SetupFunnelProps) => {
  const router = useRouter();

  const steps =
    interviewMode === "mock"
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
          onNext={() => {
            setStep("method");
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="method">
        <MethodStep
          onPrev={() => {
            setStep("type");
          }}
          onNext={() => {
            setStep("job");
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="job">
        <JobStep
          onPrev={() => {
            setStep("method");
          }}
          onNext={() => {
            setStep(interviewMode === "mock" ? "check-info" : "cover-letter");
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="cover-letter">
        <CoverLetterStep
          onPrev={() => {
            setStep("job");
          }}
          onNext={() => {
            setStep("check-info");
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="check-info">
        <CheckInfoStep
          onPrev={() => {
            setStep(interviewMode === "mock" ? "job" : "cover-letter");
          }}
          onNext={() => {
            setStep("check-info");
            router.push("/interview/ongoing");
          }}
        />
      </Funnel.Step>
    </Funnel>
  );
};

export default SetupFunnel;
