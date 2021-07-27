import { GetSignedUrlConfig } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { GCP_Storage } from './config/gcp_storage';

@Injectable()
export class UtilService {
  async generateV4UploadSignedUrl(fileName: string) {
    // Creates a client
    const bucketName = process.env.BUCKET_NAME!;

    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      contentType: 'application/octet-stream',
    };

    // Get a v4 signed URL for uploading file
    const [url] = (await GCP_Storage.bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options)
      .catch((err: Error) => console.error(err))) || [''];

    return url;
  }
}
