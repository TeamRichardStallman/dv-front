export async function getEvaluationData() {
  const res = await fetch("http://localhost:3000/api/interview/evaluation", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
