const uniqid = require('uniqid');
import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import * as moment from 'moment-timezone';
import { FORGOT_PASSWORD_TOKEN_EXPIRY_HOURS } from 'src/constants';
import { REPOSITORIES } from 'src/constants/repositories';
import { ForgotPassword } from './entities/forgot-password.entity';
import { ResetPasswordEmailService } from './reset-password-email.service';

@Injectable()
export class ForgotPasswordService {
  private logger = new Logger('ForgotPasswordService');
  constructor(
    @Inject(REPOSITORIES.FORGOT_PASSWORD_REPOSITORY)
    private readonly forgotPasswordRepository: typeof ForgotPassword,
    @Inject(ResetPasswordEmailService)
    private readonly resetPasswordEmailService: any,
  ) {}

  async generateRequest(userId: number): Promise<boolean> {
    let resetRequest = await this.forgotPasswordRepository.findOne({
      where: {
        expiredAt: { [Op.gte]: moment().toDate() },
        servedAt: null,
        userId: userId,
      },
    });

    if (!resetRequest) {
      const token = uniqid();
      const expiredAt = moment()
        .add(FORGOT_PASSWORD_TOKEN_EXPIRY_HOURS, 'hours')
        .toDate();

      resetRequest = new ForgotPassword();
      resetRequest.userId = userId;
      resetRequest.token = token;
      resetRequest.expiredAt = expiredAt;
      await resetRequest.save();
    }

    try {
      this.resetPasswordEmailService.sendResetPasswordEmail(
        resetRequest,
        userId,
      );
    } catch (error) {
      this.logger.error(
        'Error occured while creating resetPasswordToken ',
        error,
      );
      throw new InternalServerErrorException();
    }
    return true;
  }

  async served(id: number): Promise<void> {
    const forgotToken = await this.forgotPasswordRepository.findOne({
      where: { id },
    });
    forgotToken.servedAt = moment().toDate();
    await forgotToken.save();
  }

  async isTokenValid(token: string): Promise<boolean> {
    const resetRequest = await this.forgotPasswordRepository.findOne({
      where: {
        token: token,
        expiredAt: { [Op.gte]: moment().toDate() },
        servedAt: null,
      },
    });
    if (resetRequest) {
      return true;
    }
    throw new BadRequestException('Link has already expired');
  }

  async getRestRequest(token: string): Promise<any> {
    const resetRequest = await this.forgotPasswordRepository.findOne({
      where: { token },
    });
    if (resetRequest) {
      return resetRequest;
    }
    return false;
  }
}
