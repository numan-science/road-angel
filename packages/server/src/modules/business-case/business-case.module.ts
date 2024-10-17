import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';
import { BusinessCaseController } from './business-case.controller';
import { BusinessCaseService } from './business-case.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [BusinessCaseController],
  providers: [BusinessCaseService, ...authProvider],
  exports: [BusinessCaseService],
})
export class BusinessCaseModule {}