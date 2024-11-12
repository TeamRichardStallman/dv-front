import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InterviewFile {
  type: "COVER_LETTER";
  filePath: string;
}

export interface QuestionRequestType {
  interviewId: number | undefined;
  interviewTitle: string | undefined;
  interviewStatus: string | undefined;
  interviewType: string | undefined;
  interviewMethod: string | undefined;
  interviewMode: string | undefined;
  files: InterviewFile[];
  jobId: number | undefined;
}

interface InterviewStore {
  questionRequest: QuestionRequestType;
  setQuestionRequest: (data: QuestionRequestType) => void;
  updateQuestionRequestField: (
    field: keyof QuestionRequestType,
    value: string | number | { type: string; filePath: string }[]
  ) => void;
}

const useQuestionRequest = create<InterviewStore>()(
  persist(
    (set) => ({
      questionRequest: {
        interviewId: undefined,
        interviewTitle: undefined,
        interviewStatus: undefined,
        interviewType: undefined,
        interviewMethod: undefined,
        interviewMode: undefined,
        jobId: undefined,
        files: [],
      },
      setQuestionRequest: (newData) => set({ questionRequest: newData }),
      updateQuestionRequestField: (field, value) =>
        set((state) => ({
          questionRequest: {
            ...state.questionRequest,
            [field]: value,
          },
        })),
    }),
    {
      name: "question-request-storage",
    }
  )
);

export default useQuestionRequest;
