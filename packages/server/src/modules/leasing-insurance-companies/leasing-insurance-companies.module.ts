import { Module, forwardRef } from '@nestjs/common';
import {  LeasingInsuranceCompanyController } from './leasing-insurance-companies.controller';
import {  LeasingInsuranceCompanyService } from './leasing-insurance-companies.service';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [LeasingInsuranceCompanyController],
  providers: [LeasingInsuranceCompanyService, ...authProvider],
  exports: [LeasingInsuranceCompanyService],
})
export class LeasingInsuranceCompanyModule {}

