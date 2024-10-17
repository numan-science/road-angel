import { Module, forwardRef } from '@nestjs/common';
import { WorkshopController } from './workshop.controller';
import {  WorkshopService } from './workshop.service';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [WorkshopController],
  providers: [WorkshopService, ...authProvider],
  exports: [WorkshopService],
})
export class WorkshopModule {}

