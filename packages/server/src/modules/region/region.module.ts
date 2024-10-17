import { Module, forwardRef } from '@nestjs/common';
import { RegionController } from './region.controller';
import {  RegionService, } from './region.service';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [RegionController],
  providers: [RegionService, ...authProvider],
  exports: [RegionService],
})
export class RegionModule {}

