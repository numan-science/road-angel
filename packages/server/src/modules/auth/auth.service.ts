import {
  Injectable,
  Inject,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { REPOSITORIES } from 'src/constants/repositories';
import { LoginTokenService } from './login-token.service';
import { ForgotPasswordService } from './forgot-password.service';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { LoginToken } from './entities/login-token.entity';
import { UserContextService } from './user-context.service';
import { Validate } from '../../helpers/validate';
import { DEFAULT_ROLES, UNIQUE_KEY_VIOLATION } from 'src/constants';
import { GlobalDbService } from '../global-db/global-db.service';
import {
  DEFAULT_BM_PERMISSIONS,
  DEFAULT_SM_PERMISSIONS,
} from 'src/constants/permissions';
import { Op } from 'sequelize';
import { Where } from 'sequelize/types/utils';

@Injectable()
export class AuthService {
  
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(REPOSITORIES.LOGIN_TOKEN_REPOSITORY)
    private readonly loginTokenRepository: typeof LoginToken,
    @Inject(LoginTokenService)
    private readonly loginTokenService,
    @Inject(ForgotPasswordService)
    private readonly forgotPasswordService,
    @Inject(UserContextService)
    private readonly userContextService,
    private readonly validate: Validate,
    @Inject(GlobalDbService)
    private readonly DB,
  ) {}

  async login(
    authCredentialsDto: AuthCredentialsDto,
    clientInfo: any,
  ): Promise<any> {
    const user = await this.validateUserPassword(authCredentialsDto);
    if (!user) {
      return this.throwInvalidCredentialsException();
    }
    const token: any = await this.loginTokenService.generateToken(user, {
      rememberMe: authCredentialsDto.rememberMe,
    });
    return token;
  }

  async signUp(user: any) {
    const { email, password, role } = user;
  
    if (!email) {
      throw new BadRequestException('Email is required.');
    }
  
    const userWhere: any = {};
    userWhere.email = email;
  
    const existingUser = await this.DB.getOne('User', userWhere);
    if (existingUser) {
      throw new ConflictException('UserEmail already exists.');
    }
  
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
  
    const response = await this.DB.getOne('Role', {
      name: role,
    });
  
    user.roleId = response.id;
  
    try {
      const savedUser = await this.DB.repo.User.create(user);
      // const token: any = await this.loginTokenService.generateToken(savedUser, {});
      return savedUser;
    } catch (error) {
      if (error?.parent?.code === UNIQUE_KEY_VIOLATION) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  
  async logout(token: string): Promise<void> {
    await this.loginTokenService.expireToken(token);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository
      .scope('withPassword')
      .findOne({ where: { email } });

    if (user) {
      const hash = await bcrypt.hash(password, user.salt);
      if (hash === user.password) {
        return user;
      }
    }
    return null;
  }

  async forgotPassword(params: any): Promise<any> {
    const { username } = params;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      this.forgotPasswordService.generateRequest(user.id);
      return { success: true };
    } else {
      throw new UnauthorizedException('Invalid username');
    }
  }

  async resetPassword(
    authResetPasswordDto: AuthResetPasswordDto,
    token: string,
  ): Promise<any> {
    const { password } = authResetPasswordDto;
    const resetRequest = await this.forgotPasswordService.getRestRequest(token);
    if (resetRequest) {
      const user = await this.userRepository.findOne({
        where: { id: resetRequest.userId },
      });
      if (user) {
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        // user.passwordResetAt = dayjs(dayjs()).add(1, 'month').toDate();
        user.save();

        await this.forgotPasswordService.served(resetRequest.id);

        return { success: true };
      }
    }
    throw new InternalServerErrorException();
  }

  async updatePassword(data: any, loggedInUser: any): Promise<any> {
    const { password, confirmPassword } = data;

    if (password === confirmPassword) {
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(password, salt);

      const update = {
        salt,
        password: newPassword,
        passwordResetAt: dayjs(dayjs()).add(1, 'month').toDate(),
      };
      await this.userRepository.update(update, {
        where: { id: loggedInUser.user.id },
      });

      return { success: true };
    }
    throw new BadRequestException('Confirm password does not match');
  }

  async changePassword(data: any, loggedInUser: any): Promise<any> {
    const { currentPassword, newPassword: password, confirmPassword } = data;

    const { username } = loggedInUser;

    const validate: any = {
      username,
      password: currentPassword,
    };
    const response = await this.validateUserPassword(validate);
    if (response) {
      if (password === confirmPassword) {
        const newPassword = await bcrypt.hash(password, response.salt);

        if (response.password !== newPassword) {
          const update = {
            password: newPassword,
            passwordResetAt: dayjs(dayjs()).add(1, 'month').toDate(),
          };
          await this.userRepository.update(update, {
            where: { id: loggedInUser.user.id },
          });

          return { success: true };
        }
        throw new BadRequestException(
          'You used an old password. To protect your account, choose a new password.',
        );
      }
      throw new BadRequestException('Confirm password does not match');
    }
    throw new BadRequestException('Invalid current password');
  }

  async throwInvalidCredentialsException() {
    throw new UnauthorizedException('Invalid credentials');
  }

  async getLoggedInUserByToken(tokenBearer: string) {
    const token = tokenBearer.substring(7);

    const tokenDetail = await this.loginTokenRepository.findOne({
      where: { token },
      include: { model: User },
    });
    await this.validate.token(tokenDetail);
    const loggedInUser = await this.userContextService.getUserContext(
      tokenDetail,
    );
    return loggedInUser;
  }

  registerCompany = async (data: any, clientInfo: any) => {
    const { repo } = this.DB;
    const { password } = data;
    const insuranceCompanyWhere: any = {};
    insuranceCompanyWhere.name = data.insuranceCompany;
    const existingCompany = await this.DB.getOne(
      'Company',
      insuranceCompanyWhere,
    );
    if (existingCompany) {
      throw new ConflictException('Company already exists.');
    }
    try {
      data.salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, data.salt);
      const companyAdmin = await this.DB.getOne('Role', {
        name: DEFAULT_ROLES.COMPANY_ADMIN,
      });
      data.roleId = companyAdmin.id;
      data.username = data.company;
      const savedCompanyAdmin = await repo.User.create(data);

      // Create Company
      const savedCompany = await repo.Company.create({
        name: data.company,
        userId: savedCompanyAdmin.id,
      });

      await this.createCompanyRolesPermissions(savedCompany.id);

      const token: any = await this.loginTokenService.generateToken(
        savedCompanyAdmin,
        {
          ...clientInfo,
        },
      );
      return token;
    } catch (error) {
      if (error?.parent?.code === UNIQUE_KEY_VIOLATION) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  };

  createCompanyRolesPermissions = async (companyId: string) => {
    const { repo } = this.DB;

    // Create Business Manager
    const businessManager = await repo.Role.create({
      name: DEFAULT_ROLES.BUSINESS_MANAGER,
    });

    const bmPermissions = await repo.Permission.findAll({
      where: { permission: { [Op.in]: DEFAULT_BM_PERMISSIONS } },
    });

    const businessManagerPermissions = _.map(bmPermissions, (perm) => ({
      roleId: businessManager.id,
      permissionId: perm.id,
    }));

    // Create Sale Manager
    const saleManager = await repo.Role.create({
      name: DEFAULT_ROLES.SALE_MANAGER,
    });

    const smPermissions = await repo.Permission.findAll({
      where: { permission: { [Op.in]: DEFAULT_SM_PERMISSIONS } },
    });

    const saleManagerPermissions = _.map(smPermissions, (perm) => ({
      roleId: saleManager.id,
      permissionId: perm.id,
    }));

    const permissions = [
      ...businessManagerPermissions,
      ...saleManagerPermissions,
    ];

    // Create Business Manager & Permissions
    await repo.RolePermission.bulkCreate(permissions);

    const companyRole = [
      {
        companyId,
        roleId: businessManager.id,
      },

      {
        companyId,
        roleId: saleManager.id,
      },
    ];

    // Bound Roles To Company
    await repo.CompanyRole.bulkCreate(companyRole);
  };
}
