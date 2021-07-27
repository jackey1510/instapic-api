import { Storage } from '@google-cloud/storage';

export const GCP_Storage = new Storage();

async function configureBucketCors() {
  const method = ['PUT'];
  const origin = [process.env.CORS_ORIGIN];
  const responseHeader = 'Content-Type';
  await GCP_Storage.bucket(process.env.BUCKET_NAME).setCorsConfiguration([
    {
      maxAgeSeconds: 60 * 5,
      method,
      origin,
      responseHeader: [responseHeader],
    },
  ]);
}

configureBucketCors().catch(console.error);
