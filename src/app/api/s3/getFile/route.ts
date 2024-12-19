import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const generatePresignedUrl = async (bucketName: string, objectKey: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
  return presignedUrl;
};

export async function POST(req: NextRequest) {
  try {
    const { bucketName, objectKey } = await req.json();
    const presignedUrl = await generatePresignedUrl(bucketName, objectKey);

    return new Response(JSON.stringify({ presignedUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate presigned URL" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
