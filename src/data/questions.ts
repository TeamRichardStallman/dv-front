import { Config } from "@/config";

export async function getQuestionsData() {
  const res = await fetch(`${Config.NEXTAUTH_URL}/api/interview/questions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
