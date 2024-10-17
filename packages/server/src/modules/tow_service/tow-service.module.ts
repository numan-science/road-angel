import { Module, forwardRef } from '@nestjs/common';
import { TowServiceController } from './tow-service.controller';
import {  TowServiceService } from './tow-service.service';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [TowServiceController],
  providers: [TowServiceService, ...authProvider],
  exports: [TowServiceService],
})
export class TowServiceModule {}

