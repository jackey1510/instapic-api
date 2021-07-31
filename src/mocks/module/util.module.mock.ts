import { mockUtilProviders } from './../provider/util.provider.mock';
import { UtilService } from '../../util/util.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [UtilService, ...mockUtilProviders],
  exports: [UtilService],
})
export class MockUtilModule {}
