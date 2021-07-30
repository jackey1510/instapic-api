export const mockDatabaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {},
  },
];

import { Module } from '@nestjs/common';

@Module({
  providers: [...mockDatabaseProviders],
  exports: [...mockDatabaseProviders],
})
export class MockDatabaseModule {}
