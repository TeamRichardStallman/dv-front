export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatFileName = (originalName: string) => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD 형식
  const time = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS 형식
  const randomString = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자열
  return `${date}-${time}-${randomString}-${originalName}`;
};
