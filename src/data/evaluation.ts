import { Config } from "@/config";

export async function getEvaluationData() {
  const res = await fetch(`${Config.NEXTAUTH_URL}/api/interview/evaluation`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
