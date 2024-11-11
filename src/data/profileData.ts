export interface MultiFileUploadPanelDataType {
  name: string;
  type: "coverLetter" | "resume" | "portfolio";
}

export const FILES: MultiFileUploadPanelDataType[] = [
  { type: "coverLetter", name: "자기소개서" },
  { type: "resume", name: "이력서" },
  { type: "portfolio", name: "포트폴리오" },
];
