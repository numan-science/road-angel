import { Module, forwardRef } from '@nestjs/common';
import { InsuranceCompanyController } from './insurance-companies.controller';
import { InsuranceCompanyService } from './insurance-companies.service';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [InsuranceCompanyController],
  providers: [InsuranceCompanyService, ...authProvider],
  exports: [InsuranceCompanyService],
})
export class InsuranceCompanyModule {}

