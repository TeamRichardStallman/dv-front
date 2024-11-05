import { create } from "zustand";
import { persist } from "zustand/middleware";

interface File {
  type: string;
  filePath: string;
}

interface Interview {
  interviewMode: "GENERAL" | "REAL" | null;
  interviewType: "TECHNICAL" | "PERSONAL" | null;
  interviewMethod: "CHAT" | "VOICE" | "VIDEO" | null;
  jobId: number | null;
  files: File[];
}

interface InterviewStore {
  interview: Interview;
  setInterview: (newData: Interview) => void;
  updateInterviewField: (
    field: keyof Interview,
    value: string | number | File[]
  ) => void;
  addFile: (file: File) => void;
}

const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      interview: {
        interviewType: null,
        interviewMethod: null,
        interviewMode: null,
        jobId: null,
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
      addFile: (file) => {
        if (
          typeof file.type === "string" &&
          typeof file.filePath === "string"
        ) {
          set((state) => ({
            interview: {
              ...state.interview,
              files: [...state.interview.files, file],
            },
          }));
        } else {
          console.error(
            "Invalid file format: 'type' and 'filePath' must be strings."
          );
        }
      },
    }),
    {
      name: "interview-storage", // localStorage에 저장될 키 이름
    }
  )
);

export default useInterviewStore;
