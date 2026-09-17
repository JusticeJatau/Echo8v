import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

function getClient() {
  const required = [
    "B2_ENDPOINT",
    "B2_REGION",
    "B2_BUCKET",
    "B2_KEY_ID",
    "B2_APPLICATION_KEY",
  ];

  const missing = required.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error(
      "Missing Backblaze settings: " + missing.join(", "),
    );
  }

  return new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,

    credentials: {
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    },

    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
}

export async function uploadToBackblaze(buffer, type) {
  const key = "echo8v/" + randomUUID() + "." + type.ext;

  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.B2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: type.mime,
    }),
  );

  return key;
}

export async function createSignedMediaUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: key,
  });

  return getSignedUrl(getClient(), command, {
    expiresIn: 300,
  });
}

export async function deleteFromBackblaze(key) {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET,
      Key: key,
    }),
  );
}