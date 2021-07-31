import { utilProviders } from './util.provider';
import { Module } from '@nestjs/common';
import { UtilService } from './util.service';

@Module({
  providers: [UtilService, ...utilProviders],
  exports: [UtilService],
})
export class UtilModule {}
