import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const interview = await request.json();

    console.log("Received interview data:", interview);

    return NextResponse.json({
      message: "Interview data received successfully",
    });
  } catch (error) {
    console.error("Error processing interview data:", error);
    return NextResponse.json(
      { message: "Failed to process interview data" },
      { status: 500 }
    );
  }
}
