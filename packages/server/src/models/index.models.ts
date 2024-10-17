import { User } from 'src/modules/user/entities/user.entity';
import { SuperUser } from 'src/modules/user/entities/super-user.entity';
import { LoginToken } from 'src/modules/auth/entities/login-token.entity';
import { ForgotPassword } from 'src/modules/auth/entities/forgot-password.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { RolePermission } from 'src/modules/role/entities/role-permission.entity';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { InsuranceCompany } from 'src/modules/insurance-companies/entities/insurance-companies.entity';
import { TowService } from 'src/modules/tow_service/entities/tow-service.entity';
import { Region } from 'src/modules/region/entities/region.entity';
import { Workshop } from 'src/modules/workshop/entities/workshop.entity';
import { CompanyRole } from 'src/modules/role/entities/company-roles.entity';
import { UserPermission } from 'src/modules/role/entities/user-permission.entity';
import { InsuranceDocuments } from 'src/modules/insurance-documents/entities/insurance-documents.entity';
import { InsuranceCompanyUser } from 'src/modules/insurance-companies-user/entities/insurance-companies-user.entity';
import { Participant } from 'src/modules/accident-case/entities/participant.entity';
import { AccidentScenario } from 'src/modules/accident-case/entities/accident-scnario.entity';
import { AccidentCase } from 'src/modules/accident-case/entities/accident-case.entity ';
import { LeasingInsuranceCompany } from 'src/modules/leasing-insurance-companies/entities/leasing-insurance-companies.entity';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';
import { BusinessCaseActivity } from 'src/modules/business-case/entities/business-case-activity.entity';
import { BusinessCaseDocuments } from 'src/modules/business-case/entities/business-case-documents.entity';
import { BusinessCaseTowService } from 'src/modules/business-case/entities/business-case-tow-service.entity';
import { UserRegion } from 'src/modules/user/entities/user-region.entity';
import { AccidentCaseDocuments } from 'src/modules/accident-case/entities/accident-case-documents.entity';


const models = [
  User,
  SuperUser,
  LoginToken,
  ForgotPassword,
  Role,
  RolePermission,
  Permission,
  InsuranceCompany,
  InsuranceDocuments,
  TowService,
  Region,
  Workshop,
  CompanyRole,
  UserPermission,
  InsuranceCompanyUser,
  Participant,
  AccidentScenario,
  AccidentCase,
  LeasingInsuranceCompany,
  BusinessCase,
  BusinessCaseActivity,
  BusinessCaseDocuments,
  BusinessCaseTowService,
  UserRegion,
  AccidentCaseDocuments
];

export const appModels = models;
