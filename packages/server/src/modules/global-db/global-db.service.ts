import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
import { REPOSITORIES } from 'src/constants/repositories';
import { UNIQUE_KEY_VIOLATION } from 'src/constants';
import { ForgotPassword } from '../auth/entities/forgot-password.entity';
import { LoginToken } from '../auth/entities/login-token.entity';
import { Permission } from '../role/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { RolePermission } from '../role/entities/role-permission.entity';
import { SuperUser } from '../user/entities/super-user.entity';
import { User } from '../user/entities/user.entity';
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

@Injectable()
export class GlobalDbService {
  [x: string]: any;
  private logger = new Logger('GlobalDbService');
  public repo: any = {};
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(REPOSITORIES.LOGIN_TOKEN_REPOSITORY)
    private readonly loginTokenRepository: typeof LoginToken,
    @Inject(REPOSITORIES.FORGOT_PASSWORD_REPOSITORY)
    private readonly forgotPasswordRepository: typeof ForgotPassword,
    @Inject(REPOSITORIES.SUPER_USER_REPOSITORY)
    private readonly superUserRepository: typeof SuperUser,
    @Inject(REPOSITORIES.ROLE_REPOSITORY)
    private readonly RoleRepository: typeof Role,
    @Inject(REPOSITORIES.ROLE_PERMISSION_REPOSITORY)
    private readonly RolePermissionRepository: typeof RolePermission,
    @Inject(REPOSITORIES.PERMISSION_REPOSITORY)
    private readonly PermissionRepository: typeof Permission,
    @Inject(REPOSITORIES.INSURANCECOMPANY_REPOSITORY)
    private readonly insuranceCompanyRepository: typeof InsuranceCompany,
    @Inject(REPOSITORIES.TOWSERVICE_REPOSITORY)
    private readonly towServiceRepository: typeof TowService,
    @Inject(REPOSITORIES.REGION_REPOSITORY)
    private readonly regionRepository: typeof Region,
    @Inject(REPOSITORIES.WORKSHOP_REPOSITORY)
    private readonly workshopRepository: typeof Workshop,
    @Inject(REPOSITORIES.COMPANYROLE_REPOSITORY)
    private readonly companyRoleRepository: typeof CompanyRole,
    @Inject(REPOSITORIES.USERPERMISSION_REPOSITORY)
    private readonly userPermissionRepository: typeof UserPermission,
    @Inject(REPOSITORIES.INSURANCEDOCUMENTS_REPOSITORY)
    private readonly insuranceDocumentsRepository: typeof InsuranceDocuments,
    @Inject(REPOSITORIES.INSURANCECOMPANYUSER_REPOSITORY)
    private readonly insuranceCompanyUserRepository: typeof InsuranceCompanyUser,
    @Inject(REPOSITORIES.ACCIDENTSCENARIO_REPOSITORY)
    private readonly accidentScenarioRepository: typeof AccidentScenario,
    @Inject(REPOSITORIES.ACCIDENTCASE_REPOSITORY)
    private readonly accidentCaseRepository: typeof AccidentCase,
    @Inject(REPOSITORIES.PARTICIPANT_REPOSITORY)
    private readonly participantRepository: typeof Participant,
    @Inject(REPOSITORIES.AKAINSURANCECOMPANY_REPOSITORY)
    private readonly akaInsuranceCompanyRepository: typeof AkaInsuranceCompany,
    @Inject(REPOSITORIES.LEASINGINSURANCECOMPANY_REPOSITORY)
    private readonly leasingInsuranceCompanyRepository: typeof LeasingInsuranceCompany,
 
    @Inject(REPOSITORIES.BUSINESSCASE_REPOSITORY)
    private readonly BusinessCaseRepository: typeof BusinessCase,
    @Inject(REPOSITORIES.BUSINESSCASEACTIVITY_REPOSITORY)
    private readonly BusinessCaseActivityRepository: typeof BusinessCaseActivity,
    @Inject(REPOSITORIES.BUSINESSCASEDOCUMENTS_REPOSITORY)
    private readonly BusinessCaseDocumentsRepository: typeof BusinessCaseDocuments,  
    @Inject(REPOSITORIES.BUSINESSCASETOWSERVICE_REPOSITORY)
    private readonly BusinessCaseTowServiceRepository: typeof BusinessCaseTowService,
    @Inject(REPOSITORIES.USERREGION_REPOSITORY)
    private readonly UserRegionRepository: typeof UserRegion,
    @Inject(REPOSITORIES.ACCIDENTCASEDOCUMENTS_REPOSITORY)
    private readonly AccidentCaseDocumentsRepository: typeof AccidentCaseDocuments,
  ) {
    this.repo['User'] = this.userRepository;
    this.repo['LoginToken'] = this.loginTokenRepository;
    this.repo['ForgotPassword'] = this.forgotPasswordRepository;
    this.repo['SuperUser'] = this.superUserRepository;
    this.repo['Role'] = this.RoleRepository;
    this.repo['RolePermission'] = this.RolePermissionRepository;
    this.repo['Permission'] = this.PermissionRepository;
    this.repo['InsuranceCompany'] = this.insuranceCompanyRepository;
    this.repo['TowService'] = this.towServiceRepository
    this.repo['Workshop'] = this.workshopRepository
    this.repo['Region'] = this.regionRepository
    this.repo['CompanyRole'] = this.companyRoleRepository
    this.repo ['UserPermission'] = this.userPermissionRepository
    this.repo ['InsuranceDocuments'] = this.insuranceDocumentsRepository
    this.repo ['InsuranceCompanyUser'] = this.insuranceCompanyUserRepository
    this.repo ['AccidentScenario'] = this.accidentScenarioRepository
    this.repo ['Participant'] = this.participantRepository
    this.repo ['AccidentCase'] = this.accidentCaseRepository
    this.repo ['AkaInsuranceCompany'] = this.akaInsuranceCompanyRepository
    this.repo ['LeasingInsuranceCompany'] = this.leasingInsuranceCompanyRepository
    this.repo ['BusinessCase'] = this.BusinessCaseRepository
    this.repo ['BusinessCaseActivity'] = this.BusinessCaseActivityRepository
    this.repo ['BusinessCaseDocuments'] = this.BusinessCaseDocumentsRepository
    this.repo ['BusinessCaseTowService'] = this.BusinessCaseTowServiceRepository
    this.repo ['UserRegion'] = this.UserRegionRepository
    this.repo ['AccidentCaseDocuments'] = this.AccidentCaseDocumentsRepository


  }

  async getOne(model: string, params: any) {
    const filter = params;
    const result = await this.repo[model].findOne({ where: filter });
    return result;
  }

  async getAll(model: string, params: any) {
    const filter = params;
    return await this.repo[model].findAndCountAll({ where: filter });
  }

  async save(model: string, dto: any, loggedInUser: any, transaction = null) {
    if (transaction) {
      try {
        const { id } = dto;
        if (id) {
          // Update
          dto.updatedBy = loggedInUser.user.id;
          await this.repo[model].update(dto, {
            where: { id },
            transaction,
          });
          return await this.repo[model].findOne({ where: { id } });
          
        } else {
          // Create
          dto.createdBy = loggedInUser.user.id;
          return await this.repo[model].create(dto, { transaction });
        }
      } catch (e) {
        this.logger.error('Error while saving ', e);
        if (e.parent.code === UNIQUE_KEY_VIOLATION) {
          throw e;
        } else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      try {
        const { id } = dto;
        if (id) {
          // Update
          dto.updatedBy = loggedInUser.user.id;
          await this.repo[model].update(dto, {
            where: { id },
          });
          return await this.repo[model].findOne({ where: { id } });
        } else {
          // Create
          dto.createdBy = loggedInUser.user.id;
          return await this.repo[model].create(dto);
        }
      } catch (e) {
        this.logger.error('Error while saving ', e);
        if (e.parent.code === UNIQUE_KEY_VIOLATION) {
          throw e;
        } else {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  async delete(
    model: string,
    filter: any,
    loggedInUser: any = false,
    transaction = null,
  ) {
    if (transaction) {
      try {
        if (loggedInUser) {
          this.repo[model].destroy({ where: filter, transaction });
          const dto = {
            updatedBy: loggedInUser.user.id,
          };
          await this.repo[model].update(dto, { where: filter, transaction });
        }
        return await this.repo[model].destroy({ where: filter, transaction });
      } catch (e) {
        this.logger.error('Error while deleting ', e);
        throw new InternalServerErrorException();
      }
    } else {
      try {
        if (loggedInUser) {
          this.repo[model].destroy({ where: filter });
          const dto = {
            updatedBy: loggedInUser.user.id,
          };
          await this.repo[model].update(dto, { where: filter });
        }
        return await this.repo[model].destroy({ where: filter });
      } catch (e) {
        this.logger.error('Error while deleting ', e);
        throw new InternalServerErrorException();
      }
    }
  }
}
