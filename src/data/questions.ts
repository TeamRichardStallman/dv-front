export async function getQuestionsData() {
  const res = await fetch("http://localhost:3000/api/interview/questions", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
