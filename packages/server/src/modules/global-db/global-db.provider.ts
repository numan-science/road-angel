import { TransactionInterceptor } from 'src/database/transaction.interceptor';
import { REPOSITORIES } from 'src/constants/repositories';
import { ForgotPassword } from '../auth/entities/forgot-password.entity';
import { LoginToken } from '../auth/entities/login-token.entity';
import { SuperUser } from '../user/entities/super-user.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { RolePermission } from '../role/entities/role-permission.entity';
import { Permission } from '../role/entities/permission.entity';
import { InsuranceCompany } from '../insurance-companies/entities/insurance-companies.entity';
import { TowService } from '../tow_service/entities/tow-service.entity';
import { Region } from '../region/entities/region.entity';
import { Workshop } from '../workshop/entities/workshop.entity';
import { CompanyRole } from '../role/entities/company-roles.entity';
import { UserPermission } from '../role/entities/user-permission.entity';
import { InsuranceDocuments } from '../insurance-documents/entities/insurance-documents.entity';
import { InsuranceCompanyUser } from '../insurance-companies-user/entities/insurance-companies-user.entity';
import { Participant } from '../accident-case/entities/participant.entity';
import { AccidentScenario } from '../accident-case/entities/accident-scnario.entity';
import { AccidentCase } from '../accident-case/entities/accident-case.entity ';
import { AkaInsuranceCompany } from '../accident-case/entities/akasuranceCompany.entity';
import { LeasingInsuranceCompany } from '../leasing-insurance-companies/entities/leasing-insurance-companies.entity';
import { BusinessCase } from '../business-case/entities/business-case.entity';
import { BusinessCaseActivity } from '../business-case/entities/business-case-activity.entity';
import { BusinessCaseDocuments } from '../business-case/entities/business-case-documents.entity';
import { BusinessCaseTowService } from '../business-case/entities/business-case-tow-service.entity';
import { UserRegion } from '../user/entities/user-region.entity';
import { AccidentCaseDocuments } from '../accident-case/entities/accident-case-documents.entity';

export const globalDbProvider = [
  TransactionInterceptor,
  {
    provide: REPOSITORIES.USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: REPOSITORIES.SUPER_USER_REPOSITORY,
    useValue: SuperUser,
  },
  {
    provide: REPOSITORIES.LOGIN_TOKEN_REPOSITORY,
    useValue: LoginToken,
  },
  {
    provide: REPOSITORIES.FORGOT_PASSWORD_REPOSITORY,
    useValue: ForgotPassword,
  },
  {
    provide: REPOSITORIES.ROLE_REPOSITORY,
    useValue: Role,
  },
  {
    provide: REPOSITORIES.ROLE_PERMISSION_REPOSITORY,
    useValue: RolePermission,
  },
  {
    provide: REPOSITORIES.PERMISSION_REPOSITORY,
    useValue: Permission,
  },
  
  {
    provide: REPOSITORIES.INSURANCECOMPANY_REPOSITORY,
    useValue: InsuranceCompany,
  },
  
  {
    provide: REPOSITORIES.TOWSERVICE_REPOSITORY,
    useValue: TowService,
  },
  {
    provide: REPOSITORIES.REGION_REPOSITORY,
    useValue: Region,
  },
  {
    provide: REPOSITORIES.WORKSHOP_REPOSITORY,
    useValue: Workshop,
  },

  {
    provide: REPOSITORIES.COMPANYROLE_REPOSITORY,
    useValue: CompanyRole, 
  },
  {
    provide: REPOSITORIES.USERPERMISSION_REPOSITORY,
    useValue: UserPermission, 
  },
  {
    provide: REPOSITORIES.INSURANCEDOCUMENTS_REPOSITORY,
    useValue: InsuranceDocuments, 
  },

  {
    provide: REPOSITORIES.INSURANCECOMPANYUSER_REPOSITORY,
    useValue: InsuranceCompanyUser, 
  },
  {
    provide: REPOSITORIES.ACCIDENTSCENARIO_REPOSITORY,
    useValue:AccidentScenario,
  },
  {
    provide: REPOSITORIES.ACCIDENTCASE_REPOSITORY,
    useValue:AccidentCase,
  },
  {

    provide: REPOSITORIES.PARTICIPANT_REPOSITORY,
    useValue:Participant,
  },

  {

    provide: REPOSITORIES.AKAINSURANCECOMPANY_REPOSITORY,
    useValue:AkaInsuranceCompany,

  },
  

  {

    provide: REPOSITORIES.LEASINGINSURANCECOMPANY_REPOSITORY,
    useValue:LeasingInsuranceCompany,
  },

 
  {

    provide: REPOSITORIES.BUSINESSCASE_REPOSITORY,
    useValue:BusinessCase,
  },
  {

    provide: REPOSITORIES.BUSINESSCASEACTIVITY_REPOSITORY,
    useValue:BusinessCaseActivity,
  },
  {

    provide: REPOSITORIES.BUSINESSCASEDOCUMENTS_REPOSITORY,
    useValue:BusinessCaseDocuments,
  },
  {

    provide: REPOSITORIES.BUSINESSCASETOWSERVICE_REPOSITORY,
    useValue:BusinessCaseTowService,
  },
  {

    provide: REPOSITORIES.USERREGION_REPOSITORY,
    useValue:UserRegion,
  },
  {

    provide: REPOSITORIES.ACCIDENTCASEDOCUMENTS_REPOSITORY,
    useValue:AccidentCaseDocuments,
  },
 
 

];
