"use client";
import React, {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";

export type NonEmptyArray<T> = [T, ...T[]];
export type StepsType = Readonly<NonEmptyArray<string>>;

export interface FunnelProps<Steps extends StepsType> {
  steps: Steps;
  step: Steps[number];
  children:
    | Array<ReactElement<StepProps<Steps>>>
    | ReactElement<StepProps<Steps>>;
}

export const Funnel = <Steps extends StepsType>({
  steps,
  step,
  children,
}: FunnelProps<Steps>) => {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((i) =>
      steps.includes((i.props as Partial<StepProps<Steps>>).name ?? "")
    ) as Array<ReactElement<StepProps<Steps>>>;

  const targetStep = validChildren.find((child) => child.props.name === step);

  return <>{targetStep}</>;
};

export interface StepProps<Steps extends StepsType> {
  name: Steps[number];
  onEnter?: () => void;
  children: ReactNode;
}

export const Step = <Steps extends StepsType>({
  onEnter,
  children,
}: StepProps<Steps>) => {
  useEffect(() => {
    onEnter?.();
  }, [onEnter]);

  return <>{children}</>;
};

Funnel.Step = Step;
