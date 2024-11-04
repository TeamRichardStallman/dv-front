import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse, NextRequest } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  return NextResponse.json({ message: "Welcome to Next.js AWS APIs" });
}

export async function POST(req: NextRequest) {
  const { fileName, fileType } = await req.json();

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `resumes/${fileName}`,
    ContentType: fileType,
    Metadata: {
      userId: "1",
      interviewId: "abc",
    },
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    return NextResponse.json({ presignedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
