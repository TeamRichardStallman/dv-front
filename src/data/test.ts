import { Config } from "@/config";

export async function getData() {
  const res = await fetch(`${Config.NEXTAUTH_URL}/api/test`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
