import { forwardRef, Module } from '@nestjs/common';
import { InsuranceCompanyUserService } from './insurance-companies-user.service';
import { AuthModule } from '../auth/auth.module';
import { authProvider } from '../auth/auth.provider';
import { InsuranceCompanyUserController } from './insurance-companies-user.controller';
@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [InsuranceCompanyUserController],
  providers: [InsuranceCompanyUserService, ...authProvider],
  exports : [InsuranceCompanyUserService]
})
export class InsuranceCompanyUserModule {}
