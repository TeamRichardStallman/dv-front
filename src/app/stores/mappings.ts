const interviewMappings = {
  interviewMode: {
    REAL: "실전면접",
    GENERAL: "모의면접",
  },
  interviewType: {
    TECHNICAL: "기술면접",
    PERSONAL: "인성면접",
  },
  interviewMethod: {
    CHAT: "채팅",
    VOICE: "음성",
    VIDEO: "영상",
  },
  jobId: {
    1: "프론트엔드 직무",
    2: "백엔드 직무",
    3: "인프라 직무",
    4: "AI 직무",
  },
  fileType: {
    COVER_LETTER: "자기소개서",
    RESUME: "이력서",
    PORTFOLIO: "포트폴리오",
  },
};

function isKeyOf<T extends object>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return key in obj;
}

export function getMappedValue(
  category: keyof typeof interviewMappings,
  key: string | number
): string {
  const categoryMappings = interviewMappings[category];
  if (isKeyOf(categoryMappings, key)) {
    return categoryMappings[key];
  }
  return "Unknown";
}
