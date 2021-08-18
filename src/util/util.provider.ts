import { GCP_Storage } from './config/gcp_storage';
import { Provider } from '@nestjs/common';

export const utilProviders: Provider[] = [
  {
    provide: 'GCP_STORAGE',

    useFactory: () => GCP_Storage,
  },
];
