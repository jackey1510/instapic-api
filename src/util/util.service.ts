import { envPath } from './../constants';
import { GetSignedUrlConfig } from '@google-cloud/storage';
import { Injectable, Inject } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { config } from 'dotenv-safe';

config({ path: envPath });

@Injectable()
export class UtilService {
  constructor(
    @Inject('GCP_STORAGE')
    private readonly storage: Storage,
  ) {}
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
    const [url] = (await this.storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options)
      .catch((err: Error) => console.error(err))) || [''];

    return url;
  }
}
