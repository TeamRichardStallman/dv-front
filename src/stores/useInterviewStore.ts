import { create } from "zustand";
import { persist } from "zustand/middleware";

interface File {
  type: string;
  filePath: string;
}

interface Interview {
  interviewMode: "GENERAL" | "REAL" | undefined;
  interviewType: "TECHNICAL" | "PERSONAL" | undefined;
  interviewMethod: "CHAT" | "VOICE" | "VIDEO" | undefined;
  jobId: number | undefined;
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
      name: "interview-setup-storage",
    }
  )
);

export default useInterviewStore;
