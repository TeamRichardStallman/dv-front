import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InterviewMode = "GENERAL" | "REAL" | undefined;
export type InterviewType = "TECHNICAL" | "PERSONAL" | undefined;
export type InterviewMethod = "CHAT" | "VOICE" | "VIDEO" | undefined;

export interface Interview {
  interviewMode: "GENERAL" | "REAL" | undefined;
  interviewType: "TECHNICAL" | "PERSONAL" | undefined;
  interviewMethod: "CHAT" | "VOICE" | "VIDEO" | undefined;
  jobId: number | undefined;
  files: string[];
}

interface InterviewStore {
  interview: Interview;
  setInterview: (newData: Interview) => void;
  updateInterviewField: (
    field: keyof Interview,
    value: string | number | string[]
  ) => void;
}

const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      interview: {
        interviewType: undefined,
        interviewMethod: undefined,
        interviewMode: undefined,
        jobId: undefined,
        files: [],
      },
      setInterview: (newData) => set({ interview: newData }),
      updateInterviewField: (field, value) =>
        set((state) => ({
          interview: {
            ...state.interview,
            [field]: value,
          },
        })),
    }),
    {
      name: "interview-setup-storage",
    }
  )
);

export default useInterviewStore;
