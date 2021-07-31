import { GCP_Storage } from './config/gcp_storage';

export const utilProviders = [
  {
    provide: 'GCP_STORAGE',
    useFactory: () => GCP_Storage,
  },
];
