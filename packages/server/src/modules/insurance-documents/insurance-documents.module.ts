import { Module, forwardRef } from '@nestjs/common';
import { InsuranceDocumentsController } from './insurance-documents.controller';
import {InsuranceDocumentsService} from './insurance-documents.service'
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [InsuranceDocumentsController],
  providers: [InsuranceDocumentsService, ...authProvider],
  exports: [InsuranceDocumentsService],
})
export class InsuranceDocumentsModule {}

