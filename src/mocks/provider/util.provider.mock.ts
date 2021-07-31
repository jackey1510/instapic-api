import { GetSignedUrlResponse } from '@google-cloud/storage';

const mockStorage = {
  bucket: () => {
    return {
      file: () => {
        return {
          getSignedUrl: async (): Promise<GetSignedUrlResponse> => {
            return [mockSignedUrl];
          },
        };
      },
    };
  },
};

export const mockSignedUrl = 'https://signedurl.com';

export const mockUtilProviders = [
  {
    provide: 'GCP_STORAGE',
    useFactory: () => mockStorage,
  },
];
