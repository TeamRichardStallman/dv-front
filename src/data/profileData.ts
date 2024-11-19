export interface MultiFileUploadPanelDataType {
  name: string;
  type: "coverLetter" | "resume";
}

export const FILES: MultiFileUploadPanelDataType[] = [
  { type: "coverLetter", name: "자기소개서" },
  { type: "resume", name: "이력서" },
];
