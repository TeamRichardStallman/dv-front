import { v4 as uuidv4 } from "uuid";

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatFileName = (
  userId: string,
  interviewId: string,
  originalName: string
) => {
  const uniqueId = uuidv4().slice(0, 8); // 8자리 UUID

  return `user-${userId}/interview-${interviewId}/${uniqueId}-${originalName}`;
};

export const calculateAge = (
  birthdate: string | Date | undefined
): number | null => {
  if (!birthdate) return null;

  // Convert to Date if birthdate is a string
  const birthDateObj =
    typeof birthdate === "string" ? new Date(birthdate) : birthdate;

  const today = new Date();
  const birthYear = birthDateObj.getFullYear();
  const birthMonth = birthDateObj.getMonth();
  const birthDay = birthDateObj.getDate();

  let age = today.getFullYear() - birthYear;

  if (
    today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age--;
  }

  return age;
};
