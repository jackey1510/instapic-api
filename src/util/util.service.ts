import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  storage = new Storage();
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

    //   console.log("Generated PUT signed URL:");
    //   console.log(url);
    //   console.log("You can use this URL with any user agent, for example:");
    //   console.log(
    //     "curl -X PUT -H 'Content-Type: application/octet-stream' " +
    //       `--upload-file my-file '${url}'`
    //   );
    return url;
  }
}
