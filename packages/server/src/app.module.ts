import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { GlobalDbModule } from './modules/global-db/global-db.module';
import { RoleModule } from './modules/role/role.module';
import { InsuranceCompanyModule } from './modules/insurance-companies/insurance-companies.module';
import { TowServiceModule } from './modules/tow_service/tow-service.module';
import { RegionModule } from './modules/region/region.module';
import { WorkshopModule } from './modules/workshop/workshop.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InsuranceDocumentsModule } from './modules/insurance-documents/insurance-documents.module';
import { InsuranceCompanyUserModule } from './modules/insurance-companies-user/insurance-companies-user.module';
import { AccidentCaseModule } from './modules/accident-case/accident-case.module';
import { LeasingInsuranceCompanyModule } from './modules/leasing-insurance-companies/leasing-insurance-companies.module';
import { BusinessCaseModule } from './modules/business-case/business-case.module';
import { ResourceSharingModule } from './modules/resource-sharing/resource-sharing.module';


@Module({
  imports: [
    GlobalDbModule,
    AuthModule,
    DatabaseModule,
    RoleModule,
    UserModule,
    InsuranceCompanyModule,
    TowServiceModule,
    RegionModule,
    WorkshopModule,
    WorkshopModule,
    FileUploadModule,
    DashboardModule,
    InsuranceDocumentsModule,
    InsuranceCompanyUserModule,
    AccidentCaseModule,
    LeasingInsuranceCompanyModule,
    BusinessCaseModule,
    ResourceSharingModule
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}