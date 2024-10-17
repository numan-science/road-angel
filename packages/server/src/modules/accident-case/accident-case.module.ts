import { Module, forwardRef } from '@nestjs/common';
import { AccidentCaseController } from './accident-case.controller';
import {AccidentCaseService} from './accident-case.service'
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AccidentCaseController],
  providers: [AccidentCaseService, ...authProvider],
  exports: [AccidentCaseService],
})
export class AccidentCaseModule {}