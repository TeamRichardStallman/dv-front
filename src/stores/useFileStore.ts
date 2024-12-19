import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InterviewMode = "GENERAL" | "REAL" | undefined;
export type InterviewType = "TECHNICAL" | "PERSONAL" | undefined;
export type InterviewMethod = "CHAT" | "VOICE" | "VIDEO" | undefined;

export interface InterviewFile {
  isNew: boolean | undefined; // 새로 업로드할 파일 || 이전에 업로드된 파일
  filePath: string | undefined; // isNew ? undefined : exist -> 이거 있으면 면접 시작 눌렀을 때 저 파일 다운로드받아서 다시 업로드 해야 함.
  file: File | undefined; // isNew ? exist : undefined
}

interface FileStore {
  interviewFile: InterviewFile;
  setInterviewFile: (newData: InterviewFile) => void;
  updateInterviewFileField: (field: keyof InterviewFile, value: File) => void;
}

const useFileStore = create<FileStore>()(
  persist(
    (set) => ({
      interviewFile: {
        isNew: undefined,
        filePath: undefined,
        file: undefined,
      },
      setInterviewFile: (newData) =>
        new Promise<void>((resolve) => {
          set({ interviewFile: newData });
          resolve();
        }),
      updateInterviewFileField: (field, value) =>
        set((state) => ({
          interviewFile: {
            ...state.interviewFile,
            [field]: value,
          },
        })),
    }),
    {
      name: "file-setup-storage",
    }
  )
);

export default useFileStore;
